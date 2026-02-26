import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const TechnicianDashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-black to-gray-950 text-white p-10">

      {/* ================= HEADER ================= */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight">
          Technician Control Center
        </h1>
        <p className="text-gray-400 mt-2 text-sm">
          Overview of your repairs, performance & workflow
        </p>
      </div>

      {/* ================= STATS GRID ================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">

        <GlassStat value="248" label="Repairs Completed" />
        <GlassStat value="4.8 ★" label="Average Rating" />
        <GlassStat value="5 yrs" label="Experience" />

      </div>

      {/* ================= NAVIGATION CARDS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

        <DashboardCard
          title="Incoming Repairs"
          description="View and accept new repair requests"
          onClick={() => navigate("/technician/incoming")}
        />

        <DashboardCard
          title="Active Repairs"
          description="Continue working on accepted repairs"
          onClick={() => navigate("/technician/active")}
        />

        <DashboardCard
          title="Repair History"
          description="Review previously completed repairs"
          onClick={() => navigate("/technician/history")}
        />

      </div>
    </div>
  );
};

/* ================= GLASS STAT CARD ================= */

type GlassStatProps = {
  value: string;
  label: string;
};

const GlassStat: React.FC<GlassStatProps> = ({ value, label }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-8 shadow-[0_40px_120px_rgba(0,0,0,0.6)]"
    >
      <p className="text-2xl font-semibold">{value}</p>
      <p className="text-sm text-gray-400 mt-2">{label}</p>
    </motion.div>
  );
};

/* ================= DASHBOARD NAV CARD ================= */

type DashboardCardProps = {
  title: string;
  description: string;
  onClick: () => void;
};

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  description,
  onClick,
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.04 }}
      onClick={onClick}
      className="cursor-pointer bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-[0_40px_120px_rgba(0,0,0,0.6)] transition"
    >
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      <p className="text-gray-400 text-sm">{description}</p>
    </motion.div>
  );
};

export default TechnicianDashboard;