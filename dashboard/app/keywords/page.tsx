"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import Header from "@/components/Header";
import type { Keyword, KeywordStatus, CannibalizationRisk } from "@/lib/types";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const STATUS_OPTIONS: KeywordStatus[] = [
  "universe",
  "selected",
  "in_production",
  "produced",
  "published",
];

const STATUS_LABELS: Record<KeywordStatus, string> = {
  universe: "Universe",
  selected: "Selected",
  in_production: "In Production",
  produced: "Produced",
  published: "Published",
};

const STATUS_COLORS: Record<KeywordStatus, string> = {
  universe: "bg-gray-100 text-gray-600",
  selected: "bg-mh-pink/10 text-mh-pink",
  in_production: "bg-blue-50 text-blue-700",
  produced: "bg-violet-50 text-violet-700",
  published: "bg-emerald-50 text-emerald-700",
};

// ---------------------------------------------------------------------------
// Sortable column header
// ---------------------------------------------------------------------------

type SortKey =
  | "keyword"
  | "composite_score"
  | "search_volume"
  | "keyword_difficulty"
  | "cpc"
  | "status";

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
          <svg
            className="h-3 w-3"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
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
// Score breakdown tooltip
// ---------------------------------------------------------------------------

function ScoreBreakdown({ keyword }: { keyword: Keyword }) {
  const [open, setOpen] = useState(false);

  if (keyword.composite_score == null) {
    return <span className="text-gray-400">--</span>;
  }

  const scoreColor =
    keyword.composite_score >= 70
      ? "text-emerald-600 font-semibold"
      : keyword.composite_score >= 40
      ? "text-amber-600 font-semibold"
      : "text-red-600 font-semibold";

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`${scoreColor} hover:underline cursor-pointer`}
      >
        {keyword.composite_score.toFixed(1)}
      </button>
      {open && (
        <div className="absolute z-20 top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-xs min-w-[180px]">
          <div className="space-y-1.5">
            <div className="flex justify-between">
              <span className="text-gray-500">Business Value</span>
              <span className="font-medium">{keyword.business_value ?? "--"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Opportunity</span>
              <span className="font-medium">{keyword.opportunity ?? "--"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Difficulty Inv</span>
              <span className="font-medium">{keyword.difficulty_inv ?? "--"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Relevance</span>
              <span className="font-medium">{keyword.relevance ?? "--"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Content Gap</span>
              <span className="font-medium">{keyword.content_gap ?? "--"}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="mt-2 text-gray-400 hover:text-gray-600 text-xs"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Cannibalization badge
// ---------------------------------------------------------------------------

const RISK_CONFIG: Record<
  CannibalizationRisk,
  { label: string; color: string; icon: string }
> = {
  none: { label: "Clear", color: "bg-emerald-50 text-emerald-700", icon: "" },
  low: { label: "Low", color: "bg-blue-50 text-blue-600", icon: "" },
  medium: { label: "Medium", color: "bg-amber-50 text-amber-700", icon: "" },
  high: { label: "High", color: "bg-orange-50 text-orange-700", icon: "" },
  critical: { label: "Critical", color: "bg-red-50 text-red-700", icon: "" },
};

function CannibalizationBadge({ keyword }: { keyword: Keyword }) {
  const [open, setOpen] = useState(false);
  const risk = keyword.cannibalization_risk;

  if (!risk || risk === "none") {
    return <span className="text-gray-300 text-xs">--</span>;
  }

  const config = RISK_CONFIG[risk];

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold cursor-pointer ${config.color}`}
      >
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
        {config.label}
      </button>
      {open && (
        <div className="absolute z-20 top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-xs min-w-[260px] max-w-[340px]">
          <div className="space-y-2">
            <div>
              <span className="text-gray-500">Risk Level:</span>{" "}
              <span className={`font-semibold ${risk === "critical" ? "text-red-600" : risk === "high" ? "text-orange-600" : "text-amber-600"}`}>
                {config.label}
              </span>
            </div>
            {keyword.cannibalization_url && (
              <div>
                <span className="text-gray-500">Existing page:</span>
                <a
                  href={keyword.cannibalization_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-mh-pink hover:underline truncate mt-0.5"
                >
                  {keyword.cannibalization_url.replace(/^https?:\/\/(www\.)?/, "")}
                </a>
              </div>
            )}
            {keyword.cannibalization_note && (
              <div>
                <span className="text-gray-500">Note:</span>
                <p className="text-gray-700 mt-0.5 leading-relaxed">{keyword.cannibalization_note}</p>
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="mt-2 text-gray-400 hover:text-gray-600 text-xs cursor-pointer"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------

export default function KeywordsPage() {
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<KeywordStatus | "all">("all");

  // Sort
  const [sortKey, setSortKey] = useState<SortKey>("composite_score");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  // Batch selection
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [batchUpdating, setBatchUpdating] = useState(false);

  // Add keyword
  const [addKeyword, setAddKeyword] = useState("");
  const [addVolume, setAddVolume] = useState("");
  const [addDifficulty, setAddDifficulty] = useState("");
  const [addCpc, setAddCpc] = useState("");
  const [adding, setAdding] = useState(false);

  // Cannibalization actions
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Feedback
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const fetchKeywords = useCallback(async () => {
    try {
      const res = await fetch("/api/keywords");
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? `HTTP ${res.status}`);
      }
      const data: Keyword[] = await res.json();
      setKeywords(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchKeywords();
  }, [fetchKeywords]);

  const showFeedback = (type: "success" | "error", message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  // Filtered + sorted keywords
  const filtered = useMemo(() => {
    let result = [...keywords];
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((k) => k.keyword.toLowerCase().includes(q));
    }
    if (statusFilter !== "all") {
      result = result.filter((k) => k.status === statusFilter);
    }
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
  }, [keywords, search, statusFilter, sortKey, sortDir]);

  // Stats
  const stats = useMemo(() => {
    const total = keywords.length;
    const selectedCount = keywords.filter((k) => k.status === "selected").length;
    const producedCount = keywords.filter((k) => k.status === "produced").length;
    const publishedCount = keywords.filter((k) => k.status === "published").length;
    const cannibalized = keywords.filter((k) => k.cannibalization_risk && k.cannibalization_risk !== "none").length;
    const coverage = total > 0 ? ((producedCount + publishedCount) / total * 100) : 0;
    return { total, selectedCount, producedCount, publishedCount, cannibalized, coverage };
  }, [keywords]);

  // Toggle selection
  const toggleSelect = (kw: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(kw)) {
        next.delete(kw);
      } else {
        next.add(kw);
      }
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selected.size === filtered.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filtered.map((k) => k.keyword)));
    }
  };

  // Batch select for next batch
  const handleBatchSelect = async () => {
    if (selected.size === 0) return;
    setBatchUpdating(true);
    try {
      const promises = Array.from(selected).map((keyword) =>
        fetch("/api/keywords", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ keyword, status: "selected" }),
        })
      );
      const results = await Promise.all(promises);
      const failed = results.filter((r) => !r.ok);
      if (failed.length > 0) {
        showFeedback("error", `${failed.length} of ${selected.size} updates failed.`);
      } else {
        showFeedback("success", `${selected.size} keywords marked as selected.`);
      }
      setSelected(new Set());
      await fetchKeywords();
    } catch (err) {
      showFeedback("error", err instanceof Error ? err.message : "Batch update failed");
    } finally {
      setBatchUpdating(false);
    }
  };

  // Add keyword
  const handleAdd = async () => {
    if (!addKeyword.trim()) return;
    setAdding(true);
    try {
      const res = await fetch("/api/keywords", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          keyword: addKeyword.trim(),
          search_volume: addVolume ? Number(addVolume) : undefined,
          keyword_difficulty: addDifficulty ? Number(addDifficulty) : undefined,
          cpc: addCpc ? Number(addCpc) : undefined,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? `HTTP ${res.status}`);
      }
      setAddKeyword("");
      setAddVolume("");
      setAddDifficulty("");
      setAddCpc("");
      showFeedback("success", "Keyword added.");
      await fetchKeywords();
    } catch (err) {
      showFeedback("error", err instanceof Error ? err.message : "Add failed");
    } finally {
      setAdding(false);
    }
  };

  // --- Cannibalization action handlers ---

  const putKeyword = async (keyword: string, updates: Record<string, unknown>) => {
    const res = await fetch("/api/keywords", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ keyword, ...updates }),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error ?? `HTTP ${res.status}`);
    }
  };

  const handleRefreshExisting = async (kw: Keyword) => {
    setActionLoading(kw.keyword);
    try {
      await putKeyword(kw.keyword, { pipeline_mode: "refresh", status: "selected" });
      showFeedback("success", `Marked for refresh: "${kw.keyword}"`);
      await fetchKeywords();
    } catch (err) {
      showFeedback("error", err instanceof Error ? err.message : "Failed");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReplace = async (kw: Keyword) => {
    const replacement = keywords
      .filter(
        (k) =>
          k.status === "universe" &&
          (!k.cannibalization_risk || k.cannibalization_risk === "none" || k.cannibalization_risk === "low") &&
          k.keyword !== kw.keyword
      )
      .sort((a, b) => (b.composite_score ?? 0) - (a.composite_score ?? 0))[0];

    if (!replacement) {
      showFeedback("error", "No uncannibalized replacement keywords available in universe.");
      return;
    }

    setActionLoading(kw.keyword);
    try {
      await putKeyword(kw.keyword, { status: "universe", pipeline_mode: null });
      await putKeyword(replacement.keyword, { status: "selected", pipeline_mode: "new" });
      showFeedback("success", `Replaced "${kw.keyword}" with "${replacement.keyword}" (score ${replacement.composite_score?.toFixed(1)})`);
      await fetchKeywords();
    } catch (err) {
      showFeedback("error", err instanceof Error ? err.message : "Replace failed");
    } finally {
      setActionLoading(null);
    }
  };

  const handleProceedAnyway = async (kw: Keyword) => {
    setActionLoading(kw.keyword);
    try {
      await putKeyword(kw.keyword, { pipeline_mode: "new", status: "selected" });
      showFeedback("success", `Override: "${kw.keyword}" will create new article`);
      await fetchKeywords();
    } catch (err) {
      showFeedback("error", err instanceof Error ? err.message : "Failed");
    } finally {
      setActionLoading(null);
    }
  };

  const handleSkip = async (kw: Keyword) => {
    setActionLoading(kw.keyword);
    try {
      await putKeyword(kw.keyword, { status: "universe", pipeline_mode: null });
      showFeedback("success", `Skipped: "${kw.keyword}" moved back to universe`);
      await fetchKeywords();
    } catch (err) {
      showFeedback("error", err instanceof Error ? err.message : "Failed");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <>
      <Header />
      <div className="h-16" />

      <main className="flex-1 w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Page title */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-mh-black">Keyword Universe</h1>
          <p className="text-sm text-gray-500 mt-1">
            View, score, and manage the keyword universe. Select keywords for the next article batch.
          </p>
        </div>

        {/* Feedback toast */}
        {feedback && (
          <div
            className={`mb-6 px-4 py-3 rounded-lg text-sm font-medium ${
              feedback.type === "success"
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            {feedback.message}
          </div>
        )}

        {/* Stats strip */}
        <section className="mb-6 grid grid-cols-2 sm:grid-cols-6 gap-3">
          {[
            { label: "Total Keywords", value: stats.total },
            { label: "Selected", value: stats.selectedCount },
            { label: "Produced", value: stats.producedCount },
            { label: "Published", value: stats.publishedCount },
            { label: "Cannibalized", value: stats.cannibalized, warn: stats.cannibalized > 0 },
            { label: "Coverage", value: `${stats.coverage.toFixed(1)}%` },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center"
            >
              <div className={`text-2xl font-bold ${"warn" in s && s.warn ? "text-orange-600" : "text-mh-black"}`}>{s.value}</div>
              <div className="text-xs text-gray-500 mt-1">{s.label}</div>
            </div>
          ))}
        </section>

        {/* Add keyword form */}
        <section className="mb-6">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h2 className="text-sm font-semibold text-mh-black mb-3">Add Keyword Manually</h2>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
              <input
                type="text"
                placeholder="Keyword (required)"
                value={addKeyword}
                onChange={(e) => setAddKeyword(e.target.value)}
                className="sm:col-span-2 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-mh-pink/30 focus:border-mh-pink"
              />
              <input
                type="number"
                placeholder="Search volume"
                value={addVolume}
                onChange={(e) => setAddVolume(e.target.value)}
                className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-mh-pink/30 focus:border-mh-pink"
              />
              <input
                type="number"
                placeholder="KD (0-100)"
                value={addDifficulty}
                onChange={(e) => setAddDifficulty(e.target.value)}
                className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-mh-pink/30 focus:border-mh-pink"
              />
              <input
                type="number"
                placeholder="CPC ($)"
                step="0.01"
                value={addCpc}
                onChange={(e) => setAddCpc(e.target.value)}
                className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-mh-pink/30 focus:border-mh-pink"
              />
            </div>
            <div className="mt-3">
              <button
                type="button"
                onClick={handleAdd}
                disabled={!addKeyword.trim() || adding}
                className="px-4 py-2 text-sm font-medium text-white bg-mh-pink rounded-lg hover:bg-mh-pink/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {adding ? "Adding..." : "Add Keyword"}
              </button>
            </div>
          </div>
        </section>

        {/* Keyword table */}
        <section>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Toolbar */}
            <div className="p-4 border-b border-gray-100 space-y-3">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
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
                    placeholder="Search keywords..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-mh-pink/30 focus:border-mh-pink transition-colors"
                  />
                </div>
                {selected.size > 0 && (
                  <button
                    type="button"
                    onClick={handleBatchSelect}
                    disabled={batchUpdating}
                    className="px-4 py-2 text-sm font-medium text-white bg-mh-teal text-mh-black rounded-lg hover:bg-mh-teal/80 disabled:opacity-50 transition-colors whitespace-nowrap"
                  >
                    {batchUpdating
                      ? "Updating..."
                      : `Select ${selected.size} for Next Batch`}
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs text-gray-400 self-center mr-1">Status:</span>
                {(["all", ...STATUS_OPTIONS] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStatusFilter(s)}
                    className={`px-3 py-1 text-xs font-medium rounded-full border transition-colors ${
                      statusFilter === s
                        ? "bg-mh-pink text-white border-mh-pink"
                        : "bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:text-mh-black"
                    }`}
                  >
                    {s === "all" ? "All" : STATUS_LABELS[s]}
                  </button>
                ))}
              </div>
            </div>

            {/* Loading */}
            {loading && (
              <div className="p-4 space-y-3 animate-pulse">
                <div className="h-10 bg-gray-100 rounded-lg" />
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-12 bg-gray-50 rounded" />
                ))}
              </div>
            )}

            {error && (
              <div className="m-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                Failed to load keywords: {error}
              </div>
            )}

            {!loading && !error && (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-mh-gray">
                      <tr>
                        <th className="px-4 py-3 w-10">
                          <input
                            type="checkbox"
                            checked={filtered.length > 0 && selected.size === filtered.length}
                            onChange={toggleSelectAll}
                            className="rounded border-gray-300 text-mh-pink focus:ring-mh-pink"
                          />
                        </th>
                        <SortHeader label="Keyword" sortKey="keyword" currentSort={sortKey} currentDir={sortDir} onSort={handleSort} />
                        <SortHeader label="Score" sortKey="composite_score" currentSort={sortKey} currentDir={sortDir} onSort={handleSort} />
                        <SortHeader label="Volume" sortKey="search_volume" currentSort={sortKey} currentDir={sortDir} onSort={handleSort} />
                        <SortHeader label="KD" sortKey="keyword_difficulty" currentSort={sortKey} currentDir={sortDir} onSort={handleSort} />
                        <SortHeader label="CPC" sortKey="cpc" currentSort={sortKey} currentDir={sortDir} onSort={handleSort} />
                        <SortHeader label="Status" sortKey="status" currentSort={sortKey} currentDir={sortDir} onSort={handleSort} />
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Cannibal.
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Article
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider min-w-[180px]">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {filtered.length === 0 ? (
                        <tr>
                          <td colSpan={10} className="px-4 py-12 text-center text-gray-400">
                            {keywords.length === 0
                              ? "No keywords yet. Add your first keyword above."
                              : "No keywords match your filters."}
                          </td>
                        </tr>
                      ) : (
                        filtered.map((kw) => (
                          <tr key={kw.keyword} className="hover:bg-mh-gray/50 transition-colors">
                            <td className="px-4 py-3">
                              <input
                                type="checkbox"
                                checked={selected.has(kw.keyword)}
                                onChange={() => toggleSelect(kw.keyword)}
                                className="rounded border-gray-300 text-mh-pink focus:ring-mh-pink"
                              />
                            </td>
                            <td className="px-4 py-3 font-medium text-mh-black max-w-[240px]">
                              <div className="flex items-center gap-1.5">
                                <span className="truncate">{kw.keyword}</span>
                                {kw.pipeline_mode === "refresh" && (
                                  <span className="shrink-0 inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-semibold bg-blue-100 text-blue-700">
                                    Refresh
                                  </span>
                                )}
                                {kw.pipeline_mode === "new" && kw.cannibalization_risk && kw.cannibalization_risk !== "none" && kw.cannibalization_risk !== "low" && (
                                  <span className="shrink-0 inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-semibold bg-gray-100 text-gray-500">
                                    Override
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <ScoreBreakdown keyword={kw} />
                            </td>
                            <td className="px-4 py-3 text-gray-600">
                              {kw.search_volume?.toLocaleString() ?? "--"}
                            </td>
                            <td className="px-4 py-3 text-gray-600">
                              {kw.keyword_difficulty ?? "--"}
                            </td>
                            <td className="px-4 py-3 text-gray-600">
                              {kw.cpc != null ? `$${kw.cpc.toFixed(2)}` : "--"}
                            </td>
                            <td className="px-4 py-3">
                              <span
                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                  STATUS_COLORS[kw.status] ?? "bg-gray-100 text-gray-500"
                                }`}
                              >
                                {STATUS_LABELS[kw.status] ?? kw.status}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <CannibalizationBadge keyword={kw} />
                            </td>
                            <td className="px-4 py-3 text-xs text-gray-500 max-w-[140px] truncate">
                              {kw.article_slug ?? "--"}
                            </td>
                            <td className="px-4 py-3">
                              {kw.status === "selected" && kw.cannibalization_risk && kw.cannibalization_risk !== "none" && kw.cannibalization_risk !== "low" && !kw.pipeline_mode ? (
                                <div className="flex flex-wrap gap-1">
                                  {kw.cannibalization_url && (
                                    <button
                                      type="button"
                                      onClick={() => handleRefreshExisting(kw)}
                                      disabled={actionLoading === kw.keyword}
                                      className="inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[11px] font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 disabled:opacity-50 transition-colors cursor-pointer"
                                    >
                                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
                                      </svg>
                                      Refresh
                                    </button>
                                  )}
                                  <button
                                    type="button"
                                    onClick={() => handleReplace(kw)}
                                    disabled={actionLoading === kw.keyword}
                                    className="inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[11px] font-medium bg-amber-50 text-amber-700 hover:bg-amber-100 disabled:opacity-50 transition-colors cursor-pointer"
                                  >
                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
                                    </svg>
                                    Replace
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleProceedAnyway(kw)}
                                    disabled={actionLoading === kw.keyword}
                                    className="inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[11px] font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50 transition-colors cursor-pointer"
                                  >
                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                    </svg>
                                    Proceed
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleSkip(kw)}
                                    disabled={actionLoading === kw.keyword}
                                    className="inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[11px] font-medium bg-red-50 text-red-600 hover:bg-red-100 disabled:opacity-50 transition-colors cursor-pointer"
                                  >
                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                    Skip
                                  </button>
                                </div>
                              ) : kw.pipeline_mode ? (
                                <span className="text-[11px] text-gray-400">
                                  {kw.pipeline_mode === "refresh" ? "Will refresh" : "Decided"}
                                </span>
                              ) : (
                                <span className="text-gray-300 text-xs">--</span>
                              )}
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
                    {filtered.length} of {keywords.length} keywords
                    {selected.size > 0 && ` (${selected.size} selected)`}
                  </span>
                  {keywords.length > 0 && (
                    <span>
                      Sorted by {sortKey.replace(/_/g, " ")} ({sortDir})
                    </span>
                  )}
                </div>
              </>
            )}
          </div>
        </section>
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
