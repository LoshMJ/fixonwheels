import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-6 py-4 bg-white shadow">
        <h1 className="text-xl font-bold">Admin Dashboard</h1>

        <button
          onClick={handleLogout}
          className="px-4 py-2 rounded-lg bg-black text-white hover:opacity-90"
        >
          Logout
        </button>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold mb-2">Welcome, Admin 👋</h2>
          <p className="text-gray-600">
            This is your dashboard. Add your admin functions here (Products,
            Orders, Users, etc.).
          </p>
        </div>
      </div>
    </div>
  );
}