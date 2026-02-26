// src/layouts/TechnicianLayout.tsx
import { Outlet, NavLink } from "react-router-dom";
import { getSession } from "../utils/auth";

export default function TechnicianLayout() {
  const session = getSession();

  // Consistent nav item base style
  const navItem = "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200";

  const activeItem = "bg-purple-600/90 text-white shadow-sm";
  const normalItem = "text-gray-300 hover:bg-white/5 hover:text-white";

  return (
    <div className="min-h-screen flex bg-slate-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r shadow-sm p-6 flex flex-col">
        <h1 className="text-xl font-bold text-purple-700 mb-1">
          Technician Portal
        </h1>
        <p className="text-xs text-slate-500 mb-10">
          {session?.user?.name || "Technician"}
        </p>

        <nav className="space-y-1.5 flex-1">
          <NavLink
            to="/technician"
            className={({ isActive }) => `${navItem} ${isActive ? activeItem : normalItem}`}
          >
            🏠 Home
          </NavLink>

          <NavLink
            to="/technician/incoming"
            className={({ isActive }) => `${navItem} ${isActive ? activeItem : normalItem}`}
          >
            📥 Incoming Repairs
          </NavLink>

          <NavLink
            to="/technician/active"
            className={({ isActive }) => `${navItem} ${isActive ? activeItem : normalItem}`}
          >
            🔧 Active Repair
          </NavLink>

          <NavLink
            to="/technician/workspace"
            className={({ isActive }) => `${navItem} ${isActive ? activeItem : normalItem}`}
          >
            🛠 Workspace
          </NavLink>

          <NavLink
            to="/technician/payments"
            className={({ isActive }) => `${navItem} ${isActive ? activeItem : normalItem}`}
          >
            💳 Payments
          </NavLink>

          <NavLink
            to="/technician/history"
            className={({ isActive }) => `${navItem} ${isActive ? activeItem : normalItem}`}
          >
            📜 History
          </NavLink>

          <NavLink
            to="/technician/profile"
            className={({ isActive }) => `${navItem} ${isActive ? activeItem : normalItem}`}
          >
            👤 Profile
          </NavLink>
        </nav>

        {/* Logout at bottom */}
        <button
          onClick={() => {
            // your logout logic
            window.location.href = "/login";
          }}
          className="mt-auto flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-all"
        >
          🚪 Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 lg:p-10 overflow-auto bg-slate-50">
        <Outlet />
      </main>
    </div>
  );
}