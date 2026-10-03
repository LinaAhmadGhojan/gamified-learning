"use client";

import { Lock } from "lucide-react";
import Link from "next/link";
import Mascot from "@/components/Mascot";
import { PageBar, ProgressBar } from "@/components/ui";
import { subjectById } from "@/lib/content";
import { isLevelUnlocked, subjectProgress } from "@/lib/gamify";
import { useMe, useStore } from "@/lib/store";

export default function View({ id }: { id: string }) {
  const s = useStore();
  const { student } = useMe();
  const cls = s.classes.find((c) => c.id === id);
  if (!cls || !student) return null;
  const sub = subjectById(cls.subjectId)!;
  const progress = s.progress[student.id] ?? {};
  const sp = subjectProgress(sub.id, progress);

  return (
    <div className="space-y-5">
      <PageBar title="التعلّم السريع" back={`/class/${id}`} />
      <div className="flex items-center gap-4 rounded-3xl bg-white p-4 ring-1 ring-honey-100">
        <Mascot size={70} mood="think" />
        <div className="flex-1">
          <div className="text-xl font-extrabold text-honey-900">{sub.emoji} {sub.name}</div>
          <div className="mb-1 text-sm text-ink/70">أنهيت {sp.done} من {sp.total} درساً</div>
          <ProgressBar pct={sp.pct} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {sub.levels.map((l, i) => {
          const unlocked = isLevelUnlocked(sub.id, i, progress);
          const done = l.topics.filter((t) => progress[t.id]).length;
          const body = (
            <div className={`btn3d flex items-center justify-between rounded-2xl border-b-[5px] px-5 py-5 text-white ${unlocked ? "border-honey-800 bg-honey-500" : "border-stone-400 bg-stone-300"}`}>
              <div>
                <div className="text-xl font-extrabold">{l.title}</div>
                <div className="text-sm font-semibold text-white/85">{unlocked ? `${done}/${l.topics.length} دروس` : "أنهِ المستوى السابق أولاً"}</div>
              </div>
              {unlocked ? <span className="rounded-full bg-white px-3 py-1 text-lg font-extrabold text-honey-600">{Math.round((done / l.topics.length) * 100)}%</span> : <Lock className="h-7 w-7" />}
            </div>
          );
          return unlocked ? <Link key={l.id} href={`/class/${id}/learn/${l.id}`}>{body}</Link> : <div key={l.id} aria-disabled className="opacity-90">{body}</div>;
        })}
      </div>
    </div>
  );
}
