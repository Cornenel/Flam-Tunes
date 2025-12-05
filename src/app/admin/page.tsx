import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { StatsCard } from "@/components/admin/StatsCard";
import { QuickLinks } from "@/components/admin/QuickLinks";
import { CurrentPlaying } from "@/components/admin/CurrentPlaying";

export default async function AdminOverviewPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  // Get stats
  const [showsCount, tracksCount, requestsCount, nowPlaying] = await Promise.all([
    supabase.from("shows").select("id", { count: "exact", head: true }),
    supabase.from("tracks").select("id", { count: "exact", head: true }),
    supabase
      .from("requests")
      .select("id", { count: "exact", head: true })
      .eq("status", "PENDING"),
    supabase
      .from("now_playing_history")
      .select(
        `
        *,
        track:tracks(*),
        segment:segments(*, ai_host:ai_hosts(*)),
        show:shows(*)
      `
      )
      .order("started_at", { ascending: false })
      .limit(1)
      .single(),
  ]);

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8 text-orange-500">Dashboard Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatsCard
          title="Active Shows"
          value={showsCount.count || 0}
          icon="📻"
        />
        <StatsCard
          title="Total Tracks"
          value={tracksCount.count || 0}
          icon="🎵"
        />
        <StatsCard
          title="Pending Requests"
          value={requestsCount.count || 0}
          icon="💬"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CurrentPlaying nowPlaying={nowPlaying.data} />
        <QuickLinks />
      </div>
    </div>
  );
}

