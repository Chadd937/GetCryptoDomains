import { createFileRoute } from '@tanstack/react-router';
import { ArrowUpRight, ExternalLink, Maximize2 } from 'lucide-react';

const OFFICE_HUB_URL = 'https://office.getcryptodomains.com';

export const Route = createFileRoute('/office')({
  head: () => ({
    meta: [
      { title: 'Virtual Office Hub — GetCryptoDomains' },
      {
        name: 'description',
        content:
          'Open your private virtual headquarters with owner-controlled managers, employees, projects, tasks, and approvals.',
      },
    ],
  }),
  component: VirtualOfficeHub,
});

function VirtualOfficeHub() {
  return (
    <main className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="flex min-h-14 items-center justify-between gap-3 border-b border-border px-4 py-3 sm:px-6">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
            GetCryptoDomains
          </p>
          <h1 className="truncate text-lg font-semibold">Virtual Office Hub</h1>
        </div>
        <a
          href={OFFICE_HUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-sm font-medium transition-colors hover:bg-muted"
          aria-label="Open Virtual Office Hub in a new tab"
        >
          <Maximize2 className="size-4" />
          <span className="hidden sm:inline">Open full app</span>
          <ArrowUpRight className="size-4" />
        </a>
      </header>
      <section className="relative min-h-[calc(100dvh-3.5rem)] flex-1">
        <iframe
          title="Virtual Office Hub"
          src={OFFICE_HUB_URL}
          className="absolute inset-0 h-full min-h-[calc(100dvh-3.5rem)] w-full border-0 bg-background"
          loading="eager"
          referrerPolicy="strict-origin-when-cross-origin"
          allow="clipboard-read; clipboard-write; fullscreen"
        />
        <noscript>
          <p className="p-6">
            JavaScript is required to use the Virtual Office Hub.{' '}
            <a href={OFFICE_HUB_URL}>Open the office app</a>.
          </p>
        </noscript>
      </section>
      <footer className="flex flex-wrap items-center justify-between gap-2 border-t border-border px-4 py-2 text-xs text-muted-foreground sm:px-6">
        <span>The office runs as a separate application to keep its deployment and workspace services isolated.</span>
        <a
          href={OFFICE_HUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 hover:text-foreground"
        >
          office.getcryptodomains.com <ExternalLink className="size-3" />
        </a>
      </footer>
    </main>
  );
}
