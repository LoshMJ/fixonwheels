// src/components/repair/Step4.tsx
import { useState, useEffect } from "react";
import io from "socket.io-client";
import { getSession } from "../../lib/auth.js"; // adjust path if needed

import {
  getRepairWorkflow,
  findDeviceByModel,
  findIssueByLabel,
} from "./repairWorkflows";

import type { WorkflowStep } from "./repairWorkflows";

interface Step4Props {
  selectedModel: string | null;
  selectedIssue: string | null;
  workflow: ReturnType<typeof getRepairWorkflow> | null;
  repair?: any; // passed from parent (RepairLayout)
  setRepair?: (repair: any) => void; // setter from parent
}

export default function Step4({
  selectedModel,
  selectedIssue,
  workflow,
  repair,
  setRepair,
}: Step4Props) {
  const [requestText, setRequestText] = useState("");
  const [requests, setRequests] = useState<
    { id: number; text: string; createdAt: string; status: "sent" | "queued" }[]
  >([]);

  // Live socket updates for step progress
useEffect(() => {
  const session = getSession();

  if (!session?.token || !session?.userId || !repair?._id) {
    return; // clean early exit (returns void)
  }

  const socket = io("http://localhost:5000");

  socket.emit("join", session.userId);
  socket.emit("join_repair", repair._id);

  socket.on("step_updated", (data: { repairId: string; stepId: string }) => {
    if (data.repairId === repair._id && setRepair) {
      setRepair((prev: any) => {
        if (!prev) return prev;
        return {
          ...prev,
          stepsProgress: prev.stepsProgress?.map((s: any) =>
            s.stepId === data.stepId
              ? { ...s, completed: true }
              : s
          ),
        };
      });
    }
  });

  socket.on("repair_updated", (updatedRepair: any) => {
    if (updatedRepair._id === repair._id && setRepair) {
      setRepair(updatedRepair);
    }
  });

  return () => {
    socket.disconnect();
  };
}, [repair?._id]);
  const handleSendRequest = () => {
    const trimmed = requestText.trim();
    if (!trimmed) return;

    const now = new Date();
    const label = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    setRequests((prev) => [
      { id: Date.now(), text: trimmed, createdAt: label, status: "sent" },
      ...prev,
    ]);
    setRequestText("");
  };

  const deviceMeta = findDeviceByModel(selectedModel || "");
  const issueMeta = findIssueByLabel(selectedIssue || "");

  if (!workflow && !repair?.stepsProgress) {
    return (
      <div className="mt-4 flex-1 flex items-center justify-center text-white/70 text-sm text-center">
        <p className="max-w-md">
          We&apos;ll show the live repair steps here once you&apos;ve selected a
          device & issue and confirmed handover.
        </p>
      </div>
    );
  }

  const workflowSteps = workflow?.steps || [];
  const totalMinutes = workflow?.totalMinutes || 0;

  return (
    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-8 text-sm md:text-base">
      {/* LEFT: steps timeline (customer read-only view) */}
      <div className="flex flex-col gap-4">
        <div className="rounded-2xl bg-white/5 border border-white/15 px-5 py-4">
          <p className="text-xs uppercase tracking-[0.2em] text-white/60 mb-2">
            Repair steps
          </p>

          <div className="flex items-center justify-between text-xs text-white/70 mb-3">
            <span>
              {issueMeta?.label || selectedIssue || "Selected issue"} ·{" "}
              {(repair?.stepsProgress?.length || workflowSteps.length)} steps
            </span>
            <span>
              Est.{" "}
              <span className="text-white font-semibold">
                {totalMinutes} min
              </span>
            </span>
          </div>

          {/* progress bar */}
          <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden mb-4">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-purple-500 transition-all"
              style={{ width: "0%" }} // can be calculated from repair if needed
            />
          </div>

          {/* Live steps from backend (read-only) */}
          {repair?.stepsProgress ? (
            <div className="space-y-4">
              {repair.stepsProgress.map((step: any, index: number) => (
                <div
                  key={step.stepId}
                  className="flex items-center justify-between px-4 py-3 rounded-xl border border-white/10 bg-white/5"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-white">
                      {index + 1}. {step.label}
                    </span>
                  </div>

                  <div>
                    {step.completed ? (
                      <span className="text-emerald-400 font-semibold text-sm">
                        ✅ Done
                      </span>
                    ) : (
                      <span className="text-white/40 text-sm">
                        ⏳ Pending
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Fallback when no repair data yet
            <div className="space-y-3 max-h-[260px] overflow-auto pr-1">
              {workflowSteps.map((step: WorkflowStep, idx: number) => (
                <div
                  key={step.id}
                  className="flex items-start gap-3 px-3 py-2 rounded-2xl border border-white/10 text-white/70"
                >
                  <span className="mt-0.5 h-6 w-6 flex items-center justify-center rounded-full bg-white/10 text-[11px] font-semibold">
                    {idx + 1}
                  </span>
                  <div className="flex-1">
                    <p className="font-medium">{step.label}</p>
                    <p className="text-[11px] text-white/50 mt-0.5">
                      ~{step.estMinutes} min
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* timing card */}
        <div className="rounded-2xl bg-black/70 border border-purple-400/60 px-5 py-4 flex flex-col gap-2 shadow-[0_0_25px_rgba(168,85,247,0.5)]">
          <p className="text-xs uppercase tracking-[0.2em] text-purple-200/90">
            Time remaining
          </p>
          <p className="text-sm text-white/80">
            Approx.{" "}
            <span className="font-semibold text-white">
              {workflow?.totalMinutes || 0} min
            </span>{" "}
            left based on technician&apos;s workflow.
          </p>
          <p className="text-[11px] text-white/50">
            This is an estimate. Actual repair time can vary based on device
            condition and parts availability.
          </p>
        </div>
      </div>

      {/* RIGHT: chat / requests */}
      <div className="flex flex-col gap-4">
        {/* job header */}
        <div className="rounded-2xl bg-white/5 border border-white/15 px-5 py-4">
          <p className="text-xs uppercase tracking-[0.2em] text-white/60 mb-2">
            Repair session
          </p>
          <div className="space-y-1 text-xs text-white/80">
            <p>
              <span className="text-white/60">Device:</span>{" "}
              {deviceMeta?.displayName || selectedModel || "—"}
            </p>
            <p>
              <span className="text-white/60">Issue:</span>{" "}
              {issueMeta?.label || selectedIssue || "—"}
            </p>
            <p>
              <span className="text-white/60">Technician:</span>{" "}
              Alex Carter · 4.9 ⭐ · 287+ jobs
            </p>
          </div>
        </div>

        {/* request / message box */}
        <div className="rounded-2xl bg-black/70 border border-purple-400/60 px-5 py-4 flex flex-col gap-3 shadow-[0_0_25px_rgba(168,85,247,0.6)]">
          <p className="text-xs uppercase tracking-[0.2em] text-purple-200/90">
            Request photo / ask a question
          </p>

          <p className="text-[11px] text-white/60">
            This sends a request to your assigned technician. They&apos;ll
            respond from their panel with a photo or message in your chat
            thread.
          </p>

          <textarea
            value={requestText}
            onChange={(e) => setRequestText(e.target.value)}
            rows={3}
            className="w-full rounded-2xl bg-white/5 border border-white/20 text-white text-sm px-4 py-3 outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-500/60 resize-none"
            placeholder="Example: Can you send me a photo of the board? / How bad was the water damage you found?"
          />

          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleSendRequest}
              disabled={!requestText.trim()}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition ${
                requestText.trim()
                  ? "bg-purple-600 hover:bg-purple-500 text-white shadow-[0_0_16px_rgba(168,85,247,0.7)]"
                  : "bg-purple-900/40 text-white/40 cursor-not-allowed"
              }`}
            >
              Send request to technician
            </button>
            <p className="text-[11px] text-white/40">
              Responses appear in your main chat / notifications.
            </p>
          </div>

          {requests.length > 0 && (
            <div className="mt-3 border-t border-white/10 pt-3 space-y-2 max-h-[140px] overflow-auto pr-1">
              {requests.map((req) => (
                <div
                  key={req.id}
                  className="rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-[11px] text-white/80"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="uppercase tracking-[0.16em] text-white/50">
                      YOUR REQUEST
                    </span>
                    <span className="text-white/40">{req.createdAt}</span>
                  </div>
                  <p className="whitespace-pre-wrap">{req.text}</p>
                  <p className="mt-1 text-[10px] text-amber-200/80">
                    Status:{" "}
                    {req.status === "sent" ? "Sent to technician" : "Queued"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}