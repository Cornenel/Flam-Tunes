import { createClient } from "@/lib/supabase/server";
import { ShowWithHost } from "@/types/db";

async function getTodayShows(): Promise<ShowWithHost[]> {
  const supabase = await createClient();
  const today = new Date().getDay(); // 0 = Sunday, 1 = Monday, etc.
  // Convert to 1-7 format (Monday = 1, Sunday = 7)
  const dayOfWeek = today === 0 ? 7 : today;

  const { data, error } = await supabase
    .from("shows")
    .select(`
      *,
      ai_host:ai_hosts(*)
    `)
    .eq("is_active", true)
    .contains("days_of_week", [dayOfWeek])
    .order("start_time", { ascending: true });

  if (error || !data) {
    return [];
  }

  return data as ShowWithHost[];
}

function formatTime(timeString: string): string {
  const [hours, minutes] = timeString.split(":");
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
}

export async function ShowSchedule() {
  const shows = await getTodayShows();

  if (shows.length === 0) {
    return <p className="text-purple-300">No shows scheduled for today</p>;
  }

  return (
    <div className="space-y-4">
      {shows.map((show, index) => {
        const gradients = [
          "from-purple-900/40 to-pink-900/40 border-purple-500/30",
          "from-pink-900/40 to-cyan-900/40 border-pink-500/30",
          "from-cyan-900/40 to-blue-900/40 border-cyan-500/30",
          "from-blue-900/40 to-purple-900/40 border-blue-500/30",
        ];
        
        return (
          <div
            key={show.id}
            className={`p-5 bg-gradient-to-r ${gradients[index % gradients.length]} rounded-xl border backdrop-blur-sm hover:scale-105 transition-transform`}
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <h3 className="font-bold text-xl text-cyan-300 mb-1">{show.name}</h3>
                {show.description && (
                  <p className="text-sm text-purple-200 mt-2">{show.description}</p>
                )}
              </div>
              <div className="text-right ml-4">
                <div className="font-bold text-pink-300 text-sm">
                  {formatTime(show.start_time)} - {formatTime(show.end_time)}
                </div>
              </div>
            </div>
            {show.ai_host && (
              <div className="text-sm text-purple-300 font-semibold">
                🎤 Host: <span className="text-cyan-300">{show.ai_host.name}</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

