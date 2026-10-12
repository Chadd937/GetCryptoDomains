import { createFileRoute, Link } from '@tanstack/react-router';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowUp, ArrowUpRight, Building2, ChevronDown, ChevronRight, Cloud, Code2, Download, Eye, Globe, LayoutTemplate, Menu, Monitor, Moon, Plus, RotateCcw, Settings2, ShieldCheck, Smartphone, Square, Wand2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Conversation, ConversationContent, ConversationScrollButton } from '@/components/ai-elements/conversation';
import { Message, MessageContent, MessageResponse } from '@/components/ai-elements/message';
import { PromptInput, PromptInputTextarea, PromptInputFooter, PromptInputSubmit } from '@/components/ai-elements/prompt-input';
import { Shimmer } from '@/components/ai-elements/shimmer';
import { AuthFlow } from '@/components/ai-elements/auth-flow';
import { extractHtml, assistantSummary } from '@/lib/generated-site';
import hauntedGarden from '@/assets/haunted-garden.jpg';

export const Route = createFileRoute('/studio')({
  head: () => ({ meta: [
    { title: 'getCryptoDomains Studio — Build with AI' },
    { name: 'description', content: 'Create websites with AI Studio, a haunted AI workspace powered by your Cloudflare account.' },
    { property: 'og:title', content: 'getCryptoDomains — AI Studio' },
    { property: 'og:description', content: 'Conjure a website from an idea. Build, preview and export with Cloudflare AI.' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ] }),
  component: AI Studio,
});

function Sigil({ className = '' }: { className?: string }) {
  return <svg className={`brand-mark ${className}`} viewBox="0 0 32 32" fill="none" aria-label="getCryptoDomains mark"><path d="M16 2.5 29.5 16 16 29.5 2.5 16 16 2.5Z" stroke="currentColor" strokeWidth="2"/><path d="M10 16h12M16 10v12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>;
}

const starters = [
  { title: 'The Midnight Portfolio', subtitle: 'A little mystery. A lot of you.', art: 'portfolio', prompt: 'Build an elegant dark photographer portfolio called Midnight Studio with a gallery, about section and working contact form.' },
  { title: 'An Otherworldly Store', subtitle: 'For things worth obsessing over.', art: 'store', prompt: 'Build a beautiful gothic bookstore called The Curiosity Shop with book products, filtering and a working shopping cart.' },
  { title: 'Your Next Obsession', subtitle: 'An app with a life of its own.', art: 'app', prompt: 'Build a polished dark task management app called Nightshift with tasks, add task form, complete actions, and filters.' },
];

function AI Studio() {
  const [input, setInput] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [view, setView] = useState<'preview' | 'code'>('preview');
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [frameKey, setFrameKey] = useState(0);
  const [starterFilter, setStarterFilter] = useState(false);
  const textarea = useRef<HTMLTextAreaElement>(null);
  const starterSection = useRef<HTMLDivElement>(null);
  const transport = useMemo(() => new DefaultChatTransport({ api: '/api/chat' }), []);
  const { messages, sendMessage, status, error, stop, setMessages, clearError } = useChat({ transport });
  const active = messages.length > 0;
  const busy = status === 'submitted' || status === 'streaming';
  const html = useMemo(() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      const message = messages[i];
      if (message?.role === 'assistant') {
        const text = message.parts.filter(part => part.type === 'text').map(part => part.text).join('');
        const result = extractHtml(text);
        if (result) return result;
      }
    }
    return null;
  }, [messages]);
  useEffect(() => { if (!busy && !settingsOpen) textarea.current?.focus(); }, [busy, settingsOpen, active]);

  function startNew() {
    void stop(); setMessages([]); clearError(); setInput(''); setMenuOpen(false); setView('preview');
  }
  function choosePrompt(prompt: string) { setInput(prompt); textarea.current?.focus(); }
  function downloadSite() {
    if (!html) return;
    const url = URL.createObjectURL(new Blob([html], { type: 'text/html' }));
    const a = document.createElement('a'); a.href = url; a.download = 'getcryptodomains-creation.html'; a.click(); URL.revokeObjectURL(url);
  }
  function submit({ text }: { text: string }) {
    if (!text.trim() || busy) return;
    clearError(); void sendMessage({ text: text.trim() }); setInput(''); textarea.current?.focus();
  }
  const composer = <div className="composer">
    <PromptInput onSubmit={submit}>
      <PromptInputTextarea ref={textarea} aria-label="Describe your website" value={input} onChange={event => setInput(event.target.value)} placeholder={active ? 'Whisper your next change…' : 'Describe your idea. Let’s give it a life of its own…'} />
      <PromptInputFooter>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon-sm" type="button" title="New creation" aria-label="New creation" onClick={startNew}><Plus /></Button>
          <Button variant="ghost" size="sm" type="button" className="text-muted-foreground text-[11px]" onClick={() => setSettingsOpen(true)}><Cloud className="size-3.5" /> Cloudflare AI <ChevronDown className="size-3" /></Button>
        </div>
        <PromptInputSubmit status={status} onStop={() => void stop()} disabled={!busy && !input.trim()} title={busy ? 'Stop generation' : 'Bring it to life'}>{busy ? <Square className="size-3.5" /> : <ArrowUp className="size-4" />}</PromptInputSubmit>
      </PromptInputFooter>
    </PromptInput>
  </div>;

  // Authentication is handled once at the application root before any route renders.
  return <TooltipProvider><div className="app-shell">
    <aside className={`sidebar ${menuOpen ? 'open' : ''}`}>
      <div className="brand"><Sigil className="text-primary" /> AI Studio <Button variant="ghost" size="icon-sm" className="mobile-menu ml-auto" aria-label="Close menu" onClick={() => setMenuOpen(false)}><X /></Button></div>
      <div className="mt-8"><Button variant="outline" className="w-full justify-start gap-3 text-xs h-10" onClick={startNew}><Plus className="size-4" /> New creation <span className="ml-auto text-muted-foreground">↗</span></Button></div>
      <div className="sidebar-label">Your workspace</div>
      <Button variant="ghost" className="nav-item active" onClick={() => { if (active) startNew(); setMenuOpen(false); }}><Moon className="size-4" /> The workbench</Button>
      <Button variant="ghost" className="nav-item" onClick={() => { if (active) startNew(); setStarterFilter(true); setMenuOpen(false); setTimeout(() => starterSection.current?.scrollIntoView({ behavior: 'smooth' }), 100); }}><LayoutTemplate className="size-4" /> Dark beginnings</Button>
      <Link to="/office" className="nav-item flex items-center gap-3" onClick={() => setMenuOpen(false)}><Globe className="size-4" /> Launch office</Link>
      <Link to="/domains" className="nav-item flex items-center gap-3" onClick={() => setMenuOpen(false)}><Globe className="size-4" /> Domain marketplace</Link>
      <Link to="/virtual-store" className="nav-item flex items-center gap-3" onClick={() => setMenuOpen(false)}><Building2 className="size-4" /> Virtual Store</Link>
      <div className="sidebar-label">This session</div>
      <div className="px-3 text-[11px] text-muted-foreground leading-6">{active ? <div className="flex items-center gap-2 text-foreground"><span className="status-dot" /> Untitled creation</div> : 'No spirits summoned. Yet.'}</div>
      <div className="sidebar-bottom">
        <Button variant="ghost" className="nav-item" onClick={() => setSettingsOpen(true)}><Settings2 className="size-4" /> Settings & connections</Button>
        <div className="flex items-center gap-3 px-3 pt-4"><div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary font-display text-lg">C</div><div className="flex-1"><div className="text-xs">Your workspace</div><div className="text-[10px] text-muted-foreground mt-1">Something wicked awaits</div></div><ChevronDown className="size-3 text-muted-foreground" /></div>
      </div>
    </aside>
    <main className="main-workspace">
      <header className="topbar">
        <div className="flex items-center gap-3"><Button variant="ghost" size="icon-sm" className="mobile-menu" aria-label="Open menu" onClick={() => setMenuOpen(true)}><Menu /></Button><div className="breadcrumb"><Moon className="size-3.5" /><span className="text-muted-foreground">Workspace</span><ChevronRight className="size-3" /><span className="text-foreground">{active ? 'Untitled creation' : 'The workbench'}</span></div></div>
        <div className="flex items-center gap-4"><button className="connection" type="button" onClick={() => setSettingsOpen(true)}><span className="status-dot" /><span>Cloudflare connected</span></button><Button variant="ghost" size="icon-sm" aria-label="Connection settings" title="Connection settings" onClick={() => setSettingsOpen(true)}><Settings2 className="size-4 text-muted-foreground" /></Button></div>
      </header>
      {!active ? <section className="creation-home">
        <img src={hauntedGarden} className="haunted-background" alt="A moonlit gothic doorway in a haunted garden" width={1536} height={1024} />
        <div className="home-content">
          <div className="greeting">An idea is a dangerous thing</div>
          <h1 className="hero-heading">AI Studio<span className="text-primary">.</span></h1>
          <p className="hero-subtitle">Bring your dark ideas to life.</p>
          {composer}
          <div className="composer-note"><ShieldCheck className="size-3" /> Your imagination. Your Cloudflare. No borrowed magic.</div>
          <div className="suggestions">{[
            ['A haunting portfolio', 'Build a haunting personal portfolio for a creative designer with projects, about and contact sections.'],
            ['A store with a soul', starters[1]?.prompt ?? ''],
            ['Something nobody’s built', 'Build a unique interactive constellation journal where I can add notes as stars and click them to read.'],
          ].map(([label, prompt]) => <Button key={label} variant="outline" className="suggestion" onClick={() => choosePrompt(prompt ?? '')}><Wand2 className="size-3" /> {label}</Button>)}</div>
          <div ref={starterSection} className="starters-heading"><h2>{starterFilter ? 'Choose a dark beginning' : 'Every creation starts somewhere'}</h2><Button variant="ghost" size="sm" className="text-[10px] text-muted-foreground" onClick={() => setStarterFilter(!starterFilter)}>{starterFilter ? 'All beginnings' : 'Find your inspiration'}<ArrowUpRight className="size-3" /></Button></div>
          <div className="starters-grid">{starters.map(starter => <Button key={starter.title} variant="ghost" className="starter-card" onClick={() => choosePrompt(starter.prompt)}>
            {starter.art === 'app' ? <div className="starter-art editor-preview-art"><small>NIGHTSHIFT / YOUR SPACE</small><span className="!text-[22px]">Make time for the dark.</span><div className="mini-topbar" /><div className="mini-columns"><div className="mini-block" /><div className="mini-block" /><div className="mini-block" /></div></div> : <div className="starter-art"><img src={hauntedGarden} alt="" loading="lazy" width={1536} height={1024} /><small>{starter.art === 'portfolio' ? 'DESIGN • AFTER DARK' : 'OBJECTS WITH STORIES'}</small><span>{starter.art === 'portfolio' ? 'Midnight Studio' : 'The Curiosity Shop'}</span><small>{starter.art === 'portfolio' ? 'Selected works — 2026' : 'Rare finds. Strange delights.'}</small></div>}
            <div className="starter-caption"><strong>{starter.title}</strong><small>{starter.subtitle}</small></div>
          </Button>)}</div>
          <div className="footer-whisper"><Moon className="size-3" /> Made for the beautifully strange.</div>
        </div>
      </section> : <div className="builder-layout">
        <section className="chat-panel">
          <div className="chat-title"><Sigil className="!w-5 !h-6 text-primary" /><span className="font-display text-xl">Your creation, awakened.</span></div>
          <Conversation><ConversationContent className="p-1 gap-6">{messages.map(message => <Message key={message.id} from={message.role}><MessageContent>{message.parts.map((part, index) => part.type === 'text' ? <MessageResponse key={index}>{message.role === 'assistant' ? assistantSummary(part.text) : part.text}</MessageResponse> : null)}</MessageContent></Message>)}{busy && <div className="text-primary py-3 text-xs"><Shimmer>{html ? 'Shaping your creation…' : 'Summoning your creation…'}</Shimmer></div>}</ConversationContent><ConversationScrollButton /></Conversation>
          {error && <div role="alert" className="error-notice">{error.message}</div>}
          {composer}
        </section>
        <section className="preview-panel">
          <div className="preview-toolbar"><div className="flex gap-1"><Button variant={view === 'preview' ? 'secondary' : 'ghost'} size="sm" onClick={() => setView('preview')} className="text-xs"><Eye className="size-3.5" /> Preview</Button><Button variant={view === 'code' ? 'secondary' : 'ghost'} size="sm" onClick={() => setView('code')} className="text-xs"><Code2 className="size-3.5" /> Code</Button></div><div className="flex gap-1">{[{ name: 'Desktop preview', icon: Monitor, action: () => setDevice('desktop'), selected: device === 'desktop' }, { name: 'Mobile preview', icon: Smartphone, action: () => setDevice('mobile'), selected: device === 'mobile' }, { name: 'Reload preview', icon: RotateCcw, action: () => setFrameKey(value => value + 1) }, { name: 'Download website', icon: Download, action: downloadSite }].map(control => <Tooltip key={control.name}><TooltipTrigger asChild><Button variant={control.selected ? 'secondary' : 'ghost'} size="icon-sm" aria-label={control.name} disabled={control.name === 'Download website' && !html} onClick={control.action}><control.icon className="size-3.5" /></Button></TooltipTrigger><TooltipContent>{control.name}</TooltipContent></Tooltip>)}</div></div>
          {html ? view === 'code' ? <pre className="code-output">{html}</pre> : <div className={`preview-frame-wrap ${device === 'mobile' ? 'mobile' : ''}`}><iframe key={frameKey} title="Generated website preview" srcDoc={html} sandbox="allow-scripts allow-forms allow-modals" /></div> : <div className="preview-empty"><Sigil className="!w-12 !h-14 text-spectral" /><span>{busy ? 'Something is coming to life…' : 'Your next creation appears here.'}</span></div>}
        </section>
      </div>}
    </main>
    <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}><DialogContent><DialogHeader><DialogTitle className="font-display text-3xl">The source of your magic</DialogTitle><DialogDescription>Your AI Studio workspace</DialogDescription></DialogHeader><div><div className="settings-detail"><span className="flex items-center gap-2"><Cloud className="size-4 text-spectral" /> AI provider</span><span>Cloudflare Workers AI</span></div><div className="settings-detail"><span>Connection</span><span className="text-primary">Connected</span></div><div className="settings-detail"><span>Model</span><span>Llama 3.3 · 70B</span></div><div className="settings-detail"><span>History</span><span>This session only</span></div><div className="settings-detail"><span className="flex items-center gap-2"><Globe className="size-4" /> Intended domain</span><span>GetCryptoDomains.com</span></div><p className="text-xs text-muted-foreground leading-6 mt-4">Cloudflare usage is billed to your connected account. Your account credentials stay private.</p></div><Button variant="secondary" onClick={() => setSettingsOpen(false)}>Back to the workbench</Button></DialogContent></Dialog>
  </div></TooltipProvider>;
}
