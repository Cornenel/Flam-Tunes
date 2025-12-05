"use client";

import { ShowWithHost, AIHost } from "@/types/db";
import { useState } from "react";

interface ShowsTableProps {
  shows: ShowWithHost[];
  aiHosts: AIHost[];
}

function formatTime(timeString: string): string {
  const [hours, minutes] = timeString.split(":");
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
}

function getDayNames(days: number[]): string {
  const dayMap: Record<number, string> = {
    1: "Mon",
    2: "Tue",
    3: "Wed",
    4: "Thu",
    5: "Fri",
    6: "Sat",
    7: "Sun",
  };
  return days.map((d) => dayMap[d] || "").join(", ");
}

export function ShowsTable({ shows, aiHosts }: ShowsTableProps) {
  const [editingId, setEditingId] = useState<number | null>(null);

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold">Name</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Time</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Days</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Host</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {shows.map((show) => (
              <tr
                key={show.id}
                className="hover:bg-gray-700/50 transition-colors"
              >
                <td className="px-4 py-3">
                  <div className="font-medium">{show.name}</div>
                  {show.description && (
                    <div className="text-sm text-gray-400 mt-1">
                      {show.description}
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 text-sm">
                  {formatTime(show.start_time)} - {formatTime(show.end_time)}
                </td>
                <td className="px-4 py-3 text-sm">{getDayNames(show.days_of_week)}</td>
                <td className="px-4 py-3 text-sm">
                  {show.ai_host?.name || "—"}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      show.is_active
                        ? "bg-green-500/20 text-green-400"
                        : "bg-gray-500/20 text-gray-400"
                    }`}
                  >
                    {show.is_active ? "Active" : "Inactive"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {shows.length === 0 && (
          <div className="p-8 text-center text-gray-400">
            No shows found. Create one to get started.
          </div>
        )}
      </div>
    </div>
  );
}

