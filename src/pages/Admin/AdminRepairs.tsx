import { useMemo } from "react";
import DataTable from "../../components/admin/DataTable";

type RepairRow = {
  id: string;
  device: string;
  customer: string;
  technician: string;
  status: "Incoming" | "Active" | "Completed";
  date: string;
};

export default function AdminRepairs() {
  const data: RepairRow[] = useMemo(
    () => [
      { id: "r1", device: "iPhone 13 Screen", customer: "Nimal", technician: "Tech A", status: "Incoming", date: "2026-02-25" },
      { id: "r2", device: "Samsung A14 Battery", customer: "Kamal", technician: "Tech B", status: "Active", date: "2026-02-24" },
      { id: "r3", device: "Earbuds Repair", customer: "Sita", technician: "Tech C", status: "Completed", date: "2026-02-20" },
    ],
    []
  );

  return (
    <div>
      <h1 className="text-3xl font-extrabold">Repairs</h1>
      <p className="text-white/60 mt-1">All repair jobs with full details</p>

      <div className="mt-5">
        <DataTable<RepairRow>
          columns={[
            { key: "id", header: "Repair ID" },
            { key: "device", header: "Device/Issue" },
            { key: "customer", header: "Customer" },
            { key: "technician", header: "Technician" },
            { key: "status", header: "Status" },
            { key: "date", header: "Date" },
          ]}
          data={data}
        />
      </div>
    </div>
  );
}