type Props = {
  title: string;
  value: number | string;
  sub?: string;
};

export default function StatCard({ title, value, sub }: Props) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
      <p className="text-white/70 text-sm">{title}</p>
      <p className="text-white text-3xl font-extrabold mt-2">{value}</p>
      {sub && <p className="text-white/50 text-xs mt-2">{sub}</p>}
    </div>
  );
}