import React from "react";

const TechnicianDashboard: React.FC = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-100 to-slate-200 flex">
      {/* ================= Sidebar ================= */}
      <aside className="w-64 bg-white/40 backdrop-blur-xl border-r border-white/30 p-6">
        {/* App / Brand */}
        <div className="mb-10">
          <h1 className="text-xl font-semibold text-slate-800">
            Repair<span className="text-slate-500">Hub</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Technician Portal
          </p>
        </div>

        {/* Navigation */}
        <nav className="space-y-4">
          <NavItem label="Home" active />
          <NavItem label="Incoming Repairs" />
          <NavItem label="Active Repair" />
          <NavItem label="History" />
          <NavItem label="Profile" />
        </nav>
      </aside>

      {/* ================= Main Content ================= */}
      <main className="flex-1 p-10">
        {/* Page title */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-slate-800">
            Technician Dashboard
          </h2>
          <p className="text-slate-500 text-sm">
            Overview of your work and performance
          </p>
        </div>

        {/* ================= Profile Card ================= */}
        <section className="bg-white/50 backdrop-blur-xl border border-white/40 rounded-2xl p-8 shadow-lg max-w-4xl">
          <div className="flex items-center gap-8">
            {/* Profile Picture */}
            <div className="relative">
              <img
                src="https://i.pravatar.cc/150?img=12"
                alt="Technician profile"
                className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-md"
              />
              <span className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></span>
            </div>

            {/* Technician Info */}
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-slate-800">
                Alex Johnson
              </h3>
              <p className="text-slate-500 text-sm">
                Senior Mobile Repair Technician
              </p>

              {/* Stats */}
              <div className="flex gap-10 mt-6">
                <StatItem value="248" label="Repairs Completed" />
                <StatItem value="4.8 ★" label="Average Rating" />
                <StatItem value="5 yrs" label="Experience" />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

/* ================= Reusable Components ================= */

type NavItemProps = {
  label: string;
  active?: boolean;
};

const NavItem: React.FC<NavItemProps> = ({ label, active }) => {
  return (
    <button
      className={`w-full text-left px-4 py-2 rounded-lg text-sm transition
        ${
          active
            ? "bg-white text-slate-800 shadow-sm"
            : "text-slate-600 hover:bg-white/60 hover:text-slate-800"
        }`}
    >
      {label}
    </button>
  );
};

type StatItemProps = {
  value: string;
  label: string;
};

const StatItem: React.FC<StatItemProps> = ({ value, label }) => {
  return (
    <div>
      <p className="text-lg font-semibold text-slate-800">{value}</p>
      <p className="text-xs text-slate-500">{label}</p>
    </div>
  );
};

export default TechnicianDashboard;
