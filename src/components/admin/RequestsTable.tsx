"use client";

import { RequestWithTrack } from "@/types/db";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface RequestsTableProps {
  requests: RequestWithTrack[];
}

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-500/20 text-yellow-400",
  QUEUED: "bg-blue-500/20 text-blue-400",
  PLAYED: "bg-green-500/20 text-green-400",
  REJECTED: "bg-red-500/20 text-red-400",
};

export function RequestsTable({ requests }: RequestsTableProps) {
  const router = useRouter();
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const handleStatusChange = async (id: number, status: string) => {
    setUpdatingId(id);
    try {
      const response = await fetch("/api/admin/mark-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });

      if (!response.ok) {
        throw new Error("Failed to update request");
      }

      router.refresh();
    } catch (error) {
      console.error("Error updating request:", error);
      alert("Failed to update request");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold">Date</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Name</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Message</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Track</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {requests.map((request) => (
              <tr key={request.id} className="hover:bg-gray-700/50 transition-colors">
                <td className="px-4 py-3 text-sm text-gray-400">
                  {new Date(request.created_at).toLocaleString()}
                </td>
                <td className="px-4 py-3">{request.name || "Anonymous"}</td>
                <td className="px-4 py-3 text-sm">{request.message}</td>
                <td className="px-4 py-3 text-sm text-gray-400">
                  {request.requested_track
                    ? `${request.requested_track.artist || "Unknown"} - ${request.requested_track.title || "Unknown"}`
                    : "—"}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      STATUS_COLORS[request.status] || "bg-gray-500/20 text-gray-400"
                    }`}
                  >
                    {request.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    {request.status === "PENDING" && (
                      <>
                        <button
                          onClick={() => handleStatusChange(request.id, "QUEUED")}
                          disabled={updatingId === request.id}
                          className="px-3 py-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded text-xs disabled:opacity-50"
                        >
                          Queue
                        </button>
                        <button
                          onClick={() => handleStatusChange(request.id, "REJECTED")}
                          disabled={updatingId === request.id}
                          className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded text-xs disabled:opacity-50"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {request.status === "QUEUED" && (
                      <button
                        onClick={() => handleStatusChange(request.id, "PLAYED")}
                        disabled={updatingId === request.id}
                        className="px-3 py-1 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded text-xs disabled:opacity-50"
                      >
                        Mark Played
                      </button>
                    )}
                    {/* TODO: Add "Create shout-out segment" button for future AI integration */}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {requests.length === 0 && (
          <div className="p-8 text-center text-gray-400">
            No requests found.
          </div>
        )}
      </div>
    </div>
  );
}

