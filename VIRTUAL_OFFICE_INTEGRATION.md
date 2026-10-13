# Virtual Office Hub integration

The `/office` page now hosts the separately deployed Virtual Office Hub at
https://office.getcryptodomains.com. The office stays a standalone app and
keeps its own deployment, dependencies, and owner-scoped workspace services.

## Deployment prerequisite

The Virtual Office Hub must be deployed from
https://github.com/Chadd937/virtual-office-hub with its own Wrangler config.
That config targets `office.getcryptodomains.com`. The main site iframe
requires the office deployment to permit embedding from
`https://getcryptodomains.com`; if the browser blocks third-party cookies or
framing, use the **Open full app** link in the office header.

The `/office` route no longer renders the previous static launch checklist.
