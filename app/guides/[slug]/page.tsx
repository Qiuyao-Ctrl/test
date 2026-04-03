import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, Calendar, ArrowRight } from "lucide-react";
import { guides } from "@/lib/data";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

export async function generateStaticParams() {
  return guides.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = guides.find((g) => g.slug === slug);
  if (!guide) return {};
  return { title: guide.title, description: guide.description };
}

function CategoryBadge({ label }: { label: string }) {
  const colors: Record<string, string> = {
    Quickstart: "bg-success/10 text-success border-success/20",
    Security: "bg-warning/10 text-warning border-warning/20",
    Integrations: "bg-info/10 text-info border-info/20",
    Optimization: "bg-accent/10 text-accent border-accent/20",
    Guides: "bg-teal/10 text-teal border-teal/20",
    Testing: "bg-muted text-muted-foreground border-border",
    Operations: "bg-muted text-muted-foreground border-border",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center font-mono text-[11px] px-2 py-0.5 rounded border",
        colors[label] ?? "bg-muted text-muted-foreground border-border"
      )}
    >
      {label}
    </span>
  );
}

// Very basic markdown renderer for our content
function renderContent(content: string) {
  const lines = content.trim().split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Code block
    if (line.startsWith("```")) {
      const lang = line.slice(3).trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      elements.push(
        <div key={i} className="my-5 rounded-lg overflow-hidden border border-white/10">
          <div className="flex items-center gap-2 px-4 py-2.5 bg-[#161b22] border-b border-white/[0.06]">
            <span className="font-mono text-xs text-white/40">{lang || "code"}</span>
          </div>
          <pre className="bg-[#0d1117] px-5 py-4 overflow-x-auto">
            <code className="font-mono text-[13px] leading-6 text-slate-300">
              {codeLines.join("\n")}
            </code>
          </pre>
        </div>
      );
      i++;
      continue;
    }

    // Table (very basic)
    if (line.startsWith("|")) {
      const tableLines = [line];
      i++;
      while (i < lines.length && lines[i].startsWith("|")) {
        tableLines.push(lines[i]);
        i++;
      }
      const rows = tableLines.filter((l) => !l.match(/^\|[-| ]+\|$/));
      elements.push(
        <div key={i} className="my-5 overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted border-b border-border">
                {rows[0]
                  .split("|")
                  .filter(Boolean)
                  .map((cell, ci) => (
                    <th
                      key={ci}
                      className="px-4 py-2.5 text-left font-mono text-xs text-muted-foreground"
                    >
                      {cell.trim()}
                    </th>
                  ))}
              </tr>
            </thead>
            <tbody>
              {rows.slice(1).map((row, ri) => (
                <tr key={ri} className="border-b border-border last:border-0">
                  {row
                    .split("|")
                    .filter(Boolean)
                    .map((cell, ci) => (
                      <td key={ci} className="px-4 py-2.5 font-mono text-xs text-foreground">
                        {cell.trim()}
                      </td>
                    ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      continue;
    }

    // H2
    if (line.startsWith("## ")) {
      elements.push(
        <h2 key={i} className="text-xl font-bold text-foreground mt-8 mb-4 first:mt-0">
          {line.slice(3)}
        </h2>
      );
      i++;
      continue;
    }

    // H3
    if (line.startsWith("### ")) {
      elements.push(
        <h3 key={i} className="text-base font-semibold text-foreground mt-6 mb-3">
          {line.slice(4)}
        </h3>
      );
      i++;
      continue;
    }

    // Empty line
    if (line.trim() === "") {
      i++;
      continue;
    }

    // Paragraph
    elements.push(
      <p key={i} className="text-[15px] text-muted-foreground leading-relaxed mb-4">
        {line}
      </p>
    );
    i++;
  }

  return elements;
}

export default async function GuideDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = guides.find((g) => g.slug === slug);
  if (!guide) notFound();

  const relatedGuides = guides
    .filter((g) => g.slug !== slug && g.tags.some((t) => guide.tags.includes(t)))
    .slice(0, 3);

  return (
    <div className="pt-14">
      {/* Header */}
      <div className="bg-dark-bg border-b border-dark-border py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/guides"
            className="inline-flex items-center gap-1.5 text-sm text-dark-muted hover:text-dark-text transition-colors mb-6 font-mono"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Guides
          </Link>

          <div className="flex flex-wrap gap-2 mb-4">
            <CategoryBadge label={guide.category} />
            {guide.tags.map((tag) => (
              <span
                key={tag}
                className="font-mono text-[10px] text-dark-muted bg-dark-card border border-dark-border px-2 py-0.5 rounded"
              >
                {tag}
              </span>
            ))}
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-dark-text max-w-3xl leading-snug mb-5">
            {guide.title}
          </h1>
          <p className="text-dark-muted max-w-2xl leading-relaxed mb-6">
            {guide.description}
          </p>

          <div className="flex flex-wrap items-center gap-5 text-sm">
            <div className="flex items-center gap-1.5 text-dark-muted">
              <div className="w-6 h-6 bg-dark-card border border-dark-border rounded-full flex items-center justify-center">
                <span className="font-mono text-[9px] text-dark-muted">
                  {guide.author.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </span>
              </div>
              <div>
                <span className="text-dark-text font-medium">{guide.author.name}</span>
                <span className="text-dark-muted font-mono text-xs ml-1.5">
                  — {guide.author.role}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1 font-mono text-xs text-dark-muted">
              <Calendar className="w-3.5 h-3.5" />
              {formatDate(guide.publishedAt)}
            </div>
            <div className="flex items-center gap-1 font-mono text-xs text-dark-muted">
              <Clock className="w-3.5 h-3.5" />
              {guide.readingTime} min read
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-[1fr_280px] gap-12">
          {/* Main content */}
          <article className="max-w-2xl">
            {renderContent(guide.content)}
          </article>

          {/* Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-20 space-y-6">
              {/* Author card */}
              <div className="bg-card border border-border rounded-lg p-4">
                <p className="font-mono text-xs text-muted-foreground uppercase tracking-wider mb-3">
                  Written by
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-muted border border-border rounded-full flex items-center justify-center shrink-0">
                    <span className="font-mono text-xs font-semibold text-muted-foreground">
                      {guide.author.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-foreground">{guide.author.name}</p>
                    <p className="font-mono text-xs text-muted-foreground">{guide.author.role}</p>
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="bg-card border border-border rounded-lg p-4">
                <p className="font-mono text-xs text-muted-foreground uppercase tracking-wider mb-3">
                  Tags
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {guide.tags.map((tag) => (
                    <span
                      key={tag}
                      className="font-mono text-[11px] text-muted-foreground bg-muted border border-border px-2 py-0.5 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Docs CTA */}
              <div className="bg-primary/8 border border-primary/20 rounded-lg p-4">
                <p className="font-semibold text-sm text-foreground mb-1.5">Full API Reference</p>
                <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                  All endpoints, parameters, and response schemas.
                </p>
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary-hover transition-colors"
                >
                  Open Docs →
                </a>
              </div>
            </div>
          </aside>
        </div>

        {/* Related guides */}
        {relatedGuides.length > 0 && (
          <div className="mt-16 pt-10 border-t border-border">
            <h2 className="text-lg font-bold text-foreground mb-6">Related Guides</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {relatedGuides.map((rg) => (
                <Link
                  key={rg.slug}
                  href={`/guides/${rg.slug}`}
                  className="group flex flex-col bg-card border border-border rounded-lg p-4 hover:border-primary/40 hover:shadow-sm transition-all"
                >
                  <CategoryBadge label={rg.category} />
                  <h3 className="font-semibold text-sm text-foreground mt-2 mb-1 group-hover:text-primary transition-colors line-clamp-2">
                    {rg.title}
                  </h3>
                  <div className="flex items-center gap-1 mt-auto font-mono text-xs text-muted-foreground group-hover:text-primary transition-colors">
                    Read guide
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
