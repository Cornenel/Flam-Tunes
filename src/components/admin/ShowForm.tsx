"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AIHost } from "@/types/db";

interface ShowFormProps {
  aiHosts: AIHost[];
  show?: {
    id: number;
    name: string;
    description: string | null;
    ai_host_id: number | null;
    start_time: string;
    end_time: string;
    days_of_week: number[];
    priority: number;
    is_active: boolean;
  };
}

const DAYS_OF_WEEK = [
  { value: 1, label: "Monday" },
  { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" },
  { value: 4, label: "Thursday" },
  { value: 5, label: "Friday" },
  { value: 6, label: "Saturday" },
  { value: 7, label: "Sunday" },
];

export function ShowForm({ aiHosts, show }: ShowFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: show?.name || "",
    description: show?.description || "",
    ai_host_id: show?.ai_host_id?.toString() || "",
    start_time: show?.start_time || "09:00",
    end_time: show?.end_time || "10:00",
    days_of_week: show?.days_of_week || [],
    priority: show?.priority || 0,
    is_active: show?.is_active ?? true,
  });

  const handleDayToggle = (day: number) => {
    setFormData((prev) => ({
      ...prev,
      days_of_week: prev.days_of_week.includes(day)
        ? prev.days_of_week.filter((d) => d !== day)
        : [...prev.days_of_week, day],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(show ? `/api/admin/shows/${show.id}` : "/api/admin/shows", {
        method: show ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          ai_host_id: formData.ai_host_id ? parseInt(formData.ai_host_id) : null,
          days_of_week: formData.days_of_week,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save show");
      }

      router.refresh();
      if (!show) {
        setFormData({
          name: "",
          description: "",
          ai_host_id: "",
          start_time: "09:00",
          end_time: "10:00",
          days_of_week: [],
          priority: 0,
          is_active: true,
        });
      }
    } catch (error) {
      console.error("Error saving show:", error);
      alert("Failed to save show");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h2 className="text-2xl font-bold mb-4 text-orange-500">
        {show ? "Edit Show" : "Create Show"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name *</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            rows={3}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">AI Host</label>
          <select
            value={formData.ai_host_id}
            onChange={(e) =>
              setFormData({ ...formData, ai_host_id: e.target.value })
            }
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
          >
            <option value="">None</option>
            {aiHosts.map((host) => (
              <option key={host.id} value={host.id}>
                {host.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Start Time *</label>
            <input
              type="time"
              required
              value={formData.start_time}
              onChange={(e) =>
                setFormData({ ...formData, start_time: e.target.value })
              }
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">End Time *</label>
            <input
              type="time"
              required
              value={formData.end_time}
              onChange={(e) =>
                setFormData({ ...formData, end_time: e.target.value })
              }
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Days of Week *</label>
          <div className="grid grid-cols-2 gap-2">
            {DAYS_OF_WEEK.map((day) => (
              <label
                key={day.value}
                className="flex items-center gap-2 p-2 bg-gray-700 rounded cursor-pointer hover:bg-gray-600"
              >
                <input
                  type="checkbox"
                  checked={formData.days_of_week.includes(day.value)}
                  onChange={() => handleDayToggle(day.value)}
                  className="w-4 h-4 text-orange-500 rounded focus:ring-orange-500"
                />
                <span className="text-sm">{day.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Priority</label>
          <input
            type="number"
            value={formData.priority}
            onChange={(e) =>
              setFormData({ ...formData, priority: parseInt(e.target.value) || 0 })
            }
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="is_active"
            checked={formData.is_active}
            onChange={(e) =>
              setFormData({ ...formData, is_active: e.target.checked })
            }
            className="w-4 h-4 text-orange-500 rounded focus:ring-orange-500"
          />
          <label htmlFor="is_active" className="text-sm">
            Active
          </label>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || formData.days_of_week.length === 0}
          className="w-full px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-semibold transition-all"
        >
          {isSubmitting ? "Saving..." : show ? "Update Show" : "Create Show"}
        </button>
      </form>
    </div>
  );
}

