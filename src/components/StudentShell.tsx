"use client";

import { Flame, Home, LogOut, Medal, Star, User } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { CLASS_DEFS } from "@/lib/seed";
import { subjectById } from "@/lib/content";
import { DAILY_GOAL, iso, levelInfo, levelTitle } from "@/lib/gamify";
import { useMe, useStore } from "@/lib/store";
import Mascot from "./Mascot";
import { Avatar, ProgressBar, Ring } from "./ui";

const NAV = [
  { href: "/home", label: "مساحتي", icon: Home },
  { href: "/ranking", label: "الترتيب", icon: Medal },
  { href: "/profile", label: "ملفي", icon: User },
];

export default function StudentShell({ children }: { children: React.ReactNode }) {
  const path = usePathname().replace(/\/$/, "") || "/";
  const router = useRouter();
  const s = useStore();
  const { student, session } = useMe();

  useEffect(() => {
    if (!session) router.replace("/");
    else if (session.role === "teacher") router.replace("/teacher");
  }, [session, router]);

  if (!student) return null;
  // The lesson player is a focused, full-screen experience with its own controls.
  if (path.startsWith("/lesson")) return <>{children}</>;

  const lv = levelInfo(student.xp);
  const todayXp = student.daily[iso(0)] ?? 0;
  // Chat screens keep their message box at the bottom, so the tab bar steps aside there.
  const chat = /\/(announcements|discussions)$/.test(path);
  const active = (href: string) => path === href || (href === "/home" && path.startsWith("/class"));

  return (
    <div className="min-h-screen">
      <aside className="fixed inset-y-0 start-0 z-40 hidden w-72 flex-col gap-5 overflow-y-auto border-e-2 border-honey-100 bg-white p-5 lg:flex">
        <Link href="/home" className="flex items-center gap-3">
          <Mascot size={52} mood="happy" />
          <div>
            <div className="text-2xl font-extrabold leading-none text-honey-600">يلا نتعلّم</div>
            <div className="text-sm text-honey-800/70">تعلّم بالمرح</div>
          </div>
        </Link>

        <nav className="space-y-1.5">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href}
              className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-lg font-bold transition ${active(n.href) ? "bg-honey-100 text-honey-800 ring-2 ring-honey-300" : "text-ink/70 hover:bg-honey-50"}`}>
              <n.icon className="h-6 w-6" />{n.label}
            </Link>
          ))}
        </nav>

        <div>
          <div className="mb-2 px-2 text-sm font-bold text-honey-800/60">موادي</div>
          <ul className="space-y-1">
            {CLASS_DEFS.map((c) => {
              const sub = subjectById(c.subjectId)!;
              return (
                <li key={c.id}>
                  <Link href={`/class/${c.id}`} className={`flex items-center gap-3 rounded-xl px-3 py-2 text-base font-semibold hover:bg-honey-50 ${path.startsWith(`/class/${c.id}`) ? "bg-honey-50 text-honey-800" : "text-ink/80"}`}>
                    <span className="text-xl">{sub.emoji}</span>{sub.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="mt-auto space-y-4 rounded-3xl bg-honey-50 p-4 ring-1 ring-honey-100">
          <div className="flex items-center gap-3">
            <Avatar emoji={student.avatar} size={48} />
            <div className="min-w-0">
              <div className="truncate text-lg font-extrabold text-honey-900">{student.name}</div>
              <div className="text-sm text-honey-800/70">المستوى {lv.level} · {levelTitle(lv.level)}</div>
            </div>
          </div>
          <ProgressBar pct={lv.pct} color="bg-honey-500" />
          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="rounded-2xl bg-white p-2"><Flame className="mx-auto h-5 w-5 text-orange-500" /><b className="text-lg">{student.streak}</b><div className="text-xs text-ink/60">أيام متتالية</div></div>
            <div className="rounded-2xl bg-white p-2"><Star className="mx-auto h-5 w-5 fill-honey-400 text-honey-400" /><b className="text-lg">{student.xp}</b><div className="text-xs text-ink/60">نقطة خبرة</div></div>
          </div>
          <div className="flex items-center gap-3">
            <Ring pct={(todayXp / DAILY_GOAL) * 100} size={54} stroke={7}><span className="text-sm font-extrabold">{Math.min(todayXp, DAILY_GOAL)}</span></Ring>
            <div className="text-sm font-semibold text-honey-900">هدف اليوم<div className="font-normal text-ink/60">{DAILY_GOAL} نقطة</div></div>
          </div>
          <button onClick={() => { s.logout(); router.replace("/"); }} className="flex w-full items-center justify-center gap-2 rounded-2xl py-2 text-base font-bold text-berry-600 hover:bg-berry-100">
            <LogOut className="h-5 w-5" />تسجيل الخروج
          </button>
        </div>
      </aside>

      <div className="lg:ps-72">
        <main className={`mx-auto w-full max-w-md px-4 ${chat ? "pb-4" : "pb-28"} pt-0 sm:max-w-2xl lg:max-w-5xl lg:px-8 lg:pb-12 lg:pt-6`}>{children}</main>
      </div>

      <nav className={`${chat ? "hidden" : "flex"} fixed inset-x-0 bottom-0 z-40 border-t-2 border-honey-100 bg-white pb-[env(safe-area-inset-bottom)] lg:!hidden`}>
        {NAV.map((n) => (
          <Link key={n.href} href={n.href} className={`flex flex-1 flex-col items-center gap-0.5 py-2.5 text-sm font-bold ${active(n.href) ? "text-honey-600" : "text-ink/45"}`}>
            <n.icon className="h-6 w-6" />{n.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
