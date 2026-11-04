import { type NextRequest } from "next/server";
import { createServerClient } from "@/lib/supabase";
import type { Article } from "@/lib/types";

// GET /api/articles — list all articles, optional ?status= filter
export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient();
    const status = request.nextUrl.searchParams.get("status");

    let query = supabase
      .from("seo_articles")
      .select("*")
      .order("produced_date", { ascending: false });

    if (status) {
      query = query.eq("status", status);
    }

    const { data, error } = await query;

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json(data as Article[]);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
}

// POST /api/articles — insert a new article
export async function POST(request: Request) {
  try {
    const supabase = createServerClient();
    const body = await request.json();

    const {
      slug,
      title,
      target_keyword,
      scorecard_score,
      word_count,
      content_type,
      batch_id,
      produced_date,
      secondary_keywords,
      status,
    } = body;

    if (!slug || !title || !target_keyword) {
      return Response.json(
        { error: "slug, title, and target_keyword are required" },
        { status: 400 }
      );
    }

    const row: Record<string, unknown> = {
      slug,
      title,
      target_keyword,
      status: status ?? "produced",
    };

    if (scorecard_score !== undefined) row.scorecard_score = scorecard_score;
    if (word_count !== undefined) row.word_count = word_count;
    if (content_type !== undefined) row.content_type = content_type;
    if (batch_id !== undefined) row.batch_id = batch_id;
    if (produced_date !== undefined) row.produced_date = produced_date;
    if (secondary_keywords !== undefined)
      row.secondary_keywords = secondary_keywords;

    const { data, error } = await supabase
      .from("seo_articles")
      .insert(row)
      .select()
      .single();

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json(data as Article, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
}

// PUT /api/articles — update an article by slug (pass slug in body)
export async function PUT(request: Request) {
  try {
    const supabase = createServerClient();
    const body = await request.json();
    const { slug, ...updates } = body;

    if (!slug) {
      return Response.json(
        { error: "slug is required in request body" },
        { status: 400 }
      );
    }

    // Only allow updating known fields
    const allowedFields = [
      "title",
      "status",
      "published_url",
      "published_date",
      "health_status",
      "health_reason",
      "last_audit_date",
      "organic_sessions_30d",
      "organic_sessions_7d",
      "sessions_trend",
      "impressions_30d",
      "clicks_30d",
      "ctr_30d",
      "avg_position_30d",
      "position_trend",
      "scorecard_score",
      "word_count",
      "secondary_keywords",
      "content_type",
      "batch_id",
    ];

    const safeUpdates: Record<string, unknown> = {};
    for (const key of allowedFields) {
      if (key in updates) {
        safeUpdates[key] = updates[key];
      }
    }

    safeUpdates.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from("seo_articles")
      .update(safeUpdates)
      .eq("slug", slug)
      .select()
      .single();

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json(data as Article);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
}
