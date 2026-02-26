import React from "react";

type Col<T> = {
  key: keyof T | string;
  header: string;
  render?: (row: T) => React.ReactNode;
};

type Props<T> = {
  columns: Col<T>[];
  data: T[];
};

export default function DataTable<T extends { id: string }>({ columns, data }: Props<T>) {
  return (
    <div className="overflow-auto rounded-2xl border border-white/10">
      <table className="min-w-full text-sm">
        <thead className="bg-white/5 text-white/80">
          <tr>
            {columns.map((c) => (
              <th key={String(c.key)} className="text-left px-4 py-3 font-semibold">
                {c.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="bg-black/20">
          {data.map((row) => (
            <tr key={row.id} className="border-t border-white/10">
              {columns.map((c) => (
                <td key={String(c.key)} className="px-4 py-3 text-white/90">
                  {c.render ? c.render(row) : String((row as any)[c.key])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}