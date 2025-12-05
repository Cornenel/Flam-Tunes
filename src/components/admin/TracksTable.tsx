"use client";

import { Track } from "@/types/db";
import { getTrackUrl } from "@/lib/storage";
import { useState, useMemo } from "react";

interface TracksTableProps {
  tracks: Track[];
}

export function TracksTable({ tracks }: TracksTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [playingTrackId, setPlayingTrackId] = useState<number | null>(null);

  // Get unique genres
  const genres = useMemo(() => {
    const genreSet = new Set(tracks.map((t) => t.genre).filter(Boolean));
    return Array.from(genreSet).sort();
  }, [tracks]);

  // Filter tracks
  const filteredTracks = useMemo(() => {
    return tracks.filter((track) => {
      const matchesSearch =
        searchTerm === "" ||
        (track.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (track.artist || "").toLowerCase().includes(searchTerm.toLowerCase());
      const matchesGenre =
        selectedGenre === "all" || track.genre === selectedGenre;
      const matchesType =
        selectedType === "all" ||
        (selectedType === "jingle" && track.is_jingle) ||
        (selectedType === "bed" && track.is_bed_music) ||
        (selectedType === "track" &&
          !track.is_jingle &&
          !track.is_bed_music);

      return matchesSearch && matchesGenre && matchesType;
    });
  }, [tracks, searchTerm, selectedGenre, selectedType]);

  const handlePlay = (trackId: number, url: string) => {
    if (playingTrackId === trackId) {
      setPlayingTrackId(null);
      return;
    }
    setPlayingTrackId(trackId);
    // In a real implementation, you'd use an audio player here
    console.log("Playing track:", url);
  };

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-300">
              Search
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by title or artist..."
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-300">
              Genre
            </label>
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
            >
              <option value="all">All Genres</option>
              {genres.map((genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-300">
              Type
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
            >
              <option value="all">All Types</option>
              <option value="track">Tracks</option>
              <option value="jingle">Jingles</option>
              <option value="bed">Bed Music</option>
            </select>
          </div>
        </div>
        <div className="mt-2 text-sm text-gray-400">
          Showing {filteredTracks.length} of {tracks.length} tracks
        </div>
      </div>

      {/* Tracks Table */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Preview
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Title
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Artist
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Genre
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Type
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  BPM
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredTracks.map((track) => {
                const trackUrl = getTrackUrl(track.storage_path);
                return (
                  <tr
                    key={track.id}
                    className="hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handlePlay(track.id, trackUrl)}
                        className="w-8 h-8 rounded-full bg-orange-500 hover:bg-orange-600 flex items-center justify-center transition-colors"
                        aria-label={
                          playingTrackId === track.id ? "Pause" : "Play"
                        }
                      >
                        {playingTrackId === track.id ? (
                          <svg
                            className="w-4 h-4 text-white"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                        ) : (
                          <svg
                            className="w-4 h-4 text-white ml-0.5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                          </svg>
                        )}
                      </button>
                      {playingTrackId === track.id && (
                        <audio
                          src={trackUrl}
                          autoPlay
                          onEnded={() => setPlayingTrackId(null)}
                        />
                      )}
                    </td>
                    <td className="px-4 py-3 font-medium">
                      {track.title || "Untitled"}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-400">
                      {track.artist || "Unknown"}
                    </td>
                    <td className="px-4 py-3 text-sm">{track.genre || "—"}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        {track.is_jingle && (
                          <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs">
                            Jingle
                          </span>
                        )}
                        {track.is_bed_music && (
                          <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-xs">
                            Bed
                          </span>
                        )}
                        {!track.is_jingle && !track.is_bed_music && (
                          <span className="px-2 py-1 bg-gray-500/20 text-gray-400 rounded text-xs">
                            Track
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">{track.bpm || "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filteredTracks.length === 0 && (
            <div className="p-8 text-center text-gray-400">
              {tracks.length === 0
                ? "No tracks found. Upload one to get started."
                : "No tracks match your filters."}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

