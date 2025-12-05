import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ArtistProfileForm } from "@/components/ArtistProfileForm";
import { Navigation } from "@/components/Navigation";

export default async function ArtistProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/artist/login");
  }

  // Get artist profile
  const { data: profile, error: profileError } = await supabase
    .from("artist_profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (profileError || !profile) {
    redirect("/artist/register");
  }

  return (
    <div className="min-h-screen cosmic-bg relative">
      <Navigation />
      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12 floating">
            <h1 className="text-5xl md:text-7xl font-black mb-6 relative">
              <span className="absolute inset-0 blur-3xl bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500 opacity-50"></span>
              <span className="relative bg-gradient-to-r from-orange-400 via-pink-500 via-purple-500 to-cyan-400 bg-clip-text text-transparent glow-text">
                Edit Profile
              </span>
            </h1>
          </div>

          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 via-purple-600 to-cyan-600 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition duration-1000"></div>
            <div className="relative bg-gradient-to-br from-purple-900/40 via-pink-900/40 to-cyan-900/40 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-purple-500/30 glow-box">
              <ArtistProfileForm profile={profile} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

