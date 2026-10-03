"use client";

import { Flame, LogOut, RotateCcw, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import Mascot from "@/components/Mascot";
import { Avatar, Btn3D, Card, PageBar, ProgressBar } from "@/components/ui";
import { SUBJECTS } from "@/lib/content";
import { BADGES, fmtDate, iso, levelInfo, levelTitle, overallProgress, subjectProgress } from "@/lib/gamify";
import { useMe, useStore } from "@/lib/store";

export default function Profile() {
  const s = useStore();
  const router = useRouter();
  const { student } = useMe();
  if (!student) return null;
  const lv = levelInfo(student.xp);
  const progress = s.progress[student.id] ?? {};
  const all = overallProgress(progress);
  const days = Array.from({ length: 7 }, (_, i) => iso(i - 6));
  const dayName = (d: string) => new Date(d + "T12:00:00").toLocaleDateString("ar", { weekday: "short" });
  const done = Object.values(progress);
  const avg = done.length ? Math.round(done.reduce((n, r) => n + r.best, 0) / done.length) : 0;

  return (
    <div className="space-y-5">
      <PageBar title="ملفي الشخصي" />

      <Card className="flex flex-col items-center gap-3 text-center sm:flex-row sm:text-start">
        <Avatar emoji={student.avatar} size={96} />
        <div className="flex-1">
          <h2 className="text-3xl font-extrabold text-honey-900">{student.name}</h2>
          <p className="text-lg font-bold text-honey-600">المستوى {lv.level} · {levelTitle(lv.level)}</p>
          <div className="mt-2"><ProgressBar pct={lv.pct} color="bg-honey-500" height="h-4" /></div>
          <p className="mt-1 text-sm text-ink/60">{lv.need - lv.into} نقطة للمستوى التالي</p>
        </div>
        <Mascot size={110} mood="happy" className="hidden sm:block" />
      </Card>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { l: "نقاط الخبرة", v: student.xp, i: <Star className="h-6 w-6 fill-honey-400 text-honey-400" /> },
          { l: "أيام متتالية", v: student.streak, i: <Flame className="h-6 w-6 text-orange-500" /> },
          { l: "دروس منجزة", v: `${all.done}/${all.total}`, i: <span className="text-2xl">📚</span> },
          { l: "متوسط الدقة", v: `${avg}%`, i: <span className="text-2xl">🎯</span> },
        ].map((x) => (
          <Card key={x.l} className="text-center"><div className="mb-1 flex justify-center">{x.i}</div><div className="text-3xl font-extrabold text-honey-900">{x.v}</div><div className="text-base text-ink/60">{x.l}</div></Card>
        ))}
      </div>

      <Card>
        <h3 className="mb-3 text-lg font-extrabold text-honey-900">نشاط هذا الأسبوع</h3>
        <div className="flex items-end justify-between gap-2" dir="rtl">
          {days.map((d) => {
            const xp = student.daily[d] ?? 0;
            return (
              <div key={d} className="flex flex-1 flex-col items-center gap-1">
                <div className="flex h-24 w-full items-end"><div className="w-full rounded-t-xl bg-gradient-to-t from-honey-500 to-honey-300" style={{ height: `${Math.min(100, (xp / 60) * 100)}%`, minHeight: xp ? 8 : 4, opacity: xp ? 1 : 0.2 }} /></div>
                <span className="text-xs font-bold text-ink/60">{dayName(d)}</span>
                <span className="text-xs font-extrabold text-honey-700">{xp || ""}</span>
              </div>
            );
          })}
        </div>
      </Card>

      <Card>
        <h3 className="mb-3 text-lg font-extrabold text-honey-900">الشارات ({student.badges.length}/{BADGES.length})</h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {BADGES.map((b) => {
            const has = student.badges.includes(b.id);
            return (
              <div key={b.id} className={`rounded-2xl p-3 text-center ${has ? "bg-honey-100 ring-2 ring-honey-300" : "bg-stone-100 opacity-60 grayscale"}`}>
                <div className="text-4xl">{b.emoji}</div>
                <div className="mt-1 text-base font-extrabold">{b.name}</div>
                <div className="text-xs text-ink/60">{b.desc}</div>
              </div>
            );
          })}
        </div>
      </Card>

      <Card>
        <h3 className="mb-3 text-lg font-extrabold text-honey-900">تقدّمي في المواد</h3>
        <ul className="space-y-3">
          {SUBJECTS.map((sub) => {
            const sp = subjectProgress(sub.id, progress);
            return (
              <li key={sub.id}>
                <div className="mb-1 flex justify-between text-base font-bold"><span>{sub.emoji} {sub.name}</span><span>{sp.done}/{sp.total}</span></div>
                <ProgressBar pct={sp.pct} />
              </li>
            );
          })}
        </ul>
      </Card>

      {done.length > 0 && <p className="text-center text-sm text-ink/50">آخر نشاط: {fmtDate(student.lastActive)}</p>}

      <div className="grid gap-3 sm:grid-cols-2">
        <Btn3D variant="white" icon={RotateCcw} onClick={() => { s.reset(); s.toast("تمت إعادة البيانات التجريبية"); router.replace("/"); }}>إعادة البيانات التجريبية</Btn3D>
        <Btn3D variant="red" icon={LogOut} onClick={() => { s.logout(); router.replace("/"); }}>تسجيل الخروج</Btn3D>
      </div>
    </div>
  );
}
