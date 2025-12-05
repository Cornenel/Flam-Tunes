import { createClient } from "@/lib/supabase/server";
import { ShowWithHost } from "@/types/db";
import { Navigation } from "@/components/Navigation";

async function getAllShows(): Promise<ShowWithHost[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("shows")
    .select(`
      *,
      ai_host:ai_hosts(*)
    `)
    .eq("is_active", true)
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

function getDayName(dayNumber: number): string {
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  return days[dayNumber - 1] || "Unknown";
}

export default async function SchedulePage() {
  const shows = await getAllShows();

  // Group shows by day of week
  const showsByDay: Record<number, ShowWithHost[]> = {};
  for (let day = 1; day <= 7; day++) {
    showsByDay[day] = shows.filter((show) =>
      show.days_of_week.includes(day)
    );
  }

  return (
    <div className="min-h-screen cosmic-bg relative">
      <Navigation />
      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="text-center mb-12 floating">
          <h1 className="text-6xl md:text-8xl font-black mb-6 relative">
            <span className="absolute inset-0 blur-3xl bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500 opacity-50"></span>
            <span className="relative bg-gradient-to-r from-orange-400 via-pink-500 via-purple-500 to-cyan-400 bg-clip-text text-transparent glow-text">
              FLAM TUNES
            </span>
          </h1>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent glow-text">
            Schedule
          </h2>
          <p className="text-xl md:text-2xl text-purple-200">
            Your complete weekly programming guide
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Object.entries(showsByDay).map(([dayNum, dayShows], dayIndex) => {
            const day = parseInt(dayNum, 10);
            if (dayShows.length === 0) return null;

            const dayGradients = [
              "from-purple-900/40 to-pink-900/40 border-purple-500/30",
              "from-pink-900/40 to-cyan-900/40 border-pink-500/30",
              "from-cyan-900/40 to-blue-900/40 border-cyan-500/30",
              "from-blue-900/40 to-purple-900/40 border-blue-500/30",
              "from-purple-900/40 to-orange-900/40 border-purple-500/30",
              "from-orange-900/40 to-pink-900/40 border-orange-500/30",
              "from-pink-900/40 to-cyan-900/40 border-pink-500/30",
            ];

            return (
              <div
                key={day}
                className={`relative group bg-gradient-to-br ${dayGradients[dayIndex % dayGradients.length]} backdrop-blur-xl rounded-3xl p-6 border glow-box hover:scale-105 transition-transform`}
              >
                <h2 className="text-3xl font-black mb-6 bg-gradient-to-r from-cyan-400 via-pink-400 to-purple-400 bg-clip-text text-transparent glow-text">
                  {getDayName(day)}
                </h2>
                <div className="space-y-4">
                  {dayShows.map((show, showIndex) => {
                    const showGradients = [
                      "from-purple-800/50 to-pink-800/50 border-purple-400/40",
                      "from-pink-800/50 to-cyan-800/50 border-pink-400/40",
                      "from-cyan-800/50 to-blue-800/50 border-cyan-400/40",
                    ];
                    
                    return (
                      <div
                        key={show.id}
                        className={`p-4 bg-gradient-to-r ${showGradients[showIndex % showGradients.length]} rounded-xl border backdrop-blur-sm hover:scale-105 transition-transform`}
                      >
                        <div className="mb-2">
                          <h3 className="font-bold text-lg text-cyan-300 mb-1">{show.name}</h3>
                          {show.description && (
                            <p className="text-sm text-purple-200 mt-1">
                              {show.description}
                            </p>
                          )}
                        </div>
                        <div className="text-sm space-y-1">
                          <div className="font-bold text-pink-300">
                            {formatTime(show.start_time)} -{" "}
                            {formatTime(show.end_time)}
                          </div>
                          {show.ai_host && (
                            <div className="text-purple-300">
                              🎤 Host: <span className="text-cyan-300">{show.ai_host.name}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {shows.length === 0 && (
          <div className="text-center py-12">
            <p className="text-purple-300 text-lg">
              No shows scheduled at this time
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

