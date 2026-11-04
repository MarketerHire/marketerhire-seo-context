"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import Header from "@/components/Header";
import HealthBadge from "@/components/HealthBadge";
import type { AuditSnapshot, QuickWin } from "@/lib/types";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function timeSince(dateStr: string): string {
  const now = new Date();
  const then = new Date(dateStr);
  const diffMs = now.getTime() - then.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "today";
  if (diffDays === 1) return "1 day ago";
  return `${diffDays} days ago`;
}

function renderMarkdownSimple(md: string): string {
  // Very simple markdown to HTML: headings, bold, lists, paragraphs
  return md
    .replace(/^### (.+)$/gm, '<h3 class="text-sm font-semibold mt-3 mb-1">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-base font-semibold mt-4 mb-1">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-lg font-bold mt-4 mb-2">$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/^- (.+)$/gm, '<li class="ml-4 list-disc text-sm">$1</li>')
    .replace(/\n\n/g, '<br class="my-2" />')
    .replace(/\n/g, "<br />");
}

// ---------------------------------------------------------------------------
// Trend charts
// ---------------------------------------------------------------------------

function SessionsChart({ snapshots }: { snapshots: AuditSnapshot[] }) {
  const sorted = [...snapshots].reverse();
  const data = {
    labels: sorted.map((s) => formatDate(s.audit_date)),
    datasets: [
      {
        label: "Organic Sessions (30d)",
        data: sorted.map((s) => s.total_organic_sessions_30d ?? 0),
        borderColor: "#FF52E5",
        backgroundColor: "rgba(255, 82, 229, 0.1)",
        fill: true,
        tension: 0.3,
        pointRadius: 4,
        pointBackgroundColor: "#FF52E5",
      },
    ],
  };

  return (
    <Line
      data={data}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          title: {
            display: true,
            text: "Total Organic Sessions (30d)",
            font: { size: 13, weight: "bold" as const },
            color: "#141414",
            align: "start" as const,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: "rgba(0,0,0,0.04)" },
            ticks: { font: { size: 11 } },
          },
          x: {
            grid: { display: false },
            ticks: { font: { size: 11 } },
          },
        },
      }}
    />
  );
}

function HealthChart({ snapshots }: { snapshots: AuditSnapshot[] }) {
  const sorted = [...snapshots].reverse();
  const data = {
    labels: sorted.map((s) => formatDate(s.audit_date)),
    datasets: [
      {
        label: "Healthy",
        data: sorted.map((s) => s.articles_healthy),
        borderColor: "#22C55E",
        backgroundColor: "rgba(34, 197, 94, 0.1)",
        fill: true,
        tension: 0.3,
        pointRadius: 4,
        pointBackgroundColor: "#22C55E",
      },
      {
        label: "Warning",
        data: sorted.map((s) => s.articles_warning),
        borderColor: "#F59E0B",
        backgroundColor: "rgba(245, 158, 11, 0.1)",
        fill: true,
        tension: 0.3,
        pointRadius: 4,
        pointBackgroundColor: "#F59E0B",
      },
      {
        label: "Critical",
        data: sorted.map((s) => s.articles_critical),
        borderColor: "#EF4444",
        backgroundColor: "rgba(239, 68, 68, 0.1)",
        fill: true,
        tension: 0.3,
        pointRadius: 4,
        pointBackgroundColor: "#EF4444",
      },
    ],
  };

  return (
    <Line
      data={data}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom" as const,
            labels: { font: { size: 11 }, usePointStyle: true, pointStyle: "circle" },
          },
          title: {
            display: true,
            text: "Article Health Over Time",
            font: { size: 13, weight: "bold" as const },
            color: "#141414",
            align: "start" as const,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: "rgba(0,0,0,0.04)" },
            ticks: { font: { size: 11 }, stepSize: 1 },
          },
          x: {
            grid: { display: false },
            ticks: { font: { size: 11 } },
          },
        },
      }}
    />
  );
}

// ---------------------------------------------------------------------------
// Audit snapshot card
// ---------------------------------------------------------------------------

function AuditCard({ snapshot }: { snapshot: AuditSnapshot }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-mh-black">
              {formatDate(snapshot.audit_date)}
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              {snapshot.total_articles} articles audited
            </p>
          </div>
          <div className="flex items-center gap-3">
            <HealthBadge status="green" />
            <span className="text-xs font-medium text-gray-600">{snapshot.articles_healthy}</span>
            <HealthBadge status="yellow" />
            <span className="text-xs font-medium text-gray-600">{snapshot.articles_warning}</span>
            <HealthBadge status="red" />
            <span className="text-xs font-medium text-gray-600">{snapshot.articles_critical}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-mh-black">
              {snapshot.total_organic_sessions_30d?.toLocaleString() ?? "--"}
            </div>
            <div className="text-xs text-gray-500">Organic Sessions</div>
          </div>
          <div>
            <div className="text-lg font-bold text-mh-black">
              {snapshot.avg_position != null ? snapshot.avg_position.toFixed(1) : "--"}
            </div>
            <div className="text-xs text-gray-500">Avg Position</div>
          </div>
          <div>
            <div className="text-lg font-bold text-mh-black">
              {snapshot.quick_wins_count ?? "--"}
            </div>
            <div className="text-xs text-gray-500">Quick Wins</div>
          </div>
          <div>
            <div className="text-lg font-bold text-mh-black">
              {snapshot.keyword_coverage_pct != null
                ? `${snapshot.keyword_coverage_pct.toFixed(1)}%`
                : "--"}
            </div>
            <div className="text-xs text-gray-500">Keyword Coverage</div>
          </div>
        </div>
      </div>

      {snapshot.report_markdown && (
        <>
          <div className="border-t border-gray-100">
            <button
              type="button"
              onClick={() => setExpanded(!expanded)}
              className="w-full px-5 py-3 text-xs font-medium text-gray-500 hover:text-mh-black hover:bg-mh-gray/50 transition-colors flex items-center gap-1"
            >
              <svg
                className={`h-3.5 w-3.5 transition-transform ${expanded ? "rotate-180" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
              {expanded ? "Hide" : "Show"} Full Report
            </button>
          </div>
          {expanded && (
            <div className="px-5 pb-5 border-t border-gray-100">
              <div
                className="prose prose-sm max-w-none text-sm text-gray-700 mt-3"
                dangerouslySetInnerHTML={{
                  __html: renderMarkdownSimple(snapshot.report_markdown),
                }}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Quick wins table
// ---------------------------------------------------------------------------

function QuickWinsTable({ quickWins }: { quickWins: QuickWin[] }) {
  if (quickWins.length === 0) {
    return (
      <div className="text-sm text-gray-400 py-8 text-center">
        No quick wins found in the latest audit.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-mh-gray">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Article
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Keyword
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Avg Pos
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Impressions
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              CTR
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Suggestion
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {quickWins.map((qw) => (
            <tr key={qw.slug} className="hover:bg-mh-gray/50 transition-colors">
              <td className="px-4 py-3">
                <div className="font-medium text-mh-black truncate max-w-[200px]">{qw.title}</div>
                <div className="text-xs text-gray-400">{qw.slug}</div>
              </td>
              <td className="px-4 py-3 text-gray-600 max-w-[140px] truncate">
                {qw.target_keyword}
              </td>
              <td className="px-4 py-3 text-gray-600">
                {qw.avg_position_30d != null ? qw.avg_position_30d.toFixed(1) : "--"}
              </td>
              <td className="px-4 py-3 text-gray-600">
                {qw.impressions_30d?.toLocaleString() ?? "--"}
              </td>
              <td className="px-4 py-3 text-gray-600">
                {qw.ctr_30d != null ? `${(qw.ctr_30d * 100).toFixed(1)}%` : "--"}
              </td>
              <td className="px-4 py-3 text-xs text-gray-600 max-w-[240px]">
                {qw.suggestion}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------

export default function AuditPage() {
  const [snapshots, setSnapshots] = useState<AuditSnapshot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const fetchAudits = useCallback(async () => {
    try {
      const res = await fetch("/api/audit?limit=20");
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? `HTTP ${res.status}`);
      }
      const data: AuditSnapshot[] = await res.json();
      setSnapshots(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAudits();
  }, [fetchAudits]);

  const latestSnapshot = snapshots.length > 0 ? snapshots[0] : null;

  // Extract quick wins from latest snapshot
  const quickWins = useMemo<QuickWin[]>(() => {
    if (!latestSnapshot?.quick_wins_data) return [];
    const data = latestSnapshot.quick_wins_data;
    // quick_wins_data may be an array or an object with an array property
    if (Array.isArray(data)) return data as unknown as QuickWin[];
    if (typeof data === "object" && "quick_wins" in data && Array.isArray(data.quick_wins)) {
      return data.quick_wins as unknown as QuickWin[];
    }
    return [];
  }, [latestSnapshot]);

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: select text
    }
  };

  return (
    <>
      <Header />
      <div className="h-16" />

      <main className="flex-1 w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Page title */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-mh-black">SEO Audit</h1>
          <p className="text-sm text-gray-500 mt-1">
            Weekly SEO health audits. View audit history, health trends, and quick wins.
          </p>
        </div>

        {/* Run Audit panel */}
        <section className="mb-8">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-sm font-semibold text-mh-black mb-1">Run Audit</h2>
                <p className="text-xs text-gray-500">
                  Run <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-mono">/seo-audit</code> in Claude Code to pull GA4 + GSC data. Results sync here automatically.
                </p>
                {latestSnapshot && (
                  <p className="text-xs text-gray-400 mt-1">
                    Last audit: {formatDate(latestSnapshot.audit_date)} ({timeSince(latestSnapshot.audit_date)})
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => handleCopy("/seo-audit")}
                className="px-4 py-2 text-sm font-medium text-white bg-mh-pink rounded-lg hover:bg-mh-pink/90 transition-colors whitespace-nowrap flex items-center gap-2"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184"
                  />
                </svg>
                {copied ? "Copied!" : "Copy Command"}
              </button>
            </div>
          </div>
        </section>

        {/* Loading */}
        {loading && (
          <div className="space-y-4 animate-pulse">
            <div className="h-48 bg-gray-100 rounded-xl" />
            <div className="h-48 bg-gray-100 rounded-xl" />
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600 mb-8">
            Failed to load audit data: {error}
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Trend charts */}
            {snapshots.length >= 2 && (
              <section className="mb-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                  <div className="h-[260px]">
                    <SessionsChart snapshots={snapshots} />
                  </div>
                </div>
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                  <div className="h-[260px]">
                    <HealthChart snapshots={snapshots} />
                  </div>
                </div>
              </section>
            )}

            {/* Quick Wins from Latest Audit */}
            {quickWins.length > 0 && (
              <section className="mb-8">
                <h2 className="text-lg font-semibold text-mh-black mb-4">
                  Quick Wins (Latest Audit)
                </h2>
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                  <QuickWinsTable quickWins={quickWins} />
                </div>
              </section>
            )}

            {/* Audit History */}
            <section>
              <h2 className="text-lg font-semibold text-mh-black mb-4">
                Audit History
              </h2>
              {snapshots.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 text-center text-gray-400 text-sm">
                  No audits yet. Run <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">/seo-audit</code> to create the first one.
                </div>
              ) : (
                <div className="space-y-4">
                  {snapshots.map((snapshot) => (
                    <AuditCard key={snapshot.audit_date} snapshot={snapshot} />
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </main>

      <footer className="border-t border-gray-100 py-6">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between text-xs text-gray-400">
          <span>SEO Dashboard -- MarketerHire</span>
          <span>Powered by Supabase + Next.js</span>
        </div>
      </footer>
    </>
  );
}
