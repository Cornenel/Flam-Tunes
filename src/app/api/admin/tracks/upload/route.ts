import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { STORAGE_BUCKETS } from "@/lib/storage";

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

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Generate storage path
    const timestamp = Date.now();
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const storagePath = `${timestamp}_${sanitizedFileName}`;

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKETS.TRACKS)
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

    // Extract metadata from form
    const title = formData.get("title")?.toString() || null;
    const artist = formData.get("artist")?.toString() || null;
    const genre = formData.get("genre")?.toString() || null;
    const bpm = formData.get("bpm")?.toString();
    const moodTagsStr = formData.get("mood_tags")?.toString() || "";
    const moodTags = moodTagsStr
      ? moodTagsStr.split(",").map((tag) => tag.trim()).filter(Boolean)
      : null;
    const isJingle = formData.get("is_jingle") === "true";
    const isBedMusic = formData.get("is_bed_music") === "true";

    // Create track record
    const { data: trackData, error: trackError } = await supabase
      .from("tracks")
      .insert({
        storage_path: uploadData.path,
        title,
        artist,
        genre,
        bpm: bpm ? parseInt(bpm, 10) : null,
        mood_tags: moodTags,
        is_jingle: isJingle,
        is_bed_music: isBedMusic,
      })
      .select()
      .single();

    if (trackError) {
      console.error("Error creating track record:", trackError);
      // Try to delete uploaded file
      await supabase.storage
        .from(STORAGE_BUCKETS.TRACKS)
        .remove([uploadData.path]);
      return NextResponse.json(
        { error: "Failed to create track record" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: trackData }, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/admin/tracks/upload:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

