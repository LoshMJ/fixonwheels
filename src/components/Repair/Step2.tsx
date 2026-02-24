// src/components/repair/Step2.tsx
import { useState, useEffect } from "react";

interface Step2Props {
  selectedModel: string | null;
  selectedIssue: string | null;
  pricing: { repair: number; travel: number; total: number } | null;
  techAssigned: boolean;
  setTechAssigned: (val: boolean) => void;
}

export default function Step2({
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

  const technician = {
    name: "Alex Carter",
    rating: 4.9,
    jobsDone: 287,
    distanceKm: 2.3,
    etaMin: 9,
  };

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