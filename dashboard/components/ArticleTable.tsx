"use client";

import { useEffect, useState, useMemo } from "react";
import type {
  Article,
  ArticleStatus,
  HealthStatus,
  SessionsTrend,
  PositionTrend,
} from "@/lib/types";
import HealthBadge from "./HealthBadge";

// ---------------------------------------------------------------------------
// Trend Arrow
// ---------------------------------------------------------------------------
function TrendArrow({ trend }: { trend: SessionsTrend | PositionTrend | null | undefined }) {
  if (!trend || trend === "flat") {
    return <span className="text-gray-400 text-xs">--</span>;
  }
  if (trend === "up") {
    return (
      <span className="inline-flex items-center text-emerald-600 text-xs font-medium">
        <svg className="h-3.5 w-3.5 mr-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
        </svg>
        Up
      </span>
    );
  }
  return (
    <span className="inline-flex items-center text-red-500 text-xs font-medium">
      <svg className="h-3.5 w-3.5 mr-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 4.5l15 15m0 0V8.25m0 11.25H8.25" />
      </svg>
      Down
    </span>
  );
}

// ---------------------------------------------------------------------------
// Filter chips
// ---------------------------------------------------------------------------
function Chip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1 text-xs font-medium rounded-full border transition-colors ${
        active
          ? "bg-mh-pink text-white border-mh-pink"
          : "bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:text-mh-black"
      }`}
    >
      {label}
    </button>
  );
}

// ---------------------------------------------------------------------------
// Score display
// ---------------------------------------------------------------------------
function ScoreCell({ score }: { score: number | null }) {
  if (score == null) return <span className="text-gray-400">--</span>;
  const color =
    score >= 23
      ? "text-emerald-600 font-semibold"
      : score >= 20
      ? "text-amber-600 font-semibold"
      : "text-red-600 font-semibold";
  return <span className={color}>{score}/25</span>;
}

// ---------------------------------------------------------------------------
// Sortable column header
// ---------------------------------------------------------------------------
type SortKey =
  | "title"
  | "target_keyword"
  | "scorecard_score"
  | "word_count"
  | "status"
  | "organic_sessions_30d"
  | "avg_position_30d"
  | "health_status";

function SortHeader({
  label,
  sortKey,
  currentSort,
  currentDir,
  onSort,
}: {
  label: string;
  sortKey: SortKey;
  currentSort: SortKey;
  currentDir: "asc" | "desc";
  onSort: (key: SortKey) => void;
}) {
  const isActive = currentSort === sortKey;
  return (
    <th
      className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer select-none hover:text-mh-black transition-colors"
      onClick={() => onSort(sortKey)}
    >
      <span className="inline-flex items-center gap-1">
        {label}
        {isActive && (
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            {currentDir === "asc" ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            )}
          </svg>
        )}
      </span>
    </th>
  );
}

// ---------------------------------------------------------------------------
// Status badge
// ---------------------------------------------------------------------------
const STATUS_LABELS: Record<ArticleStatus, string> = {
  produced: "Produced",
  published: "Published",
  monitored: "Monitored",
  refresh_needed: "Refresh Needed",
  retired: "Retired",
};

const STATUS_COLORS: Record<ArticleStatus, string> = {
  produced: "bg-blue-50 text-blue-700",
  published: "bg-emerald-50 text-emerald-700",
  monitored: "bg-violet-50 text-violet-700",
  refresh_needed: "bg-amber-50 text-amber-700",
  retired: "bg-gray-100 text-gray-500",
};

function StatusBadge({ status }: { status: ArticleStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
        STATUS_COLORS[status] ?? "bg-gray-100 text-gray-500"
      }`}
    >
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Skeleton
// ---------------------------------------------------------------------------
function TableSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-4 space-y-3 animate-pulse">
        <div className="h-10 bg-gray-100 rounded-lg" />
        <div className="h-8 bg-gray-50 rounded" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-12 bg-gray-50 rounded" />
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
const ALL_STATUSES: (ArticleStatus | "all")[] = [
  "all",
  "produced",
  "published",
  "monitored",
  "refresh_needed",
];

const ALL_HEALTH: (HealthStatus | "all")[] = [
  "all",
  "green",
  "yellow",
  "red",
];

const HEALTH_LABELS: Record<string, string> = {
  all: "All",
  green: "Healthy",
  yellow: "Warning",
  red: "Critical",
};

export default function ArticleTable() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ArticleStatus | "all">(
    "all"
  );
  const [healthFilter, setHealthFilter] = useState<HealthStatus | "all">(
    "all"
  );

  // Sort
  const [sortKey, setSortKey] = useState<SortKey>("scorecard_score");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    fetch("/api/articles")
      .then(async (res) => {
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error ?? `HTTP ${res.status}`);
        }
        return res.json();
      })
      .then((data: Article[]) => {
        setArticles(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const filtered = useMemo(() => {
    let result = [...articles];

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.target_keyword.toLowerCase().includes(q)
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      result = result.filter((a) => a.status === statusFilter);
    }

    // Health filter
    if (healthFilter !== "all") {
      result = result.filter((a) => a.health_status === healthFilter);
    }

    // Sort
    result.sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];

      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;

      let cmp: number;
      if (typeof aVal === "string" && typeof bVal === "string") {
        cmp = aVal.localeCompare(bVal);
      } else {
        cmp = (aVal as number) - (bVal as number);
      }

      return sortDir === "asc" ? cmp : -cmp;
    });

    return result;
  }, [articles, search, statusFilter, healthFilter, sortKey, sortDir]);

  if (loading) return <TableSkeleton />;

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
        Failed to load articles: {error}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Toolbar */}
      <div className="p-4 border-b border-gray-100 space-y-3">
        {/* Search */}
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search by title or keyword..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-mh-pink/30 focus:border-mh-pink transition-colors"
          />
        </div>

        {/* Filter chips */}
        <div className="flex flex-wrap gap-2">
          <span className="text-xs text-gray-400 self-center mr-1">
            Status:
          </span>
          {ALL_STATUSES.map((s) => (
            <Chip
              key={s}
              label={s === "all" ? "All" : STATUS_LABELS[s] ?? s}
              active={statusFilter === s}
              onClick={() => setStatusFilter(s)}
            />
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="text-xs text-gray-400 self-center mr-1">
            Health:
          </span>
          {ALL_HEALTH.map((h) => (
            <Chip
              key={h}
              label={HEALTH_LABELS[h] ?? h}
              active={healthFilter === h}
              onClick={() => setHealthFilter(h)}
            />
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-mh-gray">
            <tr>
              <SortHeader label="Title" sortKey="title" currentSort={sortKey} currentDir={sortDir} onSort={handleSort} />
              <SortHeader label="Target Keyword" sortKey="target_keyword" currentSort={sortKey} currentDir={sortDir} onSort={handleSort} />
              <SortHeader label="Score" sortKey="scorecard_score" currentSort={sortKey} currentDir={sortDir} onSort={handleSort} />
              <SortHeader label="Words" sortKey="word_count" currentSort={sortKey} currentDir={sortDir} onSort={handleSort} />
              <SortHeader label="Status" sortKey="status" currentSort={sortKey} currentDir={sortDir} onSort={handleSort} />
              <SortHeader label="Sessions (30d)" sortKey="organic_sessions_30d" currentSort={sortKey} currentDir={sortDir} onSort={handleSort} />
              <SortHeader label="Avg Position" sortKey="avg_position_30d" currentSort={sortKey} currentDir={sortDir} onSort={handleSort} />
              <SortHeader label="Health" sortKey="health_status" currentSort={sortKey} currentDir={sortDir} onSort={handleSort} />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="px-4 py-12 text-center text-gray-400"
                >
                  {articles.length === 0
                    ? "No articles yet. Run the article machine to get started."
                    : "No articles match your filters."}
                </td>
              </tr>
            ) : (
              filtered.map((article) => (
                <tr
                  key={article.slug}
                  className="hover:bg-mh-gray/50 transition-colors"
                >
                  {/* Title */}
                  <td className="px-4 py-3 max-w-xs">
                    {article.published_url ? (
                      <a
                        href={article.published_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-mh-black font-medium hover:text-mh-pink transition-colors truncate block"
                        title={article.title}
                      >
                        {article.title}
                      </a>
                    ) : (
                      <span
                        className="text-mh-black font-medium truncate block"
                        title={article.title}
                      >
                        {article.title}
                      </span>
                    )}
                  </td>

                  {/* Target Keyword */}
                  <td className="px-4 py-3 text-gray-600 max-w-[160px] truncate">
                    {article.target_keyword}
                  </td>

                  {/* Score */}
                  <td className="px-4 py-3">
                    <ScoreCell score={article.scorecard_score} />
                  </td>

                  {/* Word Count */}
                  <td className="px-4 py-3 text-gray-600">
                    {article.word_count?.toLocaleString() ?? "--"}
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3">
                    <StatusBadge status={article.status} />
                  </td>

                  {/* Sessions */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-700">
                        {article.organic_sessions_30d?.toLocaleString() ?? "--"}
                      </span>
                      <TrendArrow trend={article.sessions_trend} />
                    </div>
                  </td>

                  {/* Avg Position */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-700">
                        {article.avg_position_30d != null
                          ? article.avg_position_30d.toFixed(1)
                          : "--"}
                      </span>
                      <TrendArrow trend={article.position_trend} />
                    </div>
                  </td>

                  {/* Health */}
                  <td className="px-4 py-3">
                    <HealthBadge status={article.health_status} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-gray-100 text-xs text-gray-400 flex justify-between">
        <span>
          {filtered.length} of {articles.length} articles
        </span>
        {articles.length > 0 && (
          <span>
            Sorted by {sortKey.replace(/_/g, " ")} ({sortDir})
          </span>
        )}
      </div>
    </div>
  );
}
