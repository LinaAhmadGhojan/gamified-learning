"use client";

import { BarChart3, BookOpen, ClipboardCheck, LayoutDashboard, LogOut, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { pendingGrading, teacherClasses } from "@/lib/analytics";
import { subjectById } from "@/lib/content";
import { useMe, useStore } from "@/lib/store";
import Mascot from "./Mascot";
import { Avatar } from "./ui";

export default function TeacherShell({ children }: { children: React.ReactNode }) {
  const path = usePathname().replace(/\/$/, "") || "/";
  const router = useRouter();
  const s = useStore();
  const { teacher, session } = useMe();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!session) router.replace("/");
    else if (session.role === "student") router.replace("/home");
  }, [session, router]);
  useEffect(() => setOpen(false), [path]);

  if (!teacher) return null;
  const mine = teacherClasses(s, teacher.id);
  const toGrade = pendingGrading(s, mine.map((c) => c.id)).length;

  const nav = [
    { href: "/teacher", label: "لوحة التحكم", icon: LayoutDashboard },
    { href: "/teacher/assignments", label: "الواجبات", icon: ClipboardCheck, badge: toGrade },
    { href: "/teacher/content", label: "المحتوى التعليمي", icon: BookOpen },
    { href: "/teacher/reports", label: "التقارير", icon: BarChart3 },
  ];
  const active = (h: string) => (h === "/teacher" ? path === h : path.startsWith(h));

  const sidebar = (
    <div className="flex h-full flex-col gap-5 bg-honey-900 p-5 text-honey-50">
      <Link href="/teacher" className="flex items-center gap-3">
        <span className="rounded-2xl bg-honey-500 p-1"><Mascot size={44} /></span>
        <div><div className="text-2xl font-extrabold leading-none text-honey-300">يلا نتعلّم</div><div className="text-sm text-honey-100/60">لوحة المعلم</div></div>
      </Link>
      <nav className="space-y-1.5">
        {nav.map((n) => (
          <Link key={n.href} href={n.href} className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-lg font-bold transition ${active(n.href) ? "bg-honey-500 text-honey-900" : "hover:bg-white/10"}`}>
            <n.icon className="h-6 w-6" />
            <span className="flex-1">{n.label}</span>
            {!!n.badge && <span className="rounded-full bg-berry-500 px-2 text-sm text-white">{n.badge}</span>}
          </Link>
        ))}
      </nav>
      <div>
        <div className="mb-2 px-2 text-sm font-bold text-honey-100/50">صفوفي</div>
        <ul className="space-y-1">
          {mine.map((c) => {
            const sub = subjectById(c.subjectId)!;
            return (
              <li key={c.id}>
                <Link href={`/teacher/class/${c.id}`} className={`flex items-center gap-3 rounded-xl px-3 py-2 text-base font-semibold hover:bg-white/10 ${path.startsWith(`/teacher/class/${c.id}`) ? "bg-white/15" : ""}`}>
                  <span className="text-xl">{sub.emoji}</span>{sub.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="mt-auto rounded-3xl bg-white/10 p-4">
        <div className="mb-3 flex items-center gap-3">
          <Avatar emoji={teacher.avatar} size={46} bg="#d7efff" />
          <div className="min-w-0"><div className="truncate font-extrabold">{teacher.name}</div><div className="truncate text-sm text-honey-100/60">{teacher.title}</div></div>
        </div>
        <button onClick={() => { s.logout(); router.replace("/"); }} className="flex w-full items-center justify-center gap-2 rounded-xl py-2 text-base font-bold text-berry-100 hover:bg-white/10"><LogOut className="h-5 w-5" />تسجيل الخروج</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fff6e0]">
      <aside className="fixed inset-y-0 start-0 z-40 hidden w-72 lg:block">{sidebar}</aside>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 start-0 w-72 max-w-[85%]">{sidebar}</div>
        </div>
      )}
      <div className="lg:ps-72">
        <header className="sticky top-0 z-30 flex items-center gap-3 bg-honey-500 px-4 py-3 text-white shadow-[0_3px_0_rgba(138,90,0,.2)] lg:hidden">
          <button onClick={() => setOpen(true)} aria-label="القائمة" className="rounded-xl p-2 hover:bg-white/20"><Menu className="h-6 w-6" /></button>
          <span className="flex-1 text-center text-xl font-extrabold">لوحة المعلم</span>
          <span className="w-10"><X className="hidden" /></span>
        </header>
        <main className="mx-auto max-w-6xl p-4 pb-12 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
