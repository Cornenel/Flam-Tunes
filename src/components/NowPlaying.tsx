import { createClient } from "@/lib/supabase/server";
import { NowPlayingWithDetails } from "@/types/db";

async function getNowPlaying(): Promise<NowPlayingWithDetails | null> {
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
    .limit(1)
    .single();

  if (error || !data) {
    return null;
  }

  return data as NowPlayingWithDetails;
}

export async function NowPlaying() {
  const nowPlaying = await getNowPlaying();

  if (!nowPlaying) {
    return (
      <div>
        <h2 className="text-3xl font-black mb-6 bg-gradient-to-r from-cyan-400 via-pink-400 to-purple-400 bg-clip-text text-transparent glow-text">
          🎵 Now Playing 🎵
        </h2>
        <p className="text-purple-300">No track information available</p>
      </div>
    );
  }

  const isTrack = nowPlaying.item_type === "TRACK";
  const title = isTrack
    ? nowPlaying.track?.title || "Unknown Title"
    : nowPlaying.segment?.type || "Segment";
  const artist = isTrack
    ? nowPlaying.track?.artist || "Unknown Artist"
    : nowPlaying.segment?.ai_host?.name || "AI Host";
  const showName = nowPlaying.show?.name;

  return (
    <div>
      <h2 className="text-3xl font-black mb-6 bg-gradient-to-r from-cyan-400 via-pink-400 to-purple-400 bg-clip-text text-transparent glow-text">
        🎵 Now Playing 🎵
      </h2>
      <div className="space-y-4">
        <div className="p-4 bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-xl border border-purple-500/30">
          <div className="text-xs text-purple-300 mb-1 uppercase tracking-wider">Title</div>
          <div className="text-2xl font-bold text-cyan-300 glow-text">{title}</div>
        </div>
        <div className="p-4 bg-gradient-to-r from-pink-900/30 to-cyan-900/30 rounded-xl border border-pink-500/30">
          <div className="text-xs text-purple-300 mb-1 uppercase tracking-wider">Artist</div>
          <div className="text-xl font-semibold text-pink-300">{artist}</div>
        </div>
        {showName && (
          <div className="p-4 bg-gradient-to-r from-cyan-900/30 to-purple-900/30 rounded-xl border border-cyan-500/30">
            <div className="text-xs text-purple-300 mb-1 uppercase tracking-wider">Show</div>
            <div className="text-lg font-semibold text-purple-300">{showName}</div>
          </div>
        )}
        {nowPlaying.listeners_estimate !== null && (
          <div className="p-4 bg-gradient-to-r from-orange-900/30 to-pink-900/30 rounded-xl border border-orange-500/30">
            <div className="text-xs text-purple-300 mb-1 uppercase tracking-wider">Listeners</div>
            <div className="text-lg font-semibold text-orange-300">👂 {nowPlaying.listeners_estimate}</div>
          </div>
        )}
      </div>
    </div>
  );
}

