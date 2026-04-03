"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  CreditCard,
  Activity,
  Terminal,
  Network,
  Play,
  Lock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  RotateCcw,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const fadeInUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0, 0, 0.2, 1] as [number, number, number, number] } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

// ─── Checkout Demo ─────────────────────────────────────────────────────────

const TEST_CARDS = [
  { number: "4242 4242 4242 4242", label: "Success", color: "success" },
  { number: "4000 0000 0000 9995", label: "Insufficient funds", color: "danger" },
  { number: "4000 0025 0000 3155", label: "3DS2 required", color: "warning" },
];

function CheckoutDemo() {
  const [card, setCard] = useState("4242 4242 4242 4242");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error" | "3ds">("idle");

  function simulate() {
    setStatus("loading");
    setTimeout(() => {
      if (card === "4242 4242 4242 4242") setStatus("success");
      else if (card === "4000 0025 0000 3155") setStatus("3ds");
      else setStatus("error");
    }, 1400);
  }

  return (
    <div className="grid lg:grid-cols-2 gap-8 items-start">
      {/* Form */}
      <div className="bg-card border border-black p-6">
        <div className="flex items-center gap-2 mb-6">
          <Lock className="w-4 h-4 text-black" />
          <span className="font-mono font-semibold text-sm text-foreground">Secure Checkout</span>
          <span className="ml-auto font-mono text-xs text-muted-foreground">Powered by Waffo</span>
        </div>

        <div className="mb-5">
          <p className="font-mono text-xs text-muted-foreground mb-2 uppercase tracking-widest">SELECT TEST CARD</p>
          <div className="space-y-2">
            {TEST_CARDS.map((tc) => (
              <button
                key={tc.number}
                onClick={() => { setCard(tc.number); setStatus("idle"); }}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2.5 border text-left transition-colors duration-75",
                  card === tc.number
                    ? "border-black bg-muted"
                    : "border-border-light bg-muted/30 hover:border-black"
                )}
              >
                <span className="font-mono text-xs text-foreground">{tc.number}</span>
                <span className="font-mono text-[10px] px-1.5 py-0.5 border border-border-light bg-muted text-muted-foreground">
                  {tc.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3 mb-5">
          <div>
            <label className="font-mono text-xs text-muted-foreground mb-1 block uppercase tracking-widest">
              CARD NUMBER
            </label>
            <div className="flex items-center gap-2 px-3 py-2.5 bg-muted border border-border-light">
              <CreditCard className="w-4 h-4 text-muted-foreground shrink-0" />
              <span className="font-mono text-sm text-foreground">{card}</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-mono text-xs text-muted-foreground mb-1 block uppercase tracking-widest">EXPIRY</label>
              <div className="px-3 py-2.5 bg-muted border border-border-light font-mono text-sm text-foreground">
                12 / 28
              </div>
            </div>
            <div>
              <label className="font-mono text-xs text-muted-foreground mb-1 block uppercase tracking-widest">CVC</label>
              <div className="px-3 py-2.5 bg-muted border border-border-light font-mono text-sm text-foreground">
                &bull;&bull;&bull;
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={simulate}
          disabled={status === "loading"}
          className="w-full flex items-center justify-center gap-2 bg-black hover:bg-muted-foreground disabled:opacity-60 text-white font-mono font-medium text-sm py-3 border border-black transition-colors duration-75"
        >
          {status === "loading" ? (
            <>
              <div
                className="w-4 h-4 border-2 border-white/30 border-t-white animate-spin"
                style={{ borderRadius: "50%" }}
              />
              Processing...
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              Pay $49.99
            </>
          )}
        </button>

        {status !== "idle" && status !== "loading" && (
          <button
            onClick={() => setStatus("idle")}
            className="mt-2 w-full flex items-center justify-center gap-1.5 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors py-1.5"
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </button>
        )}
      </div>

      {/* Response panel */}
      <div className="space-y-4">
        {status === "idle" && (
          <div className="bg-muted border border-border-light p-6 text-center">
            <Play className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground font-mono">
              Select a test card and click Pay to see the response.
            </p>
          </div>
        )}

        {status === "loading" && (
          <div className="bg-[#0d1117] border border-inv-border overflow-hidden">
            <div className="px-4 py-3 border-b border-white/[0.06] flex items-center gap-2">
              <span className="font-mono text-xs text-white/40">POST /v2/payments</span>
              <div
                className="ml-auto w-3 h-3 border-2 border-white/30 border-t-white animate-spin"
                style={{ borderRadius: "50%" }}
              />
            </div>
            <div className="px-5 py-4">
              <p className="font-mono text-xs text-white/40 animate-pulse">
                Routing to optimal processor...
              </p>
            </div>
          </div>
        )}

        {status === "success" && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 p-3 border border-black bg-muted">
              <CheckCircle2 className="w-4 h-4 text-black" />
              <span className="text-sm font-mono font-medium text-black">[OK] Payment succeeded</span>
            </div>
            <div className="bg-[#0d1117] border border-inv-border overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06]">
                <span className="font-mono text-xs text-white/40">Response</span>
                <span className="ml-auto font-mono text-xs text-white bg-inv-card border border-inv-border px-2 py-0.5">
                  200 OK
                </span>
              </div>
              <pre className="px-5 py-4 font-mono text-[12px] leading-6 text-slate-300 overflow-x-auto">
{`{
  "id":       "pay_demo_8xKL",
  "status":   "succeeded",
  "amount":   4999,
  "currency": "usd",
  "route":    "optimized",
  "authRate": 0.97,
  "createdAt": "${new Date().toISOString()}"
}`}
              </pre>
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 p-3 border border-black bg-muted">
              <XCircle className="w-4 h-4 text-black" />
              <span className="text-sm font-mono font-medium text-black">[ERR] Payment declined</span>
            </div>
            <div className="bg-[#0d1117] border border-inv-border overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06]">
                <span className="font-mono text-xs text-white/40">Response</span>
                <span className="ml-auto font-mono text-xs text-white bg-inv-card border border-inv-border px-2 py-0.5">
                  402
                </span>
              </div>
              <pre className="px-5 py-4 font-mono text-[12px] leading-6 text-slate-300 overflow-x-auto">
{`{
  "error": {
    "code":    "card_declined",
    "decline": "insufficient_funds",
    "message": "The card has insufficient funds."
  }
}`}
              </pre>
            </div>
          </div>
        )}

        {status === "3ds" && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 p-3 border border-black bg-muted">
              <AlertCircle className="w-4 h-4 text-black" />
              <span className="text-sm font-mono font-medium text-black">[ACTION] 3DS2 authentication required</span>
            </div>
            <div className="bg-[#0d1117] border border-inv-border overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06]">
                <span className="font-mono text-xs text-white/40">Response</span>
                <span className="ml-auto font-mono text-xs text-white bg-inv-card border border-inv-border px-2 py-0.5">
                  202
                </span>
              </div>
              <pre className="px-5 py-4 font-mono text-[12px] leading-6 text-slate-300 overflow-x-auto">
{`{
  "id":     "pay_demo_3ds",
  "status": "requires_action",
  "nextAction": {
    "type":        "redirect_to_url",
    "redirectUrl": "https://3ds.bank.example/..."
  }
}`}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Webhook Inspector Demo ───────────────────────────────────────────────

const WEBHOOK_EVENTS = [
  { event: "payment.succeeded", time: "just now", color: "success" },
  { event: "payment.created", time: "2s ago", color: "info" },
  { event: "customer.created", time: "14s ago", color: "muted" },
  { event: "dispute.created", time: "3m ago", color: "warning" },
];

function WebhookDemo() {
  const [selected, setSelected] = useState(0);
  const [fired, setFired] = useState(false);

  return (
    <div className="grid lg:grid-cols-2 gap-6 items-start">
      {/* Event list */}
      <div className="bg-card border border-black overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border-light bg-muted/30">
          <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest">WEBHOOK EVENTS</span>
          <button
            onClick={() => setFired(!fired)}
            className="flex items-center gap-1.5 text-xs font-mono font-medium text-black hover:text-muted-foreground transition-colors"
          >
            <Play className="w-3 h-3" />
            Send test event
          </button>
        </div>
        <div className="divide-y divide-border-light">
          {WEBHOOK_EVENTS.map((ev, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-muted transition-colors duration-75",
                selected === i && "bg-muted border-r-2 border-black"
              )}
            >
              <span className="w-2 h-2 bg-black shrink-0" />
              <span className="font-mono text-xs text-foreground flex-1">{ev.event}</span>
              <span className="font-mono text-[11px] text-muted-foreground">{ev.time}</span>
              <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
          ))}
        </div>
      </div>

      {/* Payload */}
      <div className="bg-[#0d1117] border border-inv-border overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06]">
          <span className="font-mono text-xs text-white/40">{WEBHOOK_EVENTS[selected].event}</span>
          <span className="ml-auto font-mono text-xs text-inv-muted border border-inv-border px-2 py-0.5">
            POST /webhook
          </span>
        </div>
        <pre className="px-5 py-4 font-mono text-[12px] leading-6 text-slate-300 overflow-x-auto">
{`{
  "id":      "evt_demo_xyz",
  "type":    "${WEBHOOK_EVENTS[selected].event}",
  "created": ${Math.floor(Date.now() / 1000)},
  "data": {
    "object": {
      "id":       "pay_8xKLm9",
      "status":   "succeeded",
      "amount":   4999,
      "currency": "usd"
    }
  },
  "livemode": false
}`}
        </pre>
        <div className="px-4 py-2.5 border-t border-white/[0.06] flex items-center gap-3">
          <span className="font-mono text-[10px] text-white/30">Signature verified</span>
          <CheckCircle2 className="w-3.5 h-3.5 text-white" />
          <span className="ml-auto font-mono text-[10px] text-white/30">
            Delivered in 73ms
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Demo sections config ────────────────────────────────────────────────

const DEMO_SECTIONS = [
  {
    id: "checkout",
    icon: CreditCard,
    title: "Checkout Flow",
    description:
      "Try a complete payment checkout. Select test cards to simulate different outcomes including success, decline, and 3DS2 authentication.",
    badge: "Interactive",
    badgeClass: "bg-black text-white border-black",
    component: CheckoutDemo,
  },
  {
    id: "webhooks",
    icon: Activity,
    title: "Webhook Inspector",
    description:
      "Explore webhook event payloads. Click any event to see the full payload, headers, and delivery metadata.",
    badge: "Live",
    badgeClass: "border-black text-black bg-transparent",
    component: WebhookDemo,
  },
];

export default function DemosPage() {
  const [activeDemo, setActiveDemo] = useState("checkout");

  return (
    <div className="pt-14">
      {/* Header */}
      <div className="bg-black border-b border-inv-border py-14 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="font-mono text-xs text-inv-muted uppercase tracking-widest mb-3">
            {"// INTERACTIVE DEMOS"}
          </p>
          <h1 className="text-3xl sm:text-4xl font-mono font-bold text-white mb-4 uppercase">
            Try it yourself
          </h1>
          <p className="text-inv-muted max-w-xl leading-relaxed font-mono text-sm">
            Hands-on demos of Waffo&apos;s core features. All demos run against the sandbox — no
            real charges, real behavior.
          </p>
        </div>
      </div>

      {/* Demo tabs */}
      <div className="border-b border-black bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-0 pt-4 overflow-x-auto">
            {DEMO_SECTIONS.map((demo) => (
              <button
                key={demo.id}
                onClick={() => setActiveDemo(demo.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 font-mono text-sm font-medium border-b-2 transition-colors duration-75 whitespace-nowrap",
                  activeDemo === demo.id
                    ? "border-black text-black"
                    : "border-transparent text-muted-foreground hover:text-black"
                )}
              >
                <demo.icon className="w-4 h-4" />
                {demo.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Active demo */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          key={activeDemo}
        >
          {DEMO_SECTIONS.filter((d) => d.id === activeDemo).map((demo) => (
            <div key={demo.id}>
              <motion.div variants={fadeInUp} className="flex items-start justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-muted border border-black flex items-center justify-center">
                    <demo.icon className="w-5 h-5 text-black" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="font-mono font-bold text-lg text-foreground">{demo.title}</h2>
                      <span className={cn("font-mono text-[11px] px-2 py-0.5 border", demo.badgeClass)}>
                        {demo.badge}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5 max-w-xl font-mono">
                      {demo.description}
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <demo.component />
              </motion.div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Other demos (coming soon) */}
      <div className="border-t border-border-light bg-muted/40 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-5">
            {"// COMING SOON"}
          </h3>
          <div className="grid sm:grid-cols-2 gap-4 max-w-2xl">
            {[
              {
                icon: Terminal,
                title: "API Playground",
                desc: "Live API calls from your browser with autofill and response diffing.",
              },
              {
                icon: Network,
                title: "Routing Simulator",
                desc: "Visualize routing decisions across the acquiring network.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="flex items-start gap-3 p-4 bg-card border border-border-light opacity-60"
              >
                <div className="w-8 h-8 bg-muted border border-border-light flex items-center justify-center shrink-0">
                  <item.icon className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-mono font-semibold text-sm text-foreground">{item.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 font-mono">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
