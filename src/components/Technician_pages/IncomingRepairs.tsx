import React, { useState } from "react";
import {
  getRepairWorkflow,
  type WorkflowStep,
} from "../Repair/repairWorkflows";

/* ---------------- Types ---------------- */

type IncomingRepair = {
  id: string;
  customerName: string;
  model: string;
  issueLabel: string;
  distanceKm: number;
  requestedAt: string;
};

/* ---------------- Mock DB Data ---------------- */

const mockIncomingRepairs: IncomingRepair[] = [
  {
    id: "r1",
    customerName: "Alex Fernando",
    model: "iPhone 13 Pro",
    issueLabel: "Cracked screen",
    distanceKm: 3.2,
    requestedAt: "5 mins ago",
  },
  {
    id: "r2",
    customerName: "Nimal Perera",
    model: "Galaxy S22",
    issueLabel: "Battery issue",
    distanceKm: 5.8,
    requestedAt: "12 mins ago",
  },
];

/* ---------------- Page ---------------- */

const IncomingRepairs: React.FC = () => {
  const [selectedRepair, setSelectedRepair] =
    useState<IncomingRepair | null>(null);

  const workflow = selectedRepair
    ? getRepairWorkflow(
        selectedRepair.model,
        selectedRepair.issueLabel
      )
    : null;

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r p-6">
        <h1 className="text-lg font-semibold mb-8">Technician</h1>
        <nav className="space-y-3">
          <NavItem label="Home" />
          <NavItem label="Incoming Repairs" active />
          <NavItem label="Active Repair" />
          <NavItem label="History" />
          <NavItem label="Profile" />
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 p-10">
        <h2 className="text-2xl font-semibold mb-6">
          Incoming Repairs
        </h2>

        <div className="grid grid-cols-2 gap-8">
          {/* LEFT — Incoming List */}
          <div className="space-y-4">
            {mockIncomingRepairs.map((repair) => (
              <div
                key={repair.id}
                className="bg-white rounded-xl p-5 shadow flex justify-between"
              >
                <div>
                  <h3 className="font-semibold">
                    {repair.customerName}
                  </h3>
                  <p className="text-sm text-slate-600">
                    {repair.model} · {repair.issueLabel}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {repair.distanceKm} km · {repair.requestedAt}
                  </p>
                </div>

                <button
                  onClick={() => setSelectedRepair(repair)}
                  className="self-center px-4 py-2 text-sm bg-slate-800 text-white rounded-lg"
                >
                  View
                </button>
              </div>
            ))}
          </div>

          {/* RIGHT — Workflow Preview */}
          <div className="bg-white rounded-xl p-6 shadow">
            {!workflow && (
              <p className="text-slate-500 text-sm">
                Select a repair to preview workflow
              </p>
            )}

            {workflow && (
              <>
                <h3 className="font-semibold text-lg mb-1">
                  Repair Workflow
                </h3>

                <p className="text-sm text-slate-600 mb-4">
                  {workflow.device?.displayName} ·{" "}
                  {workflow.issue.label}
                </p>

                <p className="text-sm font-medium mb-4">
                  Estimated time:{" "}
                  <span className="text-slate-800">
                    {workflow.totalMinutes} mins
                  </span>
                </p>

                <ol className="space-y-3">
                  {workflow.steps.map(
                    (step: WorkflowStep, index: number) => (
                      <li
                        key={step.id}
                        className="flex gap-3"
                      >
                        <span className="w-6 h-6 rounded-full bg-slate-800 text-white text-xs flex items-center justify-center">
                          {index + 1}
                        </span>
                        <div>
                          <p className="text-sm font-medium">
                            {step.label}
                          </p>
                          <p className="text-xs text-slate-500">
                            ~ {step.estMinutes} mins
                          </p>
                        </div>
                      </li>
                    )
                  )}
                </ol>

                <button className="mt-6 w-full py-2 bg-emerald-600 text-white rounded-lg">
                  Accept Repair
                </button>
              </>
            )}
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

const NavItem: React.FC<NavItemProps> = ({ label, active }) => (
  <div
    className={`px-4 py-2 rounded-lg text-sm ${
      active
        ? "bg-slate-800 text-white"
        : "text-slate-600 hover:bg-slate-200"
    }`}
  >
    {label}
  </div>
);

export default IncomingRepairs;
