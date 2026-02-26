import { Outlet } from "react-router-dom";
import AdminSidebar from "../../components/admin/AdminSidebar";

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-black text-white px-4 md:px-8 py-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6">
        <AdminSidebar />
        <main className="bg-white/5 border border-white/10 rounded-3xl p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}