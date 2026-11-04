"use client";

import { useEffect, useState, useCallback } from "react";
import type { ActivityDay, ActivityEventType } from "@/lib/types";

// ---------------------------------------------------------------------------
// Event type config — icon, color, label
// ---------------------------------------------------------------------------

const EVENT_CONFIG: Record<
  ActivityEventType,
  { dot: string; bg: string; label: string }
> = {
  keywords_researched: {
    dot: "bg-blue-400",
    bg: "bg-blue-50",
    label: "Research",
  },
  keywords_selected: {
    dot: "bg-indigo-500",
    bg: "bg-indigo-50",
    label: "Selected",
  },
  article_produced: {
    dot: "bg-mh-pink",
    bg: "bg-pink-50",
    label: "Produced",
  },
  article_published: {
    dot: "bg-mh-green",
    bg: "bg-green-50",
    label: "Published",
  },
  audit_completed: {
    dot: "bg-mh-teal",
    bg: "bg-teal-50",
    label: "Audit",
  },
};

// ---------------------------------------------------------------------------
// Date formatting helpers
// ---------------------------------------------------------------------------

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T12:00:00"); // avoid timezone shift
  const now = new Date();
  const today = now.toISOString().slice(0, 10);
  const yesterday = new Date(now.getTime() - 86400000)
    .toISOString()
    .slice(0, 10);

  if (dateStr === today) return "Today";
  if (dateStr === yesterday) return "Yesterday";

  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function formatFullDate(dateStr: string): string {
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function ActivityTimeline() {
  const [open, setOpen] = useState(false);
  const [days, setDays] = useState<ActivityDay[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchActivity = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/activity");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: ActivityDay[] = await res.json();
      setDays(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch on open
  useEffect(() => {
    if (open) fetchActivity();
  }, [open, fetchActivity]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open]);

  // Total event count for badge
  const totalEvents = days.reduce((s, d) => s + d.events.length, 0);

  return (
    <>
      {/* ── Toggle button (fixed in header area) ── */}
      <button
        onClick={() => setOpen(!open)}
        className={`
          fixed top-3 right-4 z-[60] flex items-center gap-1.5
          px-3 py-2 text-xs font-medium rounded-lg
          border transition-all duration-200 cursor-pointer
          ${
            open
              ? "bg-mh-pink text-white border-mh-pink shadow-md"
              : "bg-white text-gray-600 border-gray-200 hover:border-mh-pink hover:text-mh-pink shadow-sm"
          }
        `}
        aria-label="Toggle activity timeline"
      >
        {/* Calendar icon */}
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
          />
        </svg>
        <span className="hidden sm:inline">Activity</span>
        {totalEvents > 0 && !open && (
          <span className="ml-0.5 min-w-[18px] h-[18px] flex items-center justify-center text-[10px] font-bold bg-mh-pink text-white rounded-full">
            {totalEvents}
          </span>
        )}
      </button>

      {/* ── Backdrop ── */}
      {open && (
        <div
          className="fixed inset-0 z-[55] bg-black/20 transition-opacity duration-200"
          onClick={() => setOpen(false)}
        />
      )}

      {/* ── Slide-out panel ── */}
      <aside
        className={`
          fixed top-0 right-0 z-[58] h-full w-[340px] max-w-[90vw]
          bg-white border-l border-gray-200 shadow-xl
          flex flex-col
          transition-transform duration-300 ease-in-out
          ${open ? "translate-x-0" : "translate-x-full"}
        `}
      >
        {/* Panel header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-sm font-bold text-mh-black">Activity Log</h2>
            <p className="text-[11px] text-gray-400 mt-0.5">
              Keywords, articles, audits by date
            </p>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
            aria-label="Close activity panel"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Panel body — scrollable timeline */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {loading && !days.length && (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-3 w-24 bg-gray-200 rounded mb-3" />
                  <div className="h-16 bg-gray-100 rounded-lg" />
                </div>
              ))}
            </div>
          )}

          {error && (
            <div className="text-sm text-mh-red bg-red-50 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          {!loading && !error && days.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-300 mb-2">
                <svg
                  className="w-10 h-10 mx-auto"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <p className="text-xs text-gray-400">No activity yet</p>
              <p className="text-[11px] text-gray-300 mt-1">
                Run /seo-keywords or /seo-machine to get started
              </p>
            </div>
          )}

          {days.map((day) => (
            <div key={day.date} className="mb-5 last:mb-0">
              {/* Date header */}
              <div className="flex items-center gap-2 mb-2.5">
                <span className="text-xs font-semibold text-mh-black">
                  {formatDate(day.date)}
                </span>
                <span className="text-[10px] text-gray-400">
                  {formatFullDate(day.date)}
                </span>
                <div className="flex-1 h-px bg-gray-100" />
              </div>

              {/* Events */}
              <div className="space-y-2 pl-2 border-l-2 border-gray-100 ml-1">
                {day.events.map((event, idx) => {
                  const config = EVENT_CONFIG[event.type];
                  return (
                    <div
                      key={`${event.type}-${idx}`}
                      className={`
                        relative pl-4 py-2 px-3 rounded-lg
                        ${config.bg}
                        transition-colors
                      `}
                    >
                      {/* Timeline dot */}
                      <div
                        className={`
                          absolute -left-[7px] top-3 w-3 h-3 rounded-full
                          border-2 border-white
                          ${config.dot}
                        `}
                      />

                      {/* Badge + title */}
                      <div className="flex items-start gap-2">
                        <span
                          className={`
                            shrink-0 mt-0.5 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide rounded
                            ${config.dot} text-white
                          `}
                        >
                          {config.label}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-medium text-mh-black leading-snug">
                            {event.title}
                          </p>
                          {event.detail && (
                            <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">
                              {event.detail}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Panel footer */}
        <div className="px-4 py-3 border-t border-gray-100 bg-mh-gray">
          <p className="text-[10px] text-gray-400 text-center">
            Events from keywords, articles & audits
          </p>
        </div>
      </aside>
    </>
  );
}
