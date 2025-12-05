"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function ArtistRegistrationForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    artist_name: "",
    contact_name: "",
    contact_phone: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setIsSubmitting(false);
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      setIsSubmitting(false);
      return;
    }

    try {
      const supabase = createClient();

      // Create auth user
      const { data: authData, error: authError } =
        await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
        });

      if (authError) {
        setError(authError.message);
        setIsSubmitting(false);
        return;
      }

      if (!authData.user) {
        setError("Failed to create account");
        setIsSubmitting(false);
        return;
      }

      // Create artist profile
      const { error: profileError } = await supabase
        .from("artist_profiles")
        .insert({
          user_id: authData.user.id,
          artist_name: formData.artist_name,
          contact_name: formData.contact_name,
          contact_phone: formData.contact_phone || null,
        });

      if (profileError) {
        console.error("Error creating profile:", profileError);
        setError("Account created but failed to create profile. Please contact support.");
        setIsSubmitting(false);
        return;
      }

      // Success - redirect to dashboard
      router.push("/artist/dashboard");
      router.refresh();
    } catch (err) {
      console.error("Registration error:", err);
      setError("An unexpected error occurred");
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h2 className="text-4xl font-black mb-8 bg-gradient-to-r from-cyan-400 via-pink-400 to-purple-400 bg-clip-text text-transparent glow-text text-center">
        🎵 Create Your Account 🎵
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
              placeholder="Your artist name"
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
              placeholder="Your full name"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2 text-purple-300">
            Email Address *
          </label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="w-full px-4 py-3 bg-purple-900/40 border border-purple-500/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-white placeholder-purple-400/50 transition-all"
            placeholder="your@email.com"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2 text-purple-300">
            Phone Number (optional)
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2 text-purple-300">
              Password *
            </label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full px-4 py-3 bg-purple-900/40 border border-purple-500/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-white placeholder-purple-400/50 transition-all"
              placeholder="At least 8 characters"
              minLength={8}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-purple-300">
              Confirm Password *
            </label>
            <input
              type="password"
              required
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              className="w-full px-4 py-3 bg-purple-900/40 border border-purple-500/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-white placeholder-purple-400/50 transition-all"
              placeholder="Confirm password"
            />
          </div>
        </div>

        {error && (
          <div className="p-4 bg-gradient-to-r from-red-900/40 to-pink-900/40 border border-red-500/50 rounded-xl text-red-300 text-sm glow-box">
            ⚠️ {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full px-8 py-4 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 hover:from-orange-600 hover:via-pink-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-bold text-lg transition-all transform hover:scale-105 active:scale-95 shadow-lg glow-box"
        >
          {isSubmitting ? "🚀 Creating Account..." : "🎵 Register"}
        </button>

        <div className="text-center text-purple-300 text-sm">
          Already have an account?{" "}
          <a
            href="/artist/login"
            className="text-cyan-400 hover:text-cyan-300 font-semibold underline"
          >
            Sign in here
          </a>
        </div>
      </form>
    </div>
  );
}

