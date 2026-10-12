import { createFileRoute, Link } from '@tanstack/react-router';
import { ArrowLeft, ArrowRight, Bot, BriefcaseBusiness, CheckCircle2, CircleHelp, ClipboardCheck, Globe, MessageSquare, Rocket, ShieldCheck, Users, WandSparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const Route = createFileRoute('/virtual-store')({
  head: () => ({ meta: [
    { title: 'Virtual Store — AI Studio' },
    { name: 'description', content: 'Your AI-powered virtual office for launching, operating, and growing your digital business.' },
  ] }),
  component: VirtualStore,
});

const rooms = [
  { n: '01', title: 'Manager’s office', desc: 'Priorities, planning, and team coordination', icon: BriefcaseBusiness, status: 'Ready to configure' },
  { n: '02', title: 'Build & engineering', desc: 'Web app changes, bug fixes, and releases', icon: WandSparkles, status: 'Connect project' },
  { n: '03', title: 'Domain & security', desc: 'DNS, HTTPS, access, and domain health', icon: Globe, status: 'Connect domain' },
  { n: '04', title: 'Launch & growth', desc: 'Google Play, content, marketing, and analytics', icon: Rocket, status: 'Launch checklist' },
];

function VirtualStore() {
  return <main className="platform-page virtual-store-page">
    <header className="platform-nav"><Link to="/domains" className="platform-brand"><span>◆</span> getCryptoDomains</Link><nav><Link to="/domains">Domains</Link><Link to="/studio">AI Studio</Link><Link to="/virtual-store" className="current">Virtual Store</Link></nav><span className="office-mode"><span /> OFFICE CONCEPT</span></header>
    <section className="store-hero"><div className="store-hero-copy"><div className="platform-kicker"><Bot className="size-3.5" /> YOUR DIGITAL OPERATIONS TEAM</div><h1>Your business.<br /><em>Your own office.</em></h1><p>Once your web app is live, step into a virtual office built to help you figure out what comes next — with a manager, specialist teams, and AI assistance across your project’s lifecycle.</p><div className="store-hero-actions"><Link to="/office"><Button>Open launch office <ArrowRight className="size-4" /></Button></Link><Link to="/studio"><Button variant="outline">Return to AI Studio</Button></Link></div><div className="store-security"><ShieldCheck className="size-4" /><span>Customer workspaces must remain private. Team roles and saved work will be enabled with secure account-backed storage.</span></div></div>
      <div className="office-building" aria-label="Illustration of a virtual office building with AI team avatars"><div className="building-sky"><span className="sky-orb" /><span className="sky-star star-one">✦</span><span className="sky-star star-two">✧</span></div><div className="building-sign"><span>GC</span><div><b>YOUR COMPANY</b><small>DIGITAL OPERATIONS</small></div></div><div className="building-floor floor-top"><div className="room-label">MANAGER</div><div className="desk"><span className="avatar avatar-manager">M</span><i /></div><div className="plant">♣</div></div><div className="building-floor floor-mid"><div className="room-label">ENGINEERING</div><div className="desk"><span className="avatar avatar-dev">A</span><i /></div><div className="desk desk-two"><span className="avatar avatar-dev2">B</span><i /></div><div className="walking-avatar">●<small>AI</small></div></div><div className="building-floor floor-low"><div className="room-label">LAUNCH & GROWTH</div><div className="desk"><span className="avatar avatar-growth">G</span><i /></div><div className="plant">♣</div></div><div className="building-base"><span>YOUR IDEA, IN MOTION</span><div className="base-lights"><i /><i /><i /><i /><i /></div></div><div className="building-caption"><span className="pulse-dot" /> YOUR VIRTUAL HEADQUARTERS</div></div>
    </section>
    <section className="store-overview"><div className="platform-section-head"><div><div className="platform-kicker">THE OFFICE FLOORPLAN</div><h2>Every team has a purpose.</h2></div><p>A visual map of the work your business needs next.</p></div><div className="office-room-grid">{rooms.map(room => <article className="office-room" key={room.n}><div className="room-card-top"><span>{room.n}</span><room.icon className="size-5" /></div><h3>{room.title}</h3><p>{room.desc}</p><div className="room-card-status"><CircleHelp className="size-3.5" /> {room.status}</div></article>)}</div></section>
    <section className="store-service-desk"><div className="service-desk-icon"><MessageSquare className="size-6" /></div><div className="service-desk-copy"><div className="platform-kicker">THE OPERATIONS DESK</div><h2>“What should I do next?” is a valid request.</h2><p>Customers should be able to ask for help in plain language — from fixing a domain issue to preparing a Play Store release, improving SEO, reviewing accessibility, adding features, or planning their next product. The office should route each request to the right specialist workflow, ask before consequential actions, and show progress.</p></div></section>
    <section className="store-principles"><div><CheckCircle2 className="size-4" /><span>Clear project ownership and audit trail</span></div><div><ClipboardCheck className="size-4" /><span>Tasks, approvals, and visible progress</span></div><div><Users className="size-4" /><span>Manager and employee roles with least privilege</span></div><div><ShieldCheck className="size-4" /><span>Human approval before purchases or publishing</span></div></section>
    <footer className="platform-footer"><Link to="/domains"><ArrowLeft className="size-3.5" /> Back to getCryptoDomains</Link><span>Virtual Store concept · AI Studio by getCryptoDomains</span></footer>
  </main>;
}
