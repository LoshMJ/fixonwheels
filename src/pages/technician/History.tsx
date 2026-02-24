import React, { useState, useEffect } from "react";
import { getSession } from "../../utils/auth";

type CompletedRepair = {
  _id: string;
  model: string;
  issueLabel: string;
  customerId: string;
  completedAt: string;
  status: string;
};

const History: React.FC = () => {
  const [repairs, setRepairs] = useState<CompletedRepair[]>([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    const session = getSession();
    try {
      const res = await fetch("http://localhost:5000/api/repairs/history", {
        headers: { Authorization: `Bearer ${session?.token}` },
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setRepairs(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r shadow-sm p-6">
        <h1 className="text-xl font-bold text-slate-800">RepairHub</h1>
        <p className="text-sm text-slate-500 mt-1">Technician Portal</p>
        <nav className="mt-10 space-y-2">
          <NavItem label="Home" to="/technician" />
          <NavItem label="Incoming Repairs" to="/technician/incoming" />
          <NavItem label="Active Repairs" to="/technician/active" />
          <NavItem label="History" to="/technician/history" active />
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 p-10">
        <h2 className="text-2xl font-semibold mb-6">Completed Repairs History</h2>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          {repairs.length === 0 ? (
            <p className="text-center py-20 text-slate-400">No completed repairs yet</p>
          ) : (
            <div className="space-y-5">
              {repairs.map((repair) => (
                <div key={repair._id} className="p-5 border rounded-xl bg-slate-50">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-lg">{repair.model}</p>
                      <p className="text-slate-700">{repair.issueLabel}</p>
                    </div>
                    <span className="text-emerald-600 font-medium">
                      Completed
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 mt-2">
                    Completed on {new Date(repair.completedAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

function NavItem({ label, to, active }: { label: string; to: string; active?: boolean }) {
  return (
    <a
      href={to}
      className={`block px-5 py-3 rounded-lg text-sm font-medium transition ${
        active
          ? "bg-purple-100 text-purple-800"
          : "text-slate-700 hover:bg-slate-100"
      }`}
    >
      {label}
    </a>
  );
}

export default History;