export type Guide = {
  slug: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  readingTime: number;
  publishedAt: string;
  featured: boolean;
  author: { name: string; role: string };
  content: string;
};

export type CaseStudy = {
  slug: string;
  title: string;
  company: string;
  industry: string;
  excerpt: string;
  metrics: { label: string; value: string; direction?: "up" | "down" }[];
  tags: string[];
  publishedAt: string;
  featured: boolean;
  logo: string;
  quote: string;
  quoteAuthor: string;
  quoteRole: string;
};

export type Demo = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  badge: string;
  badgeColor: string;
  icon: string;
  href: string;
};

export type Update = {
  version: string;
  date: string;
  title: string;
  type: "feature" | "improvement" | "fix" | "deprecation";
  description: string;
  changes: { type: "added" | "changed" | "fixed" | "deprecated"; text: string }[];
};

export type CommunityResource = {
  id: string;
  title: string;
  description: string;
  icon: string;
  href: string;
  meta: string;
  category: string;
};

// ─── GUIDES ──────────────────────────────────────────────────────────────────

export const guides: Guide[] = [
  {
    slug: "getting-started-payment-api",
    title: "Integrating the Waffo Payment API in 10 Minutes",
    description:
      "Set up your first payment flow end-to-end — authentication, creating payment intents, handling responses, and testing against our sandbox.",
    category: "Quickstart",
    tags: ["API", "Quickstart", "Node.js"],
    readingTime: 8,
    publishedAt: "2026-03-20",
    featured: true,
    author: { name: "Alex Chen", role: "Developer Advocate" },
    content: `
## Prerequisites

You'll need a Waffo account and your API keys from the dashboard. Install the SDK:

\`\`\`bash
npm install @waffo/sdk
\`\`\`

## Initialize the Client

\`\`\`typescript
import { Waffo } from "@waffo/sdk";

const client = new Waffo({
  apiKey: process.env.WAFFO_SECRET_KEY,
});
\`\`\`

## Create a Payment Intent

A payment intent represents a payment lifecycle. Create one server-side:

\`\`\`typescript
const payment = await client.payments.create({
  amount: 4999,        // amount in smallest currency unit
  currency: "usd",
  customer: "cus_7x9kL",
  paymentMethod: "pm_card_visa",
  capture: true,       // capture immediately
  metadata: {
    orderId: "ord_1234",
    userId: "usr_abc",
  },
});

console.log(payment.status);  // "succeeded"
\`\`\`

## Handle the Response

The response object contains everything you need:

\`\`\`typescript
if (payment.status === "succeeded") {
  // Update your database
  await db.orders.update({
    where: { id: payment.metadata.orderId },
    data: { status: "paid", paymentId: payment.id },
  });
}
\`\`\`

## Test in Sandbox

Use test card numbers to simulate different scenarios:

| Card Number | Scenario |
|---|---|
| 4242 4242 4242 4242 | Successful payment |
| 4000 0000 0000 9995 | Insufficient funds |
| 4000 0025 0000 3155 | 3DS2 required |

That's it. You've processed your first payment with Waffo.
    `,
  },
  {
    slug: "webhook-best-practices",
    title: "Webhook Best Practices: Reliability at Scale",
    description:
      "Learn how to build a robust webhook handler — signature verification, idempotency, retry logic, and queue-based processing for high-volume scenarios.",
    category: "Integrations",
    tags: ["Webhooks", "Reliability", "Node.js"],
    readingTime: 12,
    publishedAt: "2026-03-14",
    featured: true,
    author: { name: "Priya Sharma", role: "Staff Engineer" },
    content: `
## Why Webhooks Fail

Most webhook failures fall into three categories: signature mismatch, duplicate processing, and unhandled event types. This guide covers all three.

## Signature Verification

Always verify the webhook signature before processing:

\`\`\`typescript
import { Waffo } from "@waffo/sdk";

const waffo = new Waffo({ apiKey: process.env.WAFFO_SECRET_KEY });

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("waffo-signature") ?? "";

  let event;
  try {
    event = waffo.webhooks.construct(body, signature, process.env.WAFFO_WEBHOOK_SECRET!);
  } catch (err) {
    return new Response("Invalid signature", { status: 400 });
  }

  // Process event...
  return new Response("OK");
}
\`\`\`

## Idempotency

Use the event ID to prevent duplicate processing:

\`\`\`typescript
async function handleEvent(event: WaffoEvent) {
  // Check if already processed
  const existing = await db.processedEvents.findUnique({
    where: { eventId: event.id },
  });
  if (existing) return;

  // Process the event
  await processPaymentEvent(event);

  // Mark as processed
  await db.processedEvents.create({
    data: { eventId: event.id, processedAt: new Date() },
  });
}
\`\`\`

## Queue-Based Processing

For high volume, offload processing to a queue:

\`\`\`typescript
export async function POST(req: Request) {
  // ... verify signature ...

  // Immediately enqueue and respond
  await queue.push({ event, receivedAt: Date.now() });
  return new Response("Accepted", { status: 202 });
}
\`\`\`
    `,
  },
  {
    slug: "pci-dss-developers-guide",
    title: "PCI DSS Level 1: What Developers Actually Need to Know",
    description:
      "Strip away the compliance jargon. A practical breakdown of PCI DSS requirements that affect your code, your infrastructure, and your responsibilities.",
    category: "Security",
    tags: ["PCI DSS", "Compliance", "Security"],
    readingTime: 15,
    publishedAt: "2026-03-07",
    featured: false,
    author: { name: "Marcus Webb", role: "Security Engineer" },
    content: `
## What Is PCI DSS?

PCI DSS (Payment Card Industry Data Security Standard) is a set of security requirements designed to protect cardholder data. If you handle card payments, you need to comply.

## The Good News About Waffo

When you use Waffo's hosted payment fields (Waffo.js), card data never touches your servers. This limits your PCI scope to SAQ A — the most lightweight compliance level.

## Your Responsibilities

Even with reduced scope, you still need to:

1. **Use HTTPS everywhere** — All pages, not just checkout
2. **Content Security Policy** — Prevent script injection
3. **Dependency management** — Keep libraries updated
4. **Access controls** — Limit who can access payment settings
5. **Incident response** — Have a documented plan

## What Waffo Handles

- PCI DSS Level 1 Service Provider (the highest)
- Card data storage and encryption
- Network security and penetration testing
- Annual compliance audits

## Practical Checklist

\`\`\`text
✓ HTTPS with valid TLS 1.2+ certificate
✓ CSP header allowing Waffo's domains
✓ No logging of raw card data
✓ API keys rotated quarterly
✓ Webhook signature verification
✓ Separate staging/production environments
\`\`\`
    `,
  },
  {
    slug: "3ds2-authentication",
    title: "Implementing 3DS2 Authentication with Waffo",
    description:
      "Step-by-step implementation of 3D Secure 2 for European card payments. Covers challenge flows, frictionless paths, and exemption strategies.",
    category: "Security",
    tags: ["3DS2", "SCA", "Europe", "Auth"],
    readingTime: 10,
    publishedAt: "2026-02-28",
    featured: false,
    author: { name: "Alex Chen", role: "Developer Advocate" },
    content: `
## Background: SCA and 3DS2

Strong Customer Authentication (SCA) is required for most European card payments under PSD2. Waffo handles 3DS2 automatically, but understanding the flows helps you optimize conversion.

## The Two Paths

**Frictionless**: No customer interaction needed — bank authenticates in the background.
**Challenge**: Customer must verify (biometrics, SMS OTP, etc.).

## How to Enable 3DS2

Pass the required data when creating a payment:

\`\`\`typescript
const payment = await client.payments.create({
  amount: 9900,
  currency: "eur",
  customer: "cus_xyz",
  paymentMethod: "pm_card_eu",
  returnUrl: "https://yourapp.com/payment/return",
  // Enable 3DS2
  authentication: {
    requested: true,
    // Pass as much data as possible for frictionless path
    browserInfo: {
      acceptHeader: req.headers.get("accept"),
      language: "en-GB",
      colorDepth: 24,
      screenHeight: 900,
      screenWidth: 1440,
      timeZone: 0,
      javaEnabled: false,
    },
  },
});
\`\`\`

## Handling Challenge Flows

If authentication requires a challenge, redirect the customer:

\`\`\`typescript
if (payment.status === "requires_action") {
  // Redirect to 3DS2 authentication URL
  redirect(payment.nextAction.redirectUrl);
}
\`\`\`
    `,
  },
  {
    slug: "smart-routing-auth-rates",
    title: "Smart Routing: How Waffo Optimizes Authorization Rates",
    description:
      "Deep dive into Waffo's machine learning-based routing engine. How it works, what signals it uses, and how to configure it for your transaction profile.",
    category: "Optimization",
    tags: ["Smart Routing", "Authorization Rate", "ML"],
    readingTime: 7,
    publishedAt: "2026-02-21",
    featured: true,
    author: { name: "Priya Sharma", role: "Staff Engineer" },
    content: `
## The Authorization Rate Problem

On average, 8–12% of legitimate payment attempts fail due to issuer declines. Most of these failures are recoverable with the right routing strategy.

## How Smart Routing Works

Waffo's routing engine analyzes hundreds of signals in real-time:

- Card issuer and BIN data
- Historical success rates per route
- Current processor performance
- Time of day and geography
- Customer payment history

## Configuring Smart Routing

Enable it on your account settings or via API:

\`\`\`typescript
const payment = await client.payments.create({
  amount: 2999,
  currency: "usd",
  routing: {
    strategy: "optimize_auth_rate",
    // Or: "optimize_cost" | "round_robin" | "manual"
    fallback: true,    // try secondary processor on failure
    maxAttempts: 3,
  },
});
\`\`\`

## Measuring Impact

Use the analytics API to measure routing impact:

\`\`\`typescript
const stats = await client.analytics.authRates({
  from: "2026-01-01",
  to: "2026-02-01",
  groupBy: "route",
});

// Returns per-route auth rates, volume, revenue
\`\`\`
    `,
  },
  {
    slug: "multi-currency-checkout",
    title: "Building a Multi-Currency Checkout",
    description:
      "Support 190+ currencies in your checkout. Dynamic currency conversion, FX rates, settlement currencies, and currency display logic.",
    category: "Guides",
    tags: ["Multi-currency", "FX", "Global"],
    readingTime: 11,
    publishedAt: "2026-02-14",
    featured: false,
    author: { name: "Maya Torres", role: "Solutions Engineer" },
    content: `
## Currency Architecture

Waffo separates three concepts: **presentment currency** (what the customer sees), **processing currency** (what goes to the network), and **settlement currency** (what lands in your bank).

## Dynamic Currency Conversion

Let customers choose their preferred currency at checkout:

\`\`\`typescript
// Get supported currencies and FX rates
const rates = await client.fx.rates({
  base: "usd",
  currencies: ["eur", "gbp", "jpy", "cad"],
});

// rates.eur → 0.92, rates.gbp → 0.79, etc.

// Create payment in customer's currency
const payment = await client.payments.create({
  amount: convertAmount(4999, "usd", customerCurrency, rates),
  currency: customerCurrency,
  settleAs: "usd",  // settle in USD regardless
});
\`\`\`

## Displaying Formatted Amounts

Use Waffo's formatting utilities:

\`\`\`typescript
import { formatAmount } from "@waffo/sdk/utils";

formatAmount(4999, "usd"); // "$49.99"
formatAmount(4999, "jpy"); // "¥4,999"
formatAmount(4999, "eur"); // "€49.99"
\`\`\`
    `,
  },
  {
    slug: "sandbox-testing",
    title: "Testing Payment Flows with the Waffo Sandbox",
    description:
      "Comprehensive guide to the Waffo sandbox environment. Test cards, webhook simulation, error injection, and CI/CD integration patterns.",
    category: "Testing",
    tags: ["Testing", "Sandbox", "CI/CD"],
    readingTime: 9,
    publishedAt: "2026-02-07",
    featured: false,
    author: { name: "Marcus Webb", role: "Security Engineer" },
    content: `
## The Sandbox Environment

The Waffo sandbox mirrors production functionality but uses test credentials and simulated networks. No real charges occur.

## Test Cards

\`\`\`text
Success scenarios:
4242 4242 4242 4242  — Standard success
4000 0566 5566 5556  — Debit card success
5555 5555 5555 4444  — Mastercard success

Failure scenarios:
4000 0000 0000 9995  — Insufficient funds
4000 0000 0000 0002  — Card declined
4000 0000 0000 9987  — Expired card

3DS scenarios:
4000 0025 0000 3155  — Challenge required
4000 0027 6000 3184  — Frictionless pass
\`\`\`

## Simulating Webhooks

Use the CLI to replay webhook events locally:

\`\`\`bash
waffo webhooks forward --url localhost:3000/api/webhooks
\`\`\`

## CI/CD Integration

Configure sandbox keys in your CI environment:

\`\`\`yaml
# .github/workflows/test.yml
env:
  WAFFO_SECRET_KEY: \${{ secrets.WAFFO_TEST_KEY }}
  WAFFO_WEBHOOK_SECRET: \${{ secrets.WAFFO_TEST_WEBHOOK_SECRET }}
\`\`\`
    `,
  },
  {
    slug: "dispute-management",
    title: "Handling Disputes Programmatically",
    description:
      "Automate dispute responses with evidence submission via API. Reduce chargeback rates with prevention signals and understand the dispute timeline.",
    category: "Operations",
    tags: ["Disputes", "Chargebacks", "Automation"],
    readingTime: 13,
    publishedAt: "2026-01-31",
    featured: false,
    author: { name: "Maya Torres", role: "Solutions Engineer" },
    content: `
## Understanding the Dispute Lifecycle

A dispute begins when a customer contacts their bank. You typically have 7–21 days to respond with evidence.

## Listening for Dispute Webhooks

\`\`\`typescript
switch (event.type) {
  case "dispute.created":
    await handleNewDispute(event.data);
    break;
  case "dispute.evidence_due":
    await submitDisputeEvidence(event.data.id);
    break;
  case "dispute.won":
    await handleDisputeWon(event.data);
    break;
  case "dispute.lost":
    await handleDisputeLost(event.data);
    break;
}
\`\`\`

## Submitting Evidence

\`\`\`typescript
await client.disputes.submitEvidence(disputeId, {
  customerEmailAddress: order.customer.email,
  customerName: order.customer.name,
  productDescription: order.items.map(i => i.name).join(", "),
  receiptUrl: \`https://yourapp.com/receipts/\${order.id}\`,
  shippingDocumentationUrl: order.tracking?.url,
  // Include as much evidence as possible
  uncategorizedText: \`Order placed on \${order.createdAt}.
    Delivered to \${order.shipping.address} on \${order.deliveredAt}.\`,
});
\`\`\`
    `,
  },
];

// ─── CASE STUDIES ─────────────────────────────────────────────────────────────

export const caseStudies: CaseStudy[] = [
  {
    slug: "meridian-financial-auth-rates",
    title: "How Meridian Financial raised auth rates from 71% to 89%",
    company: "Meridian Financial",
    industry: "FinTech / Lending",
    excerpt:
      "Meridian Financial was losing $2.1M annually to avoidable payment declines. By integrating Waffo's smart routing and retry engine, they recovered 18 percentage points of authorization rate in 60 days.",
    metrics: [
      { label: "Auth rate improvement", value: "+18pp", direction: "up" },
      { label: "Annual revenue recovered", value: "$2.1M", direction: "up" },
      { label: "Integration time", value: "11 days" },
      { label: "Decline codes analyzed", value: "47K+" },
    ],
    tags: ["Smart Routing", "Authorization Rate", "FinTech"],
    publishedAt: "2026-03-10",
    featured: true,
    logo: "MF",
    quote:
      "We'd been accepting a 71% auth rate as normal. Waffo showed us it wasn't, and had the tooling to fix it. The ROI was immediate.",
    quoteAuthor: "Danielle Park",
    quoteRole: "Head of Engineering, Meridian Financial",
  },
  {
    slug: "shopstream-fraud-prevention",
    title: "ShopStream reduced fraud losses by 94% without hurting conversion",
    company: "ShopStream",
    industry: "E-commerce",
    excerpt:
      "ShopStream was burning $5M/year on fraud while simultaneously blocking legitimate customers. Waffo's ML-based fraud detection cut losses by 94% while actually improving checkout conversion by 6%.",
    metrics: [
      { label: "Fraud losses reduced", value: "94%", direction: "down" },
      { label: "Annual savings", value: "$4.7M", direction: "up" },
      { label: "Conversion improvement", value: "+6%", direction: "up" },
      { label: "False positive rate", value: "0.3%" },
    ],
    tags: ["Fraud Prevention", "ML", "E-commerce"],
    publishedAt: "2026-02-24",
    featured: true,
    logo: "SS",
    quote:
      "Every fraud solution we'd tried killed conversion. Waffo's approach was different — it actually made checkout smoother for real customers.",
    quoteAuthor: "Tomás Reyes",
    quoteRole: "CTO, ShopStream",
  },
  {
    slug: "novo-bank-global-scale",
    title: "Novo Bank scaled to 100M+ monthly transactions across 47 countries",
    company: "Novo Bank",
    industry: "Neobank",
    excerpt:
      "Novo Bank needed payments infrastructure that could match their hyper-growth across emerging markets. Waffo's global acquiring network and localisation toolkit enabled expansion to 47 countries in under a year.",
    metrics: [
      { label: "Monthly transactions", value: "100M+", direction: "up" },
      { label: "Countries supported", value: "47" },
      { label: "Uptime SLA", value: "99.99%" },
      { label: "Time to new market", value: "< 2 weeks" },
    ],
    tags: ["Global Payments", "Scale", "Neobank"],
    publishedAt: "2026-02-10",
    featured: false,
    logo: "NB",
    quote:
      "The ability to add a new market in under two weeks — including local payment methods, currency, and compliance — is genuinely unmatched.",
    quoteAuthor: "Linh Nguyen",
    quoteRole: "VP Engineering, Novo Bank",
  },
  {
    slug: "clearpay-integration-speed",
    title: "ClearPay went from contract to production in 9 days",
    company: "ClearPay",
    industry: "BNPL",
    excerpt:
      "ClearPay needed to launch a BNPL product in time for peak retail season. With Waffo's developer-first SDK, three engineers shipped a production-ready integration in 9 working days.",
    metrics: [
      { label: "Time to production", value: "9 days" },
      { label: "Engineers involved", value: "3" },
      { label: "Lines of integration code", value: "< 200" },
      { label: "First week transaction volume", value: "$1.2M" },
    ],
    tags: ["BNPL", "Fast Integration", "SDK"],
    publishedAt: "2026-01-28",
    featured: false,
    logo: "CP",
    quote:
      "The SDK felt like it was designed by people who've built payment integrations before and were frustrated with how hard they are. It was refreshing.",
    quoteAuthor: "Ana Kovacs",
    quoteRole: "Lead Engineer, ClearPay",
  },
];

// ─── DEMOS ────────────────────────────────────────────────────────────────────

export const demos: Demo[] = [
  {
    id: "checkout-flow",
    title: "Checkout Flow",
    description:
      "A complete payment checkout: card capture, 3DS2 authentication, and confirmation. Try different card scenarios in the sandbox.",
    tags: ["Waffo.js", "3DS2", "Hosted Fields"],
    badge: "Interactive",
    badgeColor: "success",
    icon: "CreditCard",
    href: "#demo-checkout",
  },
  {
    id: "webhook-inspector",
    title: "Webhook Inspector",
    description:
      "Send test webhook events and inspect the full payload, headers, and signature. Debug your handler in real-time.",
    tags: ["Webhooks", "Events", "Debugging"],
    badge: "Live",
    badgeColor: "info",
    icon: "Activity",
    href: "#demo-webhooks",
  },
  {
    id: "api-playground",
    title: "API Playground",
    description:
      "Make live API calls against the Waffo sandbox directly from your browser. Explore every endpoint with autofill and response diffing.",
    tags: ["REST API", "OpenAPI", "Sandbox"],
    badge: "Interactive",
    badgeColor: "success",
    icon: "Terminal",
    href: "#demo-api",
  },
  {
    id: "smart-routing-sim",
    title: "Smart Routing Simulator",
    description:
      "Simulate payment routing decisions across our acquiring network. See which processor wins, and why, for any card/amount combination.",
    tags: ["Smart Routing", "Analytics", "Visualization"],
    badge: "New",
    badgeColor: "accent",
    icon: "Network",
    href: "#demo-routing",
  },
];

// ─── UPDATES ─────────────────────────────────────────────────────────────────

export const updates: Update[] = [
  {
    version: "v2.5.0",
    date: "2026-03-25",
    title: "Smart Retry Engine — Generally Available",
    type: "feature",
    description:
      "The Smart Retry Engine, which uses ML-backed optimal retry timing to recover failed payments, is now GA for all accounts. Previously in beta, it has recovered $42M in payments during the 90-day beta period.",
    changes: [
      { type: "added", text: "Smart Retry Engine available on all plan tiers" },
      { type: "added", text: "Per-retry analytics in the dashboard and API" },
      { type: "added", text: "Configurable retry windows (1h, 6h, 24h, 72h)" },
      { type: "changed", text: "Default retry strategy upgraded from round-robin to ML-optimized" },
      { type: "fixed", text: "Retry count now correctly reflected in webhook event metadata" },
    ],
  },
  {
    version: "v2.4.0",
    date: "2026-03-11",
    title: "Multi-currency Payouts + 14 New Currencies",
    type: "feature",
    description:
      "Payouts now support 14 additional currencies, bringing total payout currency support to 67. Dynamic FX rates are now available via API with sub-second staleness.",
    changes: [
      { type: "added", text: "Payout support for IDR, PHP, VND, THB, MYR, BDT, PKR, LKR, NGN, GHS, KES, ZAR, EGP, MAD" },
      { type: "added", text: "FX rates API with real-time rates (< 500ms staleness)" },
      { type: "added", text: "Currency conversion previews in dashboard before settlement" },
      { type: "changed", text: "FX spread now configurable per currency pair on Enterprise plans" },
    ],
  },
  {
    version: "v2.3.0",
    date: "2026-02-26",
    title: "Webhook Infrastructure Overhaul",
    type: "improvement",
    description:
      "Rebuilt webhook delivery on a new distributed infrastructure. P99 delivery latency reduced from 1.2s to 180ms. Added delivery guarantees with at-least-once semantics and an improved retry backoff.",
    changes: [
      { type: "changed", text: "P99 webhook delivery latency: 1,200ms → 180ms" },
      { type: "added", text: "Delivery attempt log with full request/response history (7 day retention)" },
      { type: "added", text: "Per-endpoint health score and alerting" },
      { type: "added", text: "Configurable retry backoff (exponential, linear, or custom schedule)" },
      { type: "fixed", text: "Rare duplicate delivery issue in multi-region failover scenarios" },
    ],
  },
  {
    version: "v2.2.0",
    date: "2026-02-12",
    title: "Analytics Dashboard v2 + New API Metrics",
    type: "improvement",
    description:
      "Redesigned analytics dashboard with improved time-series visualisation, cohort analysis, and exportable reports. All dashboard metrics are now also available via the Analytics API.",
    changes: [
      { type: "added", text: "Analytics API: authorization rates, decline reasons, volume, revenue" },
      { type: "added", text: "Cohort analysis for authorization rate trends by card brand" },
      { type: "added", text: "CSV/JSON export for all report types" },
      { type: "changed", text: "Dashboard data refresh rate: 15 min → 2 min" },
    ],
  },
  {
    version: "v2.1.0",
    date: "2026-01-29",
    title: "3DS2 Native SDK for iOS + Android",
    type: "feature",
    description:
      "Native 3DS2 authentication SDKs for iOS (Swift/ObjC) and Android (Kotlin/Java). Eliminates WebView redirects and provides a frictionless native authentication experience.",
    changes: [
      { type: "added", text: "iOS SDK with native 3DS2 challenge flow (Swift 5.9+)" },
      { type: "added", text: "Android SDK with native 3DS2 challenge flow (Kotlin 1.9+)" },
      { type: "added", text: "Biometric authentication support (Face ID, Touch ID, Fingerprint)" },
      { type: "fixed", text: "Challenge completion callback now fires correctly on all Android 12+ devices" },
    ],
  },
  {
    version: "v2.0.0",
    date: "2026-01-15",
    title: "Waffo 2.0: New API Surface + SDK",
    type: "feature",
    description:
      "Major release. New unified API surface, completely rewritten SDK (v2 is breaking), improved type safety, streaming support, and the new Payments object model.",
    changes: [
      { type: "added", text: "New SDK v2 with full TypeScript support and inference" },
      { type: "added", text: "Streaming events via Server-Sent Events (SSE)" },
      { type: "added", text: "Unified Payments object replacing PaymentIntent + Charge" },
      { type: "changed", text: "Authentication: Bearer token replaces Basic auth" },
      { type: "deprecated", text: "SDK v1 enters maintenance mode — EOL 2027-01-15" },
    ],
  },
];

// ─── COMMUNITY RESOURCES ─────────────────────────────────────────────────────

export const communityResources: CommunityResource[] = [
  {
    id: "discord",
    title: "Developer Discord",
    description: "Get help, share integrations, and talk to the Waffo team in real-time.",
    icon: "MessageSquare",
    href: "#",
    meta: "12,400+ developers",
    category: "Community",
  },
  {
    id: "github",
    title: "GitHub",
    description: "SDKs, sample code, and open-source tools. Contributions welcome.",
    icon: "Github",
    href: "#",
    meta: "847 stars",
    category: "Open Source",
  },
  {
    id: "stackoverflow",
    title: "Stack Overflow",
    description: "Browse 500+ answered questions tagged [waffo-api] from the community.",
    icon: "HelpCircle",
    href: "#",
    meta: "500+ answers",
    category: "Q&A",
  },
  {
    id: "changelog",
    title: "Changelog",
    description: "Detailed release notes for every update. Subscribe for weekly digest emails.",
    icon: "ListChecks",
    href: "/updates",
    meta: "Weekly releases",
    category: "Updates",
  },
  {
    id: "twitter",
    title: "X / Twitter",
    description: "Follow @waffo_dev for API status updates, new features, and dev tips.",
    icon: "Twitter",
    href: "#",
    meta: "@waffo_dev",
    category: "Social",
  },
  {
    id: "newsletter",
    title: "Developer Newsletter",
    description: "Monthly digest: new features, guides, case studies, and community highlights.",
    icon: "Mail",
    href: "#",
    meta: "8,200 subscribers",
    category: "Newsletter",
  },
];

// ─── STATS ────────────────────────────────────────────────────────────────────

export const stats = [
  { label: "API Uptime", value: "99.99%", suffix: "", mono: true },
  { label: "Avg Latency", value: "68", suffix: "ms", mono: true },
  { label: "Transactions", value: "2.4B+", suffix: "", mono: true },
  { label: "Currencies", value: "190+", suffix: "", mono: true },
  { label: "Countries", value: "47", suffix: "", mono: true },
];
