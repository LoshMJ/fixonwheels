// src/pages/technician/History.tsx
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
  const [loading, setLoading] = useState(true);

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
    } finally {
      setLoading(false);
    }
  };

  /* ================= DEVICE IMAGE LOADER ================= */

const normalizeModel = (model: string) => {
  return model
    .replace("iPhone ", "I")     // iPhone 11 Pro → I11 Pro
    .replace(/\s+/g, "")         // remove spaces → I11Pro
    .replace("Plus", "Plus")
    .replace("ProMax", "ProMax")
    .replace("Pro", "Pro");
};

const getDeviceImage = (model: string) => {
  const fileName = normalizeModel(model);

  try {
    return new URL(
      `../../assets/phones/${fileName}.png`,
      import.meta.url
    ).href;
  } catch {
    return new URL(
      `../../assets/phones/I15.png`,
      import.meta.url
    ).href;
  }
};

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold">
          Repair <span className="text-rose-300">History</span>
        </h1>
        <p className="text-gray-400 text-sm mt-2">
          Overview of your completed repair jobs
        </p>
      </div>

      {/* CONTENT CARD */}
      <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-[0_0_80px_rgba(255,140,105,0.15)]">

        {loading && (
          <div className="text-center text-gray-400 py-10">
            Loading history...
          </div>
        )}

        {!loading && repairs.length === 0 && (
          <div className="text-center text-gray-500 py-10">
            No completed repairs yet
          </div>
        )}

        <div className="space-y-6">
          {repairs.map((repair) => (
            <div
              key={repair._id}
              className="flex flex-col md:flex-row items-center md:items-start gap-6 bg-black/40 border border-white/10 rounded-2xl p-6 hover:border-rose-400/40 transition-all"
            >

              {/* DEVICE IMAGE */}
              <div className="w-28 h-28 flex-shrink-0 bg-black/30 rounded-xl border border-white/10 flex items-center justify-center">
                <img
                  src={getDeviceImage(repair.deviceModel)}
                  alt={repair.deviceModel}
                  className="object-contain w-full h-full p-2 hover:scale-105 transition"
                />
              </div>

              {/* INFO */}
              <div className="flex-1 w-full">

                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="text-lg font-semibold">
                      {repair.deviceModel}
                    </p>
                    <p className="text-sm text-gray-400">
                      {repair.issue}
                    </p>
                  </div>

                  <span className="px-4 py-1 rounded-full text-sm bg-emerald-500/20 text-emerald-400 border border-emerald-400/30">
                    Completed
                  </span>
                </div>

                {/* DATE */}
                <p className="text-sm text-gray-400 mb-4">
                  Completed on{" "}
                  {repair.paidAt
                    ? new Date(repair.paidAt).toLocaleDateString()
                    : repair.updatedAt
                    ? new Date(repair.updatedAt).toLocaleDateString()
                    : "N/A"}
                </p>

                {/* RATING */}
                <div className="flex items-center gap-3">
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
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default History;