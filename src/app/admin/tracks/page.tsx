import { createClient } from "@/lib/supabase/server";
import { TracksTable } from "@/components/admin/TracksTable";
import { TrackUploadForm } from "@/components/admin/TrackUploadForm";
import { Track } from "@/types/db";

async function getTracks(): Promise<Track[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("tracks")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data) {
    return [];
  }

  return data;
}

export default async function TracksPage() {
  const tracks = await getTracks();

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-orange-500">Tracks</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TracksTable tracks={tracks} />
        </div>
        <div>
          <TrackUploadForm />
        </div>
      </div>
    </div>
  );
}

