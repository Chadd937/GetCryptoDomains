import { createFileRoute } from '@tanstack/react-router';
import { createUIMessageStream, createUIMessageStreamResponse } from 'ai';
import { z } from 'zod';
import { verifySession } from '@/lib/auth';
import { getWorkersAI } from '@/lib/cloudflare-env';
import { extractHtml } from '@/lib/generated-site';

const inputSchema = z.object({
  messages: z.array(
    z.object({
      id: z.string(),
      role: z.enum(['user', 'assistant']),
      parts: z.array(z.object({ type: z.literal('text'), text: z.string() })),
    }),
  ).min(1),
});

const MODEL = '@cf/meta/llama-3.3-70b-instruct-fp8-fast';
const INSTRUCTIONS =
  'You are getCryptoDomains AI Studio, an AI website builder. Your primary job is to BUILD working websites, not conduct a long discovery interview. When a user describes a website or app, make reasonable product and design decisions and generate it immediately. Ask at most one brief clarifying question only when a truly essential requirement makes building impossible; otherwise do not ask questions, do not merely suggest plans, and do not stop after describing what you intend to do. Every build or revision response MUST contain the entire standalone HTML document inside one fenced HTML code block (start the code fence with html). Include <!doctype html>, complete markup, inline CSS, and JavaScript where useful. Make the site responsive, accessible, polished, and interactive. Use working local interactions, useful empty states, form validation, and realistic sample content. Avoid placeholder links, dead buttons, TODOs, and claims that anything was deployed or saved. The HTML runs in an isolated browser preview. For ordinary non-building questions, answer naturally.';

export const Route = createFileRoute('/api/chat')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const origin = request.headers.get('origin');
        if (origin && origin !== new URL(request.url).origin) {
          return new Response('Unauthorized origin', { status: 403 });
        }

        try {
          const session = await verifySession(request);
          if (!session) {
            return new Response('Unauthorized: Please sign in to use the AI builder', {
              status: 401,
              headers: { 'cache-control': 'no-store' },
            });
          }

          let body: unknown;
          try {
            body = await request.json();
          } catch {
            return new Response('Invalid conversation', { status: 400 });
          }
          const parsed = inputSchema.safeParse(body);
          if (!parsed.success) {
            return new Response('Invalid conversation', { status: 400 });
          }

          const ai = getWorkersAI();
          if (!ai) {
            console.error('Workers AI binding AI is missing; check wrangler.jsonc');
            return new Response('Cloudflare AI is not configured.', {
              status: 503,
              headers: { 'cache-control': 'no-store' },
            });
          }

          const conversation = parsed.data.messages.map((message) => ({
            role: message.role,
            content: message.parts.map((part) => part.text).join('\\n'),
          }));
          const hasGeneratedSite = parsed.data.messages.some((message) =>
            message.role === 'assistant' &&
            message.parts.some((part) => part.type === 'text' && extractHtml(part.text) !== null),
          );
          const latestUserMessage = [...conversation].reverse().find((message) => message.role === 'user')?.content ?? '';

          // Keep the workflow deterministic: a first request must build, and a conversation
          // that already has HTML must revise that artifact rather than return to discovery.
          const workflowInstruction = hasGeneratedSite
            ? [
                'WORKFLOW MODE: REVISE EXISTING WEBSITE.',
                'The conversation already contains a generated website. Treat the latest user message as an edit request for that site.',
                'Return the complete updated standalone HTML document in a fenced html code block in this response, even for small changes.',
                'Preserve working features and existing design choices unless the user asks to change them. Do not ask discovery questions; make sensible assumptions and implement the change.',
                'If earlier assistant messages asked questions instead of building, do not repeat that behavior.',
              ].join(' ')
            : [
                'WORKFLOW MODE: BUILD NOW.',
                'No usable website has been generated in this conversation yet. Build the website now from the user\'s request.',
                'Do not ask follow-up questions, do not return only a plan, and do not respond with a list of requirements. Infer sensible defaults for missing details.',
                'Return a short one-sentence introduction followed by the complete runnable standalone HTML document in a fenced html code block. The HTML document is mandatory in this response.',
                'If earlier assistant messages asked questions instead of building, treat those as superseded and start building immediately.',
              ].join(' ');

          const messages = [
            { role: 'system' as const, content: INSTRUCTIONS },
            { role: 'system' as const, content: workflowInstruction },
            ...conversation,
          ];

          // The explicit variable is useful for server-side diagnostics without logging user content.
          console.info('AI Studio workflow:', hasGeneratedSite ? 'revise' : 'build', 'latest user chars:', latestUserMessage.length);

          const stream = createUIMessageStream({
            execute: async ({ writer }) => {
              const messageId = crypto.randomUUID();
              const textId = crypto.randomUUID();
              writer.write({ type: 'start', messageId });
              writer.write({ type: 'text-start', id: textId });

              const modelStream = await ai.run(MODEL, {
                messages,
                stream: true,
                max_tokens: 8000,
              });

              for await (const chunk of modelStream as AsyncIterable<unknown>) {
                if (request.signal.aborted) break;
                if (typeof chunk !== 'object' || chunk === null || !('response' in chunk)) continue;
                const value = (chunk as { response?: unknown }).response;
                if (typeof value !== 'string' && typeof value !== 'number') continue;
                const delta = String(value);
                if (delta) writer.write({ type: 'text-delta', id: textId, delta });
              }

              writer.write({ type: 'text-end', id: textId });
              writer.write({ type: 'finish' });
            },
            onError: () => 'Cloudflare could not complete this request. Please try again.',
          });

          return createUIMessageStreamResponse({ stream });
        } catch (error) {
          if (request.signal.aborted) return new Response('Stopped', { status: 499 });
          console.error('Chat request failed:', error instanceof Error ? error.message : 'unknown error');
          return new Response('Cloudflare could not complete this request. Please try again.', {
            status: 500,
            headers: { 'cache-control': 'no-store' },
          });
        }
      },
    },
  },
});
