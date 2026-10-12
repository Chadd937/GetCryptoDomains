<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Application rules
- Use AI Elements for the chat surface and AI SDK for streaming; this preserves reliable message and composer behavior.
- Use the linked Cloudflare connector exclusively for AI requests, with credentials read inside server handlers; this keeps account access private.
- Render generated HTML in a sandboxed iframe without same-origin privileges; this isolates untrusted generated code.
- Keep the initial builder session in memory until the user chooses conversation storage; this avoids assuming persistence.
