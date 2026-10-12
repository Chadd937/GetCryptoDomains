import { createFileRoute } from '@tanstack/react-router';
import { proxyAuthRequest } from '@/lib/auth';

export const Route = createFileRoute('/api/auth/email/request')({
  server: { handlers: { POST: ({ request }) => proxyAuthRequest(request, '/auth/email/request') } },
});
