"use client";

export function Bars({ data, color = "#ffb800", height = 150 }: { data: { label: string; value: number }[]; color?: string; height?: number }) {
  const max = Math.max(1, ...data.map((d) => d.value));
  return (
    <div className="flex items-end gap-2" style={{ height }}>
      {data.map((d) => (
        <div key={d.label} className="flex h-full flex-1 flex-col items-center justify-end gap-1">
          <span className="text-xs font-extrabold text-honey-800">{d.value || ""}</span>
          <div className="w-full rounded-t-xl" style={{ height: `${(d.value / max) * 100}%`, minHeight: d.value ? 6 : 3, background: d.value ? color : "#f1e6c5" }} />
          <span className="text-xs font-bold text-ink/60">{d.label}</span>
        </div>
      ))}
    </div>
  );
}

export function Meter({ pct, tone = "honey" }: { pct: number; tone?: "honey" | "green" | "red" }) {
  const c = { honey: "bg-honey-500", green: "bg-leaf-500", red: "bg-berry-500" }[tone];
  return (
    <div className="flex items-center gap-2">
      <div className="h-2.5 w-24 overflow-hidden rounded-full bg-black/10"><div className={`h-full rounded-full ${c}`} style={{ width: `${pct}%` }} /></div>
      <span className="w-10 text-sm font-extrabold">{pct}%</span>
    </div>
  );
}
