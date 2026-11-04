import { type NextRequest } from "next/server";
import { createServerClient } from "@/lib/supabase";
import type { AuditSnapshot } from "@/lib/types";

// GET /api/audit — list audit snapshots, optional ?limit= (default 10)
export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient();
    const limitParam = request.nextUrl.searchParams.get("limit");
    const limit = limitParam ? parseInt(limitParam, 10) : 10;

    if (isNaN(limit) || limit < 1) {
      return Response.json(
        { error: "limit must be a positive integer" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("seo_audit_snapshots")
      .select("*")
      .order("audit_date", { ascending: false })
      .limit(limit);

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json(data as AuditSnapshot[]);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
}

// POST /api/audit — insert a new audit snapshot
export async function POST(request: Request) {
  try {
    const supabase = createServerClient();
    const body = await request.json();

    const {
      audit_date,
      total_articles,
      articles_healthy,
      articles_warning,
      articles_critical,
      total_organic_sessions_30d,
      avg_position,
      quick_wins_count,
      keyword_coverage_pct,
      articles_data,
      quick_wins_data,
      report_markdown,
    } = body;

    if (!audit_date || total_articles === undefined) {
      return Response.json(
        { error: "audit_date and total_articles are required" },
        { status: 400 }
      );
    }

    const row: Record<string, unknown> = {
      audit_date,
      total_articles,
      articles_healthy: articles_healthy ?? 0,
      articles_warning: articles_warning ?? 0,
      articles_critical: articles_critical ?? 0,
    };

    if (total_organic_sessions_30d !== undefined)
      row.total_organic_sessions_30d = total_organic_sessions_30d;
    if (avg_position !== undefined) row.avg_position = avg_position;
    if (quick_wins_count !== undefined)
      row.quick_wins_count = quick_wins_count;
    if (keyword_coverage_pct !== undefined)
      row.keyword_coverage_pct = keyword_coverage_pct;
    if (articles_data !== undefined) row.articles_data = articles_data;
    if (quick_wins_data !== undefined) row.quick_wins_data = quick_wins_data;
    if (report_markdown !== undefined) row.report_markdown = report_markdown;

    const { data, error } = await supabase
      .from("seo_audit_snapshots")
      .insert(row)
      .select()
      .single();

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json(data as AuditSnapshot, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
}
