"use client";
import { useEffect, useState } from "react";
import { AuthFlow } from "@/components/ai-elements/auth-flow";

type Stage = "checking" | "terms" | "auth";
type LegalTab = "terms" | "privacy" | "data";

export function FirstVisitGate({ onComplete }: { onComplete: () => void }) {
  const [stage, setStage] = useState<Stage>("checking");
  const [tab, setTab] = useState<LegalTab>("terms");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAcknowledged, setPrivacyAcknowledged] = useState(false);
  const [dataAcknowledged, setDataAcknowledged] = useState(false);

  useEffect(() => {
    try { setStage(localStorage.getItem("getcryptodomains_legal_version") === "2026-10-12" ? "auth" : "terms"); }
    catch { setStage("terms"); }
  }, []);

  function acceptAndContinue() {
    if (!termsAccepted || !privacyAcknowledged || !dataAcknowledged) return;
    try {
      localStorage.setItem("getcryptodomains_terms_accepted", "true");
      localStorage.setItem("getcryptodomains_legal_version", "2026-10-12");
      localStorage.setItem("getcryptodomains_legal_accepted_at", new Date().toISOString());
    } catch { /* Consent still applies to this visit if storage is unavailable. */ }
    setStage("auth");
  }

  if (stage === "checking") return <div className="fixed inset-0 z-[9999] bg-[#080b09]" aria-label="Preparing terms and privacy notice" />;
  if (stage === "auth") return <AuthFlow onAuthenticated={onComplete} />;

  return <main className="fixed inset-0 z-[9999] overflow-y-auto bg-[#080b09] px-4 py-6 text-[#f0f2eb] sm:px-6 sm:py-10">
    <section className="mx-auto flex min-h-full w-full max-w-3xl flex-col rounded-2xl border border-[#52604e] bg-[#101511] p-5 shadow-2xl sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#b4d79a]">getCryptoDomains · AI Studio · Virtual Office</p>
      <h1 className="mt-3 font-serif text-3xl sm:text-4xl">Before you enter</h1>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-[#c1c8bd]">Review the terms, privacy notice, and data-use disclosures. You must acknowledge all three before secure email-code sign-in appears. No landing-page or workspace content is rendered before this step.</p>
      <div className="mt-6 flex flex-wrap gap-2" role="tablist" aria-label="Legal disclosures">
        {([["terms","Terms of Service"],["privacy","Privacy Policy"],["data","Data-use disclosures"]] as const).map(([value,label]) =>
          <button key={value} type="button" role="tab" aria-selected={tab===value} onClick={() => setTab(value)}
            className={"rounded-full border px-4 py-2 text-sm " + (tab===value ? "border-[#b4d79a] bg-[#283626] text-white" : "border-[#394238] text-[#c1c8bd] hover:border-[#809579]")}>{label}</button>)}
      </div>
      <div className="mt-4 max-h-[42vh] min-h-[250px] overflow-y-auto rounded-xl border border-[#394238] bg-[#090d0a] p-5 text-sm leading-6 text-[#d6ddd2]">
        {tab === "terms" && <div className="space-y-4">
          <h2 className="text-lg font-semibold text-white">Terms of Service · Effective October 12, 2026</h2>
          <p>getCryptoDomains provides domain-discovery links, AI-assisted website creation through AI Studio, and virtual-office planning tools. By continuing, you agree to use the services lawfully and responsibly.</p>
          <h3 className="font-semibold text-white">Accounts and security</h3><p>You must provide an email address you control and protect your email account and sign-in codes. Do not share verification codes. We may restrict access to protect the service or respond to misuse.</p>
          <h3 className="font-semibold text-white">AI-generated content</h3><p>AI output can be inaccurate, incomplete, insecure, or similar to other output. Review and test generated code, content, accessibility, licensing, and security before publishing or relying on it. You are responsible for prompts, submitted material, and how you use generated output. Do not submit secrets, passwords, payment-card details, or information you are not authorized to share.</p>
          <h3 className="font-semibold text-white">Acceptable use</h3><p>Do not use the service to break the law, violate others' rights, distribute malware, compromise systems, deceive people, or generate content you have no right to use. Do not bypass security, abuse AI or infrastructure, or disrupt the service.</p>
          <h3 className="font-semibold text-white">Domains and third parties</h3><p>Domain searches may open Dynadot or another third-party service. We do not guarantee availability, price, ownership, renewal, registration, or transfer of a domain. The registrar's terms, privacy practices, fees, and checkout govern transactions you make there.</p>
          <h3 className="font-semibold text-white">Availability and disclaimers</h3><p>The service is provided on an “as available” basis to the extent permitted by law. Features may change or be unavailable. Back up your work; do not assume drafts or local workspace state persist across devices or sessions. We do not promise uninterrupted service, error-free output, or a particular business result. Nothing here is legal, tax, financial, or security advice.</p>
          <h3 className="font-semibold text-white">Liability and changes</h3><p>To the extent permitted by applicable law, we disclaim implied warranties and are not responsible for indirect, incidental, special, consequential, or lost-profit damages arising from use of the service. Nothing excludes liability that cannot legally be excluded. We may update these terms. If you do not agree, do not continue using the service.</p>
        </div>}
        {tab === "privacy" && <div className="space-y-4">
          <h2 className="text-lg font-semibold text-white">Privacy Policy · Effective October 12, 2026</h2>
          <h3 className="font-semibold text-white">Information handled</h3><p>Depending on features used, information can include your email for login and verification; verification and session information needed to secure your account; technical request and security logs; and prompts, instructions, and generated content submitted through AI Studio.</p>
          <h3 className="font-semibold text-white">How information is used</h3><p>We use information to authenticate you, provide the application, process AI requests, maintain security, prevent abuse, troubleshoot failures, and operate the service. Browser storage remembers your legal-consent choice. Authentication may use a session cookie.</p>
          <h3 className="font-semibold text-white">No sale of personal data</h3><p><strong className="text-white">We do not sell or rent your personal information.</strong> We do not offer personal information to data brokers. We may process or disclose information to service providers needed to operate the product, when you direct us to use a third party, when required by law, or to protect rights and safety.</p>
          <h3 className="font-semibold text-white">Service providers and external links</h3><p>Cloudflare provides hosting, infrastructure, and AI services; information sent to an AI feature is processed to produce its response and may be handled under Cloudflare's applicable service terms. When you follow a domain-search link, Dynadot receives information you submit to it and its own policies apply. We do not control third-party sites or their practices.</p>
          <h3 className="font-semibold text-white">Retention, security, and choices</h3><p>Information is retained as needed to operate, secure, and troubleshoot the service and meet legal obligations. No internet transmission or storage method is guaranteed perfectly secure. You can stop using the service and clear browser storage, which will make the legal-consent screen appear again. Account-level access, correction, or deletion requests require a functioning privacy contact and requester verification.</p>
          <h3 className="font-semibold text-white">Children and policy changes</h3><p>This service is not designed for children under 13. We may update this policy and its effective date. Review third-party policies before sending them information.</p>
        </div>}
        {tab === "data" && <div className="space-y-4">
          <h2 className="text-lg font-semibold text-white">Plain-language data-use disclosures</h2>
          <ul className="list-disc space-y-2 pl-5">
            <li><strong className="text-white">We do not sell your data.</strong> We do not sell or rent personal information or provide it to data brokers.</li>
            <li>Your email is used for passwordless login and account/session security.</li>
            <li>Prompts and content sent to AI Studio are processed by the configured AI service to generate responses. Do not paste passwords, API keys, wallet seed phrases, confidential customer records, or other secrets.</li>
            <li>Cloudflare is a hosting, security, and AI provider. External domain searches go to Dynadot; information entered there is subject to its policies.</li>
            <li>Necessary authentication cookies and browser storage may keep you signed in and remember consent. Clearing browser storage resets this browser's consent reminder.</li>
            <li>The office/checklist interface is not a guaranteed private, durable, cross-device document store. Do not put sensitive company or customer data in it.</li>
            <li>This notice does not promise a specific retention period. Retention depends on data type and operational/security needs; do not assume data is deleted just because you leave the page.</li>
          </ul>
          <p className="rounded-lg border border-[#5b684b] bg-[#172016] p-3 text-[#e1e9d8]">Before public launch, configure a monitored privacy contact and verify actual authentication, AI-provider, logging, and database retention settings against this notice.</p>
        </div>}
      </div>
      <div className="mt-5 space-y-3 text-sm">
        <label className="flex cursor-pointer items-start gap-3"><input className="mt-1 accent-[#b4d79a]" type="checkbox" checked={termsAccepted} onChange={e=>setTermsAccepted(e.target.checked)}/><span>I agree to the Terms of Service.</span></label>
        <label className="flex cursor-pointer items-start gap-3"><input className="mt-1 accent-[#b4d79a]" type="checkbox" checked={privacyAcknowledged} onChange={e=>setPrivacyAcknowledged(e.target.checked)}/><span>I have reviewed and acknowledge the Privacy Policy.</span></label>
        <label className="flex cursor-pointer items-start gap-3"><input className="mt-1 accent-[#b4d79a]" type="checkbox" checked={dataAcknowledged} onChange={e=>setDataAcknowledged(e.target.checked)}/><span>I understand the data-use disclosures, including that personal data is not sold and prompts may be processed by Cloudflare AI.</span></label>
      </div>
      <button type="button" onClick={acceptAndContinue} disabled={!termsAccepted || !privacyAcknowledged || !dataAcknowledged} className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-[#b4d79a] px-5 py-3 font-semibold text-[#101710] transition hover:bg-[#c8e8ae] disabled:cursor-not-allowed disabled:opacity-40">Agree and continue to secure sign-in</button>
      <p className="mt-3 text-center text-xs leading-5 text-[#899486]">Your choice is remembered in this browser. This is not a substitute for server-side consent records or legal review.</p>
    </section>
  </main>;
}
