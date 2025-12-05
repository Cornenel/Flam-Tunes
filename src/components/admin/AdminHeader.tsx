"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";

interface AdminHeaderProps {
  user: User;
}

export function AdminHeader({ user }: AdminHeaderProps) {
  const router = useRouter();

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <header className="bg-gray-800 border-b border-gray-700 px-8 py-4 flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
          Flam Tunes Admin
        </h1>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-gray-300 text-sm">{user.email}</span>
        <button
          onClick={handleSignOut}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium transition-colors"
        >
          Sign Out
        </button>
      </div>
    </header>
  );
}

