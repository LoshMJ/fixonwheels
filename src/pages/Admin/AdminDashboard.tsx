import { useEffect, useMemo, useState } from "react";
import { api } from "../../services/api";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from "recharts";

type Stats = {
  totalUsers: number;
  totalTechnicians: number;
  totalOrders: number;
  totalRepairs: number;
  cancelledOrders: number;

  // charts
  ordersLast7Days: { day: string; orders: number }[];
  orderStatusBreakdown: { name: string; value: number }[]; // Pending / Completed / Cancelled etc.
  repairsByType: { name: string; value: number }[]; // Screen / Battery / Software etc.
};

const demoStats: Stats = {
  totalUsers: 34,
  totalTechnicians: 7,
  totalOrders: 92,
  totalRepairs: 61,
  cancelledOrders: 9,
  ordersLast7Days: [
    { day: "Mon", orders: 6 },
    { day: "Tue", orders: 14 },
    { day: "Wed", orders: 10 },
    { day: "Thu", orders: 18 },
    { day: "Fri", orders: 15 },
    { day: "Sat", orders: 20 },
    { day: "Sun", orders: 9 },
  ],
  orderStatusBreakdown: [
    { name: "Pending", value: 18 },
    { name: "Completed", value: 65 },
    { name: "Cancelled", value: 9 },
  ],
  repairsByType: [
    { name: "Screen", value: 28 },
    { name: "Battery", value: 14 },
    { name: "Charging Port", value: 9 },
    { name: "Software", value: 10 },
  ],
};

function getUserFromStorage() {
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function StatCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: number | string;
  sub?: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <p className="text-sm text-white/70">{label}</p>
      <p className="mt-2 text-3xl font-extrabold tracking-tight">{value}</p>
      {sub && <p className="mt-1 text-xs text-white/50">{sub}</p>}
    </div>
  );
}

export default function AdminDashboard() {
  const user = useMemo(() => getUserFromStorage(), []);
  const [stats, setStats] = useState<Stats | null>(null);
  const [err, setErr] = useState("");
  const [usingDemo, setUsingDemo] = useState(false);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setErr("");
        setUsingDemo(false);

        // ✅ Your frontend expects this endpoint
        const data = await api<Stats>("/admin/stats");
        if (!alive) return;

        setStats(data);
      } catch (e: any) {
        // ✅ If backend not ready (404), show demo + message
        if (!alive) return;
        setStats(demoStats);
        setUsingDemo(true);
        setErr(e?.message || "Request failed");
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  const COLORS = ["#A78BFA", "#22C55E", "#F97316", "#60A5FA", "#F43F5E"];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-extrabold">Dashboard</h1>
          <p className="text-white/60 mt-1">
            Welcome back{user?.email ? `, ${user.email}` : ""}. Overview of your system.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-full bg-white/10 border border-white/10 px-3 py-1 text-xs text-white/80">
            Role: admin
          </span>
          {usingDemo && (
            <span className="rounded-full bg-yellow-500/15 border border-yellow-400/30 px-3 py-1 text-xs text-yellow-200">
              Demo stats (backend not ready)
            </span>
          )}
        </div>
      </div>

      {/* Error */}
      {err && (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-red-200">
          {err}
          <div className="text-xs text-red-200/70 mt-1">
            Expected backend route: <b>GET /api/admin/stats</b>
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard label="Total Users" value={stats?.totalUsers ?? 0} />
        <StatCard label="Technicians" value={stats?.totalTechnicians ?? 0} />
        <StatCard label="Total Orders" value={stats?.totalOrders ?? 0} />
        <StatCard label="Total Repairs" value={stats?.totalRepairs ?? 0} />
        <StatCard label="Cancelled Orders" value={stats?.cancelledOrders ?? 0} />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Line: Orders trend */}
        <div className="lg:col-span-2 rounded-3xl border border-white/10 bg-white/5 p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">Orders (Last 7 days)</h2>
            <span className="text-xs text-white/60">Trend</span>
          </div>

          <div className="mt-4 h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats?.ordersLast7Days ?? []}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                <XAxis dataKey="day" stroke="rgba(255,255,255,0.5)" />
                <YAxis stroke="rgba(255,255,255,0.5)" />
                <Tooltip
                  contentStyle={{
                    background: "rgba(10,10,10,0.95)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 12,
                    color: "white",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="orders"
                  stroke="rgba(167,139,250,0.95)"
                  strokeWidth={3}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie: Status */}
        <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">Order Status</h2>
            <span className="text-xs text-white/60">Breakdown</span>
          </div>

          <div className="mt-4 h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats?.orderStatusBreakdown ?? []}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  outerRadius={95}
                  paddingAngle={4}
                >
                  {(stats?.orderStatusBreakdown ?? []).map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "rgba(10,10,10,0.95)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 12,
                    color: "white",
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

     
    </div>
  );
}