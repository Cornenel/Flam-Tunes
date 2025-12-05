import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function PUT(request: Request) {
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
    const { artist_name, contact_name, contact_phone, bio, website } = body;

    if (!artist_name || !contact_name) {
      return NextResponse.json(
        { error: "Artist name and contact name are required" },
        { status: 400 }
      );
    }

    // Update profile
    const { data, error } = await supabase
      .from("artist_profiles")
      .update({
        artist_name,
        contact_name,
        contact_phone: contact_phone || null,
        bio: bio || null,
        website: website || null,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) {
      console.error("Error updating profile:", error);
      return NextResponse.json(
        { error: "Failed to update profile" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error in PUT /api/artist/profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

