// src/components/repair/RepairLayout.tsx
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import io, { Socket } from "socket.io-client";
import { computePricing } from "./repairUtils";
import { getRepairWorkflow } from "./repairWorkflows";

import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import Step4 from "./Step4";
import Step5 from "./Step5";

// Use relative path — this matches your folder structure (src/lib/auth.ts or auth.js)
import { getSession } from "../../lib/auth"; // ← if it's auth.js, change to "../../lib/auth.js"

const steps = [
  { id: 1, title: "Choose your device & problem" },
  { id: 2, title: "Book a technician" },
  { id: 3, title: "Arrival & handover" },
  { id: 4, title: "Repair process & status" },
  { id: 5, title: "Delivery & payment" },
];

export default function RepairLayout() {
  // Load saved state from localStorage on mount (prevents reset on refresh)
  const [currentStep, setCurrentStep] = useState(() => {
    const saved = localStorage.getItem("repairCurrentStep");
    return saved ? parseInt(saved, 10) : 0;
  });

  const [maxUnlockedStep, setMaxUnlockedStep] = useState(() => {
    const saved = localStorage.getItem("repairMaxUnlockedStep");
    return saved ? parseInt(saved, 10) : 0;
  });

  const [selectedModel, setSelectedModel] = useState<string | null>(() => {
    return localStorage.getItem("repairSelectedModel") || null;
  });

  const [selectedIssue, setSelectedIssue] = useState<string | null>(() => {
    return localStorage.getItem("repairSelectedIssue") || null;
  });

  const [notes, setNotes] = useState(() => {
    return localStorage.getItem("repairNotes") || "";
  });

  const [customDevice, setCustomDevice] = useState(() => {
    return localStorage.getItem("repairCustomDevice") || "";
  });

  const [customIssue, setCustomIssue] = useState(() => {
    return localStorage.getItem("repairCustomIssue") || "";
  });

  const [direction, setDirection] = useState<1 | -1>(1);

  const [techAssigned, setTechAssigned] = useState(() => {
    return localStorage.getItem("repairTechAssigned") === "true";
  });

  const [techAssignedName, setTechAssignedName] = useState<string | null>(() => {
    return localStorage.getItem("repairTechAssignedName") || null;
  });

  const [handoverConfirmed, setHandoverConfirmed] = useState(() => {
    return localStorage.getItem("repairHandoverConfirmed") === "true";
  });

  const [bookingLoading, setBookingLoading] = useState(false);

  const [repairId, setRepairId] = useState<string | null>(() => {
    return localStorage.getItem("repairId") || null;
  });

  const [repairStatus, setRepairStatus] = useState<string | null>(() => {
    return localStorage.getItem("repairStatus") || null;
  });

  const [socket, setSocket] = useState<Socket | null>(null);

  const isStep1Valid = !!selectedModel && !!selectedIssue;
  const pricing = computePricing(selectedModel, selectedIssue);
  const workflow = getRepairWorkflow(selectedModel, selectedIssue);

  // Save state to localStorage whenever it changes (prevents reset on refresh)
  useEffect(() => {
    localStorage.setItem("repairCurrentStep", currentStep.toString());
    localStorage.setItem("repairMaxUnlockedStep", maxUnlockedStep.toString());
    localStorage.setItem("repairSelectedModel", selectedModel || "");
    localStorage.setItem("repairSelectedIssue", selectedIssue || "");
    localStorage.setItem("repairNotes", notes);
    localStorage.setItem("repairCustomDevice", customDevice);
    localStorage.setItem("repairCustomIssue", customIssue);
    localStorage.setItem("repairTechAssigned", techAssigned.toString());
    localStorage.setItem("repairTechAssignedName", techAssignedName || "");
    localStorage.setItem("repairHandoverConfirmed", handoverConfirmed.toString());
    localStorage.setItem("repairId", repairId || "");
    localStorage.setItem("repairStatus", repairStatus || "");
  }, [
    currentStep,
    maxUnlockedStep,
    selectedModel,
    selectedIssue,
    notes,
    customDevice,
    customIssue,
    techAssigned,
    techAssignedName,
    handoverConfirmed,
    repairId,
    repairStatus,
  ]);

  // Socket.io setup
  useEffect(() => {
    const newSocket = io("http://localhost:5000", {
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: 5,
    });

    setSocket(newSocket);

    const session = getSession();
    if (session?.userId) {
      newSocket.emit("join", session.userId);
      console.log(`Socket: Joined room for userId ${session.userId}`);
    } else {
      console.warn("Socket: No userId found in session — cannot join room");
    }

    // Listen for acceptance
    newSocket.on(
      "repair_accepted",
      (data: { repairId: string; technicianId: string; technicianName: string }) => {
        console.log("Socket event received: repair_accepted", data);
        if (data.repairId === repairId) {
          setTechAssigned(true);
          setTechAssignedName(data.technicianName);
          setRepairStatus("accepted");
          alert(`Your repair has been accepted by ${data.technicianName}!`);
          if (currentStep === 1) {
            setDirection(1);
            setCurrentStep(2);
          }
        } else {
          console.warn("Socket: Repair ID mismatch", { expected: repairId, received: data.repairId });
        }
      }
    );

    newSocket.on("connect", () => {
      console.log("Socket.io connected to backend!");
    });

    newSocket.on("connect_error", (err) => {
      console.error("Socket connection error:", err.message);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [repairId, currentStep]);

  // Reset handover on step 3
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

  const handleNext = async () => {
    if (currentStep === 0) {
      if (!isStep1Valid) return;
      if (maxUnlockedStep < 1) setMaxUnlockedStep(1);
      setDirection(1);
      setCurrentStep(1);
      return;
    }

    if (currentStep === 1) {
      if (!techAssigned || bookingLoading) return;

      try {
        setBookingLoading(true);

        const session = getSession();
        if (!session?.token) {
          alert("Please login first.");
          setBookingLoading(false);
          return;
        }

        console.log("Booking request → token:", session.token);

        const res = await fetch("http://localhost:5000/api/repairs", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.token}`,
          },
          body: JSON.stringify({
            deviceModel: selectedModel,
            issue: selectedIssue,
            description: notes,
            address: "Customer Address",
          }),
        });

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.message || `HTTP ${res.status}`);
        }

        const data = await res.json();

        setRepairId(data._id);
        setRepairStatus(data.status);

        if (maxUnlockedStep < 2) setMaxUnlockedStep(2);
        setDirection(1);
        setCurrentStep(2);

      } catch (err: any) {
        console.error("Booking failed:", err);
        alert(`Failed to create repair: ${err.message}`);
      } finally {
        setBookingLoading(false);
      }

      return;
    }

    if (currentStep === 2) {
      if (!handoverConfirmed) return;
      if (maxUnlockedStep < 3) setMaxUnlockedStep(3);
      setDirection(1);
      setCurrentStep(3);
      return;
    }

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
    <section className="relative">
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/90" />
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
                className="hidden md:block absolute top-1/2 -translate-y-1/2 left-[-23%] w-[30%] h-[320px] rounded-[28px] bg-white/5 border border-white/5 backdrop-blur-xl shadow-[0_0_30px_rgba(0,0,0,0.5)] rotate-[-12deg]"
              >
                <div className="h-full flex flex-col justify-center px-8 text-white/70">
                  <p className="text-xs uppercase tracking-[0.2em]">Step {currentStep}</p>
                  <p className="text-lg font-semibold">{steps[currentStep - 1].title}</p>
                  <p className="mt-3 text-xs text-white/50">Completed. You can revisit anytime.</p>
                </div>
              </motion.div>
            )}

            {/* right preview card */}
            {currentStep < steps.length - 1 && (
              <motion.div
                initial={{ opacity: 0, x: 60, scale: 0.8 }}
                animate={{ opacity: 0.5, x: 40, scale: 0.85 }}
                exit={{ opacity: 0, x: 60, scale: 0.8 }}
                className="hidden md:block absolute top-1/2 -translate-y-1/2 right-[-23%] w-[30%] h-[320px] rounded-[28px] bg-white/5 border border-white/5 backdrop-blur-xl shadow-[0_0_30px_rgba(0,0,0,0.5)] rotate-[12deg]"
              >
                <div className="h-full flex flex-col justify-center px-8 text-white/70">
                  <p className="text-xs uppercase tracking-[0.2em]">Next</p>
                  <p className="text-lg font-semibold">{steps[currentStep + 1].title}</p>
                  <p className="mt-3 text-xs text-white/50">Locked until this step is done.</p>
                </div>
              </motion.div>
            )}

            {/* MAIN CARD - this is where your steps live */}
            <div className="relative w-full flex justify-center">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={currentStep}
                  custom={direction}
                  initial={{ opacity: 0, x: direction === 1 ? 80 : -80, scale: 0.96 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: direction === 1 ? -80 : 80, scale: 0.96 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="relative w-full md:w-[100%] min-h-[360px] rounded-[32px] border border-white/15 bg-white/8 backdrop-blur-2xl shadow-[0_40px_120px_rgba(0,0,0,0.7)] px-8 py-10 flex flex-col gap-6"
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

                  {/* STEP CONTENT - this is what was missing */}
                  {currentStep === 0 && (
                    <Step1
                      selectedModel={selectedModel}
                      setSelectedModel={setSelectedModel}
                      selectedIssue={selectedIssue}
                      setSelectedIssue={setSelectedIssue}
                      notes={notes}
                      setNotes={setNotes}
                      customDevice={customDevice}
                      setCustomDevice={setCustomDevice}
                      customIssue={customIssue}
                      setCustomIssue={setCustomIssue}
                    />
                  )}

                  {currentStep === 1 && (
                    <Step2
                      selectedModel={selectedModel}
                      selectedIssue={selectedIssue}
                      pricing={pricing}
                      techAssigned={techAssigned}
                      setTechAssigned={setTechAssigned}
                    />
                  )}

                  {currentStep === 2 && (
                    <Step3
                      selectedModel={selectedModel}
                      selectedIssue={selectedIssue}
                      handoverConfirmed={handoverConfirmed}
                      setHandoverConfirmed={setHandoverConfirmed}
                    />
                  )}

                  {currentStep === 3 && (
                    <Step4
                      selectedModel={selectedModel}
                      selectedIssue={selectedIssue}
                      workflow={workflow}
                    />
                  )}

                  {currentStep === 4 && (
                    <Step5
                      selectedModel={selectedModel}
                      selectedIssue={selectedIssue}
                      pricing={pricing}
                    />
                  )}

                  {/* Show repair status */}
                  {repairStatus && (
                    <div className="mt-4 text-center text-sm text-purple-300">
                      Repair Status: <span className="font-bold">{repairStatus}</span>
                    </div>
                  )}

                  {/* Show accepted technician */}
                  {techAssignedName && currentStep <= 2 && (
                    <div className="mt-4 p-3 bg-green-900/40 border border-green-500/50 rounded-xl text-center">
                      <p className="text-green-300 font-semibold">
                        Technician {techAssignedName} has accepted your repair!
                      </p>
                    </div>
                  )}

                  {/* bottom nav */}
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={handlePrev}
                        disabled={!showPrev}
                        className={`h-10 w-10 rounded-full border border-white/20 flex items-center justify-center text-white/70 text-lg transition ${
                          showPrev ? "hover:bg-white/10" : "opacity-30 cursor-not-allowed"
                        }`}
                      >
                        ‹
                      </button>

                      <button
                        onClick={handleNext}
                        disabled={!showNext || !canContinueFromCurrentStep || bookingLoading}
                        className={`h-10 w-10 rounded-full border border-purple-400/60 flex items-center justify-center text-purple-200 text-lg transition ${
                          showNext && canContinueFromCurrentStep && !bookingLoading
                            ? "hover:bg-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.8)]"
                            : "opacity-30 cursor-not-allowed border-white/15 text-white/40"
                        }`}
                      >
                        {bookingLoading ? <span className="animate-spin">↻</span> : "›"}
                      </button>
                    </div>

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

                    <button
                      onClick={handleNext}
                      disabled={!showNext || !canContinueFromCurrentStep || bookingLoading}
                      className={`px-5 py-2 rounded-full text-sm font-semibold transition shadow-[0_0_18px_rgba(168,85,247,0.7)] ${
                        showNext && canContinueFromCurrentStep && !bookingLoading
                          ? "bg-purple-600 hover:bg-purple-700 text-white"
                          : "bg-purple-900/40 text-white/40 cursor-not-allowed shadow-none"
                      }`}
                    >
                      {bookingLoading ? "Booking..." : ctaLabel}
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