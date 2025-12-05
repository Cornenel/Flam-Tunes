"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/admin", label: "Overview", icon: "📊" },
  { href: "/admin/shows", label: "Shows", icon: "📻" },
  { href: "/admin/ai-hosts", label: "AI Hosts", icon: "🤖" },
  { href: "/admin/tracks", label: "Tracks", icon: "🎵" },
  { href: "/admin/segments", label: "Segments", icon: "🎙️" },
  { href: "/admin/requests", label: "Requests", icon: "💬" },
  { href: "/admin/artist-submissions", label: "Artist Submissions", icon: "🎤" },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-gray-800 border-r border-gray-700 min-h-[calc(100vh-64px)]">
      <nav className="p-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? "bg-orange-500/20 text-orange-400 border border-orange-500/50"
                  : "text-gray-300 hover:bg-gray-700"
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

