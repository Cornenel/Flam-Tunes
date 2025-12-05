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
    const { id, status } = body;

    if (!id || typeof id !== "number") {
      return NextResponse.json(
        { error: "Request ID is required" },
        { status: 400 }
      );
    }

    if (
      !status ||
      !["QUEUED", "PLAYED", "REJECTED"].includes(status)
    ) {
      return NextResponse.json(
        { error: "Invalid status. Must be QUEUED, PLAYED, or REJECTED" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("requests")
      .update({
        status,
        handled_by: user.email || user.id,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating request:", error);
      return NextResponse.json(
        { error: "Failed to update request" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error in POST /api/admin/mark-request:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

