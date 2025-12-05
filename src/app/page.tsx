import { RadioPlayer } from "@/components/RadioPlayer";
import { NowPlaying } from "@/components/NowPlaying";
import { ShowSchedule } from "@/components/ShowSchedule";
import { RequestForm } from "@/components/RequestForm";
import { RecentHistory } from "@/components/RecentHistory";
import { Navigation } from "@/components/Navigation";
import { FloatingMusicalElements } from "@/components/FloatingMusicalElements";

export default async function HomePage() {
  return (
    <div className="min-h-screen cosmic-bg relative">
      <FloatingMusicalElements />
      <Navigation />
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="text-center mb-12 floating">
          <h1 className="text-8xl md:text-9xl font-black mb-6 relative">
            <span className="absolute inset-0 blur-3xl bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500 opacity-50"></span>
            <span className="relative bg-gradient-to-r from-orange-400 via-pink-500 via-purple-500 to-cyan-400 bg-clip-text text-transparent glow-text">
              FLAM
            </span>
          </h1>
          <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent glow-text">
            TUNES
          </h2>
          <p className="text-xl md:text-2xl text-purple-200 max-w-3xl mx-auto leading-relaxed">
            Your cosmic AI-driven radio station. Experience the future of music
            with intelligent hosts, curated playlists, and seamless streaming
            through the stars.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Left Column - Player & Now Playing */}
          <div className="lg:col-span-2 space-y-6">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 via-purple-600 to-cyan-600 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition duration-1000"></div>
              <div className="relative bg-gradient-to-br from-purple-900/40 via-pink-900/40 to-cyan-900/40 backdrop-blur-xl rounded-3xl p-8 border border-purple-500/30 glow-box">
                <RadioPlayer />
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition duration-1000"></div>
              <div className="relative bg-gradient-to-br from-blue-900/40 via-purple-900/40 to-pink-900/40 backdrop-blur-xl rounded-3xl p-8 border border-blue-500/30 glow-box">
                <NowPlaying />
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition duration-1000"></div>
              <div className="relative bg-gradient-to-br from-cyan-900/40 via-blue-900/40 to-purple-900/40 backdrop-blur-xl rounded-3xl p-8 border border-cyan-500/30 glow-box">
                <RecentHistory />
              </div>
            </div>
          </div>

          {/* Right Column - Request Form & Schedule */}
          <div className="space-y-6">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-orange-600 via-pink-600 to-purple-600 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition duration-1000"></div>
              <div className="relative bg-gradient-to-br from-orange-900/40 via-pink-900/40 to-purple-900/40 backdrop-blur-xl rounded-3xl p-8 border border-orange-500/30 glow-box">
                <RequestForm />
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition duration-1000"></div>
              <div className="relative bg-gradient-to-br from-purple-900/40 via-pink-900/40 to-cyan-900/40 backdrop-blur-xl rounded-3xl p-8 border border-purple-500/30 glow-box">
                <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-pink-400 to-purple-400 bg-clip-text text-transparent glow-text">
                  Today&apos;s Schedule
                </h2>
                <ShowSchedule />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

