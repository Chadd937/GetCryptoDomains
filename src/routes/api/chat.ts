import { createFileRoute } from '@tanstack/react-router';
import { createUIMessageStream, createUIMessageStreamResponse } from 'ai';
import { z } from 'zod';
import { verifySession } from '@/lib/auth';
import { getWorkersAI } from '@/lib/cloudflare-env';

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
  'You are getCryptoDomains AI Studio, an expert website builder and creative director. Help users build polished, production-quality websites. For website requests, briefly explain what you are creating, then provide a complete standalone HTML document in a fenced html code block with inline CSS and JavaScript. Make the design visually distinctive, responsive, accessible, and interactive, with thoughtful typography, spacing, color, states, and mobile layouts. Do not use placeholder links or broken image URLs; use CSS graphics or robust remote assets when appropriate. For revisions, return the entire updated HTML document. Do not claim you deployed, saved, or hosted anything. For ordinary questions, answer naturally. The HTML runs in an isolated browser preview.';

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

          const messages = [
            { role: 'system' as const, content: INSTRUCTIONS },
            ...parsed.data.messages.map((message) => ({
              role: message.role,
              content: message.parts.map((part) => part.text).join('\n'),
            })),
          ];

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
