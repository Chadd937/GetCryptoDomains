import { createFileRoute } from '@tanstack/react-router';
import { proxyAuthRequest } from '@/lib/auth';

export const Route = createFileRoute('/api/auth/session')({
  server: { handlers: { GET: ({ request }) => proxyAuthRequest(request, '/auth/session') } },
});
