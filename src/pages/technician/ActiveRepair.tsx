// src/pages/technician/ActiveRepairs.tsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // ← STEP 1: added this import
import { getSession } from "../../utils/auth"; // adjust path if needed

type Repair = {
  _id: string;
  deviceModel: string;
  issue: string;
  status: string;
  createdAt: string;
};

export default function ActiveRepairs() {
  const [repairs, setRepairs] = useState<Repair[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const session = getSession();
  const navigate = useNavigate(); // ← STEP 2: added navigate instance

  useEffect(() => {
    if (session?.token) {
      fetchActiveRepairs();
    } else {
      setError("Please login to view active repairs");
      setLoading(false);
    }
  }, []);

  async function fetchActiveRepairs() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("http://localhost:5000/api/repairs/active", {
        headers: {
          Authorization: `Bearer ${session?.token}`,
        },
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || `HTTP ${res.status}`);
      }

      const data = await res.json();
      console.log("Active repairs loaded:", data);
      setRepairs(data);
    } catch (err: any) {
      console.error("Fetch active repairs failed:", err);
      setError(err.message || "Failed to load active repairs");
    } finally {
      setLoading(false);
    }
  }

  async function startRepair(repairId: string) {
    if (!session?.token) {
      alert("Session expired. Please login again.");
      return;
    }

    if (!confirm("Start this repair?")) return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/repairs/${repairId}/start`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.token}`,
          },
        }
      );

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || `HTTP ${res.status}`);
      }

      console.log("Repair started");
      fetchActiveRepairs(); // refresh list
      alert("Repair started!");
    } catch (err: any) {
      console.error("Start failed:", err);
      alert(`Failed to start repair: ${err.message}`);
    }
  }

  async function completeRepair(repairId: string) {
    if (!session?.token) {
      alert("Session expired. Please login again.");
      return;
    }

    if (!confirm("Complete this repair?")) return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/repairs/${repairId}/complete`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.token}`,
          },
        }
      );

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || `HTTP ${res.status}`);
      }

      console.log("Repair completed");
      fetchActiveRepairs(); // refresh list
      alert("Repair completed!");
    } catch (err: any) {
      console.error("Complete failed:", err);
      alert(`Failed to complete repair: ${err.message}`);
    }
  }

  return (
  <div className="p-8 md:p-10">

    <h2 className="text-3xl font-bold mb-8">
      Active <span className="text-rose-300">Repairs</span>
    </h2>

    {loading && (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-400"></div>
      </div>
    )}

    {error && (
      <div className="bg-red-500/20 border border-red-400/40 text-red-300 px-4 py-3 rounded-xl mb-6 backdrop-blur-sm">
        {error}
      </div>
    )}

    {!loading && repairs.length === 0 && (
      <div className="text-center text-gray-400 text-lg py-10">
        No active repairs at the moment.
      </div>
    )}

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {repairs.map((repair) => (
        <div
          key={repair._id}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:shadow-[0_0_40px_rgba(255,140,105,0.25)] transition-all duration-300"
        >
          <h3 className="font-semibold text-xl mb-2">
            {repair.deviceModel}
          </h3>

          <p className="text-gray-300 mb-3">
            {repair.issue}
          </p>

          <p className="text-sm text-gray-400">
            Status:{" "}
            <span className="capitalize text-rose-300 font-medium">
              {repair.status}
            </span>
          </p>

          <p className="text-xs text-gray-500 mt-2">
            Started: {new Date(repair.createdAt).toLocaleString()}
          </p>

          <div className="mt-6 flex justify-end space-x-3">

            {repair.status === "accepted" && (
              <button
                onClick={async () => {
                  await startRepair(repair._id);
                  navigate(`/technician/workspace/${repair._id}`);
                }}
                className="bg-gradient-to-r from-rose-400 to-orange-300 text-black font-medium py-2 px-5 rounded-xl hover:scale-[1.03] transition disabled:opacity-50"
                disabled={loading}
              >
                Start Repair
              </button>
            )}

            {repair.status === "in_progress" && (
              <button
                onClick={() => completeRepair(repair._id)}
                className="bg-gradient-to-r from-emerald-400 to-green-300 text-black font-medium py-2 px-5 rounded-xl hover:scale-[1.03] transition disabled:opacity-50"
                disabled={loading}
              >
                Complete Repair
              </button>
            )}

            {repair.status === "completed" && (
              <span className="text-emerald-400 font-medium py-2 px-5">
                Completed
              </span>
            )}

          </div>
        </div>
      ))}
    </div>

  </div>
);
}