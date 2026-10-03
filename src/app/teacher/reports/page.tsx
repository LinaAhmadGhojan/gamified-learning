"use client";

import { Download } from "lucide-react";
import { Meter } from "@/components/TCharts";
import { Avatar, Btn3D, Card } from "@/components/ui";
import { classAverage, classStudents, studentAccuracy, studentSubjectPct, teacherClasses, topicStats } from "@/lib/analytics";
import { subjectById, topicsOfSubject } from "@/lib/content";
import { useMe, useStore } from "@/lib/store";

export default function Reports() {
  const s = useStore();
  const { teacher } = useMe();
  if (!teacher) return null;
  const mine = teacherClasses(s, teacher.id);

  const topics = mine.flatMap((c) =>
    topicsOfSubject(c.subjectId).map((t) => ({ t, c, ...topicStats(s, t.id, c.studentIds) })),
  ).filter((x) => x.finished > 0);
  const hardest = [...topics].sort((a, b) => a.accuracy - b.accuracy).slice(0, 6);

  const ranked = [...new Set(mine.flatMap((c) => c.studentIds))]
    .map((id) => s.students.find((x) => x.id === id)!)
    .sort((a, b) => b.xp - a.xp);

  const exportCsv = () => {
    const rows = [["الطالب", "المادة", "الإنجاز %", "الدقة %", "نقاط الخبرة", "السلسلة"]];
    for (const c of mine) for (const st of classStudents(s, c.id)) {
      rows.push([st.name, subjectById(c.subjectId)!.name, String(studentSubjectPct(s, st.id, c.subjectId)), String(studentAccuracy(s, st.id, c.subjectId)), String(st.xp), String(st.streak)]);
    }
    const blob = new Blob(["﻿" + rows.map((r) => r.join(",")).join("\n")], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "تقرير-الطلاب.csv";
    a.click();
    URL.revokeObjectURL(a.href);
    s.toast("تم تنزيل التقرير 📄");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div><h1 className="text-3xl font-extrabold text-honey-900">التقارير</h1><p className="text-lg text-ink/70">اعرف أين يتعثّر طلابك وأين يتفوّقون.</p></div>
        <Btn3D variant="white" icon={Download} onClick={exportCsv}>تصدير CSV</Btn3D>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {mine.map((c) => {
          const sub = subjectById(c.subjectId)!;
          const avgAcc = Math.round(classStudents(s, c.id).reduce((n, st) => n + studentAccuracy(s, st.id, sub.id), 0) / Math.max(1, c.studentIds.length));
          return (
            <Card key={c.id}>
              <div className="mb-3 flex items-center gap-3"><span className="text-3xl">{sub.emoji}</span><b className="text-xl">{sub.name}</b></div>
              <div className="space-y-2 text-base">
                <div className="flex items-center justify-between"><span>متوسط الإنجاز</span><Meter pct={classAverage(s, c.id)} tone="green" /></div>
                <div className="flex items-center justify-between"><span>متوسط الدقة</span><Meter pct={avgAcc} /></div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="mb-1 text-xl font-extrabold text-honey-900">الدروس الأكثر صعوبة</h2>
          <p className="mb-4 text-base text-ink/60">الأقل دقة بين من أنهوها: فكّر في إعادة الشرح.</p>
          <ul className="space-y-3">
            {hardest.map((x) => (
              <li key={x.t.id + x.c.id} className="flex items-center gap-3 rounded-2xl bg-honey-50 p-3">
                <span className="text-2xl">{x.t.emoji}</span>
                <div className="min-w-0 flex-1"><div className="truncate text-base font-bold">{x.t.title}</div><div className="text-sm text-ink/60">{subjectById(x.c.subjectId)!.name} · {x.finished} طالباً</div></div>
                <Meter pct={x.accuracy} tone={x.accuracy < 70 ? "red" : "honey"} />
              </li>
            ))}
          </ul>
        </Card>
        <Card>
          <h2 className="mb-4 text-xl font-extrabold text-honey-900">الأكثر نشاطاً</h2>
          <ol className="space-y-2">
            {ranked.slice(0, 8).map((st, i) => (
              <li key={st.id} className="flex items-center gap-3 rounded-2xl bg-honey-50 p-2.5">
                <span className="w-7 text-center text-lg font-extrabold text-honey-700">{i + 1}</span>
                <Avatar emoji={st.avatar} size={38} />
                <span className="flex-1 truncate text-base font-bold">{st.name}</span>
                <b className="text-honey-700">{st.xp} ⭐</b>
              </li>
            ))}
          </ol>
        </Card>
      </div>
    </div>
  );
}
