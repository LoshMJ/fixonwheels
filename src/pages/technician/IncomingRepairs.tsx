// src/pages/technician/IncomingRepairs.tsx

import { useEffect, useState } from "react";
import { getSession } from "../../utils/auth"; // adjust path if needed

type Repair = {
  _id: string;
  deviceModel: string;
  issue: string;
  description?: string;
  address: string;
  status: string;
  createdAt: string;
  customer?: {
    name: string;
    email: string;
  };
};

export default function IncomingRepairs() {
  const [repairs, setRepairs] = useState<Repair[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const session = getSession();

  useEffect(() => {
    if (session?.token) {
      fetchRepairs();
    } else {
      setError("Please login to view incoming repairs");
      setLoading(false);
    }
  }, []);

  async function fetchRepairs() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("http://localhost:5000/api/repairs/incoming", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.token}`,
        },
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || `Failed to fetch (HTTP ${res.status})`);
      }

      const data = await res.json();
      console.log("Incoming repairs:", data);
      setRepairs(data);
    } catch (err: any) {
      console.error("Fetch failed:", err);
      setError(err.message || "Could not load incoming repairs");
    } finally {
      setLoading(false);
    }
  }

  async function acceptRepair(repairId: string) {
    if (!session?.token) {
      alert("Please login again");
      return;
    }

    if (!confirm("Accept this repair?")) return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/repairs/${repairId}/accept`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.token}`,
          },
        }
      );

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || `Failed to accept (HTTP ${res.status})`);
      }

      const data = await res.json();
      console.log("Accept success:", data);

      // Remove from list + refresh
      setRepairs((prev) => prev.filter((r) => r._id !== repairId));
      alert("Repair accepted!");
    } catch (err: any) {
      console.error("Accept failed:", err);
      alert(`Failed to accept repair: ${err.message}`);
    }
  }

  return (
    <div className="p-8 md:p-10 min-h-screen bg-gray-50">
      <h2 className="text-3xl font-bold mb-8 text-gray-800">Incoming Repairs</h2>

      {loading && (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {!loading && !error && repairs.length === 0 && (
        <div className="text-center py-12 text-gray-500 text-lg">
          No pending repair requests at the moment.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {repairs.map((repair) => (
          <div
            key={repair._id}
            className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-200"
          >
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {repair.deviceModel}
              </h3>
              <p className="text-gray-700 font-medium mb-2">{repair.issue}</p>

              {repair.description && (
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {repair.description}
                </p>
              )}

              <div className="text-sm text-gray-500 space-y-1">
                <p>
                  Customer:{" "}
                  <span className="font-medium">
                    {repair.customer?.name || "Unknown"}
                  </span>
                </p>
                <p className="text-xs">
                  {repair.customer?.email || "—"}
                </p>
                <p className="text-xs mt-2 text-gray-400">
                  Requested: {new Date(repair.createdAt).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <button
                onClick={() => acceptRepair(repair._id)}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                Accept Repair
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}