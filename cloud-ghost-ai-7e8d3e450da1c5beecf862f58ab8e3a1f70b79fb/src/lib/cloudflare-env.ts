type WorkersAIMessage = { role: 'system' | 'user' | 'assistant'; content: string };

type WorkersAI = {
  run(
    model: string,
    input: { messages: WorkersAIMessage[]; stream: true; max_tokens?: number },
  ): Promise<ReadableStream<unknown>>;
};

type CloudflareBindings = { AI?: WorkersAI };

let currentBindings: CloudflareBindings | undefined;

// The Worker environment bindings are stable for the lifetime of this isolate.
// The server entry calls this before dispatching each request so route handlers
// can use the native Workers AI binding without putting credentials in the app.
export function setCloudflareBindings(bindings: unknown): void {
  currentBindings = bindings as CloudflareBindings;
}

export function getWorkersAI(): WorkersAI | undefined {
  return currentBindings?.AI;
}
