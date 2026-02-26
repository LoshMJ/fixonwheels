import { Outlet, useNavigate, useLocation } from "react-router-dom";
import galaxyBg from "../assets/galaxy-bg.jpg";
import astronaut from "../assets/astronaut.png";

const TechnicianLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) =>
    location.pathname.includes(path);

  return (
    <section
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden text-white"
      style={{
        backgroundImage: `url(${galaxyBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Astronaut */}
      <img
        src={astronaut}
        className="absolute right-[4%] top-[15%] w-[240px] opacity-90 animate-float-rotate drop-shadow-[0_0_40px_rgba(255,140,105,0.5)] pointer-events-none z-[2]"
      />

      {/* MAIN GLASS PANEL */}
      <div className="relative z-[5] w-full max-w-7xl mx-auto bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-[0_0_120px_rgba(255,140,105,0.35)]">

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* LEFT PANEL (NOW GLOBAL) */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">

            <h2 className="text-xl font-semibold text-rose-300">
              Technician Portal
            </h2>

            <SidebarBtn
              label="Dashboard"
              active={location.pathname === "/technician"}
              onClick={() => navigate("/technician")}
            />
            <SidebarBtn
              label="Incoming"
              active={isActive("incoming")}
              onClick={() => navigate("/technician/incoming")}
            />
            <SidebarBtn
              label="Active"
              active={isActive("active")}
              onClick={() => navigate("/technician/active")}
            />
            <SidebarBtn
              label="History"
              active={isActive("history")}
              onClick={() => navigate("/technician/history")}
            />
            <SidebarBtn
              label="Payments"
              active={isActive("payments")}
              onClick={() => navigate("/technician/payments")}
            />
            <SidebarBtn
              label="Profile"
              active={isActive("profile")}
              onClick={() => navigate("/technician/profile")}
            />

          </div>

          {/* RIGHT CONTENT */}
          <div className="md:col-span-3">
            <Outlet />
          </div>

        </div>
      </div>
    </section>
  );
};

const SidebarBtn = ({
  label,
  onClick,
  active,
}: {
  label: string;
  onClick: () => void;
  active?: boolean;
}) => (
  <button
    onClick={onClick}
    className={`w-full text-left px-4 py-3 rounded-xl transition ${
      active
        ? "bg-gradient-to-r from-rose-400 to-orange-300 text-black font-medium shadow-[0_0_20px_rgba(255,140,105,0.6)]"
        : "bg-black/30 hover:bg-rose-500/20 border border-white/10 text-gray-300"
    }`}
  >
    {label}
  </button>
);

export default TechnicianLayout;