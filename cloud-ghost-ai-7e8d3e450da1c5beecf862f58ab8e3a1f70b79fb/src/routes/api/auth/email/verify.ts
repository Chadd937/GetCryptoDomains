import { createFileRoute } from '@tanstack/react-router';
import { proxyAuthRequest } from '@/lib/auth';

export const Route = createFileRoute('/api/auth/email/verify')({
  server: { handlers: { POST: ({ request }) => proxyAuthRequest(request, '/auth/email/verify') } },
});
