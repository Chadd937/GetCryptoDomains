import { createFileRoute } from '@tanstack/react-router';
import { useEffect } from 'react';
import { ArrowUpRight, Building2 } from 'lucide-react';

const VIRTUAL_OFFICE_URL = 'https://office.getcryptodomains.com';

export const Route = createFileRoute('/office')({
  head: () => ({
    meta: [
      { title: 'Virtual Office — GetCryptoDomains' },
      {
        name: 'description',
        content: 'Open your full Virtual Office workspace for projects, managers, employees, tasks, and approvals.',
      },
    ],
  }),
  component: VirtualOfficeEntry,
});

function VirtualOfficeEntry() {
  useEffect(() => {
    // Keep the main site's existing entry/login flow, then hand off to the
    // independently deployed Virtual Office app without another login screen.
    window.location.replace(VIRTUAL_OFFICE_URL);
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 py-12 text-foreground">
      <section className="w-full max-w-lg rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Building2 className="h-7 w-7" aria-hidden="true" />
        </div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          GetCryptoDomains
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">Opening your Virtual Office</h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Taking you to your full workspace for projects, managers, employees, tasks, and approvals.
        </p>
        <a
          href={VIRTUAL_OFFICE_URL}
          className="mt-6 inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          Open Virtual Office <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </a>
      </section>
    </main>
  );
}
