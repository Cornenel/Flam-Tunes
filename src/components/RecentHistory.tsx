import { createClient } from "@/lib/supabase/server";
import { NowPlayingWithDetails } from "@/types/db";

async function getRecentHistory(): Promise<NowPlayingWithDetails[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
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
    .limit(5);

  if (error || !data) {
    return [];
  }

  return data as NowPlayingWithDetails[];
}

export async function RecentHistory() {
  const history = await getRecentHistory();

  if (history.length === 0) {
    return (
      <div>
        <h2 className="text-3xl font-black mb-6 bg-gradient-to-r from-cyan-400 via-pink-400 to-purple-400 bg-clip-text text-transparent glow-text">
          📜 Recent History 📜
        </h2>
        <p className="text-purple-300">No history available</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-3xl font-black mb-6 bg-gradient-to-r from-cyan-400 via-pink-400 to-purple-400 bg-clip-text text-transparent glow-text">
        📜 Recent History 📜
      </h2>
      <div className="space-y-3">
        {history.map((item, index) => {
          const isTrack = item.item_type === "TRACK";
          const title = isTrack
            ? item.track?.title || "Unknown Title"
            : item.segment?.type || "Segment";
          const artist = isTrack
            ? item.track?.artist || "Unknown Artist"
            : item.segment?.ai_host?.name || "AI Host";

          const gradients = [
            "from-purple-900/40 to-pink-900/40 border-purple-500/30",
            "from-pink-900/40 to-cyan-900/40 border-pink-500/30",
            "from-cyan-900/40 to-blue-900/40 border-cyan-500/30",
            "from-blue-900/40 to-purple-900/40 border-blue-500/30",
            "from-purple-900/40 to-orange-900/40 border-purple-500/30",
          ];

          return (
            <div
              key={item.id}
              className={`flex justify-between items-center p-4 bg-gradient-to-r ${gradients[index % gradients.length]} rounded-xl border backdrop-blur-sm hover:scale-105 transition-transform cursor-pointer`}
            >
              <div className="flex-1">
                <div className="font-bold text-cyan-300 mb-1">{title}</div>
                <div className="text-sm text-pink-300">{artist}</div>
              </div>
              <div className="text-xs text-purple-300 font-semibold">
                {new Date(item.started_at).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

