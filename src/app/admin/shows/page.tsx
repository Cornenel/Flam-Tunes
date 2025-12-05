import { createClient } from "@/lib/supabase/server";
import { ShowsTable } from "@/components/admin/ShowsTable";
import { ShowForm } from "@/components/admin/ShowForm";
import { ShowWithHost } from "@/types/db";

async function getShows(): Promise<ShowWithHost[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("shows")
    .select(`
      *,
      ai_host:ai_hosts(*)
    `)
    .order("start_time", { ascending: true });

  if (error || !data) {
    return [];
  }

  return data as ShowWithHost[];
}

async function getAIHosts() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("ai_hosts")
    .select("*")
    .eq("is_active", true)
    .order("name");

  return data || [];
}

export default async function ShowsPage() {
  const [shows, aiHosts] = await Promise.all([getShows(), getAIHosts()]);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-orange-500">Shows</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ShowsTable shows={shows} aiHosts={aiHosts} />
        </div>
        <div>
          <ShowForm aiHosts={aiHosts} />
        </div>
      </div>
    </div>
  );
}

