"use client";

import { Crown } from "lucide-react";
import { useState } from "react";
import { Avatar, PageBar } from "@/components/ui";
import { iso, levelInfo } from "@/lib/gamify";
import { useMe, useStore } from "@/lib/store";

export default function Ranking() {
  const s = useStore();
  const { student } = useMe();
  const [range, setRange] = useState<"week" | "all">("week");
  if (!student) return null;

  const week = Array.from({ length: 7 }, (_, i) => iso(-i));
  const score = (id: string) => {
    const st = s.students.find((x) => x.id === id)!;
    return range === "all" ? st.xp : week.reduce((n, d) => n + (st.daily[d] ?? 0), 0);
  };
  const rows = s.students.map((st) => ({ st, pts: score(st.id) })).sort((a, b) => b.pts - a.pts);
  const top = rows.slice(0, 3);
  const myRank = rows.findIndex((r) => r.st.id === student.id) + 1;
  // podium order in RTL reading: 2nd, 1st, 3rd
  const podium = [top[1], top[0], top[2]].filter(Boolean);
  const h = (i: number) => (i === 1 ? "h-36" : i === 0 ? "h-28" : "h-24");

  return (
    <div className="space-y-5">
      <PageBar title="لوحة الترتيب" />
      <div className="mx-auto flex w-fit rounded-full bg-white p-1 ring-2 ring-honey-200">
        {([["week", "هذا الأسبوع"], ["all", "الكل"]] as const).map(([k, l]) => (
          <button key={k} onClick={() => setRange(k)} className={`rounded-full px-6 py-2 text-base font-extrabold ${range === k ? "bg-honey-500 text-white" : "text-honey-700"}`}>{l}</button>
        ))}
      </div>

      <div className="flex items-end justify-center gap-3 pt-4">
        {podium.map((r, i) => (
          <div key={r.st.id} className="flex w-28 flex-col items-center sm:w-36">
            {i === 1 && <Crown className="mb-1 h-8 w-8 fill-honey-400 text-honey-500" />}
            <Avatar emoji={r.st.avatar} size={i === 1 ? 72 : 60} />
            <div className="mt-1 w-full truncate text-center text-base font-extrabold text-honey-900">{r.st.name.split(" ")[0]}</div>
            <div className="text-sm font-bold text-honey-700">{r.pts} ⭐</div>
            <div className={`mt-2 flex w-full items-start justify-center rounded-t-2xl bg-gradient-to-b from-honey-400 to-honey-600 pt-2 text-3xl font-extrabold text-white ${h(i)}`}>
              {i === 1 ? 1 : i === 0 ? 2 : 3}
            </div>
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-3xl bg-white ring-1 ring-honey-100">
        {rows.map((r, i) => {
          const me = r.st.id === student.id;
          return (
            <div key={r.st.id} className={`flex items-center gap-3 border-b border-honey-50 px-4 py-3 last:border-0 ${me ? "bg-honey-100" : ""}`}>
              <span className="w-8 text-center text-xl font-extrabold text-honey-700">{i + 1}</span>
              <Avatar emoji={r.st.avatar} size={44} />
              <div className="min-w-0 flex-1">
                <div className="truncate text-lg font-extrabold text-honey-900">{r.st.name} {me && <span className="text-sm text-honey-600">(أنت)</span>}</div>
                <div className="text-sm text-ink/60">المستوى {levelInfo(r.st.xp).level} · 🔥 {r.st.streak}</div>
              </div>
              <div className="text-xl font-extrabold text-honey-700">{r.pts} <span className="text-base">⭐</span></div>
            </div>
          );
        })}
      </div>
      <p className="text-center text-base text-ink/60">ترتيبك الحالي: <b className="text-honey-700">{myRank}</b> من {rows.length}</p>
    </div>
  );
}
