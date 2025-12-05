import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { NowPlayingWithDetails } from "@/types/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("now_playing_history")
      .select(
        `
        *,
        track:tracks(*),
        segment:segments(*, ai_host:ai_hosts(*)),
        show:shows(*)
      `
      )
      .order("started_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Error fetching history:", error);
      return NextResponse.json(
        { error: "Failed to fetch history" },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: data as NowPlayingWithDetails[] });
  } catch (error) {
    console.error("Error in GET /api/history:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

