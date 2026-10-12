# Cloud Ghost AI — GetCryptoDomains

Live site: https://getcryptodomains.com

## Authentication and secrets

The browser uses same-origin `/api/auth/*` endpoints. The app server proxies
those requests to the passwordless email authentication service and validates
chat sessions against `/auth/session`.

Configure these server-side environment variables in the deployment platform:

- `AUTH_API_URL` — auth service origin; defaults to `https://auth.getcryptodomains.com`.
- `AUTH_COOKIE_NAME` — must match the cookie name configured on the auth Worker; defaults to `site_session`.
- `CLOUDFLARE_ACCOUNT_ID` — Cloudflare account ID for Workers AI.
- `CLOUDFLARE_API_TOKEN` — secret API token permitted to invoke Workers AI.

Never put the Cloudflare API token in a `VITE_*` or `NEXT_PUBLIC_*` variable,
commit it, or expose it to the browser. Authentication must be configured and
verified before sign-in can be considered production-ready.

## Development

Requires Node.js and npm.

```sh
npm ci
npm run dev
```

## Checks

```sh
npm test
npm run build
npx wrangler deploy --dry-run
```

GitHub Actions workflows are provided for CI and Cloudflare deployment.
The deployment workflow requires the `CLOUDFLARE_API_TOKEN` repository secret.
