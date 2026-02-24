import { Outlet, NavLink } from "react-router-dom";
import { getSession } from "../utils/auth";

export default function TechnicianLayout() {
  const session = getSession();

  return (
    <div className="min-h-screen flex bg-slate-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r p-6">
        <h1 className="text-lg font-semibold mb-1">
          Technician Portal
        </h1>
        <p className="text-xs text-slate-500 mb-8">
          {session?.user.name}
        </p>

        <nav className="space-y-3">
          <NavItem to="/technician" label="Home" />
          <NavItem to="/technician/incoming" label="Incoming Repairs" />
          <NavItem to="/technician/active" label="Active Repair" />
          <NavItem to="/technician/history" label="History" />
          <NavItem to="/technician/profile" label="Profile" />
        </nav>
      </aside>

      {/* Page Content */}
      <main className="flex-1 p-10">
        <Outlet />
      </main>
    </div>
  );
}

function NavItem({ to, label }: { to: string; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `block px-4 py-2 rounded-lg text-sm ${
          isActive
            ? "bg-slate-800 text-white"
            : "text-slate-600 hover:bg-slate-200"
        }`
      }
    >
      {label}
    </NavLink>
  );
}