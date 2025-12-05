"use client";

import { AIHost } from "@/types/db";
import { useState } from "react";

interface AIHostsTableProps {
  aiHosts: AIHost[];
}

export function AIHostsTable({ aiHosts }: AIHostsTableProps) {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold">Name</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Voice ID</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {aiHosts.map((host) => (
              <>
                <tr
                  key={host.id}
                  className="hover:bg-gray-700/50 transition-colors cursor-pointer"
                  onClick={() =>
                    setExpandedId(expandedId === host.id ? null : host.id)
                  }
                >
                  <td className="px-4 py-3 font-medium">{host.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">
                    {host.voice_id}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        host.is_active
                          ? "bg-green-500/20 text-green-400"
                          : "bg-gray-500/20 text-gray-400"
                      }`}
                    >
                      {host.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button className="text-orange-500 hover:text-orange-400 text-sm">
                      {expandedId === host.id ? "Hide" : "View"} Prompt
                    </button>
                  </td>
                </tr>
                {expandedId === host.id && (
                  <tr>
                    <td colSpan={4} className="px-4 py-4 bg-gray-700/30">
                      <div className="space-y-2">
                        <div className="text-sm font-medium text-gray-300">
                          Persona Prompt:
                        </div>
                        <div className="text-sm text-gray-400 bg-gray-800 p-3 rounded border border-gray-600 whitespace-pre-wrap">
                          {host.persona_prompt}
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
        {aiHosts.length === 0 && (
          <div className="p-8 text-center text-gray-400">
            No AI hosts found. Create one to get started.
          </div>
        )}
      </div>
    </div>
  );
}

