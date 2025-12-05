"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function ArtistLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
        setIsLoading(false);
        return;
      }

      if (data.user) {
        // Check if user has an artist profile
        const { data: profile, error: profileError } = await supabase
          .from("artist_profiles")
          .select("id")
          .eq("user_id", data.user.id)
          .single();

        if (profileError || !profile) {
          setError("No artist profile found. Please register first.");
          await supabase.auth.signOut();
          setIsLoading(false);
          return;
        }

        router.push("/artist/dashboard");
        router.refresh();
      }
    } catch (err) {
      setError("An unexpected error occurred");
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-4xl font-black mb-8 bg-gradient-to-r from-cyan-400 via-pink-400 to-purple-400 bg-clip-text text-transparent glow-text text-center">
        🎵 Sign In 🎵
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold mb-2 text-purple-300">
            Email Address
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 bg-purple-900/40 border border-purple-500/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-white placeholder-purple-400/50 transition-all"
            placeholder="your@email.com"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2 text-purple-300">
            Password
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 bg-purple-900/40 border border-purple-500/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-white placeholder-purple-400/50 transition-all"
            placeholder="••••••••"
          />
        </div>

        {error && (
          <div className="p-4 bg-gradient-to-r from-red-900/40 to-pink-900/40 border border-red-500/50 rounded-xl text-red-300 text-sm glow-box">
            ⚠️ {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full px-8 py-4 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 hover:from-orange-600 hover:via-pink-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-bold text-lg transition-all transform hover:scale-105 active:scale-95 shadow-lg glow-box"
        >
          {isLoading ? "✨ Signing in..." : "🎵 Sign In"}
        </button>

        <div className="text-center text-purple-300 text-sm">
          Don&apos;t have an account?{" "}
          <a
            href="/artist/register"
            className="text-cyan-400 hover:text-cyan-300 font-semibold underline"
          >
            Register here
          </a>
        </div>
      </form>
    </div>
  );
}

