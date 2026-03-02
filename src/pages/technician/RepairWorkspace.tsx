// src/pages/technician/RepairWorkspace.tsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getSession } from "../../utils/auth";
import { motion } from "framer-motion";
import io from "socket.io-client";
import { useNavigate } from "react-router-dom";
type Step = {
  stepId: string;
  label: string;
  completed: boolean;
  completedAt?: string;
  notes?: string;
  photoUrl?: string;
};

type Repair = {
  _id: string;
  deviceModel: string;
  issue: string;
  status: string;
  stepsProgress: Step[];
  createdAt: string;
  technician?: string;
};

export default function RepairWorkspace() {
  const { id } = useParams();
  const session = getSession();
const navigate = useNavigate();
  const [repair, setRepair] = useState<Repair | null>(null);
  const [loading, setLoading] = useState(true);
  const [elapsed, setElapsed] = useState(0);
  const [socket, setSocket] = useState<any>(null);

  // Fetch repair data on mount
  useEffect(() => {
    if (!id || !session?.token) return;

    const fetchRepair = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/repairs/${id}`, {
          headers: {
            Authorization: `Bearer ${session.token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to load repair");

        const data = await res.json();
        setRepair(data);
      } catch (err) {
        console.error("Failed to load repair", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRepair();
  }, [id]);

  // Socket connection + live updates
  useEffect(() => {
  if (!id) return;

  const socket = io("http://localhost:5000");

  socket.emit("join_repair", id);

  socket.on("repair_updated", (updatedRepair: Repair) => {
    if (updatedRepair._id === id) {
      setRepair(updatedRepair);
    }
  });

  return () => {
    socket.disconnect();
  };
}, [id]);

  // Timer for in-progress repairs
  useEffect(() => {
    if (!repair || repair.status !== "in_progress") return;

    const start = new Date(repair.createdAt).getTime();

    const interval = setInterval(() => {
      const now = Date.now();
      setElapsed(Math.floor((now - start) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [repair]);

  function formatTime(seconds: number) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }


  async function finishRepair() {
  if (!session?.token || !repair) return;

  try {
    const res = await fetch(
      `http://localhost:5000/api/repairs/${repair._id}/finish`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.token}`,
        },
      }
    );

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to finish repair");
    }

    const updatedRepair = await res.json();

    // Update local state
    setRepair(updatedRepair);

    // 🔥 Navigate technician to payments page
    navigate("/technician/payments", { replace: true });

  } catch (err: any) {
    console.error("Finish repair error:", err);
    alert(err.message || "Failed to finish repair");
  }
}
  // Mark step complete (technician action)
  async function markStepComplete(stepId: string) {
    if (!session?.token || !repair) return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/repairs/${repair._id}/step/${stepId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.token}`,
          },
          body: JSON.stringify({
            notes: "",
            photoUrl: "",
          }),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to update step");
      }

      // Instant UI update (optimistic)
      setRepair((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          stepsProgress: prev.stepsProgress.map((s) =>
            s.stepId === stepId ? { ...s, completed: true } : s
          ),
        };
      });
    } catch (err) {
      console.error("Step complete failed:", err);
      alert("Failed to mark step complete");
    }
  }

  // Complete entire repair
  async function completeRepair() {
    if (!session?.token || !repair) return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/repairs/${repair._id}/complete`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${session.token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to complete repair");

      // Update local state
      setRepair((prev) => prev ? { ...prev, status: "completed" } : null);
      alert("Repair completed!");
    } catch (err) {
      console.error("Complete repair failed:", err);
      alert("Failed to complete repair");
    }
  }

  if (loading) return <div className="p-10 text-white">Loading...</div>;

  if (!repair) return <div className="p-10 text-white">Repair not found</div>;

  const completedCount = repair.stepsProgress?.filter((s: Step) => s.completed).length || 0;
  const totalSteps = repair.stepsProgress?.length || 1;
  const progress = Math.min((completedCount / totalSteps) * 100, 100);

  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-950 text-white">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Repairing: {repair.deviceModel}
          </h1>
          <p className="text-gray-400 mt-2">{repair.issue}</p>
        </div>

        <div className="flex items-center gap-6">
          {repair.status === "in_progress" && (
            <div className="px-4 py-2 rounded-full bg-black/40 border border-purple-400/30 text-purple-300 font-mono tracking-widest">
              {formatTime(elapsed)}
            </div>
          )}

          <div className="px-4 py-2 rounded-full bg-purple-500/20 border border-purple-400/40 text-purple-300 capitalize">
            {repair.status.replace("_", " ")}
          </div>
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT: Timeline + Step Controls (Technician) */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-[0_40px_120px_rgba(0,0,0,0.6)]"
        >
          <h2 className="text-2xl font-semibold mb-10">Repair Timeline</h2>

          <div className="space-y-6">
            {repair.stepsProgress?.map((step: any, index: number) => (
              <div
                key={step.stepId}
                className="bg-white/5 border border-white/10 rounded-xl p-5 flex justify-between items-center"
              >
                <div>
                  <p className="text-sm text-gray-400">
                    Step {index + 1}
                  </p>
                  <h3 className="text-white font-medium">
                    {step.label}
                  </h3>
                </div>

                {!step.completed ? (
                  <button
                    onClick={() => markStepComplete(step.stepId)}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-full text-sm transition"
                  >
                    Mark Complete
                  </button>
                ) : (
                  <span className="text-emerald-400 font-semibold">
                    ✓ Completed
                  </span>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* RIGHT: Overview Panel */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-[0_40px_120px_rgba(0,0,0,0.6)]"
        >
          <h2 className="text-2xl font-semibold mb-8">Overview</h2>

          <div className="space-y-6 text-gray-300 text-sm">
            <div className="flex justify-between">
              <span>Created</span>
              <span>{new Date(repair.createdAt).toLocaleDateString()}</span>
            </div>

            <div className="flex justify-between">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>

            <div className="flex justify-between">
              <span>Steps Done</span>
              <span>{completedCount} / {totalSteps}</span>
            </div>
          </div>

{repair.status === "in_progress" && completedCount === totalSteps && (
  <button
    onClick={finishRepair}
    className="mt-10 w-full py-3 rounded-2xl bg-amber-600 hover:bg-amber-700 transition font-semibold"
  >
    Finish Repair & Send to Payment
  </button>
)}
        </motion.div>
      </div>
    </div>
  );
}