## Repository workflow
- Preserve published commit history; use forward-only commits instead of force-pushing or rewriting shared history.
- Keep changes buildable because pushes to the main branch trigger CI and Cloudflare deployment.

## Application rules
- Use AI Elements for the chat surface and AI SDK for streaming; this preserves reliable message and composer behavior.
- Use the linked Cloudflare connector exclusively for AI requests, with credentials read inside server handlers; this keeps account access private.
- Render generated HTML in a sandboxed iframe without same-origin privileges; this isolates untrusted generated code.
- Keep the initial builder session in memory until the user chooses conversation storage; this avoids assuming persistence.
