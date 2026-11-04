"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import Header from "@/components/Header";
import HealthBadge from "@/components/HealthBadge";
import type { Article, ArticleStatus } from "@/lib/types";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const STATUS_OPTIONS: ArticleStatus[] = [
  "produced",
  "published",
  "monitored",
  "refresh_needed",
  "retired",
];

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

// ---------------------------------------------------------------------------
// StatusBadge
// ---------------------------------------------------------------------------

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
// ScoreCell
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
// Collapsible section
// ---------------------------------------------------------------------------

function CollapsibleSection({
  title,
  defaultOpen = false,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-sm font-semibold text-mh-black hover:bg-mh-gray/50 transition-colors"
      >
        {title}
        <svg
          className={`h-4 w-4 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>
      {open && <div className="px-5 pb-5 border-t border-gray-100">{children}</div>}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Inline editing
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [editFields, setEditFields] = useState<{
    published_url: string;
    published_date: string;
    status: ArticleStatus;
  }>({ published_url: "", published_date: "", status: "produced" });
  const [saving, setSaving] = useState(false);

  // Bulk register
  const [registerSlug, setRegisterSlug] = useState("");
  const [registerUrl, setRegisterUrl] = useState("");
  const [registerDate, setRegisterDate] = useState("");
  const [registering, setRegistering] = useState(false);

  // Add article
  const [addSlug, setAddSlug] = useState("");
  const [addTitle, setAddTitle] = useState("");
  const [addKeyword, setAddKeyword] = useState("");
  const [addScore, setAddScore] = useState("");
  const [addWordCount, setAddWordCount] = useState("");
  const [addContentType, setAddContentType] = useState("");
  const [adding, setAdding] = useState(false);

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ArticleStatus | "all">("all");

  // Feedback
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const fetchArticles = useCallback(async () => {
    try {
      const res = await fetch("/api/articles");
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? `HTTP ${res.status}`);
      }
      const data: Article[] = await res.json();
      setArticles(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const showFeedback = (type: "success" | "error", message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 4000);
  };

  // Filtered articles
  const filtered = useMemo(() => {
    let result = [...articles];
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.target_keyword.toLowerCase().includes(q) ||
          a.slug.toLowerCase().includes(q)
      );
    }
    if (statusFilter !== "all") {
      result = result.filter((a) => a.status === statusFilter);
    }
    return result;
  }, [articles, search, statusFilter]);

  // Produced articles (for bulk register dropdown)
  const producedArticles = useMemo(
    () => articles.filter((a) => a.status === "produced"),
    [articles]
  );

  // --- Inline edit handlers ---
  const startEdit = (article: Article) => {
    setEditingSlug(article.slug);
    setEditFields({
      published_url: article.published_url ?? "",
      published_date: article.published_date ?? "",
      status: article.status,
    });
  };

  const cancelEdit = () => {
    setEditingSlug(null);
  };

  const saveEdit = async () => {
    if (!editingSlug) return;
    setSaving(true);
    try {
      const res = await fetch("/api/articles", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: editingSlug,
          published_url: editFields.published_url || null,
          published_date: editFields.published_date || null,
          status: editFields.status,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? `HTTP ${res.status}`);
      }
      setEditingSlug(null);
      showFeedback("success", "Article updated.");
      await fetchArticles();
    } catch (err) {
      showFeedback("error", err instanceof Error ? err.message : "Update failed");
    } finally {
      setSaving(false);
    }
  };

  // --- Bulk register ---
  const handleRegister = async () => {
    if (!registerSlug || !registerUrl) return;
    setRegistering(true);
    try {
      const res = await fetch("/api/articles", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: registerSlug,
          published_url: registerUrl,
          published_date: registerDate || null,
          status: "published",
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? `HTTP ${res.status}`);
      }
      setRegisterSlug("");
      setRegisterUrl("");
      setRegisterDate("");
      showFeedback("success", "Article registered as published.");
      await fetchArticles();
    } catch (err) {
      showFeedback("error", err instanceof Error ? err.message : "Register failed");
    } finally {
      setRegistering(false);
    }
  };

  // --- Add article ---
  const handleAdd = async () => {
    if (!addSlug || !addTitle || !addKeyword) return;
    setAdding(true);
    try {
      const res = await fetch("/api/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: addSlug,
          title: addTitle,
          target_keyword: addKeyword,
          scorecard_score: addScore ? Number(addScore) : undefined,
          word_count: addWordCount ? Number(addWordCount) : undefined,
          content_type: addContentType || undefined,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? `HTTP ${res.status}`);
      }
      setAddSlug("");
      setAddTitle("");
      setAddKeyword("");
      setAddScore("");
      setAddWordCount("");
      setAddContentType("");
      showFeedback("success", "Article added.");
      await fetchArticles();
    } catch (err) {
      showFeedback("error", err instanceof Error ? err.message : "Add failed");
    } finally {
      setAdding(false);
    }
  };

  return (
    <>
      <Header />
      <div className="h-16" />

      <main className="flex-1 w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Page title */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-mh-black">Article Manager</h1>
          <p className="text-sm text-gray-500 mt-1">
            Register published URLs, update article status, and manage the article lifecycle.
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

        {/* Bulk Register */}
        <section className="mb-6">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h2 className="text-sm font-semibold text-mh-black mb-3">Register Published URL</h2>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <select
                value={registerSlug}
                onChange={(e) => setRegisterSlug(e.target.value)}
                className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-mh-pink/30 focus:border-mh-pink"
              >
                <option value="">Select produced article...</option>
                {producedArticles.map((a) => (
                  <option key={a.slug} value={a.slug}>
                    {a.title}
                  </option>
                ))}
              </select>
              <input
                type="url"
                placeholder="https://marketerhire.com/blog/..."
                value={registerUrl}
                onChange={(e) => setRegisterUrl(e.target.value)}
                className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-mh-pink/30 focus:border-mh-pink"
              />
              <input
                type="date"
                value={registerDate}
                onChange={(e) => setRegisterDate(e.target.value)}
                className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-mh-pink/30 focus:border-mh-pink"
              />
              <button
                type="button"
                onClick={handleRegister}
                disabled={!registerSlug || !registerUrl || registering}
                className="px-4 py-2 text-sm font-medium text-white bg-mh-pink rounded-lg hover:bg-mh-pink/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {registering ? "Registering..." : "Register"}
              </button>
            </div>
          </div>
        </section>

        {/* Add Article (collapsible) */}
        <section className="mb-6">
          <CollapsibleSection title="Add Article Manually">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
              <input
                type="text"
                placeholder="slug (e.g. best-marketing-tools)"
                value={addSlug}
                onChange={(e) => setAddSlug(e.target.value)}
                className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-mh-pink/30 focus:border-mh-pink"
              />
              <input
                type="text"
                placeholder="Title"
                value={addTitle}
                onChange={(e) => setAddTitle(e.target.value)}
                className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-mh-pink/30 focus:border-mh-pink"
              />
              <input
                type="text"
                placeholder="Target keyword"
                value={addKeyword}
                onChange={(e) => setAddKeyword(e.target.value)}
                className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-mh-pink/30 focus:border-mh-pink"
              />
              <input
                type="number"
                placeholder="Scorecard score (0-25)"
                value={addScore}
                onChange={(e) => setAddScore(e.target.value)}
                className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-mh-pink/30 focus:border-mh-pink"
              />
              <input
                type="number"
                placeholder="Word count"
                value={addWordCount}
                onChange={(e) => setAddWordCount(e.target.value)}
                className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-mh-pink/30 focus:border-mh-pink"
              />
              <input
                type="text"
                placeholder="Content type (e.g. pillar, cluster)"
                value={addContentType}
                onChange={(e) => setAddContentType(e.target.value)}
                className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-mh-pink/30 focus:border-mh-pink"
              />
            </div>
            <div className="mt-3">
              <button
                type="button"
                onClick={handleAdd}
                disabled={!addSlug || !addTitle || !addKeyword || adding}
                className="px-4 py-2 text-sm font-medium text-white bg-mh-pink rounded-lg hover:bg-mh-pink/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {adding ? "Adding..." : "Add Article"}
              </button>
            </div>
          </CollapsibleSection>
        </section>

        {/* Article table */}
        <section>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Toolbar */}
            <div className="p-4 border-b border-gray-100 space-y-3">
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
                  placeholder="Search by title, keyword, or slug..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-mh-pink/30 focus:border-mh-pink transition-colors"
                />
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

            {/* Loading / Error */}
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
                Failed to load articles: {error}
              </div>
            )}

            {!loading && !error && (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-mh-gray">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Title
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Keyword
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Score
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Published URL
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Published Date
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Health
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {filtered.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="px-4 py-12 text-center text-gray-400">
                            {articles.length === 0
                              ? "No articles yet."
                              : "No articles match your filters."}
                          </td>
                        </tr>
                      ) : (
                        filtered.map((article) => {
                          const isEditing = editingSlug === article.slug;
                          return (
                            <tr key={article.slug} className="hover:bg-mh-gray/50 transition-colors">
                              {/* Title */}
                              <td className="px-4 py-3 max-w-xs">
                                <span className="text-mh-black font-medium truncate block" title={article.title}>
                                  {article.title}
                                </span>
                                <span className="text-xs text-gray-400">{article.slug}</span>
                              </td>

                              {/* Keyword */}
                              <td className="px-4 py-3 text-gray-600 max-w-[140px] truncate">
                                {article.target_keyword}
                              </td>

                              {/* Score */}
                              <td className="px-4 py-3">
                                <ScoreCell score={article.scorecard_score} />
                              </td>

                              {/* Status */}
                              <td className="px-4 py-3">
                                {isEditing ? (
                                  <select
                                    value={editFields.status}
                                    onChange={(e) =>
                                      setEditFields({ ...editFields, status: e.target.value as ArticleStatus })
                                    }
                                    className="px-2 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-mh-pink/30"
                                  >
                                    {STATUS_OPTIONS.map((s) => (
                                      <option key={s} value={s}>
                                        {STATUS_LABELS[s]}
                                      </option>
                                    ))}
                                  </select>
                                ) : (
                                  <StatusBadge status={article.status} />
                                )}
                              </td>

                              {/* Published URL */}
                              <td className="px-4 py-3 max-w-[180px]">
                                {isEditing ? (
                                  <input
                                    type="url"
                                    value={editFields.published_url}
                                    onChange={(e) =>
                                      setEditFields({ ...editFields, published_url: e.target.value })
                                    }
                                    className="w-full px-2 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-mh-pink/30"
                                    placeholder="https://..."
                                  />
                                ) : article.published_url ? (
                                  <a
                                    href={article.published_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-mh-pink hover:underline truncate block"
                                  >
                                    {article.published_url.replace(/^https?:\/\/(www\.)?/, "")}
                                  </a>
                                ) : (
                                  <span className="text-xs text-gray-400">--</span>
                                )}
                              </td>

                              {/* Published Date */}
                              <td className="px-4 py-3">
                                {isEditing ? (
                                  <input
                                    type="date"
                                    value={editFields.published_date}
                                    onChange={(e) =>
                                      setEditFields({ ...editFields, published_date: e.target.value })
                                    }
                                    className="px-2 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-mh-pink/30"
                                  />
                                ) : (
                                  <span className="text-xs text-gray-600">
                                    {article.published_date ?? "--"}
                                  </span>
                                )}
                              </td>

                              {/* Health */}
                              <td className="px-4 py-3">
                                <HealthBadge status={article.health_status} />
                              </td>

                              {/* Actions */}
                              <td className="px-4 py-3">
                                {isEditing ? (
                                  <div className="flex items-center gap-2">
                                    <button
                                      type="button"
                                      onClick={saveEdit}
                                      disabled={saving}
                                      className="px-3 py-1 text-xs font-medium text-white bg-mh-pink rounded hover:bg-mh-pink/90 disabled:opacity-50 transition-colors"
                                    >
                                      {saving ? "..." : "Save"}
                                    </button>
                                    <button
                                      type="button"
                                      onClick={cancelEdit}
                                      className="px-3 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => startEdit(article)}
                                    className="p-1.5 text-gray-400 hover:text-mh-pink rounded hover:bg-mh-gray transition-colors"
                                    title="Edit article"
                                  >
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                                      />
                                    </svg>
                                  </button>
                                )}
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Footer */}
                <div className="px-4 py-3 border-t border-gray-100 text-xs text-gray-400 flex justify-between">
                  <span>
                    {filtered.length} of {articles.length} articles
                  </span>
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
