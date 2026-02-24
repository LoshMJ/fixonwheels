// src/components/repair/Step1.tsx
import { useState } from "react";
import iphoneMock from "../../assets/iphone2.png";
import { phoneImages } from "./PhoneImages";
import { DEVICES, ISSUES } from "./repairWorkflows";

interface Step1Props {
  selectedModel: string | null;
  setSelectedModel: (val: string | null) => void;
  selectedIssue: string | null;
  setSelectedIssue: (val: string | null) => void;
  notes: string;
  setNotes: (val: string) => void;
  customDevice: string;
  setCustomDevice: (val: string) => void;
  customIssue: string;
  setCustomIssue: (val: string) => void;
}

export default function Step1({
  selectedModel,
  setSelectedModel,
  selectedIssue,
  setSelectedIssue,
  notes,
  setNotes,
  customDevice,
  setCustomDevice,
  customIssue,
  setCustomIssue,
}: Step1Props) {
  const [modelOpen, setModelOpen] = useState(false);
  const [issueOpen, setIssueOpen] = useState(false);

  // ✅ SINGLE SOURCE OF TRUTH FOR IMAGE
  const phoneImage =
    selectedModel && phoneImages[selectedModel]
      ? phoneImages[selectedModel]
      : iphoneMock;

  return (
    <div className="mt-4 flex flex-col md:flex-row gap-8">
      {/* PHONE IMAGE */}
      <div className="md:w-1/3 flex justify-center">
        <div className="relative">
          <div className="absolute -inset-6 bg-purple-500/20 blur-3xl rounded-full" />

          <img
            key={selectedModel ?? "default"} // forces re-render when model changes
            src={phoneImage}
            alt={selectedModel ?? "Phone"}
            className="relative w-40 md:w-48 drop-shadow-[0_0_35px_rgba(168,85,247,0.9)] transition-all duration-300"
          />
        </div>
      </div>

      {/* FORM */}
      <div className="flex-1 flex flex-col gap-6 text-sm relative">
        {/* MODEL DROPDOWN */}
        <div className="relative">
          <label className="block text-xs uppercase tracking-[0.2em] text-white/60 mb-2">
            Device Model
          </label>

          <button
            type="button"
            onClick={() => setModelOpen(!modelOpen)}
            className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/20
            text-left text-white/80 hover:bg-white/10 transition backdrop-blur-xl"
          >
            {selectedModel || "Select your device"}
          </button>

          {modelOpen && (
            <div className="absolute mt-2 w-full z-30 bg-black/80 backdrop-blur-xl border border-white/20 rounded-2xl
              max-h-[260px] overflow-auto shadow-[0_0_25px_rgba(168,85,247,0.5)]">
              {DEVICES.map((device) => (
                <button
                  key={device.id}
                  onClick={() => {
                    setSelectedModel(device.model);
                    setModelOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm border-b border-white/10 last:border-none transition
                    ${
                      selectedModel === device.model
                        ? "bg-purple-600/40 text-purple-200"
                        : "text-white/70 hover:bg-white/10"
                    }`}
                >
                  <span className="text-xs uppercase tracking-[0.18em] text-white/40 mr-2">
                    {device.brand}
                  </span>
                  <span>{device.displayName}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ISSUE DROPDOWN */}
        <div className="relative">
          <label className="block text-xs uppercase tracking-[0.2em] text-white/60 mb-2">
            Issue
          </label>

          <button
            type="button"
            onClick={() => setIssueOpen(!issueOpen)}
            className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/20
            text-left text-white/80 hover:bg-white/10 transition backdrop-blur-xl"
          >
            {selectedIssue || "Select issue"}
          </button>

          {issueOpen && (
            <div className="absolute mt-2 w-full z-30 bg-black/80 backdrop-blur-xl border border-white/20 rounded-2xl
              max-h-[260px] overflow-auto shadow-[0_0_25px_rgba(16,185,129,0.5)]">
              {ISSUES.map((issue) => (
                <button
                  key={issue.id}
                  onClick={() => {
                    setSelectedIssue(issue.label);
                    setIssueOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm border-b border-white/10 last:border-none transition
                    ${
                      selectedIssue === issue.label
                        ? "bg-emerald-600/40 text-emerald-200"
                        : "text-white/70 hover:bg-white/10"
                    }`}
                >
                  {issue.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* NOTES */}
        <div>
          <label className="block text-xs uppercase tracking-[0.2em] text-white/60 mb-2">
            Additional Notes (optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full rounded-2xl bg-black/40 border border-white/15 text-white text-sm
            px-4 py-3 outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-500/60 resize-none"
            placeholder="Example: shuts off at 40%, slight water contact recently..."
          />
        </div>
      </div>
    </div>
  );
}