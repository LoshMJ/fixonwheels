import { Outlet } from "react-router-dom";
import AdminSidebar from "../../components/admin/AdminSidebar";
import galaxyBg from "../../assets/galaxy-bg.jpg";

export default function AdminLayout() {
  return (
    <div className="relative min-h-screen px-4 md:px-8 py-8 overflow-hidden">
      {/* ✅ FULL background image (behind everything) */}
      <div
        className="absolute inset-0 -z-10 bg-cover bg-center"
        style={{ backgroundImage: `url(${galaxyBg})` }}
      />

      {/* ✅ optional overlay (so text readable) */}
      <div className="absolute inset-0 -z-10 bg-black/40 dark:bg-black/70" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6">
        <AdminSidebar />

        <main
          className="
            rounded-3xl p-6 border transition-colors backdrop-blur-md
            bg-white/80 border-gray-200 text-gray-900
            dark:bg-white/5 dark:border-white/10 dark:text-white
          "
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}