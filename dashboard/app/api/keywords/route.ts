import { type NextRequest } from "next/server";
import { createServerClient } from "@/lib/supabase";
import type { Keyword } from "@/lib/types";

// GET /api/keywords — list all keywords, optional ?status= filter
export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient();
    const status = request.nextUrl.searchParams.get("status");

    let query = supabase
      .from("seo_keywords")
      .select("*")
      .order("composite_score", { ascending: false });

    if (status) {
      query = query.eq("status", status);
    }

    const { data, error } = await query;

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json(data as Keyword[]);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
}

// POST /api/keywords — insert one or many keywords
// Accepts single object or array of objects
export async function POST(request: Request) {
  try {
    const supabase = createServerClient();
    const body = await request.json();

    const rows = Array.isArray(body) ? body : [body];

    // Validate each row has the required 'keyword' field
    for (const row of rows) {
      if (!row.keyword) {
        return Response.json(
          { error: "Each keyword object must have a 'keyword' field" },
          { status: 400 }
        );
      }
      // Default status if not provided
      if (!row.status) {
        row.status = "universe";
      }
    }

    const { data, error } = await supabase
      .from("seo_keywords")
      .insert(rows)
      .select();

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json(data as Keyword[], { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
}

// PUT /api/keywords — update a keyword by keyword text (pass keyword in body)
export async function PUT(request: Request) {
  try {
    const supabase = createServerClient();
    const body = await request.json();
    const { keyword, ...updates } = body;

    if (!keyword) {
      return Response.json(
        { error: "keyword is required in request body" },
        { status: 400 }
      );
    }

    const allowedFields = [
      "status",
      "article_slug",
      "composite_score",
      "business_value",
      "opportunity",
      "difficulty_inv",
      "relevance",
      "content_gap",
      "search_volume",
      "keyword_difficulty",
      "cpc",
      "cannibalization_risk",
      "cannibalization_url",
      "cannibalization_note",
      "pipeline_mode",
    ];

    const safeUpdates: Record<string, unknown> = {};
    for (const key of allowedFields) {
      if (key in updates) {
        safeUpdates[key] = updates[key];
      }
    }

    if (Object.keys(safeUpdates).length === 0) {
      return Response.json(
        { error: "No valid fields to update" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("seo_keywords")
      .update(safeUpdates)
      .eq("keyword", keyword)
      .select()
      .single();

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json(data as Keyword);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
}
