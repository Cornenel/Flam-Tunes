import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { NowPlayingWithDetails } from "@/types/db";

export async function GET() {
  try {
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
      .limit(1)
      .single();

    if (error) {
      // If no rows found, return null instead of error
      if (error.code === "PGRST116") {
        return NextResponse.json({ data: null });
      }
      console.error("Error fetching now playing:", error);
      return NextResponse.json(
        { error: "Failed to fetch now playing" },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: data as NowPlayingWithDetails });
  } catch (error) {
    console.error("Error in GET /api/now-playing:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

