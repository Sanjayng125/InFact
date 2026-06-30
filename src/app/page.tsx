import Link from "next/link";
import {
  Search,
  ShieldCheck,
  Zap,
  Image,
  Video,
  Link as LinkIcon,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import VerdictBadge from "@/components/fact-check/VerdictBadge";
import ConfidenceBar from "@/components/fact-check/ConfidenceBar";
import { DEMO_CLAIMS, PRICING } from "@/lib/constants";

const FEATURES = [
  {
    icon: Search,
    title: "Multi-source verification",
    desc: "The agent searches the web multiple times per claim, cross-referencing sources before forming a verdict.",
  },
  {
    icon: ShieldCheck,
    title: "Transparent reasoning",
    desc: "Every verdict comes with a full explanation and cited sources so you can verify the verification.",
  },
  {
    icon: Zap,
    title: "Agentic pipeline",
    desc: "Powered by AI with function calling — the AI decides what to search and when it has enough evidence.",
  },
  {
    icon: Image,
    title: "Image analysis",
    desc: "Upload screenshots, photos, or memes. inFact extracts and verifies the claims within.",
  },
  {
    icon: Video,
    title: "Video transcription",
    desc: "Upload video clips. inFact transcribes the audio and fact-checks every spoken claim.",
  },
  {
    icon: LinkIcon,
    title: "URL fact-checking",
    desc: "Paste any article URL. inFact extracts the content and verifies the key claims made.",
  },
];

export default function LandingPage() {
  return (
    <div className="bg-background text-primary min-h-screen">
      <section className="max-w-7xl mx-auto px-6 pt-24 pb-20">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono mb-8 bg-accent/8 border border-accent/20 text-accent">
            <Zap size={11} />
            Powered by AI + Tavily
          </div>

          <h1 className="font-mono font-extrabold text-3xl sm:text-5xl leading-[1.05] tracking-tight mb-6">
            Don't believe
            <br />
            everything you read.
            <br />
            <span className="text-accent">Verify it.</span>
          </h1>

          <p className="text-muted text-lg leading-relaxed max-w-lg mb-10">
            Paste a claim, drop an image, upload a video, or share a URL.
            inFact's AI agent searches the web, cross-references sources, and
            returns a verdict — with evidence.
          </p>

          <div className="flex items-center gap-3 flex-wrap">
            <Link
              href="/sign-up"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium bg-accent text-background hover:opacity-90 transition-opacity"
            >
              Start fact-checking free
              <ArrowRight size={15} />
            </Link>
            <Link
              href="#how-it-works"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm text-muted border border-border-custom hover:text-primary transition-colors"
            >
              See how it works
            </Link>
          </div>
        </div>
      </section>

      <section
        id="how-it-works"
        className="border-t border-b border-border-custom py-20"
      >
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-xs font-mono uppercase tracking-widest text-subtle mb-10">
            Live example
          </p>
          <div className="grid gap-4 max-w-2xl">
            {DEMO_CLAIMS.map((item, i) => (
              <div
                key={i}
                className="rounded-xl p-5 bg-surface border border-border-custom"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <p className="text-sm leading-relaxed text-primary/80">
                    "{item.claim}"
                  </p>
                  <VerdictBadge verdict={item.verdict} />
                </div>
                <ConfidenceBar value={item.confidence} verdict={item.verdict} />
                <p className="text-xs mt-3 leading-relaxed text-muted">
                  {item.reasoning}
                </p>
                <p className="text-xs mt-2 font-mono text-subtle">
                  via {item.source}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-xs font-mono uppercase tracking-widest text-subtle mb-3">
            Features
          </p>
          <h2 className="font-mono font-bold text-4xl tracking-tight mb-12">
            Everything you need
            <br />
            to verify a claim.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <div
                  key={i}
                  className="rounded-xl p-5 bg-surface border border-border-custom"
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-4 bg-accent/8 border border-accent/15">
                    <Icon size={15} className="text-accent" />
                  </div>
                  <h3 className="text-sm font-medium font-mono text-primary mb-2">
                    {f.title}
                  </h3>
                  <p className="text-xs leading-relaxed text-muted">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-t border-border-custom py-20">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-xs font-mono uppercase tracking-widest text-subtle mb-3">
            Pricing
          </p>
          <h2 className="font-mono font-bold text-4xl tracking-tight mb-12">
            Simple, transparent pricing.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
            {PRICING.map((plan, i) => (
              <div
                key={i}
                className={`rounded-xl p-6 border ${
                  plan.highlighted
                    ? "bg-surface border-accent/30"
                    : "bg-background border-border-custom"
                }`}
              >
                <p
                  className={`text-xs font-mono uppercase tracking-widest mb-4 ${
                    plan.highlighted ? "text-accent" : "text-subtle"
                  }`}
                >
                  {plan.name}
                </p>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="font-mono font-extrabold text-5xl tracking-tight">
                    {plan.price}
                  </span>
                  <span className="text-sm text-muted">/{plan.period}</span>
                </div>
                <ul className="space-y-2.5 mb-6">
                  {plan.features.map((feat, j) => (
                    <li
                      key={j}
                      className="flex items-center gap-2 text-sm text-primary/80"
                    >
                      <CheckCircle2
                        size={13}
                        className={
                          plan.highlighted ? "text-accent" : "text-subtle"
                        }
                      />
                      {feat}
                    </li>
                  ))}
                </ul>
                <Link
                  href={plan.href}
                  className={`block text-center text-sm font-medium py-2.5 rounded-lg transition-opacity hover:opacity-90 ${
                    plan.highlighted
                      ? "bg-accent text-background"
                      : "border border-border-custom text-muted"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-border-custom py-10">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between flex-wrap gap-4">
          <span className="font-mono font-extrabold text-base tracking-tight">
            in<span className="text-accent">Fact</span>
          </span>
          <p className="text-xs text-subtle">Built with AI + Tavily</p>
        </div>
      </footer>
    </div>
  );
}
