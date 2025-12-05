"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { ArtistProfile } from "@/types/db";

interface ArtistSubmissionFormProps {
  artistProfile: Pick<ArtistProfile, "id" | "artist_name" | "contact_name" | "contact_phone">;
}

export function ArtistSubmissionForm({ artistProfile }: ArtistSubmissionFormProps) {
  const [formData, setFormData] = useState({
    // Contact Information (pre-filled from profile)
    artist_name: artistProfile.artist_name,
    contact_name: artistProfile.contact_name,
    contact_email: "",
    contact_phone: artistProfile.contact_phone || "",
    // Track Information
    track_title: "",
    genre: "",
    release_date: "",
    bpm: "",
    mood_tags: "",
    // Ownership & Permissions
    ownership_confirmed: false,
    permission_granted: false,
    rights_holder_name: "",
    additional_info: "",
  });

  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  // Get user email
  useEffect(() => {
    const getEmail = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email) {
        setFormData(prev => ({ ...prev, contact_email: user.email || "" }));
      }
    };
    getEmail();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      // Validate file type
      if (!selectedFile.type.startsWith("audio/")) {
        setErrorMessage("Please upload an audio file (MP3, WAV, etc.)");
        return;
      }
      // Validate file size (max 50MB)
      if (selectedFile.size > 50 * 1024 * 1024) {
        setErrorMessage("File size must be less than 50MB");
        return;
      }
      setFile(selectedFile);
      setErrorMessage("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    // Validation
    if (!file) {
      setErrorMessage("Please select an audio file to upload");
      return;
    }

    if (!formData.ownership_confirmed || !formData.permission_granted) {
      setErrorMessage(
        "You must confirm ownership and grant permission to proceed"
      );
      return;
    }

    if (!formData.release_date) {
      setErrorMessage("Release date is required");
      return;
    }

    // Check if release date is in the past
    const releaseDate = new Date(formData.release_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (releaseDate > today) {
      setErrorMessage("Release date must be in the past (track must be released)");
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("file", file);
      formDataToSend.append("artist_name", formData.artist_name);
      formDataToSend.append("contact_name", formData.contact_name);
      formDataToSend.append("contact_email", formData.contact_email);
      formDataToSend.append("contact_phone", formData.contact_phone || "");
      formDataToSend.append("track_title", formData.track_title);
      formDataToSend.append("genre", formData.genre || "");
      formDataToSend.append("release_date", formData.release_date);
      formDataToSend.append("bpm", formData.bpm || "");
      formDataToSend.append("mood_tags", formData.mood_tags || "");
      formDataToSend.append("ownership_confirmed", "true");
      formDataToSend.append("permission_granted", "true");
      formDataToSend.append("rights_holder_name", formData.rights_holder_name || "");
      formDataToSend.append("additional_info", formData.additional_info || "");

      const response = await fetch("/api/artist-submissions", {
        method: "POST",
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit track");
      }

      setSubmitStatus("success");
      // Reset form
      setFormData({
        artist_name: "",
        contact_name: "",
        contact_email: "",
        contact_phone: "",
        track_title: "",
        genre: "",
        release_date: "",
        bpm: "",
        mood_tags: "",
        ownership_confirmed: false,
        permission_granted: false,
        rights_holder_name: "",
        additional_info: "",
      });
      setFile(null);
      const fileInput = document.getElementById("audio-file") as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    } catch (error) {
      console.error("Error submitting track:", error);
      setSubmitStatus("error");
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to submit track"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h2 className="text-4xl font-black mb-8 bg-gradient-to-r from-cyan-400 via-pink-400 to-purple-400 bg-clip-text text-transparent glow-text text-center">
        🎵 Upload Your Track 🎵
      </h2>

      {/* Terms & Conditions Notice */}
      <div className="mb-8 p-6 bg-gradient-to-r from-orange-900/40 to-pink-900/40 border border-orange-500/50 rounded-xl">
        <h3 className="text-xl font-bold text-orange-300 mb-3">
          ⚠️ Important Requirements
        </h3>
        <ul className="text-purple-200 space-y-2 text-sm list-disc list-inside">
          <li>Track must be officially released (release date required)</li>
          <li>You must own the rights to the music or have permission from the rights holder</li>
          <li>You must grant Flam Tunes permission to play your track</li>
          <li>All submissions are subject to review before being added to rotation</li>
          <li>We reserve the right to reject submissions that don't meet our standards</li>
        </ul>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Contact Information Section - Read-only from profile */}
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-cyan-400 mb-4">
            Artist Information
          </h3>
          <div className="p-4 bg-purple-900/20 border border-purple-500/30 rounded-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-purple-200">
              <div>
                <div className="text-xs text-purple-400 mb-1">Artist/Band Name</div>
                <div className="font-semibold">{formData.artist_name}</div>
              </div>
              <div>
                <div className="text-xs text-purple-400 mb-1">Contact Name</div>
                <div className="font-semibold">{formData.contact_name}</div>
              </div>
              <div>
                <div className="text-xs text-purple-400 mb-1">Email</div>
                <div className="font-semibold">{formData.contact_email || "Loading..."}</div>
              </div>
              {formData.contact_phone && (
                <div>
                  <div className="text-xs text-purple-400 mb-1">Phone</div>
                  <div className="font-semibold">{formData.contact_phone}</div>
                </div>
              )}
            </div>
            <div className="mt-3 text-xs text-purple-400">
              To update your information, visit your{" "}
              <a href="/artist/dashboard" className="text-cyan-400 hover:text-cyan-300 underline">
                dashboard
              </a>
            </div>
          </div>
        </div>

        {/* Track Information Section */}
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-cyan-400 mb-4">
            Track Information
          </h3>

          <div>
            <label className="block text-sm font-semibold mb-2 text-purple-300">
              Audio File * (MP3, WAV, etc. - Max 50MB)
            </label>
            <input
              id="audio-file"
              type="file"
              accept="audio/*"
              onChange={handleFileChange}
              required
              className="w-full px-4 py-3 bg-purple-900/40 border border-purple-500/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-pink-500 file:text-white hover:file:bg-pink-600 transition-all"
            />
            {file && (
              <p className="mt-2 text-sm text-purple-300">
                Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2 text-purple-300">
                Track Title *
              </label>
              <input
                type="text"
                required
                value={formData.track_title}
                onChange={(e) =>
                  setFormData({ ...formData, track_title: e.target.value })
                }
                className="w-full px-4 py-3 bg-purple-900/40 border border-purple-500/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-white placeholder-purple-400/50 transition-all"
                placeholder="Song Title"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-purple-300">
                Genre
              </label>
              <input
                type="text"
                value={formData.genre}
                onChange={(e) =>
                  setFormData({ ...formData, genre: e.target.value })
                }
                className="w-full px-4 py-3 bg-purple-900/40 border border-purple-500/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-white placeholder-purple-400/50 transition-all"
                placeholder="Rock, Pop, Electronic, etc."
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-purple-300">
                Release Date * (Must be in the past)
              </label>
              <input
                type="date"
                required
                value={formData.release_date}
                onChange={(e) =>
                  setFormData({ ...formData, release_date: e.target.value })
                }
                max={new Date().toISOString().split("T")[0]}
                className="w-full px-4 py-3 bg-purple-900/40 border border-purple-500/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-white transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-purple-300">
                BPM (optional)
              </label>
              <input
                type="number"
                min="60"
                max="200"
                value={formData.bpm}
                onChange={(e) =>
                  setFormData({ ...formData, bpm: e.target.value })
                }
                className="w-full px-4 py-3 bg-purple-900/40 border border-purple-500/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-white placeholder-purple-400/50 transition-all"
                placeholder="120"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-purple-300">
              Mood Tags (comma-separated)
            </label>
            <input
              type="text"
              value={formData.mood_tags}
              onChange={(e) =>
                setFormData({ ...formData, mood_tags: e.target.value })
              }
              className="w-full px-4 py-3 bg-purple-900/40 border border-purple-500/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-white placeholder-purple-400/50 transition-all"
              placeholder="energetic, upbeat, chill, dark"
            />
          </div>
        </div>

        {/* Ownership & Permissions Section */}
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-cyan-400 mb-4">
            Ownership & Permissions
          </h3>

          <div>
            <label className="block text-sm font-semibold mb-2 text-purple-300">
              Rights Holder Name (if different from artist)
            </label>
            <input
              type="text"
              value={formData.rights_holder_name}
              onChange={(e) =>
                setFormData({ ...formData, rights_holder_name: e.target.value })
              }
              className="w-full px-4 py-3 bg-purple-900/40 border border-purple-500/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-white placeholder-purple-400/50 transition-all"
              placeholder="Record label, publisher, etc."
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-purple-300">
              Additional Information
            </label>
            <textarea
              value={formData.additional_info}
              onChange={(e) =>
                setFormData({ ...formData, additional_info: e.target.value })
              }
              rows={4}
              className="w-full px-4 py-3 bg-purple-900/40 border border-purple-500/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-white placeholder-purple-400/50 resize-none transition-all"
              placeholder="Any additional information about the track, licensing, or permissions..."
            />
          </div>

          <div className="space-y-3 p-4 bg-gradient-to-r from-purple-900/40 to-pink-900/40 border border-purple-500/50 rounded-xl">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                required
                checked={formData.ownership_confirmed}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    ownership_confirmed: e.target.checked,
                  })
                }
                className="mt-1 w-5 h-5 text-pink-500 rounded focus:ring-pink-500"
              />
              <span className="text-purple-200">
                <strong className="text-pink-300">I confirm</strong> that I own the
                rights to this track or have permission from the rights holder to
                submit it for airplay. *
              </span>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                required
                checked={formData.permission_granted}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    permission_granted: e.target.checked,
                  })
                }
                className="mt-1 w-5 h-5 text-pink-500 rounded focus:ring-pink-500"
              />
              <span className="text-purple-200">
                <strong className="text-pink-300">I grant permission</strong> to
                Flam Tunes to play this track on the radio station. *
              </span>
            </label>
          </div>
        </div>

        {errorMessage && (
          <div className="p-4 bg-gradient-to-r from-red-900/40 to-pink-900/40 border border-red-500/50 rounded-xl text-red-300 text-sm glow-box">
            ⚠️ {errorMessage}
          </div>
        )}

        {submitStatus === "success" && (
          <div className="p-4 bg-gradient-to-r from-green-900/40 to-cyan-900/40 border border-green-500/50 rounded-xl text-green-300 text-sm glow-box">
            ✨ Your track has been submitted successfully! We'll review it and
            get back to you via email. Thank you for sharing your music with Flam
            Tunes!
          </div>
        )}

        {submitStatus === "error" && !errorMessage && (
          <div className="p-4 bg-gradient-to-r from-red-900/40 to-pink-900/40 border border-red-500/50 rounded-xl text-red-300 text-sm glow-box">
            ⚠️ Failed to submit track. Please try again.
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full px-8 py-4 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 hover:from-orange-600 hover:via-pink-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-bold text-lg transition-all transform hover:scale-105 active:scale-95 shadow-lg glow-box"
        >
          {isSubmitting ? "🚀 Uploading..." : "🎵 Submit Track"}
        </button>
      </form>
    </div>
  );
}

