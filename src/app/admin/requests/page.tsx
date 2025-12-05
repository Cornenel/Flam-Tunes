import { createClient } from "@/lib/supabase/server";
import { RequestsTable } from "@/components/admin/RequestsTable";
import { RequestWithTrack } from "@/types/db";

async function getRequests(): Promise<RequestWithTrack[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("requests")
    .select(`
      *,
      requested_track:tracks(*)
    `)
    .order("created_at", { ascending: false });

  if (error || !data) {
    return [];
  }

  return data as RequestWithTrack[];
}

export default async function RequestsPage() {
  const requests = await getRequests();

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-orange-500">Listener Requests</h1>
      </div>

      <RequestsTable requests={requests} />
    </div>
  );
}

