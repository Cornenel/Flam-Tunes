import { createServiceRoleClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// TODO: Add authentication/authorization for internal orchestrator service
// This endpoint will be called by the radio orchestrator service
// Consider using API keys or service-to-service auth

export async function POST(request: Request) {
  try {
    // TODO: Verify request is from orchestrator service
    // For now, this is a stub that accepts requests

    const body = await request.json();
    const {
      item_type,
      track_id,
      segment_id,
      show_id,
      listeners_estimate,
    } = body;

    if (!item_type || !["TRACK", "SEGMENT"].includes(item_type)) {
      return NextResponse.json(
        { error: "item_type must be TRACK or SEGMENT" },
        { status: 400 }
      );
    }

    if (item_type === "TRACK" && !track_id) {
      return NextResponse.json(
        { error: "track_id is required for TRACK items" },
        { status: 400 }
      );
    }

    if (item_type === "SEGMENT" && !segment_id) {
      return NextResponse.json(
        { error: "segment_id is required for SEGMENT items" },
        { status: 400 }
      );
    }

    const supabase = createServiceRoleClient();

    // End previous item if it exists
    await supabase
      .from("now_playing_history")
      .update({ ended_at: new Date().toISOString() })
      .is("ended_at", null);

    // Insert new now playing entry
    const { data, error } = await supabase
      .from("now_playing_history")
      .insert({
        item_type,
        track_id: item_type === "TRACK" ? track_id : null,
        segment_id: item_type === "SEGMENT" ? segment_id : null,
        show_id: show_id || null,
        listeners_estimate: listeners_estimate || null,
      })
      .select()
      .single();

    if (error) {
      console.error("Error inserting now playing:", error);
      return NextResponse.json(
        { error: "Failed to update now playing" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/internal/now-playing:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

