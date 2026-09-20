"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowUpRight, BarChart3, Check, CheckCircle2, Crosshair, Layers3, Loader2, Rocket, TrendingUp } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { leadSchema, spendOptions, type LeadInput } from "@/lib/leads";
import { faqs } from "@/lib/site";

const steps = [
  { title: "Audit", number: "01", icon: Crosshair, subtitle: "Find your strongest starting point.", bullets: ["Understand your ideal member", "Review your offer and website", "Check your existing campaigns", "Define a budget and clear goals"] },
  { title: "Launch", number: "02", icon: Rocket, subtitle: "Give the right people a reason to join.", bullets: ["Build Meta and Google campaigns", "Develop and test ad creative", "Set up lead and booking tracking", "Connect ads to your intro offer"] },
  { title: "Scale", number: "03", icon: TrendingUp, subtitle: "Let the data guide the next move.", bullets: ["Review lead quality with you", "Refine audiences and messaging", "Shift budget toward what works", "Share clear, practical reporting"] },
];
const industries = [
  { title: "Boutique gyms", type: "STRENGTH", image: "/images/boutique-gym.webp", imageAlt: "AI-generated boutique strength gym with warm lighting and neatly arranged training equipment", bullets: ["Promote trials and club visits", "Reach people in your local area", "Track inquiries through to sign-ups"] },
  { title: "Pilates & yoga studios", type: "MOVEMENT", image: "/images/pilates-studio.webp", imageAlt: "AI-generated Pilates studio with wood-framed reformers and warm natural light", bullets: ["Bring attention to intro offers", "Promote classes with open spaces", "Reconnect with interested visitors"] },
  { title: "Boxing & martial arts", type: "DISCIPLINE", image: "/images/boxing-club.webp", imageAlt: "AI-generated boxer training with a heavy bag inside a boutique boxing club", bullets: ["Promote beginner-friendly programs", "Reach local adults and families", "Turn interest into trial bookings"] },
];
function Mark() {
  return <svg viewBox="0 0 32 32" fill="none" aria-hidden="true"><path d="M3 26V7h5l8 11L24 7h5v19h-5V15l-8 11-8-11v11H3Z" fill="currentColor" /></svg>;
}
function Brand() {
  return <a className="brand" href="#top" aria-label="Momentum home"><Mark /><span>momentum<span className="brand-dot">.</span></span></a>;
}
function BulletList({ items }: { items: string[] }) {
  return <ul className="bullet-list">{items.map(item => <li key={item}><Check aria-hidden="true" /><span>{item}</span></li>)}</ul>;
}
type ModelTool = { name: string; title: string; description: string; inputSchema: object; annotations: { readOnlyHint: boolean; untrustedContentHint: boolean }; execute: (input: unknown) => Promise<unknown> };

export default function Home() {
  const [spend, setSpend] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "success">("idle");
  const [error, setError] = useState("");
  const [savedEmail, setSavedEmail] = useState("");
  const submitting = useRef(false);
  const requestId = useRef<string | null>(null);
  const previousPayload = useRef("");
  const successRef = useRef<HTMLDivElement>(null);

  const submitLead = useCallback(async (input: unknown) => {
    if (submitting.current) throw new Error("A request is already being saved.");
    const validated = leadSchema.safeParse(input);
    if (!validated.success) {
      const message = validated.error.issues[0]?.message || "Please check your details.";
      setError(message); throw new Error(message);
    }
    submitting.current = true; setError(""); setStatus("saving");
    const payload = JSON.stringify(validated.data);
    if (!requestId.current || previousPayload.current !== payload) requestId.current = crypto.randomUUID();
    previousPayload.current = payload;
    try {
      const response = await fetch("/api/leads", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...validated.data, requestId: requestId.current }) });
      const result = await response.json() as { ok?: boolean; error?: string };
      if (!response.ok || !result.ok) throw new Error(result.error || "We couldn’t save your request. Please try again.");
      setSavedEmail(validated.data.email); setSpend(validated.data.monthlyAdSpend); setStatus("success");
      return { status: "request_received", nextStep: "Momentum will follow up by email to arrange a call. No time is booked yet." };
    } catch (err) {
      const message = err instanceof Error ? err.message : "We couldn’t save your request. Please try again.";
      setError(message); setStatus("idle"); throw new Error(message);
    } finally { submitting.current = false; }
  }, []);
  useEffect(() => { if (status === "success") successRef.current?.focus(); }, [status]);
  useEffect(() => {
    const context = (document as Document & { modelContext?: { registerTool: (tool: ModelTool, options: { signal: AbortSignal }) => void | Promise<void> } }).modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();
    try {
      void Promise.resolve(context.registerTool({
        name: "request_strategy_call", title: "Request a Momentum strategy call",
        description: "Save a fitness business’s request for a strategy call. This sends contact details to Momentum for email follow-up; it does not schedule a time. Submit only when the visitor has asked to send these details.",
        inputSchema: { type: "object", properties: { businessName: { type: "string", maxLength: 120 }, email: { type: "string", format: "email", maxLength: 254 }, phone: { type: "string", maxLength: 30 }, businessUrl: { type: "string", maxLength: 500 }, monthlyAdSpend: { type: "string", enum: [...spendOptions] } }, required: ["businessName", "email", "businessUrl", "monthlyAdSpend"], additionalProperties: false },
        annotations: { readOnlyHint: false, untrustedContentHint: false },
        async execute(input) {
          const result = await submitLead(input);
          await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
          document.getElementById("book")?.scrollIntoView({ behavior: "instant", block: "start" });
          return result;
        },
      }, { signal: lifecycle.signal })).catch(() => {});
    } catch { /* The form also works without model context. */ }
    return () => lifecycle.abort();
  }, [submitLead]);
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const input: LeadInput = { businessName: String(form.get("businessName") || ""), email: String(form.get("email") || ""), phone: String(form.get("phone") || ""), businessUrl: String(form.get("businessUrl") || ""), monthlyAdSpend: spend as LeadInput["monthlyAdSpend"], website: String(form.get("website") || "") };
    try { await submitLead(input); } catch { /* Keep inputs and show the error. */ }
  }

  return (
    <div className="site" id="top">
      <a className="skip-link" href="#main">Skip to content</a>
      <header className="site-header"><div className="container header-inner"><Brand /><nav className="nav" aria-label="Main navigation"><a href="#process">Our approach</a><a href="#industries">Who we help</a><a href="#faq">FAQs</a><a className="nav-cta" href="#book">Let’s talk <ArrowUpRight aria-hidden="true" /></a></nav></div></header>
      <main id="main">
        <section className="hero" aria-labelledby="hero-heading"><div className="container">
          <div className="eyebrow">Paid ads for niche fitness clubs</div>
          <h1 id="hero-heading"><span>WE RUN THE ADS.</span><span className="gold-line">YOU RUN THE CLUB.</span></h1>
          <div className="hero-bottom"><p className="hero-description">Focused Meta and Google campaigns that help the right people discover your club—and take the first step inside.</p><div className="hero-action"><a href="#book" className="button">Book a Strategy Call <ArrowUpRight aria-hidden="true" /></a><p className="micro-copy">Your club. Your goals. A clear next step.</p></div></div>
          <div className="trust-row" aria-label="Our approach to your growth"><div className="trust-item"><Layers3 aria-hidden="true" /><div><strong>Meta + Google</strong><span>A focused paid-media approach</span></div></div><div className="trust-item"><Crosshair aria-hidden="true" /><div><strong>Fitness comes first</strong><span>Built around your club and community</span></div></div><div className="trust-item"><BarChart3 aria-hidden="true" /><div><strong>Clarity at every step</strong><span>Your accounts. Transparent reporting.</span></div></div></div>
        </div></section>
        <section id="process" className="section" aria-labelledby="process-heading"><div className="container">
          <div className="section-top"><div><div className="eyebrow">The Momentum method</div><h2 id="process-heading">Three steps to<br /><span>unstoppable growth.</span></h2></div><p className="section-note">A clear plan from the first conversation to your next campaign.</p></div>
          <div className="process-grid">{steps.map(step => <article className="process-card" key={step.title}><div className="step-top"><span className="step-number">/ {step.number}</span><step.icon className="step-icon" aria-hidden="true" /></div><h3>{step.title}</h3><p>{step.subtitle}</p><BulletList items={step.bullets} /></article>)}</div>
          <p className="process-footnote"><strong>AI-assisted. Human-led.</strong> Technology supports the work. People make the decisions.</p>
        </div></section>
        <section id="industries" className="section industries" aria-labelledby="industries-heading"><div className="container">
          <div className="section-top"><div><div className="eyebrow">Built for your world</div><h2 id="industries-heading">Industries We Serve</h2></div><p className="section-note">Different disciplines.<br />The same ambition to grow.</p></div>
          <div className="industry-grid">{industries.map(industry => <article className="industry-card" key={industry.title}><div className="industry-art"><img src={industry.image} alt={industry.imageAlt} width={1200} height={800} loading="lazy" decoding="async" /><span className="industry-type" aria-hidden="true">{industry.type}</span></div><div className="industry-content"><h3>{industry.title}</h3><BulletList items={industry.bullets} /></div></article>)}</div>
        </div></section>
        <section id="faq" className="section" aria-labelledby="faq-heading"><div className="container faq-layout"><div className="faq-title"><div className="eyebrow">Good questions. Clear answers.</div><h2 id="faq-heading">Before we<br /><span>talk growth.</span></h2><p>A few things you might want to know before booking a call.</p></div><Accordion className="faq-list" type="single" collapsible>{faqs.map((faq, index) => <AccordionItem className="faq-item" value={"faq-" + index} key={faq.q}><AccordionTrigger className="faq-trigger">{faq.q}</AccordionTrigger><AccordionContent className="faq-answer">{faq.a}</AccordionContent></AccordionItem>)}</Accordion></div></section>
        <section id="book" className="section contact-section" aria-labelledby="contact-heading"><div className="container contact-layout">
          <div className="contact-copy"><div className="eyebrow">Your next chapter starts here</div><h2 id="contact-heading">Ready to<br /><span>grow?</span></h2><p>Tell us a little about your club. Let’s explore where paid ads could take it.</p><div className="call-agenda"><h3>WHAT WE’LL COVER</h3><BulletList items={["Your club’s goals and current marketing", "Your offer, audience, and opportunities", "A practical direction for your ad budget"]} /></div></div>
          <div className="lead-form">{status === "success" ? <div className="form-success" ref={successRef} tabIndex={-1} role="status"><CheckCircle2 className="success-icon" aria-hidden="true" /><h3>You’re on our radar.</h3><p>Your request has been saved. We’ll follow up at <strong>{savedEmail}</strong> to arrange your strategy call.</p><p>No time is booked yet. We’ll find one that works for you.</p></div> : <form onSubmit={handleSubmit} aria-label="Request a strategy call" aria-busy={status === "saving"}>
            <p className="form-intro">Share your details and we’ll email you to arrange a time. No obligation.</p>
            <div className="form-field"><label htmlFor="businessName">Business name</label><input id="businessName" name="businessName" placeholder="Your club or studio" autoComplete="organization" required minLength={2} maxLength={120} disabled={status === "saving"} /></div>
            <div className="form-field"><label htmlFor="email">Email address</label><input id="email" name="email" type="email" placeholder="you@yourclub.com" autoComplete="email" required maxLength={254} disabled={status === "saving"} /></div>
            <div className="form-field"><label htmlFor="phone">Phone number <span className="label-optional">optional</span></label><input id="phone" name="phone" type="tel" inputMode="tel" placeholder="+1 555 123 4567" autoComplete="tel" maxLength={30} disabled={status === "saving"} /></div>
            <div className="form-field"><label htmlFor="businessUrl">Business URL</label><input id="businessUrl" name="businessUrl" type="text" inputMode="url" placeholder="yourclub.com" autoComplete="url" required maxLength={500} disabled={status === "saving"} /></div>
            <div className="form-field"><label htmlFor="monthlyAdSpend">Monthly ad spend</label><Select name="monthlyAdSpend" value={spend} onValueChange={setSpend} required disabled={status === "saving"}><SelectTrigger id="monthlyAdSpend" className="spend-select"><SelectValue placeholder="Select your budget" /></SelectTrigger><SelectContent position="popper">{spendOptions.map(option => <SelectItem className="spend-option" key={option} value={option}>{option}</SelectItem>)}</SelectContent></Select></div>
            <div className="honeypot" aria-hidden="true"><label htmlFor="website">Leave this field empty</label><input id="website" name="website" tabIndex={-1} autoComplete="off" /></div>
            {error && <p className="form-error" role="alert">{error}</p>}
            <button className="button" type="submit" disabled={status === "saving"}>{status === "saving" ? <>Saving your request <Loader2 className="animate-spin" aria-hidden="true" /></> : <>Book a Strategy Call <ArrowUpRight aria-hidden="true" /></>}</button>
            <p className="form-privacy">By submitting, you agree to be contacted about your inquiry.</p>
          </form>}</div>
        </div></section>
      </main>
      <footer className="footer"><div className="container footer-inner"><Brand /><p className="footer-tagline">Built for clubs that move people.</p><p>© 2026 Momentum. All rights reserved.</p></div></footer>
    </div>
  );
}
