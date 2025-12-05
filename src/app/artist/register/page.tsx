import { Navigation } from "@/components/Navigation";
import { ArtistRegistrationForm } from "@/components/ArtistRegistrationForm";

export default function ArtistRegisterPage() {
  return (
    <div className="min-h-screen cosmic-bg relative">
      <Navigation />
      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="text-center mb-12 floating">
          <h1 className="text-6xl md:text-8xl font-black mb-6 relative">
            <span className="absolute inset-0 blur-3xl bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500 opacity-50"></span>
            <span className="relative bg-gradient-to-r from-orange-400 via-pink-500 via-purple-500 to-cyan-400 bg-clip-text text-transparent glow-text">
              ARTIST REGISTRATION
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-purple-200 max-w-3xl mx-auto leading-relaxed">
            Create your artist account to submit your music to Flam Tunes.
            Join our cosmic community of musicians.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 via-purple-600 to-cyan-600 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition duration-1000"></div>
            <div className="relative bg-gradient-to-br from-purple-900/40 via-pink-900/40 to-cyan-900/40 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-purple-500/30 glow-box">
              <ArtistRegistrationForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

