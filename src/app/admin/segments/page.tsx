import { createClient } from "@/lib/supabase/server";
import { SegmentsTable } from "@/components/admin/SegmentsTable";
import { SegmentWithDetails } from "@/types/db";

async function getSegments(): Promise<SegmentWithDetails[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("segments")
    .select(`
      *,
      ai_host:ai_hosts(*),
      show:shows(*)
    `)
    .order("created_at", { ascending: false });

  if (error || !data) {
    return [];
  }

  return data as SegmentWithDetails[];
}

export default async function SegmentsPage() {
  const segments = await getSegments();

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-orange-500">Segments</h1>
        <p className="text-gray-400">
          AI-generated talk segments, news, weather, and ads
        </p>
      </div>

      <SegmentsTable segments={segments} />
    </div>
  );
}

