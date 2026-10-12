import { createFileRoute, Link } from '@tanstack/react-router';
import { useState } from 'react';
import { ArrowLeft, ArrowUpRight, Check, Circle, ExternalLink, Globe, Smartphone, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export const Route = createFileRoute('/office')({
  head: () => ({ meta: [{ title: 'Launch Office — Unlovable' }, { name: 'description', content: 'Plan your domain, website, and Google Play launch in one workspace.' }] }),
  component: LaunchOffice,
});

const tasks = [
  ['Define the app and audience', 'Describe what the app does and who it helps.', 'Plan'],
  ['Secure a domain', 'Search a name and register it with a domain registrar.', 'Domain'],
  ['Publish your website', 'Build the landing page and deploy it to your hosting provider.', 'Website'],
  ['Prepare the Android release', 'Build a signed Android App Bundle (AAB).', 'Google Play'],
  ['Complete the Play Store listing', 'Prepare screenshots, description, privacy policy, and required declarations.', 'Google Play'],
  ['Test the release', 'Test on devices and complete any Play Console testing requirements.', 'Testing'],
  ['Submit for review', 'Check release details and submit through Google Play Console.', 'Launch'],
] as const;

function LaunchOffice() {
  const [domain, setDomain] = useState('');
  const [project, setProject] = useState('');
  const [completed, setCompleted] = useState<number[]>([]);
  const [showDns, setShowDns] = useState(false);

  function searchDomain(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = domain.trim();
    if (!name || /\s/.test(name)) return;
    window.open('https://www.dynadot.com/domain/search?domain=' + encodeURIComponent(name), '_blank', 'noopener,noreferrer');
  }

  return <div className="app-shell">
    <aside className="sidebar office-sidebar">
      <Link to="/studio" className="brand"><span className="office-heart">♥</span> Unlovable</Link>
      <div className="sidebar-label">Your company</div>
      <Link to="/studio" className="office-nav"><ArrowLeft className="size-4" /> AI workbench</Link>
      <div className="office-nav active"><Users className="size-4" /> Launch office</div>
      <div className="office-sidebar-foot">Unlovable — by getCryptoDomains</div>
    </aside>
    <main className="main-workspace office-main">
      <header className="topbar"><div className="breadcrumb">Unlovable <span>/</span> <strong>Launch office</strong></div><a className="office-external" href="https://play.google.com/console/" target="_blank" rel="noreferrer">Google Play Console <ArrowUpRight className="size-3.5" /></a></header>
      <div className="office-content">
        <div className="office-eyebrow">UNLOVABLE · BY GETCRYPTODOMAINS</div>
        <h1 className="office-title">From idea to <em>published.</em></h1>
        <p className="office-lede">Your app, domain, website, and Google Play launch — organized in one place.</p>
        <div className="office-project-bar"><div className="office-project-icon"><Smartphone className="size-5" /></div><div className="office-project-input"><label htmlFor="office-project">Project name</label><Input id="office-project" value={project} onChange={e => setProject(e.target.value)} placeholder="e.g. Midnight Wallet" /></div><div className="office-progress"><strong>{completed.length} / {tasks.length}</strong><span>launch steps complete</span><div className="office-progress-track"><span style={{ width: (completed.length / tasks.length * 100) + '%' }} /></div></div></div>
        <section className="office-section" id="domain">
          <div className="office-section-heading"><h2><span>01</span> Find your domain</h2><span className="office-pill">Domain desk</span></div>
          <div className="office-domain-card"><div className="office-domain-copy"><Globe className="size-5 text-primary" /><div><h3>Your idea deserves its own address.</h3><p>Search through Dynadot. Availability, final pricing, and registration are confirmed by the registrar.</p></div></div><form className="office-domain-form" onSubmit={searchDomain}><Input aria-label="Domain name to search" value={domain} onChange={e => setDomain(e.target.value)} placeholder="yourgreatidea.com" required /><Button type="submit" disabled={!domain.trim()}>Search domains <ExternalLink className="size-3.5" /></Button></form><p className="office-domain-note">This opens Dynadot in a new tab. We have not connected a reseller API or affiliate tracking yet, and this page does not claim live availability.</p></div>
          <div className="office-connect-card"><div><h3>Already own a domain?</h3><p>Connect it after your site is deployed by adding the exact DNS records your hosting provider supplies.</p></div><Button variant="outline" onClick={() => setShowDns(v => !v)}>{showDns ? 'Hide steps' : 'Show connection steps'}</Button>{showDns && <ol><li>Deploy the website first.</li><li>Add your domain in your hosting provider’s custom-domain settings.</li><li>Copy the exact DNS records it provides into your registrar’s DNS panel.</li><li>Wait for verification and HTTPS before sharing the site.</li></ol>}</div>
        </section>
        <section className="office-section" id="checklist"><div className="office-section-heading"><h2><span>02</span> Launch checklist</h2><span className="office-muted">{Math.round(completed.length / tasks.length * 100)}% complete</span></div><div className="office-task-list">{tasks.map((task, i) => <article className={'office-task ' + (completed.includes(i) ? 'is-complete' : '')} key={task[0]}><button className="office-task-check" type="button" aria-label={completed.includes(i) ? 'Mark incomplete' : 'Mark complete'} onClick={() => setCompleted(current => current.includes(i) ? current.filter(n => n !== i) : [...current, i])}>{completed.includes(i) ? <Check className="size-4" /> : <Circle className="size-4" />}</button><div><div className="office-task-meta">{task[2]} · STEP {String(i + 1).padStart(2, '0')}</div><h3>{task[0]}</h3><p>{task[1]}</p></div></article>)}</div></section>
        <section className="office-section"><div className="office-section-heading"><h2><span>03</span> Build your team</h2><span className="office-pill">Next phase</span></div><div className="office-team-card"><Users className="size-6 text-primary" /><div><h3>Managers, employees, and private project spaces</h3><p>This is the first launch-office foundation. Team invitations, role permissions, and cross-device task storage must be backed by authenticated server-side storage before they can safely go live.</p></div></div></section>
        <footer className="office-footer">Your idea. Your domain. Your launch.</footer>
      </div>
    </main>
  </div>;
}
