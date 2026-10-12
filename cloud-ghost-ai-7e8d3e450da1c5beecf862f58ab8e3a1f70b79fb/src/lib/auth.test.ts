import { afterEach, describe, expect, it, vi } from 'vitest';
import { proxyAuthRequest, verifySession } from './auth';

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe('verifySession', () => {
  it('does not call the auth service when there is no cookie', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    await expect(verifySession(new Request('https://app.example/api/chat'))).resolves.toBeNull();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('accepts only a verified session from the auth service', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ authenticated: true, verified: true }), { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);
    await expect(verifySession(new Request('https://app.example/api/chat', { headers: { cookie: 'site_session=opaque-token' } }))).resolves.toEqual({ authenticated: true, verified: true });
    expect(fetchMock).toHaveBeenCalledWith(new URL('https://auth.getcryptodomains.com/auth/session'), expect.objectContaining({ headers: { cookie: 'site_session=opaque-token', accept: 'application/json' } }));
  });

  it('rejects unverified sessions and auth-service failures', async () => {
    for (const payload of [{ authenticated: false, verified: false }, { authenticated: true, verified: false }]) {
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify(payload), { status: 200 })));
      await expect(verifySession(new Request('https://app.example/api/chat', { headers: { cookie: 'site_session=opaque-token' } }))).resolves.toBeNull();
    }
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')));
    await expect(verifySession(new Request('https://app.example/api/chat', { headers: { cookie: 'site_session=opaque-token' } }))).resolves.toBeNull();
  });
});

describe('proxyAuthRequest', () => {
  it('rejects cross-origin POST requests before forwarding them', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    const response = await proxyAuthRequest(new Request('https://app.example/api/auth/email/request', { method: 'POST', headers: { origin: 'https://attacker.example', 'content-type': 'application/json' }, body: JSON.stringify({ email: 'person@example.com' }) }), '/auth/email/request');
    expect(response.status).toBe(403);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('forwards the request and returns the session cookie on the app origin', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ ok: true }), { status: 200, headers: { 'content-type': 'application/json', 'set-cookie': 'site_session=opaque-token; HttpOnly; Secure; SameSite=Lax; Path=/' } }));
    vi.stubGlobal('fetch', fetchMock);
    const response = await proxyAuthRequest(new Request('https://app.example/api/auth/email/verify', { method: 'POST', headers: { origin: 'https://app.example', 'content-type': 'application/json' }, body: JSON.stringify({ email: 'person@example.com', code: '123456' }) }), '/auth/email/verify');
    expect(response.status).toBe(200);
    expect(response.headers.get('set-cookie')).toContain('site_session=opaque-token');
    expect(fetchMock).toHaveBeenCalledWith(new URL('https://auth.getcryptodomains.com/auth/email/verify'), expect.objectContaining({ method: 'POST' }));
  });
});
