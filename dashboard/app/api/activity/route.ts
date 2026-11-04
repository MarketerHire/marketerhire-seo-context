import { createServerClient } from "@/lib/supabase";
import type { ActivityEvent, ActivityDay } from "@/lib/types";

// GET /api/activity — aggregate timeline from all SEO tables
export async function GET() {
  try {
    const supabase = createServerClient();

    const [articlesResult, keywordsResult, auditsResult] = await Promise.all([
      supabase
        .from("seo_articles")
        .select("slug, title, status, target_keyword, produced_date, published_date, batch_id, scorecard_score, health_status")
        .order("produced_date", { ascending: false }),

      supabase
        .from("seo_keywords")
        .select("keyword, status, composite_score, created_at")
        .order("created_at", { ascending: false }),

      supabase
        .from("seo_audit_snapshots")
        .select("audit_date, total_articles, articles_healthy, articles_warning, articles_critical, total_organic_sessions_30d, quick_wins_count")
        .order("audit_date", { ascending: false }),
    ]);

    if (articlesResult.error) {
      return Response.json({ error: articlesResult.error.message }, { status: 500 });
    }
    if (keywordsResult.error) {
      return Response.json({ error: keywordsResult.error.message }, { status: 500 });
    }
    // audit may be empty — not an error
    const articles = articlesResult.data ?? [];
    const keywords = keywordsResult.data ?? [];
    const audits = auditsResult.data ?? [];

    const events: ActivityEvent[] = [];

    // --- Article produced events (group by produced_date + batch_id) ---
    const prodGroups = new Map<string, typeof articles>();
    for (const a of articles) {
      if (!a.produced_date) continue;
      const key = `${a.produced_date}|${a.batch_id ?? "manual"}`;
      const list = prodGroups.get(key) ?? [];
      list.push(a);
      prodGroups.set(key, list);
    }
    for (const [key, group] of prodGroups) {
      const [date] = key.split("|");
      const batchId = group[0].batch_id;
      const avgScore = group.reduce((s, a) => s + (a.scorecard_score ?? 0), 0) / group.length;
      events.push({
        type: "article_produced",
        date,
        title: group.length === 1
          ? `Article produced: ${group[0].title}`
          : `${group.length} articles produced`,
        detail: group.length === 1
          ? `"${group[0].target_keyword}" — score ${group[0].scorecard_score ?? "?"}/25`
          : `${batchId ? `Batch ${batchId}` : "Manual"} — avg score ${Math.round(avgScore * 10) / 10}/25. ${group.map(a => a.title).join(", ")}`,
        count: group.length,
      });
    }

    // --- Article published events ---
    for (const a of articles) {
      if (!a.published_date) continue;
      events.push({
        type: "article_published",
        date: a.published_date,
        title: `Published: ${a.title}`,
        detail: `"${a.target_keyword}" went live`,
      });
    }

    // --- Keyword events (group by date + status) ---
    const kwGroups = new Map<string, typeof keywords>();
    for (const k of keywords) {
      if (!k.created_at) continue;
      const date = k.created_at.slice(0, 10); // YYYY-MM-DD
      const key = `${date}|${k.status}`;
      const list = kwGroups.get(key) ?? [];
      list.push(k);
      kwGroups.set(key, list);
    }
    for (const [key, group] of kwGroups) {
      const [date, status] = key.split("|");
      if (status === "selected" || status === "in_production" || status === "produced" || status === "published") {
        events.push({
          type: "keywords_selected",
          date,
          title: group.length === 1
            ? `Keyword selected: "${group[0].keyword}"`
            : `${group.length} keywords selected`,
          detail: group.length <= 5
            ? group.map(k => `"${k.keyword}" (score ${k.composite_score ?? "?"})`).join(", ")
            : `${group.slice(0, 3).map(k => `"${k.keyword}"`).join(", ")} + ${group.length - 3} more`,
          count: group.length,
        });
      } else {
        events.push({
          type: "keywords_researched",
          date,
          title: group.length === 1
            ? `Keyword researched: "${group[0].keyword}"`
            : `${group.length} keywords researched`,
          detail: group.length <= 5
            ? group.map(k => `"${k.keyword}"`).join(", ")
            : `Top: ${group.slice(0, 3).map(k => `"${k.keyword}"`).join(", ")} + ${group.length - 3} more`,
          count: group.length,
        });
      }
    }

    // --- Audit events ---
    for (const a of audits) {
      events.push({
        type: "audit_completed",
        date: a.audit_date,
        title: "SEO audit completed",
        detail: `${a.total_articles} articles — ${a.articles_healthy} healthy, ${a.articles_warning} warning, ${a.articles_critical} critical${a.total_organic_sessions_30d ? ` — ${a.total_organic_sessions_30d.toLocaleString()} sessions (30d)` : ""}${a.quick_wins_count ? ` — ${a.quick_wins_count} quick wins` : ""}`,
      });
    }

    // --- Group by date, sort descending ---
    const dayMap = new Map<string, ActivityEvent[]>();
    for (const e of events) {
      const list = dayMap.get(e.date) ?? [];
      list.push(e);
      dayMap.set(e.date, list);
    }

    const days: ActivityDay[] = Array.from(dayMap.entries())
      .sort(([a], [b]) => b.localeCompare(a))
      .map(([date, dayEvents]) => ({
        date,
        events: dayEvents.sort((a, b) => {
          // Sort within day: audits first, then published, produced, keywords
          const order: Record<string, number> = {
            audit_completed: 0,
            article_published: 1,
            article_produced: 2,
            keywords_selected: 3,
            keywords_researched: 4,
          };
          return (order[a.type] ?? 5) - (order[b.type] ?? 5);
        }),
      }));

    return Response.json(days);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
}
