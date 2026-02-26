// src/pages/technician/History.tsx (or TechnicianHistory.tsx)
import React, { useState, useEffect } from "react";
import { getSession } from "../../utils/auth";

interface CompletedRepair {
  _id: string;
  deviceModel: string;
  issue: string;
  rating?: number;
  ratingNote?: string;
  paidAt?: string;
  updatedAt?: string;
  status: string;
}

const History: React.FC = () => {
  const [repairs, setRepairs] = useState<CompletedRepair[]>([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    const session = getSession();
    if (!session?.token) return;

    try {
      const res = await fetch("http://localhost:5000/api/repairs/history", {
        headers: { Authorization: `Bearer ${session.token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch history");

      const data = await res.json();
      setRepairs(data);
    } catch (err) {
      console.error("History fetch error:", err);
    }
  };

  return (
    <div className="p-10 min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-950 text-white">
      <h1 className="text-3xl font-bold mb-8">
        Completed Repairs History
      </h1>

      <div className="space-y-6">
        {repairs.length === 0 ? (
          <div className="bg-white/5 border border-white/10 rounded-3xl p-10 text-center text-gray-400">
            No completed repairs yet
          </div>
        ) : (
          repairs.map((repair) => (
            <div
              key={repair._id}
              className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-[0_20px_60px_rgba(0,0,0,0.6)] hover:border-emerald-400/50 transition"
            >
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="text-lg font-semibold">
                    {repair.deviceModel}
                  </p>
                  <p className="text-sm text-gray-400">
                    {repair.issue}
                  </p>
                </div>

                <span className="text-emerald-400 font-semibold">
                  Completed
                </span>
              </div>

              <p className="text-sm text-gray-400 mb-3">
                Completed on{" "}
                {repair.paidAt
                  ? new Date(repair.paidAt).toLocaleDateString()
                  : repair.updatedAt
                    ? new Date(repair.updatedAt).toLocaleDateString()
                    : "N/A"}
              </p>

              {/* ⭐ Rating Section */}
              <div className="flex items-center gap-2">
                {repair.rating ? (
                  <>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          className={
                            star <= (repair.rating ?? 0)
                              ? "text-yellow-400 text-xl"
                              : "text-gray-600 text-xl"
                          }
                        >
                          ★
                        </span>
                      ))}
                    </div>

                    <span className="text-sm text-gray-400">
                      {repair.rating}/5
                    </span>
                  </>
                ) : (
                  <span className="text-sm text-gray-500">
                    No rating given
                  </span>
                )}
              </div>

              {repair.ratingNote && (
                <p className="mt-3 text-sm text-gray-400 italic">
                  “{repair.ratingNote}”
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default History;