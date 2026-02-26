import { useMemo } from "react";
import StatCard from "../../components/admin/StatCard";
import { PieChart, Pie, Tooltip, BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";

function getAdminEmail() {
  const userRaw = localStorage.getItem("user");
  const user = userRaw ? JSON.parse(userRaw) : null;
  return user?.email ?? "admin";
}

export default function AdminSummary() {
  const email = getAdminEmail();

  // ✅ dummy stats for now (later: fetch from backend)
  const stats = {
    totalUsers: 120,
    totalTechnicians: 18,
    totalOrders: 340,
    cancelledOrders: 22,
    totalRepairs: 290,
    completedRepairs: 260,
  };

  const ordersByStatus = useMemo(
    () => [
      { name: "Completed", value: stats.totalOrders - stats.cancelledOrders },
      { name: "Cancelled", value: stats.cancelledOrders },
    ],
    []
  );

  const monthlyRepairs = useMemo(
    () => [
      { month: "Jan", repairs: 22 },
      { month: "Feb", repairs: 30 },
      { month: "Mar", repairs: 27 },
      { month: "Apr", repairs: 35 },
      { month: "May", repairs: 40 },
      { month: "Jun", repairs: 32 },
    ],
    []
  );

  return (
    <div>
      <h1 className="text-3xl font-extrabold">Dashboard</h1>
      <p className="text-white/60 mt-1">Welcome back, <span className="text-white">{email}</span></p>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard title="Total Users" value={stats.totalUsers} />
        <StatCard title="Total Technicians" value={stats.totalTechnicians} />
        <StatCard title="Total Orders" value={stats.totalOrders} />
        <StatCard title="Cancelled Orders" value={stats.cancelledOrders} />
        <StatCard title="Total Repairs" value={stats.totalRepairs} />
        <StatCard title="Completed Repairs" value={stats.completedRepairs} />
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
          <h3 className="font-bold text-lg">Orders Status</h3>
          <div className="h-[260px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={ordersByStatus} dataKey="value" nameKey="name" outerRadius={90} />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
          <h3 className="font-bold text-lg">Repairs per Month</h3>
          <div className="h-[260px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyRepairs}>
                <XAxis dataKey="month" stroke="white" />
                <YAxis stroke="white" />
                <Tooltip />
                <Bar dataKey="repairs" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}