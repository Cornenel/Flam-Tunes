import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { STORAGE_BUCKETS } from "@/lib/storage";
import { sendSubmissionStatusEmail } from "@/lib/email";

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
    const { id, status, admin_notes } = body;

    if (!id || typeof id !== "number") {
      return NextResponse.json(
        { error: "Submission ID is required" },
        { status: 400 }
      );
    }

    if (
      !status ||
      !["APPROVED", "REJECTED", "UNDER_REVIEW"].includes(status)
    ) {
      return NextResponse.json(
        { error: "Invalid status. Must be APPROVED, REJECTED, or UNDER_REVIEW" },
        { status: 400 }
      );
    }

    // Get the submission first
    const { data: submission, error: fetchError } = await supabase
      .from("artist_submissions")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError || !submission) {
      return NextResponse.json(
        { error: "Submission not found" },
        { status: 404 }
      );
    }

    let approved_track_id: number | null = null;

    // If approving, create a track in the tracks table
    if (status === "APPROVED" && !submission.approved_track_id) {
      // Copy file from artist-submissions bucket to radio-tracks bucket
      const { data: sourceFile, error: downloadError } = await supabase.storage
        .from(STORAGE_BUCKETS.ARTIST_SUBMISSIONS)
        .download(submission.storage_path);

      if (downloadError || !sourceFile) {
        console.error("Error downloading file:", downloadError);
        return NextResponse.json(
          { error: "Failed to process file for approval" },
          { status: 500 }
        );
      }

      // Generate new path in radio-tracks bucket
      const timestamp = Date.now();
      const sanitizedFileName = submission.file_name.replace(
        /[^a-zA-Z0-9.-]/g,
        "_"
      );
      const newStoragePath = `approved/${timestamp}_${sanitizedFileName}`;

      // Upload to radio-tracks bucket
      const { error: uploadError } = await supabase.storage
        .from(STORAGE_BUCKETS.TRACKS)
        .upload(newStoragePath, sourceFile, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        console.error("Error uploading approved file:", uploadError);
        return NextResponse.json(
          { error: "Failed to move file to tracks library" },
          { status: 500 }
        );
      }

      // Create track record
      const { data: trackData, error: trackError } = await supabase
        .from("tracks")
        .insert({
          storage_path: newStoragePath,
          artist: submission.artist_name,
          title: submission.track_title,
          genre: submission.genre,
          bpm: submission.bpm,
          mood_tags: submission.mood_tags,
          is_jingle: false,
          is_bed_music: false,
        })
        .select()
        .single();

      if (trackError || !trackData) {
        console.error("Error creating track:", trackError);
        // Try to delete uploaded file
        await supabase.storage
          .from(STORAGE_BUCKETS.TRACKS)
          .remove([newStoragePath]);
        return NextResponse.json(
          { error: "Failed to create track record" },
          { status: 500 }
        );
      }

      approved_track_id = trackData.id;
    }

    // Update submission
    const { data, error } = await supabase
      .from("artist_submissions")
      .update({
        status,
        reviewed_at: new Date().toISOString(),
        reviewed_by: user.email || user.id,
        admin_notes: admin_notes || null,
        approved_track_id: approved_track_id || submission.approved_track_id,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating submission:", error);
      return NextResponse.json(
        { error: "Failed to update submission" },
        { status: 500 }
      );
    }

    // Send email notification to artist (non-blocking)
    if (status === "APPROVED" || status === "REJECTED" || status === "UNDER_REVIEW") {
      sendSubmissionStatusEmail(
        submission.contact_email,
        submission.artist_name,
        submission.track_title,
        status,
        admin_notes || undefined
      ).catch((err) => {
        console.error("Failed to send email notification:", err);
        // Don't fail the request if email fails
      });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error in POST /api/admin/artist-submissions/review:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

