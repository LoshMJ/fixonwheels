// src/components/repair/RepairSteps.tsx
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import iphoneMock from "../../assets/iphone2.png";
import SpinningCard from "../../components/ui/Card";
import { phoneImages } from "./PhoneImages";
import stepsbg from "../../assets/steps-bg.jpg";
import {GridScan} from './GridScan';
import {
  DEVICES,
  ISSUES,
  getRepairWorkflow,
  findDeviceByModel,
  findIssueByLabel,
} from "./repairWorkflows";

import type { WorkflowStep } from "./repairWorkflows";

/* ----------------------------------------
   STEP META
----------------------------------------- */
const steps = [
  { id: 1, title: "Choose your device & problem" },
  { id: 2, title: "Book a technician" },
  { id: 3, title: "Arrival & handover" },
  { id: 4, title: "Repair process & status" },
  { id: 5, title: "Delivery & payment" },
];

/* ----------------------------------------
   PRICING (same logic as before)
----------------------------------------- */
const baseIssuePrices: Record<string, number> = {
  "Cracked screen": 120,
  "Battery issue": 70,
  "Charging port": 55,
  "Camera issue": 95,
  "Water damage": 160,
  "Speaker / mic issue": 45,
  "Software issue": 40,
  Other: 30,
};

const modelMultiplier: Record<string, number> = {
  // iPhone X series
  "iPhone X": 1.0,
  "iPhone XR": 1.05,
  "iPhone XS": 1.1,

  // iPhone 11 series
  "iPhone 11": 1.15,
  "iPhone 11 Pro": 1.2,
  "iPhone 11 Pro Max": 1.25,

  // iPhone 12 series
  "iPhone 12": 1.25,
  "iPhone 12 Pro": 1.3,
  "iPhone 12 Pro Max": 1.35,

  // iPhone 13 series
  "iPhone 13": 1.35,
  "iPhone 13 Pro": 1.4,
  "iPhone 13 Pro Max": 1.45,

  // iPhone 14 series
  "iPhone 14": 1.45,
  "iPhone 14 Plus": 1.5,
  "iPhone 14 Pro": 1.55,
  "iPhone 14 Pro Max": 1.6,

  // iPhone 15 series
  "iPhone 15": 1.55,
  "iPhone 15 Plus": 1.6,
  "iPhone 15 Pro": 1.65,
  "iPhone 15 Pro Max": 1.7,

  // iPhone 16 series
  "iPhone 16": 1.65,
  "iPhone 16 Plus": 1.7,
  "iPhone 16 Pro": 1.75,
  "iPhone 16 Pro Max": 1.8,

  // iPhone 17 series (future-proofed)
  "iPhone 17": 1.75,
  "iPhone 17 Air": 1.8,
  "iPhone 17 Pro": 1.85,
  "iPhone 17 Pro Max": 1.9,

  // Others fall back to 1.0
};


const TRAVEL_FEE = 15;

function computePricing(
  model: string | null,
  issue: string | null
): { repair: number; travel: number; total: number } | null {
  if (!model || !issue) return null;
  const base = baseIssuePrices[issue];
  const multiplier = modelMultiplier[model] ?? 1;
  if (!base) return null;

  const repair = base * multiplier;
  const travel = TRAVEL_FEE;
  const total = repair + travel;
  return { repair, travel, total };
}

/* ----------------------------------------
   FAKE TECHNICIAN INFO (used in step 2 & 3 & 4 & 5)
----------------------------------------- */
const technicianInfo = {
  name: "Alex Carter",
  rating: 4.9,
  jobsDone: 287,
  distanceKm: 2.3,
  etaMin: 9,
};

/* ========================================
   MAIN COMPONENT
======================================== */
export default function RepairSteps() {
  const [currentStep, setCurrentStep] = useState(0);
  const [maxUnlockedStep, setMaxUnlockedStep] = useState(0);

  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [selectedIssue, setSelectedIssue] = useState<string | null>(null);
  const [notes, setNotes] = useState("");

  const [direction, setDirection] = useState<1 | -1>(1);

  // Step 2 state: technician matching
  const [techAssigned, setTechAssigned] = useState(false);

  // Step 3 state: handover confirmation
  const [handoverConfirmed, setHandoverConfirmed] = useState(false);

  const isStep1Valid = !!selectedModel && !!selectedIssue;
  const pricing = computePricing(selectedModel, selectedIssue);

  // Step 4 workflow
  const workflow = getRepairWorkflow(selectedModel, selectedIssue);

  // Reset handover confirmation whenever we land on step 3 fresh
  useEffect(() => {
    if (currentStep === 2) {
      setHandoverConfirmed(false);
    }
  }, [currentStep]);

  const handleGoToStep = (index: number) => {
    if (index > maxUnlockedStep) return;
    setDirection(index > currentStep ? 1 : -1);
    setCurrentStep(index);
  };

  const handleNext = () => {
    // Step 1 → Step 2
    if (currentStep === 0) {
      if (!isStep1Valid) return;
      if (maxUnlockedStep < 1) setMaxUnlockedStep(1);
      setDirection(1);
      setCurrentStep(1);
      return;
    }

    // Step 2 → Step 3
    if (currentStep === 1) {
      if (!techAssigned) return;
      if (maxUnlockedStep < 2) setMaxUnlockedStep(2);
      setDirection(1);
      setCurrentStep(2);
      return;
    }

    // Step 3 → Step 4
    if (currentStep === 2) {
      if (!handoverConfirmed) return;
      if (maxUnlockedStep < 3) setMaxUnlockedStep(3);
      setDirection(1);
      setCurrentStep(3);
      return;
    }

    // Step 4 → Step 5 (and beyond)
    const next = currentStep + 1;
    if (next >= steps.length) return;
    if (maxUnlockedStep < next) setMaxUnlockedStep(next);
    setDirection(1);
    setCurrentStep(next);
  };

  const handlePrev = () => {
    const prev = currentStep - 1;
    if (prev < 0) return;
    setDirection(-1);
    setCurrentStep(prev);
  };

  const showPrev = currentStep > 0;
  const showNext = currentStep < steps.length - 1;

  const canContinueFromCurrentStep =
    currentStep === 0
      ? isStep1Valid
      : currentStep === 1
      ? techAssigned
      : currentStep === 2
      ? handoverConfirmed
      : true;

  const headerBadge = (() => {
    if (currentStep === 0) return "Required";
    if (currentStep === 1) return "Confirm booking";
    if (currentStep === 2) return "Safety check";
    if (currentStep === 3) return "Live repair";
    if (currentStep === 4) return "Payment & rating";
    return "Coming soon";
  })();

  const ctaLabel = (() => {
    if (currentStep === 0) return "Confirm & Continue";
    if (currentStep === 1) return "Confirm booking";
    if (currentStep === 2) return "Confirm handover";
    if (currentStep === 3) return "Go to delivery step";
    return "Next step";
  })();

  return (
<section className="relative bg-black overflow-hidden">
  {/* ================= GRIDSCAN BACKGROUND ================= */}
  <div className="absolute inset-0 z-0 pointer-events-none">
    <GridScan
      sensitivity={0.55}
      lineThickness={1}
      linesColor="#392e4e"
      gridScale={0.1}
      scanColor="#FF9FFC"
      scanOpacity={0.35}
      enablePost
      bloomIntensity={0.6}
      chromaticAberration={0.002}
      noiseIntensity={0.01}
    />
  </div>
      {/* purple glow behind card */}
      {/* ================= PURPLE GLOW ================= */}
  <div className="pointer-events-none absolute inset-0 z-10">
    <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-purple-700/30 blur-[140px]" />
  </div>

 <div className="relative z-20 min-h-screen flex items-center justify-center py-24 px-4">
    <div className="relative max-w-6xl mx-auto flex flex-col items-center gap-10">
      <p className="text-sm tracking-[0.25em] uppercase text-purple-300">
        Step-by-step repair flow
      </p>
        <div className="relative w-full max-w-5xl">
          {/* left preview card */}
          {currentStep > 0 && (
            <motion.div
              initial={{ opacity: 0, x: -60, scale: 0.8 }}
              animate={{ opacity: 0.5, x: -40, scale: 0.85 }}
              exit={{ opacity: 0, x: -60, scale: 0.8 }}
              className="hidden md:block absolute top-1/2 -translate-y-1/2 left-[-40%] w-[260px] h-[320px] rounded-[28px]
              bg-white/5 border border-white/5 backdrop-blur-xl shadow-[0_0_30px_rgba(0,0,0,0.5)] rotate-[-12deg]"
            >
              <div className="h-full flex flex-col justify-center px-8 text-white/70">
                <p className="text-xs uppercase tracking-[0.2em]">
                  Step {currentStep}
                </p>
                <p className="text-lg font-semibold">
                  {steps[currentStep - 1].title}
                </p>
                <p className="mt-3 text-xs text-white/50">
                  Completed. You can revisit anytime.
                </p>
              </div>
            </motion.div>
          )}

          {/* right preview card */}
          {currentStep < steps.length - 1 && (
            <motion.div
              initial={{ opacity: 0, x: 60, scale: 0.8 }}
              animate={{ opacity: 0.5, x: 40, scale: 0.85 }}
              exit={{ opacity: 0, x: 60, scale: 0.8 }}
              className="hidden md:block absolute top-1/2 -translate-y-1/2 right-[-35%] w-[260px] h-[320px] rounded-[28px]
              bg-white/5 border border-white/5 backdrop-blur-xl shadow-[0_0_30px_rgba(0,0,0,0.5)] rotate-[12deg]"
            >
              <div className="h-full flex flex-col justify-center px-8 text-white/70">
                <p className="text-xs uppercase tracking-[0.2em]">Next</p>
                <p className="text-lg font-semibold">
                  {steps[currentStep + 1].title}
                </p>
                <p className="mt-3 text-xs text-white/50">
                  Locked until this step is done.
                </p>
              </div>
            </motion.div>
          )}

          {/* MAIN CARD */}
          <div className="relative w-full flex justify-center">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentStep}
                custom={direction}
                initial={{
                  opacity: 0,
                  x: direction === 1 ? 80 : -80,
                  scale: 0.96,
                }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{
                  opacity: 0,
                  x: direction === 1 ? -80 : 80,
                  scale: 0.96,
                }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="relative w-full md:w-[100%] min-h-[360px] rounded-[32px]
                border border-white/15 bg-white/8 backdrop-blur-2xl
                shadow-[0_40px_120px_rgba(0,0,0,0.7)] px-8 py-10 flex flex-col gap-6"
              >
                {/* header */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-purple-200/80">
                      Step {steps[currentStep].id}
                    </p>
                    <h2 className="text-xl md:text-2xl font-semibold text-white">
                      {steps[currentStep].title}
                    </h2>
                  </div>

                  <span className="px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/50 text-xs text-purple-200">
                    {headerBadge}
                  </span>
                </div>

                {/* STEP CONTENT */}
                {currentStep === 0 && (
                  <Step1Content
                    selectedModel={selectedModel}
                    setSelectedModel={setSelectedModel}
                    selectedIssue={selectedIssue}
                    setSelectedIssue={setSelectedIssue}
                    notes={notes}
                    setNotes={setNotes}
                  />
                )}

                {currentStep === 1 && (
                  <Step2Content
                    selectedModel={selectedModel}
                    selectedIssue={selectedIssue}
                    pricing={pricing}
                    techAssigned={techAssigned}
                    setTechAssigned={setTechAssigned}
                  />
                )}

                {currentStep === 2 && (
                  <Step3Content
                    selectedModel={selectedModel}
                    selectedIssue={selectedIssue}
                    handoverConfirmed={handoverConfirmed}
                    setHandoverConfirmed={setHandoverConfirmed}
                  />
                )}

                {currentStep === 3 && (
                  <Step4Content
                    selectedModel={selectedModel}
                    selectedIssue={selectedIssue}
                    workflow={workflow}
                  />
                )}

                {currentStep === 4 && (
                  <Step5Content
                    selectedModel={selectedModel}
                    selectedIssue={selectedIssue}
                    pricing={pricing}
                  />
                )}

                {/* bottom nav */}
                <div className="mt-4 flex items-center justify-between">
                  {/* arrows */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handlePrev}
                      disabled={!showPrev}
                      className={`h-10 w-10 rounded-full border border-white/20 flex items-center justify-center text-white/70 text-lg transition ${
                        showPrev
                          ? "hover:bg-white/10"
                          : "opacity-30 cursor-not-allowed"
                      }`}
                    >
                      ‹
                    </button>

                    <button
                      onClick={handleNext}
                      disabled={!showNext || !canContinueFromCurrentStep}
                      className={`h-10 w-10 rounded-full border border-purple-400/60 flex items-center justify-center text-purple-200 text-lg transition ${
                        showNext && canContinueFromCurrentStep
                          ? "hover:bg-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.8)]"
                          : "opacity-30 cursor-not-allowed border-white/15 text-white/40"
                      }`}
                    >
                      ›
                    </button>
                  </div>

                  {/* dots */}
                  <div className="flex items-center gap-2">
                    {steps.map((s, idx) => {
                      const unlocked = idx <= maxUnlockedStep;
                      return (
                        <button
                          key={s.id}
                          onClick={() => handleGoToStep(idx)}
                          className={`h-2.5 rounded-full transition-all ${
                            idx === currentStep
                              ? "w-6 bg-white"
                              : unlocked
                              ? "w-2.5 bg-white/60 hover:bg-white"
                              : "w-2.5 bg-white/20 cursor-not-allowed"
                          }`}
                        />
                      );
                    })}
                  </div>

                  {/* CTA */}
                  <button
                    onClick={handleNext}
                    disabled={!showNext || !canContinueFromCurrentStep}
                    className={`px-5 py-2 rounded-full text-sm font-semibold transition shadow-[0_0_18px_rgba(168,85,247,0.7)] ${
                      showNext && canContinueFromCurrentStep
                        ? "bg-purple-600 hover:bg-purple-700 text-white"
                        : "bg-purple-900/40 text-white/40 cursor-not-allowed shadow-none"
                    }`}
                  >
                    {ctaLabel}
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
      </div>
    </section>
  );
}

/* ========================================
   STEP 1 – DEVICE & ISSUE
======================================== */
function Step1Content({
  selectedModel,
  setSelectedModel,
  selectedIssue,
  setSelectedIssue,
  notes,
  setNotes,
}: {
  selectedModel: string | null;
  setSelectedModel: (val: string) => void;
  selectedIssue: string | null;
  setSelectedIssue: (val: string) => void;
  notes: string;
  setNotes: (val: string) => void;
}) {
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


/* ========================================
   STEP 2 – BOOK TECHNICIAN (UI ONLY)
======================================== */
type Step2Props = {
  selectedModel: string | null;
  selectedIssue: string | null;
  pricing: { repair: number; travel: number; total: number } | null;
  techAssigned: boolean;
  setTechAssigned: (val: boolean) => void;
};

function Step2Content({
  selectedModel,
  selectedIssue,
  pricing,
  techAssigned,
  setTechAssigned,
}: Step2Props) {
  const [searching, setSearching] = useState(true);

  useEffect(() => {
    setSearching(true);
    setTechAssigned(false);

    const timeout = setTimeout(() => {
      setSearching(false);
      setTechAssigned(true);
    }, 1600);

    return () => clearTimeout(timeout);
  }, [selectedModel, selectedIssue, setTechAssigned]);

  const technician = technicianInfo;

  return (
    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-8 text-sm md:text-base">
      {/* left – technician + mini map */}
      <div className="flex flex-col gap-4">
        <div className="rounded-2xl bg-white/5 border border-white/15 px-5 py-4 flex flex-col gap-2">
          <p className="text-xs uppercase tracking-[0.2em] text-purple-200/80">
            Technician matching
          </p>

          {searching && (
            <>
              <p className="text-white font-medium">
                Searching for nearby technicians…
              </p>
              <p className="text-white/60 text-xs">
                Checking live availability around your location.
              </p>
              <div className="mt-2 flex gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-purple-400 animate-pulse" />
                <span className="h-1.5 w-1.5 rounded-full bg-purple-400/70 animate-pulse [animation-delay:150ms]" />
                <span className="h-1.5 w-1.5 rounded-full bg-purple-400/40 animate-pulse [animation-delay:300ms]" />
              </div>
            </>
          )}

          {!searching && techAssigned && (
            <>
              <p className="text-white font-semibold">
                {technician.name} assigned to your repair
              </p>
              <p className="text-white/70 text-xs">
                {technician.distanceKm} km away · ETA {technician.etaMin} min
              </p>
              <p className="text-white/50 text-xs">
                Rating {technician.rating} ⭐ · {technician.jobsDone}+ repairs
                completed
              </p>
            </>
          )}
        </div>

        {/* mini map */}
        <div className="relative rounded-2xl bg-gradient-to-br from-[#14002b] via-[#050015] to-[#020617] border border-purple-500/40 px-5 py-4 overflow-hidden">
          <p className="text-xs uppercase tracking-[0.2em] text-white/60 mb-3">
            Live location preview
          </p>

          <div className="relative h-40 rounded-xl overflow-hidden bg-black/60">
            <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_top,_#9333EA_0,_transparent_55%),radial-gradient(circle_at_bottom,_#22C55E_0,_transparent_55%)]" />
            <div className="absolute left-10 top-10 right-10 bottom-10 border-dashed border-purple-300/40 border-[1px] rounded-3xl" />

            {/* user pin */}
            <div className="absolute left-7 bottom-6 flex flex-col items-center gap-1">
              <div className="h-7 w-7 rounded-full bg-emerald-400 shadow-[0_0_18px_rgba(16,185,129,0.9)] flex items-center justify-center text-xs font-bold text-black">
                U
              </div>
              <span className="text-[10px] text-white/70">You</span>
            </div>

            {/* tech pin */}
            <div className="absolute right-7 top-6 flex flex-col items-center gap-1">
              <div className="h-8 w-8 rounded-full bg-purple-500 shadow-[0_0_20px_rgba(168,85,247,1)] flex items-center justify-center text-[11px] font-bold text-white">
                ⚡
              </div>
              <span className="text-[10px] text-white/70">Technician</span>
            </div>
          </div>

          <p className="mt-3 text-[11px] text-white/50">
            Exact turn-by-turn tracking appears once your technician is on the
            way.
          </p>
        </div>
      </div>

      {/* right – summary & pricing */}
      <div className="flex flex-col gap-4">
        <div className="rounded-2xl bg-white/5 border border-white/15 px-5 py-4 flex flex-col gap-3">
          <p className="text-xs uppercase tracking-[0.2em] text-white/60">
            Booking summary
          </p>

          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-white/60">Device</span>
              <span className="text-white font-medium">
                {selectedModel || "—"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Issue</span>
              <span className="text-white font-medium">
                {selectedIssue || "—"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Estimated repair time</span>
              <span className="text-white font-medium">2 – 3 hours</span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-black/60 border border-purple-400/60 px-5 py-4 flex flex-col gap-3 shadow-[0_0_25px_rgba(168,85,247,0.5)]">
          <p className="text-xs uppercase tracking-[0.2em] text-purple-200/90">
            Cost estimate
          </p>

          {pricing ? (
            <>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/60">Repair cost</span>
                  <span className="text-white font-semibold">
                    ${pricing.repair.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Technician travel fee</span>
                  <span className="text-white font-semibold">
                    ${pricing.travel.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-white/10 mt-1">
                  <span className="text-white">Total due on completion</span>
                  <span className="text-purple-300 font-bold text-lg">
                    ${pricing.total.toFixed(2)}
                  </span>
                </div>
              </div>
              <p className="text-[11px] text-white/50 mt-1">
                You only pay after the repair is completed and the device passes
                basic health checks.
              </p>
            </>
          ) : (
            <p className="text-sm text-white/70">
              Select a device & issue in Step 1 to see an exact estimate.
            </p>
          )}
        </div>

        {!techAssigned && (
          <p className="text-xs text-amber-200/80 mt-1">
            We&apos;ll enable confirmation as soon as a technician is matched.
          </p>
        )}
      </div>
    </div>
  );
}

/* ========================================
   STEP 3 – ARRIVAL & HANDOVER CONFIRMATION
======================================== */
type Step3Props = {
  selectedModel: string | null;
  selectedIssue: string | null;
  handoverConfirmed: boolean;
  setHandoverConfirmed: (val: boolean) => void;
};

function Step3Content({
  selectedModel,
  selectedIssue,
  handoverConfirmed,
  setHandoverConfirmed,
}: Step3Props) {
  const technician = technicianInfo;

  return (
    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-8 text-sm md:text-base">
      {/* left – arrival status */}
      <div className="flex flex-col gap-4">
        <div className="rounded-2xl bg-emerald-500/10 border border-emerald-400/40 px-5 py-4 flex flex-col gap-2 shadow-[0_0_20px_rgba(16,185,129,0.5)]">
          <p className="text-xs uppercase tracking-[0.2em] text-emerald-200/90">
            Technician arrival
          </p>
          <p className="text-white font-semibold text-base">
            {technician.name} has arrived at your location.
          </p>
          <p className="text-white/70 text-xs">
            Please meet them at your selected pickup point and hand over your
            device securely.
          </p>

          <div className="mt-3 flex items-center gap-3 text-xs text-white/70">
            <div className="h-9 w-9 rounded-full bg-emerald-400 flex items-center justify-center text-black font-bold shadow-[0_0_18px_rgba(16,185,129,0.9)]">
              ✓
            </div>
            <div>
              <p className="font-medium text-white">
                Safety tip – verify your technician
              </p>
              <p className="text-white/60">
                Ask them to confirm your name & device model, and check their
                FixOnWheels ID before handover.
              </p>
            </div>
          </div>
        </div>

        {/* little timeline card */}
        <div className="rounded-2xl bg-white/5 border border-white/10 px-5 py-4">
          <p className="text-xs uppercase tracking-[0.2em] text-white/60 mb-2">
            Today&apos;s flow
          </p>
          <ol className="space-y-2 text-xs text-white/70">
            <li>1. Technician verifies device & issue with you.</li>
            <li>2. You confirm handover inside the app (this step).</li>
            <li>3. Device is taken to secure lab for repair.</li>
            <li>4. You receive live repair updates & final delivery.</li>
          </ol>
        </div>
      </div>

      {/* right – handover confirmation UI */}
      <div className="flex flex-col gap-4">
        <div className="rounded-2xl bg-white/5 border border-white/15 px-5 py-4 flex flex-col gap-3">
          <p className="text-xs uppercase tracking-[0.2em] text-white/60">
            Handover checklist
          </p>

          <div className="space-y-2 text-xs text-white/70">
            <p>
              <span className="text-white font-semibold">Device:</span>{" "}
              {selectedModel || "—"}
            </p>
            <p>
              <span className="text-white font-semibold">Issue:</span>{" "}
              {selectedIssue || "—"}
            </p>
          </div>

          <ul className="mt-3 space-y-1 text-xs text-white/70">
            <li>• Remove any personal cases or accessories if you want.</li>
            <li>• Turn off & unlock the device, or share temporary passcode.</li>
            <li>
              • Make sure your data is backed up (iCloud / Google / local
              backup).
            </li>
          </ul>
        </div>

        {/* toggle card */}
        <div className="rounded-2xl bg-black/70 border border-purple-400/60 px-5 py-4 flex flex-col gap-3 shadow-[0_0_25px_rgba(168,85,247,0.5)]">
          <p className="text-xs uppercase tracking-[0.2em] text-purple-200/90">
            Confirm handover
          </p>

          <p className="text-xs text-white/70">
            Toggle this once you&apos;ve physically handed your phone to{" "}
            <span className="font-semibold text-white">{technician.name}</span>.
            This acts as a digital handover receipt for both of you.
          </p>

          <button
            type="button"
            onClick={() => setHandoverConfirmed(!handoverConfirmed)}
            className={`mt-2 inline-flex items-center justify-between w-full px-4 py-3 rounded-2xl border text-sm font-semibold transition
              ${
                handoverConfirmed
                  ? "bg-emerald-500 border-emerald-300 text-black shadow-[0_0_22px_rgba(16,185,129,0.9)]"
                  : "bg-white/5 border-white/25 text-white/80 hover:bg-white/10"
              }`}
          >
            <span>
              {handoverConfirmed
                ? "Handover confirmed"
                : "Tap to confirm: device handed over"}
            </span>
            <span
              className={`h-6 w-11 rounded-full flex items-center px-1 transition ${
                handoverConfirmed ? "bg-black/80" : "bg-white/20"
              }`}
            >
              <span
                className={`h-4 w-4 rounded-full bg-white transform transition ${
                  handoverConfirmed ? "translate-x-4" : "translate-x-0"
                }`}
              />
            </span>
          </button>

          {!handoverConfirmed && (
            <p className="text-[11px] text-amber-200/80">
              You&apos;ll be able to continue to the repair tracking step once
              this handover is confirmed.
            </p>
          )}

          {handoverConfirmed && (
            <p className="text-[11px] text-emerald-200/90">
              Nice — your technician can now start the repair. You&apos;ll see
              live status in the next step.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

/* ========================================
   STEP 4 – REPAIR PROCESS & STATUS
======================================== */
type Step4Props = {
  selectedModel: string | null;
  selectedIssue: string | null;
  workflow: ReturnType<typeof getRepairWorkflow> | null;
};

function Step4Content({ selectedModel, selectedIssue, workflow }: Step4Props) {
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

  const steps = workflow.steps;
  const totalMinutes = workflow.totalMinutes;
  const completedCount = completedIds.length;
  const currentStep = steps[activeIndex];
  const remainingMinutes = steps
    .slice(activeIndex)
    .reduce((sum, s) => sum + s.estMinutes, 0);

  const progress =
    steps.length === 0 ? 0 : (completedCount / steps.length) * 100;

  const handleMarkComplete = (step: WorkflowStep) => {
    if (!completedIds.includes(step.id)) {
      setCompletedIds((prev) => [...prev, step.id]);
    }
    if (activeIndex < steps.length - 1) {
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
              {steps.length} steps
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
            {steps.map((step, idx) => {
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
              {technicianInfo.name} · {technicianInfo.rating} ⭐ ·{" "}
              {technicianInfo.jobsDone}+ jobs
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

/* ========================================
   STEP 5 – DELIVERY & PAYMENT + LOYALTY + RATING
======================================== */
type Step5Props = {
  selectedModel: string | null;
  selectedIssue: string | null;
  pricing: { repair: number; travel: number; total: number } | null;
};

type PaymentMethod = "card" | "cash" | "paypal";
type PaymentStatus = "idle" | "processing" | "success";

function Step5Content({
  selectedModel,
  selectedIssue,
  pricing,
}: Step5Props) {
  const [method, setMethod] = useState<PaymentMethod>("card");
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("idle");

  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");

  const [paypalEmail, setPaypalEmail] = useState("");

  const [loyaltyPoints, setLoyaltyPoints] = useState<number | null>(null);
  const [rating, setRating] = useState(0);
  const [ratingNote, setRatingNote] = useState("");

  useEffect(() => {
    // reset when job changes
    setMethod("card");
    setPaymentStatus("idle");
    setCardName("");
    setCardNumber("");
    setCardExpiry("");
    setCardCvc("");
    setPaypalEmail("");
    setLoyaltyPoints(null);
    setRating(0);
    setRatingNote("");
  }, [selectedModel, selectedIssue, pricing?.total]);

  const deviceMeta = findDeviceByModel(selectedModel || "");
  const issueMeta = findIssueByLabel(selectedIssue || "");

  const total = pricing?.total ?? 0;
  const computedPoints =
    total > 0 ? Math.max(2, Math.round(total * 0.02)) : 2; // at least 2 pts

  const canSubmit =
    method === "cash"
      ? true
      : method === "card"
      ? !!cardName && !!cardNumber && !!cardExpiry && !!cardCvc
      : !!paypalEmail;

  const handlePay = () => {
    if (!canSubmit || paymentStatus === "processing") return;

    setPaymentStatus("processing");

    // fake async "real" payment
    setTimeout(() => {
      setPaymentStatus("success");
      setLoyaltyPoints(computedPoints);
    }, 900);
  };

  const renderMethodFields = () => {
    if (method === "cash") {
      return (
        <div className="space-y-3 text-sm text-white/80">
          <p>
            You&apos;ve selected{" "}
            <span className="font-semibold text-white">
              Cash on delivery
            </span>
            .
          </p>
          <p className="text-white/70 text-xs">
            You&apos;ll pay the technician once your device is delivered back
            to you. They&apos;ll confirm the payment on their panel and you&apos;ll
            see a confirmation here.
          </p>
          <div className="mt-2 rounded-2xl bg-black/60 border border-emerald-400/50 px-4 py-3 flex items-center justify-between">
            <span className="text-xs text-white/60">
              Total due on delivery
            </span>
            <span className="text-lg font-semibold text-emerald-300">
              ${total.toFixed(2)}
            </span>
          </div>
          {paymentStatus === "success" && (
            <p className="text-[11px] text-emerald-200/90">
              Payment marked as received by technician. Thank you!
            </p>
          )}
        </div>
      );
    }

    if (method === "paypal") {
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-[0.2em] text-white/60 mb-2">
              PayPal email
            </label>
            <input
              type="email"
              value={paypalEmail}
              onChange={(e) => setPaypalEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-2xl bg-black/40 border border-white/15 text-white text-sm px-4 py-3 outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-500/60"
            />
          </div>
          <p className="text-[11px] text-white/50">
            We&apos;ll open a secure PayPal flow in production. For now this is
            a front-end preview only.
          </p>
        </div>
      );
    }

    // CARD
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-3">
          <div>
            <label className="block text-xs uppercase tracking-[0.2em] text-white/60 mb-2">
              Cardholder name
            </label>
            <input
              type="text"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              placeholder="Name on card"
              className="w-full rounded-2xl bg-black/40 border border-white/15 text-white text-sm px-4 py-3 outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-500/60"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-[0.2em] text-white/60 mb-2">
              Card number
            </label>
            <input
              type="text"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              placeholder="1234 5678 9012 3456"
              className="w-full rounded-2xl bg-black/40 border border-white/15 text-white text-sm px-4 py-3 outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-500/60"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="block text-xs uppercase tracking-[0.2em] text-white/60 mb-2">
                Expiry
              </label>
              <input
                type="text"
                value={cardExpiry}
                onChange={(e) => setCardExpiry(e.target.value)}
                placeholder="MM/YY"
                className="w-full rounded-2xl bg-black/40 border border-white/15 text-white text-sm px-4 py-3 outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-500/60"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-[0.2em] text-white/60 mb-2">
                CVC
              </label>
              <input
                type="password"
                value={cardCvc}
                onChange={(e) => setCardCvc(e.target.value)}
                placeholder="***"
                className="w-full rounded-2xl bg-black/40 border border-white/15 text-white text-sm px-4 py-3 outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-500/60"
              />
            </div>
          </div>
        </div>

        {/* spinning card component just for card payments */}
        <div className="mt-2 flex justify-start">
          <SpinningCard />
        </div>

        <p className="text-[11px] text-white/50">
          This is a visual preview. In production this will connect to your real
          payment gateway (Stripe / PayPal / bank).
        </p>
      </div>
    );
  };

  return (
    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-8 text-sm md:text-base">
      {/* LEFT: payment method + inputs */}
      <div className="flex flex-col gap-4">
        <div className="rounded-2xl bg-white/5 border border-white/15 px-5 py-4 flex flex-col gap-3">
          <p className="text-xs uppercase tracking-[0.2em] text-white/60 mb-1">
            Payment method
          </p>

          <div className="space-y-1 text-xs text-white/80 mb-2">
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
              {technicianInfo.name}
            </p>
          </div>

          {/* method selector */}
          <div className="inline-flex items-center gap-2 rounded-full bg-black/40 p-1 border border-white/10 text-xs">
            <button
              type="button"
              onClick={() => setMethod("card")}
              className={`px-3 py-1.5 rounded-full transition ${
                method === "card"
                  ? "bg-purple-600 text-white shadow-[0_0_12px_rgba(168,85,247,0.7)]"
                  : "text-white/70 hover:bg-white/5"
              }`}
            >
              Card
            </button>
            <button
              type="button"
              onClick={() => setMethod("cash")}
              className={`px-3 py-1.5 rounded-full transition ${
                method === "cash"
                  ? "bg-emerald-500 text-black shadow-[0_0_12px_rgba(16,185,129,0.7)]"
                  : "text-white/70 hover:bg-white/5"
              }`}
            >
              Cash on delivery
            </button>
            <button
              type="button"
              onClick={() => setMethod("paypal")}
              className={`px-3 py-1.5 rounded-full transition ${
                method === "paypal"
                  ? "bg-sky-500 text-black shadow-[0_0_12px_rgba(56,189,248,0.7)]"
                  : "text-white/70 hover:bg-white/5"
              }`}
            >
              PayPal
            </button>
          </div>

          <div className="mt-3">{renderMethodFields()}</div>

          {/* total row */}
          <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3">
            <span className="text-xs text-white/60">Order total</span>
            <div className="text-right">
              <p className="text-lg font-semibold text-white">
                ${total.toFixed(2)}
              </p>
              <p className="text-[10px] text-white/40">
                Repair + travel · no hidden fees
              </p>
            </div>
          </div>

          {/* pay button */}
          <button
            type="button"
            onClick={handlePay}
            disabled={!canSubmit || paymentStatus === "processing"}
            className={`mt-3 w-full px-4 py-2.5 rounded-full text-xs font-semibold transition flex items-center justify-center gap-2 ${
              canSubmit && paymentStatus !== "processing"
                ? "bg-purple-600 hover:bg-purple-500 text-white shadow-[0_0_18px_rgba(168,85,247,0.8)]"
                : "bg-purple-900/40 text-white/40 cursor-not-allowed"
            }`}
          >
            {paymentStatus === "processing" ? (
              <>
                <span className="h-3 w-3 rounded-full border-2 border-white/40 border-t-transparent animate-spin" />
                Processing payment…
              </>
            ) : method === "cash" ? (
              "Mark as will pay on delivery"
            ) : (
              "Confirm payment"
            )}
          </button>

          {paymentStatus === "success" && (
            <p className="mt-2 text-[11px] text-emerald-200/90">
              Payment confirmed. A receipt will appear in your account and a
              notification is sent to your device.
            </p>
          )}
        </div>
      </div>

      {/* RIGHT: loyalty + rating */}
      <div className="flex flex-col gap-4">
        {/* loyalty points */}
        <div className="rounded-2xl bg-black/70 border border-emerald-400/60 px-5 py-4 shadow-[0_0_25px_rgba(16,185,129,0.5)]">
          <p className="text-xs uppercase tracking-[0.2em] text-emerald-200/90 mb-2">
            Loyalty & rewards
          </p>

          <p className="text-sm text-white/80">
            For this repair you&apos;ll earn{" "}
            <span className="font-semibold text-emerald-200">
              {loyaltyPoints ?? computedPoints} pts
            </span>{" "}
            towards future discounts.
          </p>

          <p className="text-[11px] text-white/50 mt-2">
            Points unlock priority support and % discounts on your next
            FixOnWheels repair.
          </p>

          {paymentStatus !== "success" && (
            <p className="text-[11px] text-amber-200/80 mt-2">
              Confirm payment to actually credit these points to your profile.
            </p>
          )}
        </div>

        {/* rating card */}
        <div className="rounded-2xl bg-white/5 border border-white/15 px-5 py-4 flex flex-col gap-3">
          <p className="text-xs uppercase tracking-[0.2em] text-white/60">
            Rate your technician
          </p>

          <p className="text-xs text-white/70">
            Help us keep quality high for every repair. This feedback is shared
            with{" "}
            <span className="font-semibold text-white">
              {technicianInfo.name}
            </span>{" "}
            and our support team.
          </p>

          {/* stars */}
          <div className="flex items-center gap-1 mt-1">
            {[1, 2, 3, 4, 5].map((star) => {
              const active = rating >= star;
              return (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="p-1"
                >
                  <span
                    className={`text-xl ${
                      active ? "text-yellow-300" : "text-white/30"
                    }`}
                  >
                    ★
                  </span>
                </button>
              );
            })}
            {rating > 0 && (
              <span className="ml-2 text-xs text-white/70">
                {rating}/5 stars
              </span>
            )}
          </div>

          {/* note */}
          <textarea
            value={ratingNote}
            onChange={(e) => setRatingNote(e.target.value)}
            rows={3}
            className="w-full rounded-2xl bg-black/40 border border-white/15 text-white text-sm px-4 py-3 outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-500/60 resize-none"
            placeholder="Anything you loved or anything we should improve?"
          />

          <button
            type="button"
            className="self-start mt-1 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-xs text-white font-semibold transition"
          >
            Save feedback
          </button>

          {paymentStatus === "success" && (
            <p className="text-[11px] text-emerald-200/90 mt-1">
              Thanks! Your rating and notes are saved with this job.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
