// src/components/repair/Step3.tsx

interface Step3Props {
  selectedModel: string | null;
  selectedIssue: string | null;
  handoverConfirmed: boolean;
  setHandoverConfirmed: (val: boolean) => void;
}

export default function Step3({
  selectedModel,
  selectedIssue,
  handoverConfirmed,
  setHandoverConfirmed,
}: Step3Props) {
  const technician = {
    name: "Alex Carter",
    rating: 4.9,
    jobsDone: 287,
    distanceKm: 2.3,
    etaMin: 9,
  };

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