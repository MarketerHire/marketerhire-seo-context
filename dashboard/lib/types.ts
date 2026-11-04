// ============================================================
// SEO Dashboard — Shared TypeScript Types
// Maps 1:1 to Supabase table columns
// ============================================================

// --- seo_articles ---

export type ArticleStatus =
  | "produced"
  | "published"
  | "monitored"
  | "refresh_needed"
  | "retired";

export type SessionsTrend = "up" | "down" | "flat";
export type PositionTrend = "up" | "down" | "flat";
export type HealthStatus = "green" | "yellow" | "red";

export interface Article {
  slug: string;
  title: string;
  status: ArticleStatus;
  target_keyword: string;
  secondary_keywords: string[] | null;
  scorecard_score: number | null;
  word_count: number | null;
  content_type: string | null;
  batch_id: string | null;
  produced_date: string | null;
  published_url: string | null;
  published_date: string | null;
  organic_sessions_30d: number | null;
  organic_sessions_7d: number | null;
  sessions_trend: SessionsTrend | null;
  impressions_30d: number | null;
  clicks_30d: number | null;
  ctr_30d: number | null;
  avg_position_30d: number | null;
  position_trend: PositionTrend | null;
  health_status: HealthStatus | null;
  health_reason: string | null;
  last_audit_date: string | null;
  created_at: string;
  updated_at: string;
}

// --- seo_keywords ---

export type KeywordStatus =
  | "universe"
  | "selected"
  | "in_production"
  | "produced"
  | "published";

export type CannibalizationRisk = "none" | "low" | "medium" | "high" | "critical";
export type PipelineMode = "new" | "refresh";

export interface Keyword {
  keyword: string;
  composite_score: number | null;
  business_value: number | null;
  opportunity: number | null;
  difficulty_inv: number | null;
  relevance: number | null;
  content_gap: number | null;
  search_volume: number | null;
  keyword_difficulty: number | null;
  cpc: number | null;
  status: KeywordStatus;
  article_slug: string | null;
  cannibalization_risk: CannibalizationRisk | null;
  cannibalization_url: string | null;
  cannibalization_note: string | null;
  pipeline_mode: PipelineMode | null;
  created_at: string;
}

// --- seo_audit_snapshots ---

export interface AuditSnapshot {
  audit_date: string;
  total_articles: number;
  articles_healthy: number;
  articles_warning: number;
  articles_critical: number;
  total_organic_sessions_30d: number | null;
  avg_position: number | null;
  quick_wins_count: number | null;
  keyword_coverage_pct: number | null;
  articles_data: Record<string, unknown> | null;
  quick_wins_data: Record<string, unknown> | null;
  report_markdown: string | null;
  created_at: string;
}

// --- Computed / Dashboard types ---

export interface SummaryStats {
  total_articles: number;
  articles_by_status: Record<ArticleStatus, number>;
  avg_scorecard_score: number | null;
  total_organic_sessions_30d: number;
  articles_needing_attention: number;
  keyword_coverage_pct: number | null;
  quick_wins_count: number | null;
  latest_audit_date: string | null;
  total_keywords: number;
  keywords_by_status: Record<KeywordStatus, number>;
}

export interface QuickWin {
  slug: string;
  title: string;
  target_keyword: string;
  avg_position_30d: number | null;
  impressions_30d: number | null;
  clicks_30d: number | null;
  ctr_30d: number | null;
  suggestion: string;
}

// --- Activity Timeline ---

export type ActivityEventType =
  | "keywords_researched"
  | "keywords_selected"
  | "article_produced"
  | "article_published"
  | "audit_completed";

export interface ActivityEvent {
  type: ActivityEventType;
  date: string; // YYYY-MM-DD
  title: string;
  detail: string | null;
  count?: number; // for grouped events (e.g. "5 keywords selected")
}

export interface ActivityDay {
  date: string; // YYYY-MM-DD
  events: ActivityEvent[];
}
