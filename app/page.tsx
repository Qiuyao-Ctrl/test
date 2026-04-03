"use client";

import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import {
  ArrowRight,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  Clock,
  TrendingUp,
  Activity,
  Terminal,
  CreditCard,
  Globe,
  MessageSquare,
  GitFork,
  Mail,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { guides, caseStudies, updates, stats } from "@/lib/data";
import { formatDate } from "@/lib/utils";
import dynamic from "next/dynamic";

const Lanyard = dynamic(() => import("@/components/lanyard"), { ssr: false });

// ─── Animation variants ────────────────────────────────────────────────────

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0, 0, 0.2, 1] as [number, number, number, number] } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4 } },
};

function AnimatedSection({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={stagger}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Looping terminal typewriter for stats ────────────────────────────────

function TerminalTyper({ text, startDelay = 0 }: { text: string; startDelay?: number }) {
  const [displayed, setDisplayed] = useState("");
  const [typing, setTyping] = useState(true);

  useEffect(() => {
    let pos = 0;
    let t: ReturnType<typeof setTimeout>;

    function tick() {
      if (pos <= text.length) {
        setDisplayed(text.slice(0, pos));
        setTyping(pos < text.length);
        pos++;
        t = setTimeout(tick, 68);
      } else {
        // pause then restart
        t = setTimeout(() => {
          pos = 0;
          setDisplayed("");
          setTyping(true);
          t = setTimeout(tick, 80);
        }, 2800);
      }
    }

    t = setTimeout(tick, startDelay);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {displayed}
      {typing && <span className="cursor-blink">_</span>}
    </>
  );
}

// ─── Typewriter hook ───────────────────────────────────────────────────────

function useTypewriter(text: string, speed = 35, delay = 400) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    const timeout = setTimeout(() => {
      let i = 0;
      const interval = setInterval(() => {
        setDisplayed(text.slice(0, i + 1));
        i++;
        if (i >= text.length) {
          clearInterval(interval);
          setDone(true);
        }
      }, speed);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timeout);
  }, [text, speed, delay]);
  return { displayed, done };
}

// ─── Stats bar with slide-in + count-up ───────────────────────────────────

function StatsBar() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const cellVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, delay: i * 0.1, ease: [0, 0, 0.2, 1] as [number, number, number, number] },
    }),
  };

  return (
    <section className="bg-black border-y border-inv-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={ref}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 divide-x divide-inv-border"
        >
          <motion.div
            custom={0}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            variants={cellVariants}
            className="flex flex-col gap-1.5 px-6 py-5 first:pl-0"
          >
            <span className="font-mono text-[11px] text-inv-muted uppercase tracking-widest">
              API Status
            </span>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-white animate-pulse" />
              <span className="font-mono text-sm text-white">
                <TerminalTyper text="[OK] Operational" startDelay={0} />
              </span>
            </div>
          </motion.div>
          {stats.slice(0, 4).map((s, i) => (
            <motion.div
              key={s.label}
              custom={i + 1}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              variants={cellVariants}
              className="flex flex-col gap-1.5 px-6 py-5 last:pr-0"
            >
              <span className="font-mono text-[11px] text-inv-muted uppercase tracking-widest">
                {s.label}
              </span>
              <span className="font-mono text-lg font-semibold text-white">
                <TerminalTyper text={s.value + s.suffix} startDelay={(i + 1) * 420} />
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Particle field (animated canvas) ─────────────────────────────────────

function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    const ctx = canvas.getContext('2d')!;
    const W = canvas.width, H = canvas.height;
    const ACCENTS = ['#E9DDF9', '#F2E46D', '#E88C8C'];
    const particles = Array.from({ length: 55 }, (_, i) => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.5, vy: (Math.random() - 0.5) * 0.5,
      r: 1 + Math.random() * 1.6,
      color: i < 9 ? ACCENTS[i % 3] : '#ffffff',
      alpha: i < 9 ? 0.75 : 0.18 + Math.random() * 0.22,
    }));

    const REPEL_RADIUS = 110;
    const REPEL_STRENGTH = 0.55;
    const MOUSE_LINE_RADIUS = 130;
    const MAX_SPEED = 2.2;

    function onMouseMove(e: MouseEvent) {
      const rect = canvas!.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }
    function onMouseLeave() { mouseRef.current = null; }
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseleave', onMouseLeave);

    let raf: number;
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, W, H);

    function draw() {
      ctx.fillStyle = 'rgba(0,0,0,0.16)';
      ctx.fillRect(0, 0, W, H);

      const mouse = mouseRef.current;

      // Particle–particle connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 88) {
            const colored = particles[i].color !== '#ffffff' || particles[j].color !== '#ffffff';
            ctx.globalAlpha = (1 - d / 88) * (colored ? 0.32 : 0.09);
            ctx.strokeStyle = colored ? particles[i].color : '#ffffff';
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Mouse connection lines
      if (mouse) {
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < MOUSE_LINE_RADIUS) {
            const t = 1 - d / MOUSE_LINE_RADIUS;
            ctx.globalAlpha = t * (p.color !== '#ffffff' ? 0.55 : 0.22);
            ctx.strokeStyle = p.color !== '#ffffff' ? p.color : '#ffffff';
            ctx.lineWidth = t * 0.8;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
          }
        }
        // Cursor node
        ctx.globalAlpha = 0.9;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 0.15;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, REPEL_RADIUS, 0, Math.PI * 2);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 0.4;
        ctx.stroke();
      }

      // Draw & update particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Mouse repulsion
        if (mouse) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < REPEL_RADIUS && d > 0) {
            const force = (1 - d / REPEL_RADIUS) * REPEL_STRENGTH;
            p.vx += (dx / d) * force;
            p.vy += (dy / d) * force;
          }
        }

        // Speed cap
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (speed > MAX_SPEED) { p.vx = (p.vx / speed) * MAX_SPEED; p.vy = (p.vy / speed) * MAX_SPEED; }

        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();

        p.x += p.vx; p.y += p.vy;
        // Damping — drift back toward natural speed
        p.vx *= 0.985; p.vy *= 0.985;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    }
    draw();
    return () => {
      cancelAnimationFrame(raf);
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('mouseleave', onMouseLeave);
    };
  }, []);

  return <canvas ref={canvasRef} className="w-full block cursor-crosshair" style={{ height: '260px' }} />;
}

// ─── Hero Code Snippet ─────────────────────────────────────────────────────

const CODE_LINES = [
  { tokens: [{ t: "comment", v: "// Initialize the Waffo client" }] },
  {
    tokens: [
      { t: "keyword", v: "import" },
      { t: "text", v: " { Waffo } " },
      { t: "keyword", v: "from" },
      { t: "string", v: ' "@waffo/sdk"' },
    ],
  },
  { tokens: [] },
  {
    tokens: [
      { t: "keyword", v: "const" },
      { t: "text", v: " client = " },
      { t: "keyword", v: "new" },
      { t: "function", v: " Waffo" },
      { t: "text", v: "({ apiKey: process.env." },
      { t: "property", v: "WAFFO_SECRET_KEY" },
      { t: "text", v: " })" },
    ],
  },
  { tokens: [] },
  { tokens: [{ t: "comment", v: "// Create a payment" }] },
  {
    tokens: [
      { t: "keyword", v: "const" },
      { t: "text", v: " payment = " },
      { t: "keyword", v: "await" },
      { t: "text", v: " client.payments." },
      { t: "function", v: "create" },
      { t: "text", v: "({" },
    ],
  },
  {
    tokens: [
      { t: "text", v: "  " },
      { t: "property", v: "amount" },
      { t: "text", v: ":    " },
      { t: "number", v: "4999" },
      { t: "text", v: "," },
      { t: "comment", v: "   // $49.99" },
    ],
  },
  {
    tokens: [
      { t: "text", v: "  " },
      { t: "property", v: "currency" },
      { t: "text", v: ":  " },
      { t: "string", v: '"usd"' },
      { t: "text", v: "," },
    ],
  },
  {
    tokens: [
      { t: "text", v: "  " },
      { t: "property", v: "customer" },
      { t: "text", v: ":  " },
      { t: "string", v: '"cus_7x9kL"' },
      { t: "text", v: "," },
    ],
  },
  {
    tokens: [
      { t: "text", v: "  " },
      { t: "property", v: "capture" },
      { t: "text", v: ":   " },
      { t: "keyword", v: "true" },
      { t: "text", v: "," },
    ],
  },
  { tokens: [{ t: "text", v: "})" }] },
  { tokens: [] },
  {
    tokens: [
      { t: "comment", v: "// payment.status → " },
      { t: "string", v: '"succeeded"' },
    ],
  },
];

function CodeToken({ t, v }: { t: string; v: string }) {
  const classMap: Record<string, string> = {
    comment: "token-comment",
    keyword: "token-keyword",
    string: "token-string",
    number: "token-number",
    property: "token-property",
    function: "token-function",
    text: "token-variable",
  };
  return <span className={classMap[t] ?? "token-variable"}>{v}</span>;
}

function HeroCodeBlock() {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="relative"
    >
      <div className="relative bg-[#0d1117] border border-inv-border overflow-hidden">
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center gap-3 px-4 py-3 border-b border-inv-border hover:bg-white/[0.03] transition-colors cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 bg-white/60" />
            <span className="font-mono text-xs text-inv-muted">[payment.ts]</span>
          </span>
          <span className="ml-auto font-mono text-[10px] text-inv-muted uppercase tracking-widest flex items-center gap-2">
            {expanded ? "COLLAPSE" : "VIEW CODE"}
            <ChevronDown
              className={cn(
                "w-3 h-3 text-inv-muted transition-transform duration-300",
                expanded && "rotate-180"
              )}
            />
          </span>
        </button>

        <motion.div
          initial={false}
          animate={{
            height: expanded ? "auto" : 0,
            opacity: expanded ? 1 : 0,
          }}
          transition={{ duration: 0.35, ease: [0.04, 0.62, 0.23, 0.98] }}
          className="overflow-hidden"
        >
          <pre className="px-5 py-4 font-mono text-[13px] leading-6 overflow-x-auto">
            {CODE_LINES.map((line, i) => (
              <div key={i} className="flex">
                <span className="select-none w-8 text-right pr-4 text-white/20 shrink-0">
                  {i + 1}
                </span>
                <code>
                  {line.tokens.length === 0 ? (
                    <span>&nbsp;</span>
                  ) : (
                    line.tokens.map((token, j) => (
                      <CodeToken key={j} t={token.t} v={token.v} />
                    ))
                  )}
                </code>
              </div>
            ))}
          </pre>
        </motion.div>

        <div className="px-5 py-3 border-t border-inv-border flex items-center gap-2">
          <span className={cn("w-2 h-2", expanded ? "bg-white animate-pulse" : "bg-inv-muted")} />
          <span className="font-mono text-xs text-white/80">
            {expanded
              ? '[OK] payment.status: "succeeded"'
              : "WAFFO SDK · Click to inspect"}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Category badge ────────────────────────────────────────────────────────

function CategoryBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center font-mono text-[11px] px-2 py-0.5 border border-border-light bg-muted text-muted-foreground">
      {label}
    </span>
  );
}

function UpdateTypeBadge({ type }: { type: string }) {
  const map: Record<string, string> = {
    feature: "bg-black text-white border-black",
    improvement: "bg-muted text-foreground border-border-light",
    fix: "bg-muted text-muted-foreground border-border-light",
    deprecation: "border border-black text-black bg-transparent",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center font-mono text-[11px] px-2 py-0.5 border capitalize",
        map[type] ?? "bg-muted text-muted-foreground border-border-light"
      )}
    >
      {type}
    </span>
  );
}

// ─── Guide card ────────────────────────────────────────────────────────────

function GuideCard({ guide }: { guide: (typeof guides)[0] }) {
  return (
    <motion.div variants={fadeInUp}>
      <Link
        href={`/guides/${guide.slug}`}
        className="group flex flex-col h-full bg-card border border-border-light p-5 hover:border-black transition-all duration-100"
      >
        <div className="flex items-center justify-between mb-3">
          <CategoryBadge label={guide.category} />
          <span className="flex items-center gap-1 font-mono text-[11px] text-muted-foreground">
            <Clock className="w-3 h-3" />
            {guide.readingTime} min
          </span>
        </div>
        <h3 className="font-semibold text-foreground leading-snug mb-2 group-hover:text-black transition-colors line-clamp-2">
          {guide.title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed flex-1 line-clamp-3">
          {guide.description}
        </p>
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border-light">
          <span className="font-mono text-[11px] text-muted-foreground">
            {formatDate(guide.publishedAt)}
          </span>
          <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-black group-hover:translate-x-0.5 transition-all" />
        </div>
      </Link>
    </motion.div>
  );
}

// ─── Case study metric ─────────────────────────────────────────────────────

function Metric({
  label,
  value,
  direction,
}: {
  label: string;
  value: string;
  direction?: "up" | "down";
}) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-baseline gap-1.5">
        <span className="font-mono text-2xl font-semibold text-white">{value}</span>
        {direction && (
          <TrendingUp
            className={cn(
              "w-4 h-4 text-white",
              direction === "down" && "rotate-180"
            )}
          />
        )}
      </div>
      <span className="font-mono text-xs text-inv-muted">{label}</span>
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────

const HERO_TEXT = "Payments API built\nfor developers who\nship fast.";

export default function HomePage() {
  const featuredGuides = guides.filter((g) => g.featured).slice(0, 3);
  const featuredCase = caseStudies.find((c) => c.featured);
  const latestUpdates = updates.slice(0, 3);

  const { displayed, done } = useTypewriter(HERO_TEXT);

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative bg-white pt-16 pb-12 lg:pt-20 lg:pb-16 border-b border-black">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left */}
            <div className="relative z-10">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={stagger}
                className="flex flex-col gap-5"
              >
                {/* Terminal meta row */}
                <motion.div variants={fadeInUp}>
                  <p className="font-mono text-[11px] text-muted-foreground tracking-widest">
                    {"// ── WAFFO PAYMENTS API ─── BUILD: v2.5.0 ── STATUS: [LIVE] ──"}
                  </p>
                </motion.div>

                {/* Typewriter headline */}
                <motion.h1
                  variants={fadeIn}
                  className="text-5xl sm:text-6xl lg:text-7xl font-mono font-bold tracking-tight leading-none text-black whitespace-pre"
                >
                  {displayed}
                  <span className={cn("cursor-blink", done ? "inline" : "hidden")}>_</span>
                  {!done && <span className="cursor-blink">_</span>}
                </motion.h1>

                <motion.p
                  variants={fadeInUp}
                  className="text-sm text-muted-foreground leading-relaxed max-w-lg font-mono"
                >
                  Integrate, test, and scale your payment flows with
                  production-grade tooling. 190+ currencies, smart routing, and
                  ML-backed fraud prevention — built in.
                </motion.p>

<motion.div variants={fadeInUp} className="flex flex-wrap gap-2 pt-1">
                  {[
                    { label: "190+ currencies", bg: "bg-accent-lavender" },
                    { label: "99.99% uptime",   bg: "bg-accent-signal"   },
                    { label: "< 80ms latency",  bg: "bg-accent-blush"    },
                  ].map(({ label, bg }) => (
                    <span key={label} className={`inline-flex items-center font-mono text-[11px] tracking-wider px-2.5 py-1 ${bg} text-black border border-black/10`}>
                      {label}
                    </span>
                  ))}
                </motion.div>
              </motion.div>
            </div>

            {/* Right: voxel scene + code block */}
            <div className="flex flex-col gap-4 min-w-0">
              {/* Lanyard */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.9, delay: 0.2 }}
                className="relative overflow-hidden"
                style={{ height: '420px' }}
              >
                <Lanyard transparent={true} />
              </motion.div>

              {/* Collapsible code panel */}
              <HeroCodeBlock />
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats bar ────────────────────────────────────────── */}
      <StatsBar />

      {/* ── Latest Guides ─────────────────────────────────────── */}
      <section className="bg-muted/20 py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <motion.div variants={fadeInUp} className="flex items-end justify-between mb-8">
              <div>
                <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-2">
                  {"// LATEST FROM WAFFO"}
                </p>
                <h2 className="text-2xl font-mono font-bold tracking-tight text-foreground uppercase">
                  GUIDES & TUTORIALS
                </h2>
              </div>
              <Link
                href="/guides"
                className="hidden sm:flex items-center gap-1 font-mono text-xs text-black border border-black px-3 py-1.5 hover:bg-black hover:text-white transition-colors duration-75"
              >
                [ ALL GUIDES → ]
              </Link>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {featuredGuides.map((guide) => (
                <GuideCard key={guide.slug} guide={guide} />
              ))}
            </div>

            <motion.div variants={fadeInUp} className="mt-6 sm:hidden">
              <Link
                href="/guides"
                className="flex items-center gap-1 font-mono text-xs text-black border border-black px-3 py-1.5 hover:bg-black hover:text-white transition-colors duration-75 w-fit"
              >
                [ ALL GUIDES → ]
              </Link>
            </motion.div>
          </AnimatedSection>
        </div>
      </section>

      {/* ── Signal canvas ─────────────────────────────────────── */}
      <section className="bg-black border-y border-inv-border overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="font-mono text-[11px] text-inv-muted tracking-widest uppercase mb-1">
                {"// PAYMENT ROUTING ENGINE"}
              </p>
              <h2 className="font-mono text-3xl sm:text-4xl font-bold text-white tracking-tight uppercase leading-none flex flex-wrap items-center gap-3">
                SIGNAL PROCESSING
                <span className="font-mono text-xs px-2.5 py-1 bg-accent-signal text-black">
                  ACTIVE
                </span>
              </h2>
            </div>
            <div className="text-right hidden sm:block">
              <p className="font-mono text-[10px] text-inv-muted tracking-widest mb-0.5">NETWORK_NODES</p>
              <p className="font-mono text-2xl font-bold text-white">47 REGIONS</p>
              <p className="font-mono text-[10px] text-inv-muted mt-0.5">THROUGHPUT: 2.4B+ TX/YR</p>
            </div>
          </div>
        </div>
        <ParticleField />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 border-t border-inv-border flex items-center justify-between">
          <span className="font-mono text-[10px] text-inv-muted tracking-widest">
            AVG_LATENCY: 68ms · AUTH_RATE: 97.2% · UPTIME: 99.99%
          </span>
          <span className="font-mono text-[10px] text-inv-muted">ENGINE v2.5.0</span>
        </div>
      </section>

      {/* ── Featured Case Study ───────────────────────────────── */}
      {featuredCase && (
        <section className="bg-black py-16 lg:py-20 border-y border-inv-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection>
              <motion.div variants={fadeInUp} className="mb-10">
                <p className="font-mono text-xs text-inv-muted uppercase tracking-widest mb-2">
                  {"// CASE STUDY"}
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-inv-card border border-inv-border flex items-center justify-center">
                    <span className="font-mono text-xs font-bold text-white">
                      {featuredCase.logo}
                    </span>
                  </div>
                  <div>
                    <span className="font-mono text-xs text-inv-muted">
                      {featuredCase.company}
                    </span>
                    <p className="font-mono text-[11px] text-inv-muted/60">
                      {featuredCase.industry}
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.h2
                variants={fadeInUp}
                className="text-2xl sm:text-3xl font-mono font-bold text-white max-w-2xl leading-snug mb-8"
              >
                {featuredCase.title}
              </motion.h2>

              {/* Metrics */}
              <motion.div
                variants={stagger}
                className="grid grid-cols-2 sm:grid-cols-4 gap-6 p-6 bg-inv-card border border-inv-border mb-8"
              >
                {featuredCase.metrics.map((m) => (
                  <motion.div key={m.label} variants={fadeInUp}>
                    <Metric label={m.label} value={m.value} direction={m.direction} />
                  </motion.div>
                ))}
              </motion.div>

              {/* Quote */}
              <motion.blockquote
                variants={fadeInUp}
                className="border-l-2 border-white pl-6 mb-8"
              >
                <p className="text-white text-lg leading-relaxed italic font-mono">
                  &ldquo;{featuredCase.quote}&rdquo;
                </p>
                <footer className="mt-3">
                  <span className="font-semibold text-sm text-white font-mono">
                    {featuredCase.quoteAuthor}
                  </span>
                  <span className="font-mono text-xs text-inv-muted ml-2">
                    — {featuredCase.quoteRole}
                  </span>
                </footer>
              </motion.blockquote>

              <motion.div variants={fadeInUp}>
                <Link
                  href={`/case-studies/${featuredCase.slug}`}
                  className="inline-flex items-center gap-2 font-mono text-sm text-white border border-white px-4 py-2 hover:bg-white hover:text-black transition-colors duration-75"
                >
                  Read full case study
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            </AnimatedSection>
          </div>
        </section>
      )}

      {/* ── API Quick Reference ───────────────────────────────── */}
      <section className="bg-white py-16 lg:py-20 border-b border-border-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              <motion.div variants={fadeInUp}>
                <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-2">
                  {"// API REFERENCE"}
                </p>
                <h2 className="text-2xl font-mono font-bold tracking-tight text-foreground mb-4 uppercase">
                  Clean API surface. Zero boilerplate.
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-6 text-sm font-mono">
                  The Waffo API is designed around RESTful conventions with predictable
                  resource-oriented URLs. SDKs available for Node.js, Python, Go, Ruby, Java,
                  and PHP.
                </p>
                <div className="space-y-3">
                  {[
                    { method: "POST", path: "/v2/payments", desc: "Create a payment" },
                    { method: "GET", path: "/v2/payments/:id", desc: "Retrieve a payment" },
                    { method: "POST", path: "/v2/payments/:id/capture", desc: "Capture an auth" },
                    { method: "POST", path: "/v2/refunds", desc: "Issue a refund" },
                    { method: "GET", path: "/v2/analytics/auth-rates", desc: "Auth rate metrics" },
                  ].map((ep) => (
                    <div
                      key={ep.path}
                      className="flex items-center gap-3 p-3 bg-muted border border-border-light hover:border-black transition-colors duration-75 cursor-pointer group"
                    >
                      <span
                        className={cn(
                          "font-mono text-[10px] font-semibold px-1.5 py-0.5 min-w-[40px] text-center border",
                          ep.method === "POST"
                            ? "bg-black text-white border-black"
                            : ep.method === "GET"
                            ? "border-black text-black bg-transparent"
                            : "bg-muted text-muted-foreground border-border-light"
                        )}
                      >
                        {ep.method}
                      </span>
                      <span className="font-mono text-xs text-foreground flex-1">{ep.path}</span>
                      <span className="text-xs text-muted-foreground hidden sm:block font-mono">
                        {ep.desc}
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-black transition-colors" />
                    </div>
                  ))}
                </div>
                <div className="mt-5">
                  <a
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 font-mono text-sm text-black border border-black px-3 py-1.5 hover:bg-black hover:text-white transition-colors duration-75"
                  >
                    [ API REFERENCE ↗ ]
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </motion.div>

              {/* Response example */}
              <motion.div variants={fadeInUp}>
                <div className="bg-[#0d1117] border border-inv-border overflow-hidden">
                  <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06]">
                    <span className="font-mono text-xs text-white/40">Response</span>
                    <span className="ml-auto font-mono text-xs text-white bg-inv-card border border-inv-border px-2 py-0.5">
                      200 OK
                    </span>
                  </div>
                  <pre className="px-5 py-4 font-mono text-[12.5px] leading-6 text-slate-300 overflow-x-auto">
{`{
  `}<span className="token-property">"id"</span>{`:         `}<span className="token-string">"pay_8xKLm9nqR"</span>{`,
  `}<span className="token-property">"status"</span>{`:     `}<span className="token-string">"succeeded"</span>{`,
  `}<span className="token-property">"amount"</span>{`:     `}<span className="token-number">4999</span>{`,
  `}<span className="token-property">"currency"</span>{`:   `}<span className="token-string">"usd"</span>{`,
  `}<span className="token-property">"customer"</span>{`:   `}<span className="token-string">"cus_7x9kL"</span>{`,
  `}<span className="token-property">"authRate"</span>{`:   `}<span className="token-number">0.97</span>{`,
  `}<span className="token-property">"processor"</span>{`:  `}<span className="token-string">"stripe"</span>{`,
  `}<span className="token-property">"route"</span>{`:      `}<span className="token-string">"optimized"</span>{`,
  `}<span className="token-property">"createdAt"</span>{`:  `}<span className="token-string">"2026-03-25T14:32:01Z"</span>{`,
  `}<span className="token-property">"metadata"</span>{`: {
    `}<span className="token-property">"orderId"</span>{`:  `}<span className="token-string">"ord_1234"</span>
{`  }
}`}
                  </pre>
                </div>
              </motion.div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ── Demos ─────────────────────────────────────────────── */}
      <section className="bg-muted/20 py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <motion.div variants={fadeInUp} className="flex items-end justify-between mb-8">
              <div>
                <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-2">
                  {"// INTERACTIVE"}
                </p>
                <h2 className="text-2xl font-mono font-bold tracking-tight text-foreground uppercase">
                  Try it yourself
                </h2>
              </div>
              <Link
                href="/demos"
                className="hidden sm:flex items-center gap-1 font-mono text-xs text-black border border-black px-3 py-1.5 hover:bg-black hover:text-white transition-colors duration-75"
              >
                [ ALL DEMOS → ]
              </Link>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  icon: CreditCard,
                  title: "Checkout Flow",
                  desc: "Full payment checkout with 3DS2 and sandbox scenarios.",
                  badge: "Interactive",
                  badgeClass: "bg-accent-lavender text-black border-black/10",
                  href: "/demos",
                },
                {
                  icon: Activity,
                  title: "Webhook Inspector",
                  desc: "Send test events and inspect payloads in real-time.",
                  badge: "Live",
                  badgeClass: "bg-accent-signal text-black border-black/10",
                  href: "/demos",
                },
                {
                  icon: Terminal,
                  title: "API Playground",
                  desc: "Make live API calls against the sandbox from your browser.",
                  badge: "Interactive",
                  badgeClass: "bg-black text-white border-black",
                  href: "/demos",
                },
                {
                  icon: Globe,
                  title: "Routing Simulator",
                  desc: "Visualize routing decisions across our acquiring network.",
                  badge: "New",
                  badgeClass: "bg-accent-alert text-black border-black/10",
                  href: "/demos",
                },
              ].map((demo) => (
                <motion.div key={demo.title} variants={fadeInUp}>
                  <Link
                    href={demo.href}
                    className="group flex flex-col h-full bg-card border border-border-light p-5 hover:border-black transition-all duration-100"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-9 h-9 bg-muted border border-border-light flex items-center justify-center group-hover:bg-black group-hover:border-black transition-colors duration-75">
                        <demo.icon className="w-4 h-4 text-muted-foreground group-hover:text-white transition-colors" />
                      </div>
                      <span
                        className={cn(
                          "font-mono text-[11px] px-2 py-0.5 border",
                          demo.badgeClass
                        )}
                      >
                        {demo.badge}
                      </span>
                    </div>
                    <h3 className="font-mono font-semibold text-sm text-foreground mb-1.5 group-hover:text-black transition-colors">
                      {demo.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed flex-1 font-mono">
                      {demo.desc}
                    </p>
                    <div className="mt-4 flex items-center gap-1 text-xs font-mono font-medium text-muted-foreground group-hover:text-black transition-colors">
                      Open demo
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ── Latest Updates ────────────────────────────────────── */}
      <section className="bg-white py-16 lg:py-20 border-b border-border-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <motion.div variants={fadeInUp} className="flex items-end justify-between mb-8">
              <div>
                <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-2">
                  {"// CHANGELOG"}
                </p>
                <h2 className="text-2xl font-mono font-bold tracking-tight text-foreground uppercase">
                  Latest Updates
                </h2>
              </div>
              <Link
                href="/updates"
                className="hidden sm:flex items-center gap-1 font-mono text-xs text-black border border-black px-3 py-1.5 hover:bg-black hover:text-white transition-colors duration-75"
              >
                [ FULL CHANGELOG → ]
              </Link>
            </motion.div>

            <div className="space-y-0 divide-y divide-border-light">
              {latestUpdates.map((update) => (
                <motion.div key={update.version} variants={fadeInUp}>
                  <Link
                    href="/updates"
                    className="group flex items-start gap-4 py-5 hover:bg-muted -mx-4 px-4 transition-colors duration-75"
                  >
                    <div className="flex-shrink-0 pt-0.5">
                      <span className="font-mono text-xs font-semibold text-white bg-black border border-black px-2 py-0.5">
                        {update.version}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="font-mono font-semibold text-sm text-foreground group-hover:text-black transition-colors">
                          {update.title}
                        </span>
                        <UpdateTypeBadge type={update.type} />
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-1 font-mono">
                        {update.description}
                      </p>
                    </div>
                    <div className="flex-shrink-0 flex items-center gap-3">
                      <span className="font-mono text-xs text-muted-foreground hidden sm:block">
                        {formatDate(update.date)}
                      </span>
                      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-black transition-colors" />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ── Community ─────────────────────────────────────────── */}
      <section className="bg-muted/20 py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <motion.div variants={fadeInUp} className="text-center mb-10">
              <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-2">
                {"// COMMUNITY"}
              </p>
              <h2 className="text-2xl font-mono font-bold tracking-tight text-foreground mb-3 uppercase">
                Join 12,000+ developers
              </h2>
              <p className="text-muted-foreground max-w-md mx-auto text-sm font-mono">
                Get help, share integrations, and stay up to date with the Waffo developer community.
              </p>
            </motion.div>

            <motion.div
              variants={stagger}
              className="grid sm:grid-cols-3 gap-4 max-w-3xl mx-auto"
            >
              {[
                {
                  icon: MessageSquare,
                  title: "Developer Discord",
                  desc: "12,400+ developers. Get answers fast.",
                  meta: "Join community →",
                },
                {
                  icon: GitFork,
                  title: "GitHub",
                  desc: "SDKs, tools, and sample code.",
                  meta: "847 stars",
                },
                {
                  icon: Mail,
                  title: "Newsletter",
                  desc: "Monthly digest of updates and guides.",
                  meta: "8,200 subscribers",
                },
              ].map((item) => (
                <motion.div key={item.title} variants={fadeInUp}>
                  <a
                    href="#"
                    className="group flex flex-col items-center text-center p-6 bg-card border border-border-light hover:border-black transition-all duration-100"
                  >
                    <item.icon className="w-7 h-7 mb-3 text-muted-foreground group-hover:text-black transition-colors" />
                    <h3 className="font-mono font-semibold text-sm text-foreground mb-1">
                      {item.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mb-3 font-mono">{item.desc}</p>
                    <span className="font-mono text-xs text-black group-hover:underline">
                      {item.meta}
                    </span>
                  </a>
                </motion.div>
              ))}
            </motion.div>
          </AnimatedSection>
        </div>
      </section>

      {/* ── CTA Banner ────────────────────────────────────────── */}
      <section className="bg-black py-14 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <motion.p variants={fadeInUp} className="font-mono text-xs text-inv-muted uppercase tracking-widest mb-4">
              {"// READY TO BUILD"}
            </motion.p>
            <motion.h2
              variants={fadeInUp}
              className="text-2xl sm:text-3xl font-mono font-bold text-white mb-4 uppercase"
            >
              Ready to start building?
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-inv-muted mb-8 max-w-md mx-auto font-mono text-sm">
              Read the docs, explore the guides, or jump straight into the sandbox.
            </motion.p>
            <motion.div
              variants={fadeInUp}
              className="flex flex-wrap items-center justify-center gap-3"
            >
              <Link
                href="/guides/getting-started-payment-api"
                className="inline-flex items-center gap-2 bg-white text-black font-mono text-sm px-5 py-2.5 border border-white hover:bg-inv-muted hover:border-inv-muted transition-colors duration-75"
              >
                Read Quickstart Guide
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-transparent text-white font-mono text-sm px-5 py-2.5 border border-inv-border hover:border-white transition-colors duration-75"
              >
                View API Docs
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </motion.div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
