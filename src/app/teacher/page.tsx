"use client";

import { AlertTriangle, CheckCircle2, ClipboardCheck, GraduationCap, TrendingUp, Users } from "lucide-react";
import Link from "next/link";
import { Bars, Meter } from "@/components/TCharts";
import { Avatar, Card, Pill } from "@/components/ui";
import { classAverage, classStudents, needsAttention, pendingGrading, teacherClasses, weeklyXp } from "@/lib/analytics";
import { subjectById } from "@/lib/content";
import { timeAgo } from "@/lib/gamify";
import { useMe, useNow, useStore } from "@/lib/store";

export default function TeacherHome() {
  const s = useStore();
  const { teacher } = useMe();
  const now = useNow(60000);
  if (!teacher) return null;
  const mine = teacherClasses(s, teacher.id);
  const ids = new Set(mine.flatMap((c) => c.studentIds));
  const idList = [...ids];
  const toGrade = pendingGrading(s, mine.map((c) => c.id));
  const avg = mine.length ? Math.round(mine.reduce((n, c) => n + classAverage(s, c.id), 0) / mine.length) : 0;
  const week = weeklyXp(s, idList);
  const attention = needsAttention(s, idList).slice(0, 5);
  const dayLabel = (d: string) => new Date(d + "T12:00:00").toLocaleDateString("ar", { weekday: "short" });
  const activeToday = s.students.filter((x) => ids.has(x.id) && (x.daily[week.at(-1)!.day] ?? 0) > 0).length;

  const kpis = [
    { l: "عدد الطلاب", v: idList.length, i: Users, c: "bg-honey-100 text-honey-700" },
    { l: "متوسط الإنجاز", v: `${avg}%`, i: TrendingUp, c: "bg-leaf-100 text-leaf-600" },
    { l: "بانتظار التصحيح", v: toGrade.length, i: ClipboardCheck, c: "bg-berry-100 text-berry-600" },
    { l: "نشِطون اليوم", v: activeToday, i: GraduationCap, c: "bg-sky-100 text-sky-700" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-honey-900">أهلاً {teacher.name} 👋</h1>
        <p className="text-lg text-ink/70">هذه نظرة سريعة على صفوفك اليوم.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {kpis.map((k) => (
          <Card key={k.l} className="flex items-center gap-4">
            <span className={`flex h-14 w-14 items-center justify-center rounded-2xl ${k.c}`}><k.i className="h-7 w-7" /></span>
            <div><div className="text-3xl font-extrabold text-honey-900">{k.v}</div><div className="text-base text-ink/60">{k.l}</div></div>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <h2 className="mb-1 text-xl font-extrabold text-honey-900">نشاط الطلاب هذا الأسبوع</h2>
          <p className="mb-4 text-base text-ink/60">مجموع نقاط الخبرة اليومية</p>
          <Bars data={week.map((w) => ({ label: dayLabel(w.day), value: w.xp }))} height={190} />
        </Card>
        <Card>
          <h2 className="mb-3 flex items-center gap-2 text-xl font-extrabold text-honey-900"><AlertTriangle className="h-5 w-5 text-orange-500" />يحتاجون متابعة</h2>
          {attention.length === 0 && <p className="text-base text-ink/60">الجميع نشِط 🎉</p>}
          <ul className="space-y-3">
            {attention.map(({ st, idle }) => (
              <li key={st.id} className="flex items-center gap-3">
                <Avatar emoji={st.avatar} size={40} />
                <div className="min-w-0 flex-1"><div className="truncate text-base font-bold">{st.name}</div><div className="text-sm text-ink/60">غائب منذ {idle} أيام</div></div>
                <Pill tone="red">{st.streak} 🔥</Pill>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="mb-4 text-xl font-extrabold text-honey-900">صفوفي</h2>
          <ul className="space-y-3">
            {mine.map((c) => {
              const sub = subjectById(c.subjectId)!;
              return (
                <li key={c.id}>
                  <Link href={`/teacher/class/${c.id}`} className="flex items-center gap-3 rounded-2xl bg-honey-50 p-3 transition hover:bg-honey-100">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl text-2xl text-white" style={{ background: `linear-gradient(135deg, ${sub.from}, ${sub.to})` }}>{sub.emoji}</span>
                    <div className="min-w-0 flex-1"><div className="text-lg font-extrabold">{sub.name}</div><div className="text-sm text-ink/60">{c.grade} · {classStudents(s, c.id).length} طالباً</div></div>
                    <Meter pct={classAverage(s, c.id)} tone="green" />
                  </Link>
                </li>
              );
            })}
          </ul>
        </Card>

        <Card>
          <div className="mb-4 flex items-center justify-between"><h2 className="text-xl font-extrabold text-honey-900">تسليمات تنتظر التصحيح</h2><Link href="/teacher/assignments" className="text-base font-bold text-honey-600 underline">عرض الكل</Link></div>
          {toGrade.length === 0 && <p className="flex items-center gap-2 text-base text-ink/60"><CheckCircle2 className="h-5 w-5 text-leaf-500" />كل شيء مُصحَّح</p>}
          <ul className="space-y-3">
            {toGrade.slice(0, 5).map((sub) => {
              const st = s.students.find((x) => x.id === sub.studentId)!;
              const a = s.assignments.find((x) => x.id === sub.assignmentId)!;
              return (
                <li key={sub.id} className="flex items-center gap-3">
                  <Avatar emoji={st.avatar} size={40} />
                  <div className="min-w-0 flex-1"><div className="truncate text-base font-bold">{st.name}</div><div className="truncate text-sm text-ink/60">{a.title}</div></div>
                  <span className="text-sm text-ink/50">{sub.submittedAt ? timeAgo(sub.submittedAt, now) : ""}</span>
                </li>
              );
            })}
          </ul>
        </Card>
      </div>
    </div>
  );
}
