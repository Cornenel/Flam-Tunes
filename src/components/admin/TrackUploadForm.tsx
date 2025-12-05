"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function TrackUploadForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    artist: "",
    genre: "",
    bpm: "",
    mood_tags: "",
    is_jingle: false,
    is_bed_music: false,
  });
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      alert("Please select a file to upload");
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload file to Supabase Storage
      const formDataToSend = new FormData();
      formDataToSend.append("file", file);
      formDataToSend.append("title", formData.title);
      formDataToSend.append("artist", formData.artist);
      formDataToSend.append("genre", formData.genre);
      formDataToSend.append("bpm", formData.bpm);
      formDataToSend.append("mood_tags", formData.mood_tags);
      formDataToSend.append("is_jingle", formData.is_jingle.toString());
      formDataToSend.append("is_bed_music", formData.is_bed_music.toString());

      const response = await fetch("/api/admin/tracks/upload", {
        method: "POST",
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error("Failed to upload track");
      }

      router.refresh();
      setFormData({
        title: "",
        artist: "",
        genre: "",
        bpm: "",
        mood_tags: "",
        is_jingle: false,
        is_bed_music: false,
      });
      setFile(null);
      // Reset file input
      const fileInput = document.getElementById("file-input") as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    } catch (error) {
      console.error("Error uploading track:", error);
      alert("Failed to upload track");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h2 className="text-2xl font-bold mb-4 text-orange-500">Upload Track</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Audio File *</label>
          <input
            id="file-input"
            type="file"
            accept="audio/*"
            onChange={handleFileChange}
            required
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-orange-500 file:text-white hover:file:bg-orange-600"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Artist</label>
          <input
            type="text"
            value={formData.artist}
            onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Genre</label>
            <input
              type="text"
              value={formData.genre}
              onChange={(e) =>
                setFormData({ ...formData, genre: e.target.value })
              }
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">BPM</label>
            <input
              type="number"
              value={formData.bpm}
              onChange={(e) =>
                setFormData({ ...formData, bpm: e.target.value })
              }
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Mood Tags (comma-separated)
          </label>
          <input
            type="text"
            value={formData.mood_tags}
            onChange={(e) =>
              setFormData({ ...formData, mood_tags: e.target.value })
            }
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
            placeholder="energetic, upbeat, chill"
          />
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.is_jingle}
              onChange={(e) =>
                setFormData({ ...formData, is_jingle: e.target.checked })
              }
              className="w-4 h-4 text-orange-500 rounded focus:ring-orange-500"
            />
            <span className="text-sm">Jingle</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.is_bed_music}
              onChange={(e) =>
                setFormData({ ...formData, is_bed_music: e.target.checked })
              }
              className="w-4 h-4 text-orange-500 rounded focus:ring-orange-500"
            />
            <span className="text-sm">Bed Music</span>
          </label>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !file}
          className="w-full px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-semibold transition-all"
        >
          {isSubmitting ? "Uploading..." : "Upload Track"}
        </button>
      </form>
    </div>
  );
}

