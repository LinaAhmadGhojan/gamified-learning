"use client";

import { Check, Star } from "lucide-react";
import Link from "next/link";
import { PageBar } from "@/components/ui";
import { levelById } from "@/lib/content";
import { useMe, useStore } from "@/lib/store";

export default function View({ id, levelId }: { id: string; levelId: string }) {
  const s = useStore();
  const { student } = useMe();
  const cls = s.classes.find((c) => c.id === id);
  if (!cls || !student) return null;
  const level = levelById(cls.subjectId, levelId);
  if (!level) return null;
  const progress = s.progress[student.id] ?? {};
  // The next lesson to take is the first one not finished yet.
  const nextId = level.topics.find((t) => !progress[t.id])?.id;

  return (
    <div className="space-y-5">
      <PageBar title={level.title.split(":")[0]} back={`/class/${id}/learn`} />
      <div className="rounded-2xl border-b-[5px] border-honey-800 bg-honey-500 px-5 py-4 text-center text-xl font-extrabold text-white">{level.title}</div>

      <div className="rounded-3xl bg-white p-3 shadow-[0_2px_0_rgba(138,90,0,.12)] ring-1 ring-honey-100 sm:p-4">
        <ul className="grid gap-3 md:grid-cols-2">
          {level.topics.map((t, i) => {
            const r = progress[t.id];
            const isNext = t.id === nextId;
            return (
              <li key={t.id}>
                <Link href={`/lesson/${t.id}`}
                  className={`btn3d flex items-center gap-3 rounded-2xl px-4 py-4 text-white ${isNext ? "bg-honey-600 ring-4 ring-honey-300" : "bg-honey-400"}`}>
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/90 text-2xl">{t.emoji}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-lg font-extrabold">{i + 1}. {t.title}</span>
                    {r ? (
                      <span className="flex gap-0.5">{[1, 2, 3].map((n) => <Star key={n} className={`h-4 w-4 ${n <= r.stars ? "fill-white text-white" : "text-white/40"}`} />)}</span>
                    ) : (
                      <span className="text-sm text-white/85">{isNext ? "الدرس التالي" : "٢ شرائح + اختبار قصير"}</span>
                    )}
                  </span>
                  {r ? (
                    <span className="flex items-center gap-1 rounded-full bg-leaf-400 px-3 py-1 text-sm font-extrabold text-white"><Check className="h-4 w-4" />تم</span>
                  ) : (
                    <span className="rounded-full bg-white px-4 py-1.5 text-sm font-extrabold text-honey-600">ابدأ</span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
