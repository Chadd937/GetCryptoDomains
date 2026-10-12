import { createFileRoute } from '@tanstack/react-router';
import { proxyAuthRequest } from '@/lib/auth';

export const Route = createFileRoute('/api/auth/logout')({
  server: { handlers: { POST: ({ request }) => proxyAuthRequest(request, '/auth/logout') } },
});
