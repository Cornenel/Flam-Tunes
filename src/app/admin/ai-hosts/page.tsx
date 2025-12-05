import { createClient } from "@/lib/supabase/server";
import { AIHostsTable } from "@/components/admin/AIHostsTable";
import { AIHostForm } from "@/components/admin/AIHostForm";
import { AIHost } from "@/types/db";

async function getAIHosts(): Promise<AIHost[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("ai_hosts")
    .select("*")
    .order("name");

  if (error || !data) {
    return [];
  }

  return data;
}

export default async function AIHostsPage() {
  const aiHosts = await getAIHosts();

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-orange-500">AI Hosts</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AIHostsTable aiHosts={aiHosts} />
        </div>
        <div>
          <AIHostForm />
        </div>
      </div>
    </div>
  );
}

