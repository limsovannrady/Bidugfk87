import { useState, useEffect } from "react";

interface BotUser {
  user_id: number;
  username: string | null;
  first_name: string | null;
  last_name: string | null;
  joined_at: string;
}

interface Stats {
  total: number;
  today: number;
}

export default function Dashboard() {
  const [users, setUsers] = useState<BotUser[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, today: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchData = async () => {
    try {
      const [usersRes, statsRes] = await Promise.all([
        fetch("/api/users"),
        fetch("/api/stats"),
      ]);
      const usersData = await usersRes.json();
      const statsData = await statsRes.json();
      setUsers(usersData);
      setStats(statsData);
    } catch (err) {
      console.error("Failed to load data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    return (
      (u.username ?? "").toLowerCase().includes(q) ||
      (u.first_name ?? "").toLowerCase().includes(q) ||
      (u.last_name ?? "").toLowerCase().includes(q)
    );
  });

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleString("km-KH", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getInitials = (u: BotUser) => {
    const fn = u.first_name?.[0] ?? "";
    const ln = u.last_name?.[0] ?? "";
    return (fn + ln).toUpperCase() || "?";
  };

  return (
    <div className="min-h-screen bg-[#0f1117] text-white">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-xl bg-blue-500 flex items-center justify-center text-lg">
              🤖
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Bot Dashboard</h1>
          </div>
          <p className="text-gray-400 text-sm ml-12">អ្នកប្រើប្រាស់ Telegram Bot</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="rounded-2xl bg-[#1a1d27] border border-white/5 p-5">
            <p className="text-gray-400 text-sm mb-1">អ្នកប្រើប្រាស់ទាំងអស់</p>
            <p className="text-3xl font-bold">{stats.total}</p>
          </div>
          <div className="rounded-2xl bg-[#1a1d27] border border-white/5 p-5">
            <p className="text-gray-400 text-sm mb-1">ថ្មីថ្ងៃនេះ</p>
            <p className="text-3xl font-bold text-blue-400">{stats.today}</p>
          </div>
        </div>

        <div className="rounded-2xl bg-[#1a1d27] border border-white/5 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
            <h2 className="font-semibold text-sm">បញ្ជីអ្នកប្រើប្រាស់</h2>
            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder="ស្វែងរក..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white placeholder-gray-500 outline-none focus:border-blue-500 w-48"
              />
              <button
                onClick={fetchData}
                className="text-xs text-gray-400 hover:text-white px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition"
              >
                🔄 Refresh
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16 text-gray-500">
              <div className="text-center">
                <div className="text-2xl mb-2 animate-spin">⟳</div>
                <p className="text-sm">កំពុងផ្ទុក...</p>
              </div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex items-center justify-center py-16 text-gray-500">
              <div className="text-center">
                <div className="text-4xl mb-3">👤</div>
                <p className="text-sm">
                  {search ? "រកមិនឃើញ" : "មិនទាន់មានអ្នកប្រើប្រាស់ទេ"}
                </p>
                {!search && (
                  <p className="text-xs text-gray-600 mt-1">
                    ចាប់ផ្ដើម Bot ហើយ /start ដើម្បីបន្ថែមអ្នកប្រើ
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div>
              <div className="grid grid-cols-12 px-5 py-2 text-xs text-gray-500 uppercase tracking-wider border-b border-white/5">
                <div className="col-span-1">#</div>
                <div className="col-span-5">អ្នកប្រើ</div>
                <div className="col-span-3">Username</div>
                <div className="col-span-3">ចូលរួម</div>
              </div>
              {filtered.map((user, i) => (
                <div
                  key={user.user_id}
                  className="grid grid-cols-12 px-5 py-3.5 border-b border-white/5 last:border-0 hover:bg-white/3 transition items-center"
                >
                  <div className="col-span-1 text-sm text-gray-500">{i + 1}</div>
                  <div className="col-span-5 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-xs font-semibold text-blue-300 shrink-0">
                      {getInitials(user)}
                    </div>
                    <div>
                      <p className="text-sm font-medium leading-tight">
                        {[user.first_name, user.last_name].filter(Boolean).join(" ") || "—"}
                      </p>
                      <p className="text-xs text-gray-500">ID: {user.user_id}</p>
                    </div>
                  </div>
                  <div className="col-span-3 text-sm text-gray-400">
                    {user.username ? (
                      <span className="bg-white/5 px-2 py-0.5 rounded-md">
                        @{user.username}
                      </span>
                    ) : (
                      <span className="text-gray-600">—</span>
                    )}
                  </div>
                  <div className="col-span-3 text-xs text-gray-500">
                    {formatDate(user.joined_at)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
