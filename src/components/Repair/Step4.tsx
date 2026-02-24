// src/components/repair/Step4.tsx
import { useState, useEffect } from "react";
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
}

export default function Step4({ selectedModel, selectedIssue, workflow }: Step4Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [requestText, setRequestText] = useState("");
  const [requests, setRequests] = useState<
    { id: number; text: string; createdAt: string; status: "sent" | "queued" }[]
  >([]);

  useEffect(() => {
    // reset when model/issue changes
    setActiveIndex(0);
    setCompletedIds([]);
    setRequests([]);
    setRequestText("");
  }, [selectedModel, selectedIssue, workflow?.issue?.id]);

  if (!workflow) {
    return (
      <div className="mt-4 flex-1 flex items-center justify-center text-white/70 text-sm text-center">
        <p className="max-w-md">
          We&apos;ll show the live repair steps here once you&apos;ve selected a
          device & issue and confirmed handover.
        </p>
      </div>
    );
  }

  const workflowSteps = workflow.steps;
  const totalMinutes = workflow.totalMinutes;

  const completedCount = completedIds.length;
  const currentStep = workflowSteps[activeIndex];
  const remainingMinutes = workflowSteps
    .slice(activeIndex)
    .reduce((sum: number, s: WorkflowStep) => sum + s.estMinutes, 0);

  const progress =
    workflowSteps.length === 0 ? 0 : (completedCount / workflowSteps.length) * 100;

  const handleMarkComplete = (step: WorkflowStep) => {
    if (!completedIds.includes(step.id)) {
      setCompletedIds((prev) => [...prev, step.id]);
    }
    if (activeIndex < workflowSteps.length - 1) {
      setActiveIndex(activeIndex + 1);
    }
  };

  const handleJumpToStep = (index: number) => {
    setActiveIndex(index);
  };

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

  return (
    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-8 text-sm md:text-base">
      {/* LEFT: steps timeline */}
      <div className="flex flex-col gap-4">
        <div className="rounded-2xl bg-white/5 border border-white/15 px-5 py-4">
          <p className="text-xs uppercase tracking-[0.2em] text-white/60 mb-2">
            Repair steps
          </p>

          <div className="flex items-center justify-between text-xs text-white/70 mb-3">
            <span>
              {issueMeta?.label || selectedIssue || "Selected issue"} ·{" "}
              {workflowSteps.length} steps
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
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="space-y-3 max-h-[260px] overflow-auto pr-1">
            {workflowSteps.map((step: WorkflowStep, idx: number) => {
              const done = completedIds.includes(step.id);
              const isCurrent = idx === activeIndex && !done;

              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => handleJumpToStep(idx)}
                  className={`w-full flex items-start gap-3 text-left px-3 py-2 rounded-2xl border text-xs md:text-sm transition ${
                    done
                      ? "bg-emerald-500/10 border-emerald-400/40 text-emerald-100"
                      : isCurrent
                      ? "bg-purple-500/10 border-purple-400/60 text-purple-100"
                      : "bg-white/0 border-white/10 text-white/70 hover:bg-white/5"
                  }`}
                >
                  <span
                    className={`mt-0.5 h-6 w-6 flex items-center justify-center rounded-full text-[11px] font-semibold ${
                      done
                        ? "bg-emerald-400 text-black"
                        : isCurrent
                        ? "bg-purple-500 text-white"
                        : "bg-white/10 text-white/70"
                    }`}
                  >
                    {done ? "✓" : idx + 1}
                  </span>
                  <div className="flex-1">
                    <p className="font-medium">{step.label}</p>
                    <p className="text-[11px] text-white/50 mt-0.5">
                      ~{step.estMinutes} min
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {currentStep && (
            <div className="mt-4 flex items-center justify-between gap-3">
              <div className="text-xs text-white/60">
                <p className="text-[11px] uppercase tracking-[0.2em] mb-1">
                  Current step
                </p>
                <p className="text-white font-medium text-sm">
                  {currentStep.label}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleMarkComplete(currentStep)}
                className="px-4 py-2 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-semibold transition shadow-[0_0_15px_rgba(16,185,129,0.7)]"
              >
                Mark step complete
              </button>
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
              {remainingMinutes} min
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