import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { STORAGE_BUCKETS } from "@/lib/storage";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const formData = await request.formData();

    // Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get artist profile
    const { data: artistProfile, error: profileError } = await supabase
      .from("artist_profiles")
      .select("id, artist_name, contact_name, contact_phone")
      .eq("user_id", user.id)
      .single();

    if (profileError || !artistProfile) {
      return NextResponse.json(
        { error: "Artist profile not found. Please register first." },
        { status: 403 }
      );
    }

    // Extract form data
    const file = formData.get("file") as File;
    const artist_name = formData.get("artist_name")?.toString() || artistProfile.artist_name;
    const contact_name = formData.get("contact_name")?.toString() || artistProfile.contact_name;
    const contact_email = user.email || "";
    const contact_phone = formData.get("contact_phone")?.toString() || artistProfile.contact_phone || null;
    const track_title = formData.get("track_title")?.toString();
    const genre = formData.get("genre")?.toString() || null;
    const release_date = formData.get("release_date")?.toString();
    const bpm = formData.get("bpm")?.toString();
    const moodTagsStr = formData.get("mood_tags")?.toString() || "";
    const ownership_confirmed = formData.get("ownership_confirmed") === "true";
    const permission_granted = formData.get("permission_granted") === "true";
    const rights_holder_name =
      formData.get("rights_holder_name")?.toString() || null;
    const additional_info = formData.get("additional_info")?.toString() || null;

    // Validation
    if (!file) {
      return NextResponse.json(
        { error: "Audio file is required" },
        { status: 400 }
      );
    }

    if (!artist_name || !contact_name || !contact_email || !track_title || !release_date) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!ownership_confirmed || !permission_granted) {
      return NextResponse.json(
        { error: "Ownership and permission must be confirmed" },
        { status: 400 }
      );
    }

    // Validate release date is in the past
    const releaseDate = new Date(release_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (releaseDate > today) {
      return NextResponse.json(
        { error: "Release date must be in the past (track must be released)" },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith("audio/")) {
      return NextResponse.json(
        { error: "File must be an audio file" },
        { status: 400 }
      );
    }

    // Validate file size (50MB max)
    if (file.size > 50 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size must be less than 50MB" },
        { status: 400 }
      );
    }

    // Generate storage path
    const timestamp = Date.now();
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const storagePath = `submissions/${timestamp}_${sanitizedFileName}`;

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKETS.ARTIST_SUBMISSIONS)
      .upload(storagePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error("Error uploading file:", uploadError);
      return NextResponse.json(
        { error: "Failed to upload file" },
        { status: 500 }
      );
    }

    // Process mood tags
    const mood_tags = moodTagsStr
      ? moodTagsStr.split(",").map((tag) => tag.trim()).filter(Boolean)
      : null;

    // Create submission record
    const { data: submissionData, error: submissionError } = await supabase
      .from("artist_submissions")
      .insert({
        artist_profile_id: artistProfile.id,
        artist_name,
        contact_name,
        contact_email,
        contact_phone,
        track_title,
        genre,
        release_date,
        bpm: bpm ? parseInt(bpm, 10) : null,
        mood_tags,
        storage_path: uploadData.path,
        file_name: file.name,
        file_size: file.size,
        ownership_confirmed: true,
        permission_granted: true,
        rights_holder_name,
        additional_info,
        status: "PENDING",
      })
      .select()
      .single();

    if (submissionError) {
      console.error("Error creating submission:", submissionError);
      // Try to delete uploaded file
      await supabase.storage
        .from(STORAGE_BUCKETS.ARTIST_SUBMISSIONS)
        .remove([uploadData.path]);
      return NextResponse.json(
        { error: "Failed to create submission record" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, data: submissionData },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in POST /api/artist-submissions:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

