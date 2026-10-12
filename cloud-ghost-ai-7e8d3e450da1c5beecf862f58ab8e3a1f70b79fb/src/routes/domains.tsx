import { createFileRoute, Link } from '@tanstack/react-router';
import { useState } from 'react';
import { ArrowRight, ArrowUpRight, CheckCircle2, Globe, Search, ShieldCheck, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export const Route = createFileRoute('/domains')({
  head: () => ({ meta: [
    { title: 'Crypto Domains — getCryptoDomains' },
    { name: 'description', content: 'Discover a domain for your next crypto, Web3, or AI project. Search with Dynadot or bring a domain you already own.' },
  ] }),
  component: DomainMarketplace,
});

const examples = [
  { name: 'BlockHarbor', domain: 'blockharbor.com', category: 'Web3 infrastructure', note: 'Illustrative idea' },
  { name: 'ChainPilot', domain: 'chainpilot.xyz', category: 'Crypto tools', note: 'Illustrative idea' },
  { name: 'TokenGarden', domain: 'tokengarden.io', category: 'DeFi & community', note: 'Illustrative idea' },
  { name: 'GhostLayer', domain: 'ghostlayer.ai', category: 'AI & blockchain', note: 'Illustrative idea' },
];

function DomainMarketplace() {
  const [query, setQuery] = useState('');
  function search(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = query.trim();
    if (!value || /\s/.test(value)) return;
    window.open('https://www.dynadot.com/domain/search?domain=' + encodeURIComponent(value), '_blank', 'noopener,noreferrer');
  }
  return <main className="platform-page">
    <header className="platform-nav"><Link to="/domains" className="platform-brand"><span>◆</span> getCryptoDomains</Link><nav><Link to="/domains" className="current">Domains</Link><Link to="/studio">AI Studio</Link><Link to="/virtual-store">Virtual Store</Link></nav><a href="https://www.dynadot.com/" target="_blank" rel="noreferrer" className="platform-nav-link">Registrar <ArrowUpRight className="size-3.5" /></a></header>
    <section className="domain-hero"><div className="platform-kicker"><Sparkles className="size-3.5" /> YOUR NEXT IDEA STARTS HERE</div><h1>A name worth<br /><em>building on.</em></h1><p>Find your domain, create your web app with AI Studio, then bring your launch team together in your own virtual office.</p><form className="domain-search" onSubmit={search}><Search className="size-4" /><Input aria-label="Search for a domain" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search a name or full domain…" required /><Button type="submit" disabled={!query.trim()}>Search domains <ArrowRight className="size-4" /></Button></form><div className="domain-trust"><span><CheckCircle2 className="size-3.5" /> New domain or one you own</span><span><ShieldCheck className="size-3.5" /> Registration handled securely by registrar</span></div></section>
    <section className="domain-section"><div className="platform-section-head"><div><div className="platform-kicker">THE STARTING LINE</div><h2>Ideas for your next domain</h2></div><span>Concepts, not availability claims</span></div><div className="domain-idea-grid">{examples.map(item => <article className="domain-idea" key={item.domain}><div className="domain-idea-icon"><Globe className="size-5" /></div><span className="domain-idea-category">{item.category}</span><h3>{item.name}</h3><p>{item.domain}</p><span className="domain-idea-note">{item.note}</span><button type="button" onClick={() => setQuery(item.domain)}>Use this idea <ArrowRight className="size-3.5" /></button></article>)}</div><p className="domain-disclaimer">These are sample naming ideas only. No live availability or pricing is implied. Search with Dynadot to confirm whether a domain can be registered and at what price.</p></section>
    <section className="platform-journey"><div><span className="platform-kicker">ONE CONNECTED JOURNEY</span><h2>From domain to digital business.</h2><p>Keep moving forward without stitching together a dozen disconnected tools.</p></div><div className="journey-steps"><Link to="/domains"><span>01</span><strong>Find a domain</strong><small>Search or bring your own</small><ArrowRight className="size-4" /></Link><Link to="/studio"><span>02</span><strong>Build with AI Studio</strong><small>AI-powered web app studio</small><ArrowRight className="size-4" /></Link><Link to="/virtual-store"><span>03</span><strong>Run your virtual office</strong><small>Manage the next steps</small><ArrowRight className="size-4" /></Link></div></section>
    <footer className="platform-footer">getCryptoDomains <span>·</span> Domains, creation, and launch operations in one place.</footer>
  </main>;
}
