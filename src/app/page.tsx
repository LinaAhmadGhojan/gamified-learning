"use client";

import { BookOpen, Flame, GraduationCap, Trophy, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Mascot from "@/components/Mascot";
import { Avatar, Btn3D, Field, Modal, inputCls } from "@/components/ui";
import { useStore } from "@/lib/store";

const AVATARS = ["🐯", "🦊", "🐼", "🐰", "🦁", "🐨", "🐸", "🦄", "🐵", "🐱", "🐶", "🦉"];

export default function Welcome() {
  const s = useStore();
  const router = useRouter();
  const [mode, setMode] = useState<"home" | "login" | "signup">("home");
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState(AVATARS[0]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (s.session) router.replace(s.session.role === "teacher" ? "/teacher" : "/home");
  }, [s.session, router]);

  const enter = (role: "student" | "teacher", id: string) => {
    s.login(role, id);
    router.push(role === "teacher" ? "/teacher" : "/home");
  };

  const signup = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 2) return setError("اكتب اسمك (حرفان على الأقل).");
    s.register(name.trim(), avatar);
    router.push("/home");
  };

  return (
    <div className="min-h-screen bg-cream lg:grid lg:grid-cols-2">
      <section className="relative hidden overflow-hidden bg-gradient-to-br from-honey-400 to-honey-600 p-12 text-white lg:flex lg:flex-col lg:justify-center">
        <div className="absolute -start-24 -top-24 h-96 w-96 rounded-full bg-white/10" />
        <div className="absolute -bottom-32 -end-16 h-[28rem] w-[28rem] rounded-full bg-black/5" />
        <div className="relative">
          <h1 className="text-6xl font-extrabold leading-tight">يلا نتعلّم!</h1>
          <p className="mt-3 max-w-md text-2xl font-semibold text-white/90">دروس قصيرة، تحديات ممتعة، ونقاط تجعل التعلّم عادة يومية.</p>
          <ul className="mt-8 space-y-4 text-xl font-bold">
            {[[BookOpen, "٦ مواد دراسية بمستويات ودروس تفاعلية"], [Trophy, "نقاط خبرة وشارات ولوحة ترتيب"], [Flame, "سلسلة أيام متتالية وهدف يومي"], [Users, "إعلانات ونقاشات وواجبات مع المعلم"]].map(([I, t], i) => {
              const Icon = I as typeof BookOpen;
              return <li key={i} className="flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/20"><Icon className="h-6 w-6" /></span>{t as string}</li>;
            })}
          </ul>
        </div>
        <Mascot size={230} mood="cheer" className="float absolute bottom-6 start-10 hidden xl:block" />
      </section>

      <section className="flex min-h-screen flex-col items-center justify-center px-6 py-10">
        <h1 className="text-6xl font-extrabold text-honey-500 sm:text-7xl lg:hidden">مرحباً!</h1>
        <h2 className="hidden text-5xl font-extrabold text-honey-500 lg:block">مرحباً!</h2>
        <Mascot size={210} className="float my-4" />
        <div className="w-full max-w-sm space-y-4">
          <Btn3D size="lg" className="w-full" onClick={() => setMode("login")}>تسجيل الدخول</Btn3D>
          <Btn3D size="lg" className="w-full" onClick={() => setMode("signup")}>حساب جديد</Btn3D>
          <p className="pt-2 text-center text-base text-ink/60">تجربة مباشرة بدون كلمة مرور. اختر حساباً جاهزاً وابدأ.</p>
        </div>
      </section>

      {mode === "login" && (
        <Modal title="من يتعلّم اليوم؟" onClose={() => setMode("home")} wide>
          <div className="space-y-6">
            <div>
              <div className="mb-3 flex items-center gap-2 text-lg font-extrabold text-honey-900"><GraduationCap className="h-6 w-6" />أنا طالب</div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {s.students.slice(0, 6).map((st) => (
                  <button key={st.id} onClick={() => enter("student", st.id)} className="flex items-center gap-3 rounded-2xl border-2 border-honey-100 bg-white p-3 text-start transition hover:border-honey-400 hover:bg-honey-50">
                    <Avatar emoji={st.avatar} size={44} />
                    <span className="min-w-0 truncate text-base font-bold">{st.name}</span>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div className="mb-3 flex items-center gap-2 text-lg font-extrabold text-honey-900"><Users className="h-6 w-6" />أنا معلّم</div>
              <div className="grid gap-3 sm:grid-cols-3">
                {s.teachers.map((t) => (
                  <button key={t.id} onClick={() => enter("teacher", t.id)} className="flex items-center gap-3 rounded-2xl border-2 border-honey-100 bg-white p-3 text-start transition hover:border-honey-400 hover:bg-honey-50">
                    <Avatar emoji={t.avatar} size={44} bg="#d7efff" />
                    <span className="min-w-0"><span className="block truncate text-base font-bold">{t.name}</span><span className="block truncate text-sm text-ink/60">{t.title}</span></span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Modal>
      )}

      {mode === "signup" && (
        <Modal title="حساب جديد" onClose={() => setMode("home")}>
          <form onSubmit={signup} className="space-y-5">
            <Field label="اسمك"><input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} autoFocus placeholder="مثال: ليان" /></Field>
            <div>
              <span className="mb-2 block text-base font-bold text-honey-900">اختر شخصيتك</span>
              <div className="grid grid-cols-6 gap-2">
                {AVATARS.map((a) => (
                  <button type="button" key={a} onClick={() => setAvatar(a)} className={`flex h-12 items-center justify-center rounded-2xl text-2xl ${avatar === a ? "bg-honey-100 ring-2 ring-honey-500" : "bg-honey-50"}`}>{a}</button>
                ))}
              </div>
            </div>
            {error && <p className="text-base font-bold text-berry-600">{error}</p>}
            <Btn3D size="lg" className="w-full">ابدأ الرحلة</Btn3D>
          </form>
        </Modal>
      )}
    </div>
  );
}
