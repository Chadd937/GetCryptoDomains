# getCryptoDomains

## Product
- [x] Create haunted AI builder interface and live preview.
- [x] Pull the complete getCryptoDomains AI Studio flow from the local project (verified identical to Chadd937/cloud-ghost-ai).
- [x] Verify Cloudflare AI generation through the connector gateway (Llama 3.3 70B: non-streaming + streaming verified).
- [x] Route chat.ts AI calls through the Cloudflare connector gateway (Cloudflare Workers AI binding configured in the server handler).
- [ ] Verify generated HTML preview isolation and export behavior.
- [ ] Add end-to-end browser smoke tests.

## Authentication and security
- [x] Add same-origin server proxy routes for email-code authentication.
- [x] Validate chat sessions against the auth service rather than an unconfigured app D1 binding.
- [x] Add tests for verified sessions, proxy cookie forwarding, and cross-origin POST rejection.
- [x] Confirm auth.getcryptodomains.com is live (session endpoint 200; email code request advances the flow).
- [ ] Run a full live sign-in + AI chat round trip (needs a real email inbox to read the code).
- [ ] Add end-to-end browser smoke tests for sign-in and chat.

## Delivery
- [x] Add GitHub Actions checks for authentication/chat lint, tests, and production build.
- [ ] Fix remaining repository-wide lint findings.
- [ ] Confirm production build passes in CI.
- [ ] Point hosting to GetCryptoDomains.com (domain connection pending user request).
