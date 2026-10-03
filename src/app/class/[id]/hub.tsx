"use client";

import { CalendarClock, ClipboardList, Megaphone, MessagesSquare, Rocket, Send } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Card, PageBar, ProgressBar } from "@/components/ui";
import { subjectById } from "@/lib/content";
import { fmtDate, iso, subjectProgress, timeAgo } from "@/lib/gamify";
import { useMe, useNow, useStore } from "@/lib/store";

export default function Hub({ id }: { id: string }) {
  const s = useStore();
  const { student } = useMe();
  const now = useNow(60000);
  const [q, setQ] = useState("");
  const cls = s.classes.find((c) => c.id === id);
  if (!cls || !student) return null;
  const sub = subjectById(cls.subjectId)!;
  const teacher = s.teachers.find((t) => t.id === cls.teacherId);
  const sp = subjectProgress(sub.id, s.progress[student.id]);
  const anns = s.announcements.filter((a) => a.classId === id).sort((a, b) => b.at - a.at);
  const open = s.discussions.filter((d) => d.classId === id && d.kind === "problem").length;
  const myAssigns = s.assignments.filter((a) => a.classId === id);
  const pending = myAssigns.filter((a) => (s.submissions.find((x) => x.assignmentId === a.id && x.studentId === student.id)?.status ?? "assigned") === "assigned");
  const next = [...pending].sort((a, b) => a.due.localeCompare(b.due))[0];

  const ask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!q.trim()) return;
    s.sendDiscussion(id, student.id, "student", "problem", q.trim());
    setQ("");
    s.toast("تم نشر سؤالك في النقاشات 💬");
  };

  const tiles = [
    { href: `/class/${id}/announcements`, label: "الإعلانات", sub: `${anns.length} إعلان`, icon: Megaphone, emoji: "📢", bg: "bg-honey-600" },
    { href: `/class/${id}/discussions`, label: "النقاشات", sub: `${open} سؤال`, icon: MessagesSquare, emoji: "💬", bg: "bg-honey-600" },
    { href: `/class/${id}/learn`, label: "التعلّم السريع", sub: `${sp.pct}% مكتمل`, icon: Rocket, emoji: "🚀", bg: "bg-honey-600" },
    { href: `/class/${id}/assignments`, label: "الواجبات", sub: `${pending.length} بانتظارك`, icon: ClipboardList, emoji: "📝", bg: "bg-honey-600" },
  ];

  return (
    <div className="space-y-5">
      <PageBar title={sub.name} back="/home" right={<span className="rounded-full bg-white px-3 py-1 text-sm font-extrabold text-honey-600">{cls.grade}</span>} />

      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
        <div className="space-y-5">
          <div className="flex items-center justify-between rounded-3xl p-6 text-white shadow-[0_5px_0_rgba(0,0,0,.18)]" style={{ background: `linear-gradient(135deg, ${sub.from}, ${sub.to})` }}>
            <div>
              <div className="text-lg font-bold text-white/85">{cls.grade}</div>
              <div className="text-4xl font-extrabold">{sub.name}</div>
              {teacher && <div className="mt-1 text-base text-white/90">{teacher.avatar} {teacher.name}</div>}
            </div>
            <div className="float text-7xl drop-shadow-lg">{sub.emoji}</div>
          </div>

          <form onSubmit={ask} className="flex items-center gap-2 rounded-full bg-white px-4 py-2 ring-2 ring-honey-300">
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="شارك سؤالك مع الصف..." className="flex-1 bg-transparent py-1.5 text-base text-ink outline-none placeholder:text-honey-600/60" />
            <button aria-label="إرسال" className="flex h-10 w-10 items-center justify-center rounded-full bg-honey-500 text-white"><Send className="h-5 w-5 rtl:-scale-x-100" /></button>
          </form>

          <div className="grid gap-4 sm:grid-cols-2">
            {tiles.map((t) => (
              <Link key={t.href} href={t.href}
                className={`btn3d flex items-center justify-between rounded-3xl border-b-[6px] border-honey-800 px-6 py-5 text-white ${t.bg} hover:brightness-105`}>
                <div>
                  <div className="text-2xl font-extrabold">{t.label}</div>
                  <div className="text-base font-semibold text-white/85">{t.sub}</div>
                </div>
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 text-4xl">{t.emoji}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <Card>
            <h3 className="mb-3 text-lg font-extrabold text-honey-900">تقدّمك في المادة</h3>
            <div className="mb-1 flex justify-between text-base font-bold"><span>{sp.done} من {sp.total} درس</span><span>{sp.pct}%</span></div>
            <ProgressBar pct={sp.pct} />
            <Link href={`/class/${id}/learn`} className="mt-3 inline-block text-base font-bold text-honey-600 underline">أكمل التعلّم ←</Link>
          </Card>
          <Card>
            <h3 className="mb-3 flex items-center gap-2 text-lg font-extrabold text-honey-900"><CalendarClock className="h-5 w-5" />الموعد القادم</h3>
            {next ? (
              <Link href={`/class/${id}/assignments`} className="block rounded-2xl bg-honey-50 p-3">
                <div className="text-base font-bold">{next.title}</div>
                <div className="text-sm text-ink/70">آخر موعد: {fmtDate(next.due)}{next.due < iso(0) ? " (متأخر)" : ""}</div>
              </Link>
            ) : <p className="text-base text-ink/60">لا واجبات مستحقة 🎉</p>}
          </Card>
          {anns[0] && (
            <Card>
              <h3 className="mb-2 text-lg font-extrabold text-honey-900">آخر إعلان</h3>
              <p className="text-base leading-relaxed">{anns[0].emoji} {anns[0].text}</p>
              <div className="mt-1 text-sm text-ink/50">{timeAgo(anns[0].at, now)}</div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
