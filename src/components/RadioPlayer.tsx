"use client";

import { useState, useRef, useEffect } from "react";

export function RadioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const streamUrl =
    process.env.NEXT_PUBLIC_ICECAST_STREAM_URL ||
    process.env.ICECAST_STREAM_URL ||
    "";

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleLoadStart = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);
    const handleError = () => {
      setIsLoading(false);
      setIsPlaying(false);
      console.error("Error loading stream");
    };

    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("loadstart", handleLoadStart);
    audio.addEventListener("canplay", handleCanPlay);
    audio.addEventListener("error", handleError);

    return () => {
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("loadstart", handleLoadStart);
      audio.removeEventListener("canplay", handleCanPlay);
      audio.removeEventListener("error", handleError);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch((err) => {
        console.error("Error playing audio:", err);
        setIsPlaying(false);
      });
    }
  };

  if (!streamUrl) {
    return (
      <div className="text-center py-8">
        <p className="text-purple-300 text-lg">
          ⚠️ Stream URL not configured. Please set ICECAST_STREAM_URL in your
          environment variables.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-4xl font-black mb-8 bg-gradient-to-r from-cyan-400 via-pink-400 to-purple-400 bg-clip-text text-transparent glow-text">
        🎵 Live Stream 🎵
      </h2>
      <audio ref={audioRef} src={streamUrl} preload="none" />
      <div className="flex flex-col items-center gap-8">
        <div className="relative">
          {/* Glowing rings */}
          {isPlaying && (
            <>
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 opacity-50 blur-2xl animate-pulse"></div>
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 opacity-30 blur-xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
            </>
          )}
          <button
            onClick={togglePlay}
            disabled={isLoading}
            className="relative w-32 h-32 rounded-full bg-gradient-to-br from-pink-500 via-purple-500 to-cyan-500 hover:from-pink-600 hover:via-purple-600 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-2xl transition-all transform hover:scale-110 active:scale-95 glow-box"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isLoading ? (
              <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin" />
            ) : isPlaying ? (
              <svg
                className="w-16 h-16 text-white drop-shadow-lg"
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
                className="w-16 h-16 text-white ml-2 drop-shadow-lg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
              </svg>
            )}
          </button>
        </div>
        <div className="text-center">
          <div className="text-sm text-purple-300 mb-2 uppercase tracking-wider">Status</div>
          <div className={`text-3xl font-bold ${
            isLoading 
              ? "text-cyan-400" 
              : isPlaying 
                ? "text-pink-400 glow-text" 
                : "text-purple-400"
          }`}>
            {isLoading
              ? "✨ Connecting..."
              : isPlaying
                ? "🔴 LIVE"
                : "⏸ Stopped"}
          </div>
        </div>
      </div>
    </div>
  );
}

