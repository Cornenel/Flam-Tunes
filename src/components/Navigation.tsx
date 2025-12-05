import Link from "next/link";

export function Navigation() {
  return (
    <nav className="relative bg-gradient-to-r from-purple-900/30 via-pink-900/30 to-cyan-900/30 backdrop-blur-xl border-b border-purple-500/20 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link 
            href="/" 
            className="text-3xl font-black bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500 bg-clip-text text-transparent glow-text hover:scale-105 transition-transform"
          >
            FLAM TUNES
          </Link>
          <div className="flex gap-8">
            <Link
              href="/"
              className="text-purple-200 hover:text-cyan-400 transition-all hover:scale-110 font-semibold relative group"
            >
              Home
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-pink-500 to-purple-500 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link
              href="/schedule"
              className="text-purple-200 hover:text-cyan-400 transition-all hover:scale-110 font-semibold relative group"
            >
              Schedule
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-pink-500 to-purple-500 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link
              href="/artist/login"
              className="text-purple-200 hover:text-cyan-400 transition-all hover:scale-110 font-semibold relative group"
            >
              Artist Login
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-pink-500 to-purple-500 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link
              href="/admin"
              className="text-purple-200 hover:text-cyan-400 transition-all hover:scale-110 font-semibold relative group"
            >
              Admin
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-pink-500 to-purple-500 group-hover:w-full transition-all duration-300"></span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

