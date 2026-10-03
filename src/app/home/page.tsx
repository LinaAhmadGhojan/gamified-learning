"use client";

import { ArrowLeft, Flame, Star } from "lucide-react";
import Link from "next/link";
import Mascot from "@/components/Mascot";
import { PageBar, ProgressBar, Ring } from "@/components/ui";
import { subjectById } from "@/lib/content";
import { DAILY_GOAL, iso, levelInfo, levelTitle, subjectProgress, timeAgo } from "@/lib/gamify";
import { useMe, useNow, useStore } from "@/lib/store";

export default function Home() {
  const s = useStore();
  const { student } = useMe();
  const now = useNow(60000);
  if (!student) return null;
  const progress = s.progress[student.id] ?? {};
  const lv = levelInfo(student.xp);
  const todayXp = student.daily[iso(0)] ?? 0;
  const mine = s.classes.filter((c) => c.studentIds.includes(student.id));

  return (
    <div className="space-y-5">
      <PageBar title="مساحتك التعليمية" />

      <section className="relative overflow-hidden rounded-3xl bg-white p-4 shadow-[0_2px_0_rgba(138,90,0,.12)] ring-1 ring-honey-100 sm:p-5">
        <div className="flex items-center gap-3 sm:gap-4">
          <Mascot size={76} mood={todayXp >= DAILY_GOAL ? "cheer" : "happy"} className="shrink-0" />
          <div className="min-w-0 flex-1">
            <h2 className="text-xl font-extrabold text-honey-900 sm:text-2xl">أهلاً {student.name.split(" ")[0]}!</h2>
            <p className="text-sm leading-snug text-ink/70 sm:text-base">{todayXp >= DAILY_GOAL ? "حققت هدف اليوم، عمل رائع!" : "أنهِ درساً واحداً اليوم لتحافظ على سلسلتك."}</p>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-sm font-bold sm:text-base">
              <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-3 py-1 text-orange-600"><Flame className="h-4 w-4" />{student.streak} يوم</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-honey-100 px-3 py-1 text-honey-800"><Star className="h-4 w-4 fill-honey-500 text-honey-500" />{student.xp}</span>
            </div>
          </div>
          <Ring pct={(todayXp / DAILY_GOAL) * 100} size={68} stroke={8}>
            <div className="leading-tight" dir="ltr"><b className="text-base">{Math.min(todayXp, DAILY_GOAL)}</b><div className="text-[11px] text-ink/60">/{DAILY_GOAL}</div></div>
          </Ring>
        </div>
        <div className="mt-4">
          <div className="mb-1 flex justify-between text-sm font-bold text-honey-900"><span>المستوى {lv.level} · {levelTitle(lv.level)}</span><span dir="ltr">{lv.into}/{lv.need}</span></div>
          <ProgressBar pct={lv.pct} color="bg-honey-500" />
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {mine.map((c) => {
          const sub = subjectById(c.subjectId)!;
          const sp = subjectProgress(sub.id, progress);
          const last = sub.levels.flatMap((l) => l.topics).map((t) => progress[t.id]?.doneAt).filter(Boolean).sort().at(-1);
          const ann = s.announcements.filter((a) => a.classId === c.id).sort((a, b) => b.at - a.at)[0];
          return (
            <Link key={c.id} href={`/class/${c.id}`}
              className="group relative overflow-hidden rounded-3xl p-5 text-white shadow-[0_5px_0_rgba(0,0,0,.18)] transition active:translate-y-0.5 active:shadow-none"
              style={{ background: `linear-gradient(135deg, ${sub.from}, ${sub.to})` }}>
              <div className="absolute -end-6 -top-6 h-32 w-32 rounded-full bg-white/15" />
              <div className="relative flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-sm font-bold text-white/85">{c.grade}</div>
                  <div className="text-2xl font-extrabold leading-tight sm:text-3xl">{sub.name}</div>
                  <div className="mt-1 text-sm text-white/85">{last ? `آخر نشاط: ${timeAgo(new Date(last + "T12:00:00").getTime(), now)}` : ann ? `آخر إعلان ${timeAgo(ann.at, now)}` : "ابدأ أول درس"}</div>
                </div>
                <div className="float text-6xl drop-shadow-lg">{sub.emoji}</div>
              </div>
              <div className="relative mt-4 flex items-center gap-3">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-5 py-1.5 text-base font-extrabold" style={{ color: sub.to }}>دخول<ArrowLeft className="h-4 w-4" /></span>
                <div className="flex-1">
                  <div className="mb-1 flex justify-between text-xs font-bold text-white/90"><span>{sp.done}/{sp.total} درس</span><span>{sp.pct}%</span></div>
                  <ProgressBar pct={sp.pct} color="bg-white" height="h-2.5" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
