import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    // Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      description,
      ai_host_id,
      start_time,
      end_time,
      days_of_week,
      priority,
      is_active,
    } = body;

    if (!name || !start_time || !end_time || !days_of_week || days_of_week.length === 0) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("shows")
      .insert({
        name,
        description: description || null,
        ai_host_id: ai_host_id || null,
        start_time,
        end_time,
        days_of_week,
        priority: priority || 0,
        is_active: is_active !== undefined ? is_active : true,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating show:", error);
      return NextResponse.json(
        { error: "Failed to create show" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/admin/shows:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

