import { NavLink, useNavigate } from "react-router-dom";
import { clearSession } from "../../utils/auth";

export default function AdminSidebar() {
  const navigate = useNavigate();

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `block w-full rounded-xl px-4 py-3 font-semibold transition ${
      isActive ? "bg-white text-black" : "text-white/80 hover:bg-white/10"
    }`;

  const logout = () => {
    clearSession();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/", { replace: true });

    // ✅ HARD redirect to public home (bypass AdminRoutes guard)
    window.location.replace("/");
  };

  return (
    <aside className="bg-white/5 border border-white/10 rounded-3xl p-6">
      <div className="mb-6">
        <h2 className="text-xl font-extrabold">FixOnWheels Admin</h2>
        <p className="text-white/60 text-sm mt-1">Manage system</p>
      </div>

      <nav className="space-y-2">
        <NavLink to="/admin" end className={linkClass}>
          Summary
        </NavLink>
        <NavLink to="/admin/users" className={linkClass}>
          Users
        </NavLink>
        <NavLink to="/admin/orders" className={linkClass}>
          Orders
        </NavLink>
        <NavLink to="/admin/technicians" className={linkClass}>
          Technicians
        </NavLink>

        {/* ✅ NEW (before settings) */}
        <NavLink to="/admin/shop-categories" className={linkClass}>
          Shop Categories
        </NavLink>

        <NavLink to="/admin/settings" className={linkClass}>
          Settings
        </NavLink>
      </nav>

      <button
        onClick={logout}
        className="mt-6 w-full rounded-xl bg-white text-black font-bold py-3 hover:opacity-90"
      >
        Logout
      </button>
    </aside>
  );
}