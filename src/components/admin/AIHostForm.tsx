"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function AIHostForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    voice_id: "",
    persona_prompt: "",
    is_active: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/admin/ai-hosts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to save AI host");
      }

      router.refresh();
      setFormData({
        name: "",
        voice_id: "",
        persona_prompt: "",
        is_active: true,
      });
    } catch (error) {
      console.error("Error saving AI host:", error);
      alert("Failed to save AI host");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h2 className="text-2xl font-bold mb-4 text-orange-500">Create AI Host</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name *</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
            placeholder="DJ Flam"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Voice ID *</label>
          <input
            type="text"
            required
            value={formData.voice_id}
            onChange={(e) =>
              setFormData({ ...formData, voice_id: e.target.value })
            }
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
            placeholder="en-US-voice-001"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Persona Prompt *
          </label>
          <textarea
            required
            value={formData.persona_prompt}
            onChange={(e) =>
              setFormData({ ...formData, persona_prompt: e.target.value })
            }
            rows={6}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white resize-none"
            placeholder="You are a friendly radio host who loves music and engages with listeners..."
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
          disabled={isSubmitting}
          className="w-full px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-semibold transition-all"
        >
          {isSubmitting ? "Creating..." : "Create AI Host"}
        </button>
      </form>
    </div>
  );
}

