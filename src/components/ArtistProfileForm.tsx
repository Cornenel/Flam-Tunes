"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArtistProfile } from "@/types/db";

interface ArtistProfileFormProps {
  profile: ArtistProfile;
}

export function ArtistProfileForm({ profile }: ArtistProfileFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    artist_name: profile.artist_name,
    contact_name: profile.contact_name,
    contact_phone: profile.contact_phone || "",
    bio: profile.bio || "",
    website: profile.website || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/artist/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update profile");
      }

      setSuccess(true);
      router.refresh();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h2 className="text-4xl font-black mb-8 bg-gradient-to-r from-cyan-400 via-pink-400 to-purple-400 bg-clip-text text-transparent glow-text text-center">
        🎵 Your Profile 🎵
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2 text-purple-300">
              Artist/Band Name *
            </label>
            <input
              type="text"
              required
              value={formData.artist_name}
              onChange={(e) =>
                setFormData({ ...formData, artist_name: e.target.value })
              }
              className="w-full px-4 py-3 bg-purple-900/40 border border-purple-500/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-white placeholder-purple-400/50 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-purple-300">
              Contact Name *
            </label>
            <input
              type="text"
              required
              value={formData.contact_name}
              onChange={(e) =>
                setFormData({ ...formData, contact_name: e.target.value })
              }
              className="w-full px-4 py-3 bg-purple-900/40 border border-purple-500/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-white placeholder-purple-400/50 transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2 text-purple-300">
            Phone Number
          </label>
          <input
            type="tel"
            value={formData.contact_phone}
            onChange={(e) =>
              setFormData({ ...formData, contact_phone: e.target.value })
            }
            className="w-full px-4 py-3 bg-purple-900/40 border border-purple-500/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-white placeholder-purple-400/50 transition-all"
            placeholder="+1 (555) 123-4567"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2 text-purple-300">
            Website
          </label>
          <input
            type="url"
            value={formData.website}
            onChange={(e) =>
              setFormData({ ...formData, website: e.target.value })
            }
            className="w-full px-4 py-3 bg-purple-900/40 border border-purple-500/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-white placeholder-purple-400/50 transition-all"
            placeholder="https://yourwebsite.com"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2 text-purple-300">
            Bio
          </label>
          <textarea
            value={formData.bio}
            onChange={(e) =>
              setFormData({ ...formData, bio: e.target.value })
            }
            rows={5}
            className="w-full px-4 py-3 bg-purple-900/40 border border-purple-500/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-white placeholder-purple-400/50 resize-none transition-all"
            placeholder="Tell us about yourself and your music..."
          />
        </div>

        {error && (
          <div className="p-4 bg-gradient-to-r from-red-900/40 to-pink-900/40 border border-red-500/50 rounded-xl text-red-300 text-sm glow-box">
            ⚠️ {error}
          </div>
        )}

        {success && (
          <div className="p-4 bg-gradient-to-r from-green-900/40 to-cyan-900/40 border border-green-500/50 rounded-xl text-green-300 text-sm glow-box">
            ✨ Profile updated successfully!
          </div>
        )}

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 px-8 py-4 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 hover:from-orange-600 hover:via-pink-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-bold text-lg transition-all transform hover:scale-105 active:scale-95 shadow-lg glow-box"
          >
            {isSubmitting ? "✨ Saving..." : "💾 Save Changes"}
          </button>
          <a
            href="/artist/dashboard"
            className="px-8 py-4 bg-gray-700 hover:bg-gray-600 rounded-xl font-bold text-lg transition-all text-center"
          >
            Cancel
          </a>
        </div>
      </form>
    </div>
  );
}

