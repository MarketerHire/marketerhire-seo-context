"use client";

import { useEffect, useState } from "react";
import type { AuditSnapshot } from "@/lib/types";

interface QuickWinRow {
  query: string;
  position: number;
  impressions: number;
  page_url: string;
  opportunity_score: number;
}

export default function QuickWinsPanel() {
  const [wins, setWins] = useState<QuickWinRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    fetch("/api/audit?limit=1")
      .then(async (res) => {
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error ?? `HTTP ${res.status}`);
        }
        return res.json();
      })
      .then((data: AuditSnapshot[]) => {
        const latest = data?.[0];
        if (latest?.quick_wins_data) {
          // quick_wins_data can be an array or { items: [...] }
          const raw = latest.quick_wins_data;
          let items: QuickWinRow[] = [];

          if (Array.isArray(raw)) {
            items = raw as QuickWinRow[];
          } else if (
            typeof raw === "object" &&
            raw !== null &&
            "items" in raw &&
            Array.isArray((raw as Record<string, unknown>).items)
          ) {
            items = (raw as Record<string, unknown>).items as QuickWinRow[];
          }

          // Sort by opportunity_score desc, take top 10
          items.sort(
            (a, b) => (b.opportunity_score ?? 0) - (a.opportunity_score ?? 0)
          );
          setWins(items.slice(0, 10));
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header with collapse toggle */}
      <button
        type="button"
        onClick={() => setCollapsed(!collapsed)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-mh-gray/30 transition-colors"
      >
        <div className="flex items-center gap-2">
          <svg
            className="h-5 w-5 text-mh-green"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
            />
          </svg>
          <h3 className="text-sm font-semibold text-mh-black">
            Quick Win Opportunities
          </h3>
          {wins.length > 0 && (
            <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-medium">
              {wins.length}
            </span>
          )}
        </div>
        <svg
          className={`h-4 w-4 text-gray-400 transition-transform ${
            collapsed ? "" : "rotate-180"
          }`}
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 8.25l-7.5 7.5-7.5-7.5"
          />
        </svg>
      </button>

      {/* Content */}
      {!collapsed && (
        <div className="border-t border-gray-100">
          {loading && (
            <div className="p-5 animate-pulse space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-8 bg-gray-50 rounded" />
              ))}
            </div>
          )}

          {error && (
            <div className="p-4 text-sm text-red-600">
              Failed to load quick wins: {error}
            </div>
          )}

          {!loading && !error && wins.length === 0 && (
            <div className="p-5 text-sm text-gray-400 text-center">
              No quick win data available. Run an SEO audit to discover
              opportunities.
            </div>
          )}

          {!loading && !error && wins.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-mh-gray">
                  <tr>
                    <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Query
                    </th>
                    <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Position
                    </th>
                    <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Impressions
                    </th>
                    <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Page
                    </th>
                    <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Opportunity
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {wins.map((win, idx) => (
                    <tr
                      key={`${win.query}-${idx}`}
                      className="hover:bg-mh-gray/50 transition-colors"
                    >
                      <td className="px-4 py-2.5 font-medium text-mh-black">
                        {win.query}
                      </td>
                      <td className="px-4 py-2.5 text-gray-600">
                        {win.position?.toFixed(1) ?? "--"}
                      </td>
                      <td className="px-4 py-2.5 text-gray-600">
                        {win.impressions?.toLocaleString() ?? "--"}
                      </td>
                      <td className="px-4 py-2.5 max-w-[200px]">
                        {win.page_url ? (
                          <a
                            href={win.page_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-500 hover:text-mh-pink truncate block text-xs"
                            title={win.page_url}
                          >
                            {new URL(win.page_url).pathname}
                          </a>
                        ) : (
                          <span className="text-gray-400">--</span>
                        )}
                      </td>
                      <td className="px-4 py-2.5">
                        <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                          {win.opportunity_score?.toFixed(1) ?? "--"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
