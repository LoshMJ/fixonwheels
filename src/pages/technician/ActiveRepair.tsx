import React, { useState } from "react";

type RepairStep = {
  id: string;
  label: string;
  estMinutes: number;
};

const mockRepair = {
  customerName: "John Silva",
  device: "iPhone 14 Pro",
  issue: "Cracked screen",
  totalMinutes: 75,
  steps: [
    { id: "checkin", label: "Check-in & visual inspection", estMinutes: 5 },
    { id: "poweroff", label: "Power down device", estMinutes: 5 },
    { id: "open", label: "Open device & remove screen", estMinutes: 15 },
    { id: "replace", label: "Install new display", estMinutes: 20 },
    { id: "qc", label: "Final quality checks", estMinutes: 10 },
  ] as RepairStep[],
};

const ActiveRepair: React.FC = () => {
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  const toggleStep = (id: string) => {
    setCompletedSteps((prev) =>
      prev.includes(id)
        ? prev.filter((s) => s !== id)
        : [...prev, id]
    );
  };

  const progress =
    (completedSteps.length / mockRepair.steps.length) * 100;

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-100 to-slate-200 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white/40 backdrop-blur-xl border-r border-white/30 p-6">
        <div className="mb-10">
          <h1 className="text-xl font-semibold text-slate-800">
            Repair<span className="text-slate-500">Hub</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Technician Portal
          </p>
        </div>

        <nav className="space-y-4">
          <NavItem label="Home" />
          <NavItem label="Incoming Repairs" />
          <NavItem label="Active Repair" active />
          <NavItem label="History" />
          <NavItem label="Profile" />
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 p-10">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-slate-800">
            Active Repair
          </h2>
          <p className="text-slate-500 text-sm">
            Update repair progress in real time
          </p>
        </div>

        {/* Repair summary card */}
        <div className="bg-white/60 backdrop-blur-xl border border-white/40 rounded-xl p-6 shadow-md max-w-4xl mb-8">
          <h3 className="text-lg font-semibold text-slate-800">
            {mockRepair.customerName}
          </h3>
          <p className="text-sm text-slate-600">
            {mockRepair.device} · {mockRepair.issue}
          </p>

          <div className="mt-4">
            <div className="flex justify-between text-xs text-slate-500 mb-1">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-slate-800 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <p className="text-xs text-slate-500 mt-3">
            Estimated total time: {mockRepair.totalMinutes} minutes
          </p>
        </div>

        {/* Steps */}
        <div className="bg-white/60 backdrop-blur-xl border border-white/40 rounded-xl p-6 shadow-md max-w-4xl">
          <h4 className="font-semibold text-slate-800 mb-4">
            Repair Steps
          </h4>

          <div className="space-y-4">
            {mockRepair.steps.map((step, index) => {
              const done = completedSteps.includes(step.id);

              return (
                <div
                  key={step.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => toggleStep(step.id)}
                      className={`w-8 h-8 rounded-full border flex items-center justify-center text-sm
                        ${
                          done
                            ? "bg-slate-800 text-white border-slate-800"
                            : "border-slate-300 text-slate-500"
                        }`}
                    >
                      {index + 1}
                    </button>

                    <div>
                      <p
                        className={`text-sm font-medium
                          ${
                            done
                              ? "text-slate-800 line-through"
                              : "text-slate-700"
                          }`}
                      >
                        {step.label}
                      </p>
                      <p className="text-xs text-slate-500">
                        ~ {step.estMinutes} mins
                      </p>
                    </div>
                  </div>

                  {done && (
                    <span className="text-xs text-emerald-600 font-medium">
                      Completed
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
};

/* ---------------- Components ---------------- */

type NavItemProps = {
  label: string;
  active?: boolean;
};

const NavItem: React.FC<NavItemProps> = ({ label, active }) => {
  return (
    <button
      className={`w-full text-left px-4 py-2 rounded-lg text-sm transition
        ${
          active
            ? "bg-white text-slate-800 shadow-sm"
            : "text-slate-600 hover:bg-white/60 hover:text-slate-800"
        }`}
    >
      {label}
    </button>
  );
};

export default ActiveRepair;
