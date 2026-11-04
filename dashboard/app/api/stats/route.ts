import { createServerClient } from "@/lib/supabase";
import type { ArticleStatus, KeywordStatus, SummaryStats } from "@/lib/types";

// GET /api/stats — computed summary statistics across all SEO tables
export async function GET() {
  try {
    const supabase = createServerClient();

    // Run queries in parallel for speed
    const [articlesResult, keywordsResult, latestAuditResult] =
      await Promise.all([
        // All articles
        supabase
          .from("seo_articles")
          .select("status, scorecard_score, organic_sessions_30d, health_status"),

        // All keywords (just need count and statuses)
        supabase.from("seo_keywords").select("status, article_slug"),

        // Latest audit snapshot
        supabase
          .from("seo_audit_snapshots")
          .select("audit_date, quick_wins_count")
          .order("audit_date", { ascending: false })
          .limit(1)
          .single(),
      ]);

    if (articlesResult.error) {
      return Response.json(
        { error: `articles query: ${articlesResult.error.message}` },
        { status: 500 }
      );
    }

    if (keywordsResult.error) {
      return Response.json(
        { error: `keywords query: ${keywordsResult.error.message}` },
        { status: 500 }
      );
    }

    const articles = articlesResult.data ?? [];
    const keywords = keywordsResult.data ?? [];

    // --- Total articles ---
    const total_articles = articles.length;

    // --- Articles by status ---
    const articles_by_status: Record<string, number> = {};
    for (const a of articles) {
      const s = a.status ?? "unknown";
      articles_by_status[s] = (articles_by_status[s] ?? 0) + 1;
    }

    // --- Average scorecard score ---
    const scores = articles
      .map((a) => a.scorecard_score)
      .filter((s): s is number => s !== null && s !== undefined);
    const avg_scorecard_score =
      scores.length > 0
        ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10
        : null;

    // --- Total organic sessions 30d ---
    const total_organic_sessions_30d = articles.reduce(
      (sum, a) => sum + (a.organic_sessions_30d ?? 0),
      0
    );

    // --- Articles needing attention (health yellow or red) ---
    const articles_needing_attention = articles.filter(
      (a) => a.health_status === "yellow" || a.health_status === "red"
    ).length;

    // --- Keywords by status ---
    const total_keywords = keywords.length;
    const keywords_by_status: Record<string, number> = {};
    for (const k of keywords) {
      const s = k.status ?? "unknown";
      keywords_by_status[s] = (keywords_by_status[s] ?? 0) + 1;
    }

    // --- Keyword coverage % ---
    // articles with status != retired / total keywords
    const activeArticles = articles.filter(
      (a) => a.status !== "retired"
    ).length;
    const keyword_coverage_pct =
      total_keywords > 0
        ? Math.round((activeArticles / total_keywords) * 1000) / 10
        : null;

    // --- Quick wins and latest audit date from audit snapshot ---
    const latestAudit = latestAuditResult.data;
    const quick_wins_count = latestAudit?.quick_wins_count ?? null;
    const latest_audit_date = latestAudit?.audit_date ?? null;

    const stats: SummaryStats = {
      total_articles,
      articles_by_status: articles_by_status as Record<ArticleStatus, number>,
      avg_scorecard_score,
      total_organic_sessions_30d,
      articles_needing_attention,
      keyword_coverage_pct,
      quick_wins_count,
      latest_audit_date,
      total_keywords,
      keywords_by_status: keywords_by_status as Record<KeywordStatus, number>,
    };

    return Response.json(stats);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
}
