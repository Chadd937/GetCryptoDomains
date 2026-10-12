# Cloud Ghost AI



## Authentication and secrets

The browser uses same-origin `/api/auth/*` endpoints. The app server proxies those requests to the passwordless email auth service and validates chat sessions against `/auth/session`. This avoids relying on a browser cookie scoped to a different host or on an app D1 binding that is not configured here.

Configure these server-side environment variables in the deployment platform:

- `AUTH_API_URL` — auth service origin; defaults to `https://auth.getcryptodomains.com`.
- `AUTH_COOKIE_NAME` — must match the cookie name configured on the auth Worker; defaults to `site_session`.
- `CLOUDFLARE_ACCOUNT_ID` — Cloudflare account ID for Workers AI.
- `CLOUDFLARE_API_TOKEN` — secret API token permitted to invoke Workers AI.

Never put the Cloudflare API token in a `VITE_*` or `NEXT_PUBLIC_*` variable, commit it, or expose it to the browser. The auth service must be deployed and configured with its D1 database, email delivery secrets, and matching session-cookie name before sign-in can work end-to-end.

## Development

Requires Node.js and npm.

```sh
git clone https://github.com/Chadd937/cloud-ghost-ai.git
cd cloud-ghost-ai
npm ci
npm run dev
```

## Checks

```sh
npm run lint
npm test
npm run build
```

GitHub Actions runs focused lint on the authentication/chat files, tests, and the production build. Repository-wide lint cleanup remains separate work.
