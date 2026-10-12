import { createFileRoute, Link } from '@tanstack/react-router';
import { ArrowRight, ArrowUpRight, Building2, CheckCircle2, Globe, Search, Sparkles, WandSparkles } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export const Route = createFileRoute('/')({
  head: () => ({ meta: [
    { title: 'getCryptoDomains — Name it. Build it. Launch it.' },
    { name: 'description', content: 'Find a domain, build a web app with AI Studio, and manage your digital business from a virtual office.' },
    { property: 'og:title', content: 'getCryptoDomains — Name it. Build it. Launch it.' },
    { property: 'og:description', content: 'Your connected path from domain discovery to AI-built web app and virtual operations office.' },
  ] }),
  component: Home,
});

const featured = [
  { title: 'BlockHarbor', domain: 'blockharbor.com', type: 'Web3 infrastructure', mark: 'B' },
  { title: 'ChainPilot', domain: 'chainpilot.xyz', type: 'Crypto tools', mark: 'C' },
  { title: 'TokenGarden', domain: 'tokengarden.io', type: 'DeFi & community', mark: 'T' },
];

function Home() {
  const [query, setQuery] = useState('');
  function search(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = query.trim();
    if (!value || /\s/.test(value)) return;
    window.open('https://www.dynadot.com/domain/search?domain=' + encodeURIComponent(value), '_blank', 'noopener,noreferrer');
  }
  return <main className="platform-page home-page">
    <header className="platform-nav"><Link to="/" className="platform-brand"><span>◆</span> getCryptoDomains</Link><nav><Link to="/domains" className="current">Domains</Link><Link to="/studio">AI Studio</Link><Link to="/virtual-store">Virtual Store</Link></nav><Link to="/studio" className="platform-nav-link">Start building <ArrowUpRight className="size-3.5" /></Link></header>
    <section className="domain-hero home-hero"><div className="platform-kicker"><Sparkles className="size-3.5" /> YOUR NEXT DIGITAL BUSINESS STARTS HERE</div><h1>Name it.<br /><em>Build it. Launch it.</em></h1><p>Find the right domain, turn your idea into a live web app with AI Studio, and manage everything that comes next from your own virtual office.</p><form className="domain-search" onSubmit={search}><Search className="size-4" /><Input aria-label="Search for a domain" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search a domain name, e.g. myproject.com" required /><Button type="submit" disabled={!query.trim()}>Find my domain <ArrowRight className="size-4" /></Button></form><div className="domain-trust"><span><CheckCircle2 className="size-3.5" /> Already own a domain? Bring it with you.</span><span><Globe className="size-3.5" /> Domain search handled by Dynadot</span></div></section>
    <section className="domain-section home-featured"><div className="platform-section-head"><div><div className="platform-kicker">A LITTLE INSPIRATION</div><h2>Names for ideas worth building.</h2></div><Link to="/domains" className="platform-nav-link">Explore domain desk <ArrowRight className="size-3.5" /></Link></div><div className="domain-idea-grid">{featured.map(item => <article className="domain-idea" key={item.domain}><div className="domain-idea-icon"><span className="featured-letter">{item.mark}</span></div><span className="domain-idea-category">{item.type}</span><h3>{item.title}</h3><p>{item.domain}</p><span className="domain-idea-note">Example name · availability not checked</span><button type="button" onClick={() => setQuery(item.domain)}>Search this name <ArrowRight className="size-3.5" /></button></article>)}</div><p className="domain-disclaimer">Featured names are illustrative ideas, not claims that the domains are available or for sale. Confirm availability and current pricing with the registrar.</p></section>
    <section className="platform-journey home-journey"><div><div className="platform-kicker">THREE STEPS. ONE CONNECTED PLATFORM.</div><h2>From a name to a business that’s live.</h2><p>Start wherever you are — even if you already own a domain or have an existing app.</p><Link to="/studio" className="home-primary-link">Enter AI Studio <ArrowRight className="size-4" /></Link></div><div className="journey-steps"><Link to="/domains"><span>01</span><strong>Find or bring a domain</strong><small>Discover a name or connect one you own</small><Globe className="size-4" /></Link><Link to="/studio"><span>02</span><strong>Build with AI Studio</strong><small>Create, preview, refine, and publish a web app</small><WandSparkles className="size-4" /></Link><Link to="/virtual-store"><span>03</span><strong>Run your virtual office</strong><small>Organize your launch and ongoing operations</small><Building2 className="size-4" /></Link></div></section>
    <footer className="platform-footer"><span>getCryptoDomains · AI Studio · Virtual Store</span><nav aria-label="Legal"><Link to="/terms">Terms</Link><Link to="/privacy">Privacy</Link></nav><span>One home for your digital business.</span></footer>
  </main>;
}
