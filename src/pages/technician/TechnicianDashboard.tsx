import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import galaxyBg from "../../assets/galaxy-bg.jpg";
import astronaut from "../../assets/astronaut.png";

const TechnicianDashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden text-white"
      style={{
        backgroundImage: `url(${galaxyBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* ================= BACKGROUND LAYERS ================= */}

      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <div className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(circle_at_20%_30%,rgba(255,140,105,0.25),transparent_40%),radial-gradient(circle_at_80%_70%,rgba(255,180,160,0.15),transparent_40%)]" />

      <img
        src={astronaut}
        className="absolute right-[4%] top-[15%] w-[240px] opacity-90 animate-float-rotate drop-shadow-[0_0_40px_rgba(255,140,105,0.5)] pointer-events-none z-[2]"
      />

      {/* ================= GLASS APP CONTAINER ================= */}

      <div className="relative z-[5] w-full max-w-7xl mx-auto bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-[0_0_120px_rgba(255,140,105,0.35)]">

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* ================= SIDEBAR ================= */}

         

          {/* ================= MAIN CONTENT ================= */}

          <div className="md:col-span-3 space-y-10">

            {/* HEADER */}
            <div>
              <h1 className="text-3xl font-bold">
                Dashboard Overview
              </h1>
              <p className="text-gray-400 text-sm mt-2">
                Monitor repairs, track performance and manage workflow
              </p>
            </div>

            {/* STATS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <GlassStat value="248" label="Repairs Completed" />
              <GlassStat value="4.8 ★" label="Average Rating" />
              <GlassStat value="5 Years" label="Experience" />
            </div>

            {/* ACTION CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <DashboardCard
                title="Incoming Repairs"
                description="Review and accept new repair requests"
                onClick={() => navigate("/technician/incoming")}
              />
              <DashboardCard
                title="Active Repairs"
                description="Continue working on current repairs"
                onClick={() => navigate("/technician/active")}
              />
              <DashboardCard
                title="Repair History"
                description="Review completed repair records"
                onClick={() => navigate("/technician/history")}
              />
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

/* ================= SIDEBAR BUTTON ================= */

const SidebarButton = ({
  label,
  onClick,
  active = false,
}: {
  label: string;
  onClick: () => void;
  active?: boolean;
}) => (
  <motion.button
    whileHover={{ scale: 1.03 }}
    onClick={onClick}
    className={`w-full text-left px-4 py-3 rounded-xl transition border ${
      active
        ? "bg-gradient-to-r from-rose-400 to-orange-300 text-black font-medium shadow-[0_0_20px_rgba(255,140,105,0.6)]"
        : "bg-black/30 hover:bg-rose-500/20 border-white/10 text-gray-300"
    }`}
  >
    {label}
  </motion.button>
);

/* ================= STAT CARD ================= */

const GlassStat = ({
  value,
  label,
}: {
  value: string;
  label: string;
}) => (
  <motion.div
    whileHover={{ scale: 1.04 }}
    className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-[0_0_50px_rgba(255,140,105,0.25)] transition"
  >
    <p className="text-2xl font-semibold">{value}</p>
    <p className="text-sm text-gray-400 mt-2">{label}</p>
  </motion.div>
);

/* ================= DASHBOARD CARD ================= */

const DashboardCard = ({
  title,
  description,
  onClick,
}: {
  title: string;
  description: string;
  onClick: () => void;
}) => (
  <motion.div
    whileHover={{ scale: 1.04 }}
    onClick={onClick}
    className="cursor-pointer bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-[0_0_60px_rgba(255,140,105,0.25)] transition"
  >
    <h3 className="text-xl font-semibold mb-3 text-rose-300">
      {title}
    </h3>
    <p className="text-gray-400 text-sm">{description}</p>
  </motion.div>
);

export default TechnicianDashboard;