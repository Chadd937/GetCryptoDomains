const DEFAULT_AUTH_API_URL = 'https://auth.getcryptodomains.com';

function authApiUrl(path: string): URL {
  const baseUrl = process.env['AUTH_API_URL'] || DEFAULT_AUTH_API_URL;
  return new URL(path, baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`);
}

function sessionCookieHeader(request: Request): string | null {
  const cookieName = process.env['AUTH_COOKIE_NAME'] || 'site_session';
  const cookieHeader = request.headers.get('cookie');
  if (!cookieHeader) return null;
  return cookieHeader.split(';').map((cookie) => cookie.trim()).find((cookie) => cookie.startsWith(`${cookieName}=`)) || null;
}

export async function verifySession(request: Request): Promise<{ authenticated: true; verified: true } | null> {
  const cookie = sessionCookieHeader(request);
  if (!cookie) return null;

  try {
    const response = await fetch(authApiUrl('/auth/session'), {
      method: 'GET',
      headers: { cookie, accept: 'application/json' },
      cache: 'no-store',
      redirect: 'follow',
    });
    if (!response.ok) return null;

    const session: unknown = await response.json();
    if (
      typeof session === 'object' &&
      session !== null &&
      'authenticated' in session &&
      'verified' in session &&
      session.authenticated === true &&
      session.verified === true
    ) {
      return { authenticated: true, verified: true };
    }
  } catch (error) {
    console.error('Auth session validation failed:', error instanceof Error ? error.message : 'unknown error');
  }

  return null;
}

export async function proxyAuthRequest(request: Request, authPath: string): Promise<Response> {
  const origin = request.headers.get('origin');
  if (request.method !== 'GET' && origin && origin !== new URL(request.url).origin) {
    return new Response('Unauthorized origin', { status: 403 });
  }

  const headers = new Headers({ accept: 'application/json' });
  const cookie = sessionCookieHeader(request);
  const contentType = request.headers.get('content-type');
  if (cookie) headers.set('cookie', cookie);
  if (contentType) headers.set('content-type', contentType);

  try {
    const response = await fetch(authApiUrl(authPath), {
      method: request.method,
      headers,
      body: request.method === 'GET' || request.method === 'HEAD' ? null : await request.arrayBuffer(),
      cache: 'no-store',
      redirect: 'follow',
    });

    const responseHeaders = new Headers({
      'cache-control': 'no-store',
      'content-type': response.headers.get('content-type') || 'application/json; charset=utf-8',
    });
    const setCookie = response.headers.get('set-cookie');
    if (setCookie) responseHeaders.set('set-cookie', setCookie);

    return new Response(response.body, { status: response.status, headers: responseHeaders });
  } catch (error) {
    console.error('Auth proxy request failed:', error instanceof Error ? error.message : 'unknown error');
    return new Response(JSON.stringify({ detail: 'Authentication service is temporarily unavailable.' }), {
      status: 502,
      headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
    });
  }
}
