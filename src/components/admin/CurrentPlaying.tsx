import { NowPlayingWithDetails } from "@/types/db";

interface CurrentPlayingProps {
  nowPlaying: NowPlayingWithDetails | null;
}

export function CurrentPlaying({ nowPlaying }: CurrentPlayingProps) {
  if (!nowPlaying) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h2 className="text-2xl font-bold mb-4 text-orange-500">Now Playing</h2>
        <p className="text-gray-400">No track information available</p>
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
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h2 className="text-2xl font-bold mb-4 text-orange-500">Now Playing</h2>
      <div className="space-y-3">
        <div>
          <div className="text-sm text-gray-400 mb-1">Title</div>
          <div className="text-xl font-semibold">{title}</div>
        </div>
        <div>
          <div className="text-sm text-gray-400 mb-1">Artist</div>
          <div className="text-lg">{artist}</div>
        </div>
        {showName && (
          <div>
            <div className="text-sm text-gray-400 mb-1">Show</div>
            <div className="text-lg">{showName}</div>
          </div>
        )}
        {nowPlaying.listeners_estimate !== null && (
          <div>
            <div className="text-sm text-gray-400 mb-1">Listeners</div>
            <div className="text-lg">{nowPlaying.listeners_estimate}</div>
          </div>
        )}
        <div>
          <div className="text-sm text-gray-400 mb-1">Started</div>
          <div className="text-sm">
            {new Date(nowPlaying.started_at).toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
}

