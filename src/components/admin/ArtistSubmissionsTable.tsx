"use client";

import { ArtistSubmissionWithTrack } from "@/types/db";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface ArtistSubmissionsTableProps {
  submissions: ArtistSubmissionWithTrack[];
}

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-500/20 text-yellow-400",
  UNDER_REVIEW: "bg-blue-500/20 text-blue-400",
  APPROVED: "bg-green-500/20 text-green-400",
  REJECTED: "bg-red-500/20 text-red-400",
};

export function ArtistSubmissionsTable({
  submissions,
}: ArtistSubmissionsTableProps) {
  const router = useRouter();
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [reviewingId, setReviewingId] = useState<number | null>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleStatusChange = async (
    id: number,
    status: "APPROVED" | "REJECTED" | "UNDER_REVIEW",
    notes?: string
  ) => {
    setIsProcessing(true);
    try {
      const response = await fetch("/api/admin/artist-submissions/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          status,
          admin_notes: notes || adminNotes,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update submission");
      }

      router.refresh();
      setExpandedId(null);
      setReviewingId(null);
      setAdminNotes("");
    } catch (error) {
      console.error("Error updating submission:", error);
      alert("Failed to update submission");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold">
                Artist
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold">
                Track
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold">
                Release Date
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold">
                Contact
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold">
                Status
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {submissions.map((submission) => (
              <>
                <tr
                  key={submission.id}
                  className="hover:bg-gray-700/50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="font-medium">{submission.artist_name}</div>
                    {submission.rights_holder_name && (
                      <div className="text-xs text-gray-400">
                        Rights: {submission.rights_holder_name}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium">{submission.track_title}</div>
                    {submission.genre && (
                      <div className="text-xs text-gray-400">
                        {submission.genre}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {new Date(submission.release_date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div>{submission.contact_email}</div>
                    <div className="text-xs text-gray-400">
                      {submission.contact_name}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        STATUS_COLORS[submission.status] ||
                        "bg-gray-500/20 text-gray-400"
                      }`}
                    >
                      {submission.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() =>
                        setExpandedId(
                          expandedId === submission.id ? null : submission.id
                        )
                      }
                      className="text-orange-500 hover:text-orange-400 text-sm font-medium"
                    >
                      {expandedId === submission.id ? "Hide" : "View"} Details
                    </button>
                  </td>
                </tr>
                {expandedId === submission.id && (
                  <tr>
                    <td colSpan={6} className="px-4 py-6 bg-gray-700/30">
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-sm font-semibold text-gray-300 mb-1">
                              File Information
                            </div>
                            <div className="text-sm text-gray-400">
                              {submission.file_name} (
                              {(submission.file_size
                                ? submission.file_size / 1024 / 1024
                                : 0
                              ).toFixed(2)}{" "}
                              MB)
                            </div>
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-gray-300 mb-1">
                              Track Details
                            </div>
                            <div className="text-sm text-gray-400">
                              {submission.bpm && `BPM: ${submission.bpm} • `}
                              {submission.mood_tags &&
                                submission.mood_tags.length > 0 &&
                                `Tags: ${submission.mood_tags.join(", ")}`}
                            </div>
                          </div>
                        </div>

                        {submission.additional_info && (
                          <div>
                            <div className="text-sm font-semibold text-gray-300 mb-1">
                              Additional Information
                            </div>
                            <div className="text-sm text-gray-400 bg-gray-800 p-3 rounded border border-gray-600">
                              {submission.additional_info}
                            </div>
                          </div>
                        )}

                        <div className="flex gap-2">
                          <div className="flex-1">
                            <span className="text-sm font-semibold text-gray-300">
                              Ownership Confirmed:
                            </span>{" "}
                            <span
                              className={`text-sm ${
                                submission.ownership_confirmed
                                  ? "text-green-400"
                                  : "text-red-400"
                              }`}
                            >
                              {submission.ownership_confirmed ? "✓ Yes" : "✗ No"}
                            </span>
                          </div>
                          <div className="flex-1">
                            <span className="text-sm font-semibold text-gray-300">
                              Permission Granted:
                            </span>{" "}
                            <span
                              className={`text-sm ${
                                submission.permission_granted
                                  ? "text-green-400"
                                  : "text-red-400"
                              }`}
                            >
                              {submission.permission_granted ? "✓ Yes" : "✗ No"}
                            </span>
                          </div>
                        </div>

                        {submission.admin_notes && (
                          <div>
                            <div className="text-sm font-semibold text-gray-300 mb-1">
                              Admin Notes
                            </div>
                            <div className="text-sm text-gray-400 bg-gray-800 p-3 rounded border border-gray-600">
                              {submission.admin_notes}
                            </div>
                          </div>
                        )}

                        {submission.approved_track && (
                          <div className="p-3 bg-green-900/30 border border-green-500/50 rounded">
                            <div className="text-sm font-semibold text-green-400">
                              ✓ Approved and added to tracks library
                            </div>
                            <div className="text-xs text-gray-400 mt-1">
                              Track ID: {submission.approved_track.id}
                            </div>
                          </div>
                        )}

                        {submission.status === "PENDING" ||
                        submission.status === "UNDER_REVIEW" ? (
                          <div className="space-y-3 pt-4 border-t border-gray-600">
                            {reviewingId !== submission.id ? (
                              <button
                                onClick={() => setReviewingId(submission.id)}
                                className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded text-sm font-medium"
                              >
                                Review Submission
                              </button>
                            ) : (
                              <div className="space-y-3">
                                <div>
                                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                                    Admin Notes
                                  </label>
                                  <textarea
                                    value={adminNotes}
                                    onChange={(e) =>
                                      setAdminNotes(e.target.value)
                                    }
                                    rows={3}
                                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white resize-none"
                                    placeholder="Add notes about this submission..."
                                  />
                                </div>
                                <div className="flex gap-3">
                                  <button
                                    onClick={() =>
                                      handleStatusChange(
                                        submission.id,
                                        "APPROVED",
                                        adminNotes
                                      )
                                    }
                                    disabled={isProcessing}
                                    className="flex-1 px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded text-sm font-medium disabled:opacity-50"
                                  >
                                    ✓ Approve
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleStatusChange(
                                        submission.id,
                                        "REJECTED",
                                        adminNotes
                                      )
                                    }
                                    disabled={isProcessing}
                                    className="flex-1 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded text-sm font-medium disabled:opacity-50"
                                  >
                                    ✗ Reject
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleStatusChange(
                                        submission.id,
                                        "UNDER_REVIEW",
                                        adminNotes
                                      )
                                    }
                                    disabled={isProcessing}
                                    className="flex-1 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded text-sm font-medium disabled:opacity-50"
                                  >
                                    🔍 Under Review
                                  </button>
                                  <button
                                    onClick={() => {
                                      setReviewingId(null);
                                      setAdminNotes("");
                                    }}
                                    className="px-4 py-2 bg-gray-500/20 hover:bg-gray-500/30 text-gray-400 rounded text-sm font-medium"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="text-sm text-gray-400">
                            Reviewed on:{" "}
                            {submission.reviewed_at
                              ? new Date(
                                  submission.reviewed_at
                                ).toLocaleString()
                              : "N/A"}
                            {submission.reviewed_by && (
                              <> • By: {submission.reviewed_by}</>
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
        {submissions.length === 0 && (
          <div className="p-8 text-center text-gray-400">
            No artist submissions found.
          </div>
        )}
      </div>
    </div>
  );
}

