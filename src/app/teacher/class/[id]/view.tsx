"use client";

import { ArrowRight, BarChart3, ClipboardList, Megaphone, MessagesSquare, Users } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { AnnouncementFeed, DiscussionFeed } from "@/components/Chat";
import { Bars, Meter } from "@/components/TCharts";
import { Avatar, Card, Pill } from "@/components/ui";
import { classAverage, classStudents, hardestQuestions, studentAccuracy, studentSubjectPct, topicStats, weeklyXp } from "@/lib/analytics";
import { subjectById } from "@/lib/content";
import { daysBetween, fmtDate, iso, levelInfo } from "@/lib/gamify";
import { useMe, useStore } from "@/lib/store";

type Tab = "students" | "assignments" | "announcements" | "discussions" | "performance";

export default function View({ id }: { id: string }) {
  const s = useStore();
  const { teacher } = useMe();
  const [tab, setTab] = useState<Tab>("students");
  const cls = s.classes.find((c) => c.id === id);
  if (!cls || !teacher) return null;
  const sub = subjectById(cls.subjectId)!;
  const students = classStudents(s, id);
  const assigns = s.assignments.filter((a) => a.classId === id);

  const tabs: { id: Tab; label: string; icon: typeof Users }[] = [
    { id: "students", label: "الطلاب", icon: Users },
    { id: "assignments", label: "الواجبات", icon: ClipboardList },
    { id: "announcements", label: "الإعلانات", icon: Megaphone },
    { id: "discussions", label: "النقاشات", icon: MessagesSquare },
    { id: "performance", label: "الأداء", icon: BarChart3 },
  ];

  return (
    <div className="space-y-5">
      <Link href="/teacher" className="inline-flex items-center gap-1 text-base font-bold text-honey-600 hover:underline"><ArrowRight className="h-5 w-5" />لوحة التحكم</Link>
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl p-6 text-white shadow-[0_5px_0_rgba(0,0,0,.18)]" style={{ background: `linear-gradient(135deg, ${sub.from}, ${sub.to})` }}>
        <div>
          <div className="text-lg font-bold text-white/85">{cls.grade}</div>
          <h1 className="text-4xl font-extrabold">{sub.name}</h1>
          <div className="mt-1 text-base text-white/90">{students.length} طالباً · متوسط الإنجاز {classAverage(s, id)}%</div>
        </div>
        <div className="float text-7xl drop-shadow-lg">{sub.emoji}</div>
      </div>

      <div className="no-scrollbar flex gap-1.5 overflow-x-auto rounded-2xl bg-white p-1.5 ring-1 ring-honey-100">
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)} className={`flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-xl px-4 py-2.5 text-base font-extrabold ${tab === t.id ? "bg-honey-500 text-white" : "text-honey-800 hover:bg-honey-50"}`}>
            <t.icon className="h-5 w-5" />{t.label}
          </button>
        ))}
      </div>

      {tab === "students" && (
        <Card className="!p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-base">
              <thead><tr className="bg-honey-50 text-sm font-extrabold text-honey-800">
                {["الطالب", "المستوى", "الإنجاز", "الدقة", "السلسلة", "آخر نشاط"].map((h) => <th key={h} className="px-4 py-3 text-start">{h}</th>)}
              </tr></thead>
              <tbody>
                {[...students].sort((a, b) => b.xp - a.xp).map((st) => {
                  const idle = daysBetween(st.lastActive, iso(0));
                  return (
                    <tr key={st.id} className="border-t border-honey-50">
                      <td className="px-4 py-3"><span className="flex items-center gap-3"><Avatar emoji={st.avatar} size={38} /><span className="font-bold">{st.name}</span></span></td>
                      <td className="px-4 py-3 font-bold">{levelInfo(st.xp).level} <span className="text-sm font-normal text-ink/50">({st.xp}⭐)</span></td>
                      <td className="px-4 py-3"><Meter pct={studentSubjectPct(s, st.id, sub.id)} tone="green" /></td>
                      <td className="px-4 py-3"><Meter pct={studentAccuracy(s, st.id, sub.id)} /></td>
                      <td className="px-4 py-3"><Pill tone={st.streak ? "honey" : "gray"}>{st.streak} 🔥</Pill></td>
                      <td className="px-4 py-3 text-ink/70">{idle <= 0 ? "اليوم" : idle === 1 ? "أمس" : `منذ ${idle} أيام`}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {tab === "assignments" && (
        <div className="grid gap-4 md:grid-cols-2">
          {assigns.map((a) => {
            const subs = s.submissions.filter((x) => x.assignmentId === a.id);
            const submitted = subs.filter((x) => x.status !== "assigned").length;
            const graded = subs.filter((x) => x.status === "graded").length;
            return (
              <Card key={a.id}>
                <div className="flex items-start justify-between gap-2"><div><h3 className="text-xl font-extrabold text-honey-900">{a.title}</h3><p className="text-sm text-ink/60">آخر موعد: {fmtDate(a.due)} · {a.points} نقاط</p></div><Link href="/teacher/assignments" className="text-sm font-extrabold text-honey-600 underline">تصحيح</Link></div>
                <div className="mt-4 space-y-2 text-base">
                  <div className="flex justify-between"><span>سلّموا</span><b>{submitted}/{subs.length}</b></div>
                  <Meter pct={subs.length ? Math.round((submitted / subs.length) * 100) : 0} tone="green" />
                  <div className="flex justify-between"><span>تم تقييمهم</span><b>{graded}/{submitted}</b></div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {tab === "announcements" && <AnnouncementFeed classId={id} canPost />}
      {tab === "discussions" && <DiscussionFeed classId={id} me={{ id: teacher.id, role: "teacher" }} />}

      {tab === "performance" && <Performance classId={id} />}
    </div>
  );
}

function Performance({ classId }: { classId: string }) {
  const s = useStore();
  const cls = s.classes.find((c) => c.id === classId)!;
  const sub = subjectById(cls.subjectId)!;
  const ids = cls.studentIds;
  const week = weeklyXp(s, ids);
  const dayLabel = (d: string) => new Date(d + "T12:00:00").toLocaleDateString("ar", { weekday: "short" });
  return (
    <div className="space-y-5">
      <Card>
        <h3 className="mb-3 text-xl font-extrabold text-honey-900">نشاط الصف هذا الأسبوع</h3>
        <Bars data={week.map((w) => ({ label: dayLabel(w.day), value: w.xp }))} />
      </Card>
      <Card>
        <h3 className="mb-4 text-xl font-extrabold text-honey-900">أداء الدروس</h3>
        <ul className="space-y-4">
          {sub.levels.flatMap((l) => l.topics).map((t) => {
            const st = topicStats(s, t.id, ids);
            const hard = hardestQuestions(s, t.id, t.questions.length).sort((a, b) => b.rate - a.rate)[0];
            return (
              <li key={t.id} className="rounded-2xl bg-honey-50 p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-lg font-extrabold">{t.emoji} {t.title}</span>
                  <div className="flex gap-4 text-sm font-bold"><span className="flex items-center gap-2">إنجاز <Meter pct={st.completion} tone="green" /></span><span className="flex items-center gap-2">دقة <Meter pct={st.accuracy} tone={st.accuracy < 70 ? "red" : "honey"} /></span></div>
                </div>
                {hard && hard.rate > 25 && <p className="mt-2 text-sm text-berry-600">⚠ أصعب سؤال: «{t.questions[hard.index].q}» ({hard.rate}% أخطأوا)</p>}
              </li>
            );
          })}
        </ul>
      </Card>
    </div>
  );
}
