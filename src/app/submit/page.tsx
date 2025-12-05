import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Navigation } from "@/components/Navigation";
import { ArtistSubmissionForm } from "@/components/ArtistSubmissionForm";

export default async function SubmitPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/artist/login?redirect=/submit");
  }

  // Check if user has artist profile
  const { data: profile, error: profileError } = await supabase
    .from("artist_profiles")
    .select("id, artist_name, contact_name, contact_phone")
    .eq("user_id", user.id)
    .single();

  if (profileError || !profile) {
    redirect("/artist/register");
  }
  return (
    <div className="min-h-screen cosmic-bg relative">
      <Navigation />
      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="text-center mb-12 floating">
          <h1 className="text-6xl md:text-8xl font-black mb-6 relative">
            <span className="absolute inset-0 blur-3xl bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500 opacity-50"></span>
            <span className="relative bg-gradient-to-r from-orange-400 via-pink-500 via-purple-500 to-cyan-400 bg-clip-text text-transparent glow-text">
              SUBMIT YOUR MUSIC
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-purple-200 max-w-3xl mx-auto leading-relaxed">
            Share your music with the cosmos. Upload your tracks and let Flam Tunes
            bring your sound to listeners across the universe.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 via-purple-600 to-cyan-600 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition duration-1000"></div>
            <div className="relative bg-gradient-to-br from-purple-900/40 via-pink-900/40 to-cyan-900/40 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-purple-500/30 glow-box">
              <ArtistSubmissionForm artistProfile={profile} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

