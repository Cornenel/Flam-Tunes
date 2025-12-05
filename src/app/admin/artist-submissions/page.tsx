import { createClient } from "@/lib/supabase/server";
import { ArtistSubmissionsTable } from "@/components/admin/ArtistSubmissionsTable";
import { ArtistSubmissionWithTrack } from "@/types/db";

async function getSubmissions(): Promise<ArtistSubmissionWithTrack[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("artist_submissions")
    .select(`
      *,
      approved_track:tracks(*)
    `)
    .order("created_at", { ascending: false });

  if (error || !data) {
    return [];
  }

  return data as ArtistSubmissionWithTrack[];
}

export default async function ArtistSubmissionsPage() {
  const submissions = await getSubmissions();

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-orange-500">
          Artist Submissions
        </h1>
        <p className="text-gray-400">
          Review and approve music submissions from artists
        </p>
      </div>

      <ArtistSubmissionsTable submissions={submissions} />
    </div>
  );
}

