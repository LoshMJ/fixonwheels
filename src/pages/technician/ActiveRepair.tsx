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
    <div className="p-6 md:p-10 min-h-screen bg-gray-50">
      <h2 className="text-3xl font-bold mb-8 text-gray-800">Active Repairs</h2>

      {loading && (
        <div className="flex justify-center items-center h-40">
          <p className="text-gray-600 animate-pulse text-lg">Loading active jobs...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {!loading && repairs.length === 0 && (
        <div className="text-center text-gray-500 text-lg py-10">
          No active repairs at the moment.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {repairs.map((repair) => (
          <div
            key={repair._id}
            className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-all duration-200"
          >
            <div className="p-6">
              <h3 className="font-bold text-xl text-gray-900 mb-2">
                {repair.deviceModel}
              </h3>
              <p className="text-gray-700 font-medium mb-3">{repair.issue}</p>
              <p className="text-sm text-gray-500">
                Status: <span className="font-semibold capitalize">{repair.status}</span>
              </p>
              <p className="text-xs text-gray-400 mt-2">
                Started: {new Date(repair.createdAt).toLocaleString()}
              </p>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
              {repair.status === "accepted" && (
                <button
                  onClick={async () => {
                    await startRepair(repair._id);
                    navigate(`/technician/workspace/${repair._id}`); // ← STEP 3: fixed to use navigate
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-5 rounded-lg transition disabled:opacity-50"
                  disabled={loading}
                >
                  Start Repair
                </button>
              )}

              {repair.status === "in_progress" && (
                <button
                  onClick={() => completeRepair(repair._id)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-5 rounded-lg transition disabled:opacity-50"
                  disabled={loading}
                >
                  Complete Repair
                </button>
              )}

              {repair.status === "completed" && (
                <span className="text-emerald-600 font-medium py-2 px-5">
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