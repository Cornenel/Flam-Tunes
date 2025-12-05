"use client";

import { useState } from "react";

export function RequestForm() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const response = await fetch("/api/requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name || undefined,
          message,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit request");
      }

      setSubmitStatus("success");
      setName("");
      setMessage("");
    } catch (error) {
      console.error("Error submitting request:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-black mb-6 bg-gradient-to-r from-orange-400 via-pink-400 to-purple-400 bg-clip-text text-transparent glow-text">
        💬 Send a Request 💬
      </h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="name" className="block text-sm font-semibold mb-2 text-purple-300">
            Name (optional)
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 bg-purple-900/40 border border-purple-500/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-white placeholder-purple-400/50 transition-all"
            placeholder="Your name"
          />
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-semibold mb-2 text-purple-300">
            Message *
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            rows={4}
            className="w-full px-4 py-3 bg-purple-900/40 border border-purple-500/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-white placeholder-purple-400/50 resize-none transition-all"
            placeholder="What would you like to request?"
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting || !message.trim()}
          className="w-full px-6 py-4 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 hover:from-orange-600 hover:via-pink-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-bold text-lg transition-all transform hover:scale-105 active:scale-95 shadow-lg glow-box"
        >
          {isSubmitting ? "✨ Submitting..." : "🚀 Submit Request"}
        </button>
        {submitStatus === "success" && (
          <div className="p-4 bg-gradient-to-r from-green-900/40 to-cyan-900/40 border border-green-500/50 rounded-xl text-green-300 text-sm glow-box">
            ✨ Request submitted successfully!
          </div>
        )}
        {submitStatus === "error" && (
          <div className="p-4 bg-gradient-to-r from-red-900/40 to-pink-900/40 border border-red-500/50 rounded-xl text-red-300 text-sm glow-box">
            ⚠️ Failed to submit request. Please try again.
          </div>
        )}
      </form>
    </div>
  );
}

