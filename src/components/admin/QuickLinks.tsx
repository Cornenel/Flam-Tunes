import Link from "next/link";

const links = [
  { href: "/admin/shows", label: "Manage Shows", icon: "📻" },
  { href: "/admin/ai-hosts", label: "AI Hosts", icon: "🤖" },
  { href: "/admin/tracks", label: "Upload Tracks", icon: "🎵" },
  { href: "/admin/requests", label: "View Requests", icon: "💬" },
];

export function QuickLinks() {
  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h2 className="text-2xl font-bold mb-4 text-orange-500">Quick Links</h2>
      <div className="grid grid-cols-2 gap-4">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="p-4 bg-gray-700 hover:bg-gray-600 rounded-lg border border-gray-600 transition-colors flex items-center gap-3"
          >
            <span className="text-2xl">{link.icon}</span>
            <span className="font-medium">{link.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

