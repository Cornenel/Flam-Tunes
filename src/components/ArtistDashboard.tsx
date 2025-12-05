"use client";

import { ArtistProfile, ArtistSubmissionWithTrack } from "@/types/db";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface ArtistDashboardProps {
  profile: ArtistProfile;
  submissions: ArtistSubmissionWithTrack[];
}

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-500/20 text-yellow-400",
  UNDER_REVIEW: "bg-blue-500/20 text-blue-400",
  APPROVED: "bg-green-500/20 text-green-400",
  REJECTED: "bg-red-500/20 text-red-400",
};

export function ArtistDashboard({ profile, submissions }: ArtistDashboardProps) {
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  const pendingCount = submissions.filter(
    (s) => s.status === "PENDING" || s.status === "UNDER_REVIEW"
  ).length;
  const approvedCount = submissions.filter(
    (s) => s.status === "APPROVED"
  ).length;
  const rejectedCount = submissions.filter(
    (s) => s.status === "REJECTED"
  ).length;

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-5xl md:text-7xl font-black mb-4 relative">
            <span className="absolute inset-0 blur-3xl bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500 opacity-50"></span>
            <span className="relative bg-gradient-to-r from-orange-400 via-pink-500 via-purple-500 to-cyan-400 bg-clip-text text-transparent glow-text">
              {profile.artist_name}
            </span>
          </h1>
          <p className="text-xl text-purple-200">Artist Dashboard</p>
        </div>
        <div className="flex gap-4">
          <a
            href="/submit"
            className="px-6 py-3 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 hover:from-orange-600 hover:via-pink-600 hover:to-purple-600 rounded-xl font-bold transition-all transform hover:scale-105 shadow-lg glow-box"
          >
            🎵 Submit New Track
          </a>
          <a
            href="/artist/profile"
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 hover:from-cyan-600 hover:via-blue-600 hover:to-purple-600 rounded-xl font-bold transition-all transform hover:scale-105 shadow-lg glow-box"
          >
            ✏️ Edit Profile
          </a>
          <button
            onClick={handleSignOut}
            disabled={isSigningOut}
            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl font-semibold transition-all disabled:opacity-50"
          >
            {isSigningOut ? "Signing out..." : "Sign Out"}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-2xl blur opacity-30"></div>
          <div className="relative bg-gradient-to-br from-yellow-900/40 to-orange-900/40 backdrop-blur-xl rounded-2xl p-6 border border-yellow-500/30 glow-box">
            <div className="text-4xl font-black text-yellow-400 mb-2">
              {pendingCount}
            </div>
            <div className="text-purple-200">Pending Review</div>
          </div>
        </div>

        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-cyan-600 rounded-2xl blur opacity-30"></div>
          <div className="relative bg-gradient-to-br from-green-900/40 to-cyan-900/40 backdrop-blur-xl rounded-2xl p-6 border border-green-500/30 glow-box">
            <div className="text-4xl font-black text-green-400 mb-2">
              {approvedCount}
            </div>
            <div className="text-purple-200">Approved</div>
          </div>
        </div>

        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-pink-600 rounded-2xl blur opacity-30"></div>
          <div className="relative bg-gradient-to-br from-red-900/40 to-pink-900/40 backdrop-blur-xl rounded-2xl p-6 border border-red-500/30 glow-box">
            <div className="text-4xl font-black text-red-400 mb-2">
              {rejectedCount}
            </div>
            <div className="text-purple-200">Rejected</div>
          </div>
        </div>
      </div>

      {/* Submissions List */}
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 rounded-3xl blur-xl opacity-30"></div>
        <div className="relative bg-gradient-to-br from-purple-900/40 via-pink-900/40 to-cyan-900/40 backdrop-blur-xl rounded-3xl p-8 border border-purple-500/30 glow-box">
          <h2 className="text-3xl font-black mb-6 bg-gradient-to-r from-cyan-400 via-pink-400 to-purple-400 bg-clip-text text-transparent glow-text">
            Your Submissions
          </h2>

          {submissions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-purple-300 text-lg mb-4">
                You haven&apos;t submitted any tracks yet.
              </p>
              <a
                href="/submit"
                className="inline-block px-6 py-3 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 hover:from-orange-600 hover:via-pink-600 hover:to-purple-600 rounded-xl font-bold transition-all transform hover:scale-105 shadow-lg glow-box"
              >
                Submit Your First Track
              </a>
            </div>
          ) : (
            <div className="space-y-4">
              {submissions.map((submission) => (
                <div
                  key={submission.id}
                  className="p-6 bg-gradient-to-r from-purple-800/40 to-pink-800/40 rounded-xl border border-purple-500/30 hover:scale-105 transition-transform"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-cyan-300 mb-2">
                        {submission.track_title}
                      </h3>
                      <div className="text-purple-200 space-y-1">
                        <div>Artist: {submission.artist_name}</div>
                        {submission.genre && (
                          <div>Genre: {submission.genre}</div>
                        )}
                        <div>
                          Submitted:{" "}
                          {new Date(submission.created_at).toLocaleDateString()}
                        </div>
                        {submission.reviewed_at && (
                          <div>
                            Reviewed:{" "}
                            {new Date(submission.reviewed_at).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <span
                        className={`px-3 py-1 rounded text-sm font-medium ${
                          STATUS_COLORS[submission.status] ||
                          "bg-gray-500/20 text-gray-400"
                        }`}
                      >
                        {submission.status}
                      </span>
                    </div>
                  </div>

                  {submission.admin_notes && (
                    <div className="mt-4 p-4 bg-gray-800/50 rounded-lg border border-gray-600">
                      <div className="text-sm font-semibold text-gray-300 mb-1">
                        Admin Notes:
                      </div>
                      <div className="text-sm text-gray-400">
                        {submission.admin_notes}
                      </div>
                    </div>
                  )}

                  {submission.approved_track && (
                    <div className="mt-4 p-4 bg-green-900/30 border border-green-500/50 rounded-lg">
                      <div className="text-sm font-semibold text-green-400">
                        ✓ Approved! Your track is now in rotation.
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

