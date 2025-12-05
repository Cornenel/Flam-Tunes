import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ArtistDashboard } from "@/components/ArtistDashboard";
import { Navigation } from "@/components/Navigation";

export default async function ArtistDashboardPage() {
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

  // Get artist submissions
  const { data: submissions, error: submissionsError } = await supabase
    .from("artist_submissions")
    .select(`
      *,
      approved_track:tracks(*)
    `)
    .eq("artist_profile_id", profile.id)
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen cosmic-bg relative">
      <Navigation />
      <div className="container mx-auto px-4 py-12 relative z-10">
        <ArtistDashboard profile={profile} submissions={submissions || []} />
      </div>
    </div>
  );
}

