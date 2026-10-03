"use client";

import { Check, Flame, Heart, Star, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useRef, useState } from "react";
import Mascot from "@/components/Mascot";
import { Btn3D, ProgressBar } from "@/components/ui";
import VisualView from "@/components/Visuals";
import { questionsFor, topicById } from "@/lib/content";
import { BADGES } from "@/lib/gamify";
import { type LessonOutcome, useMe, useStore } from "@/lib/store";
import type { Question } from "@/lib/types";

const LIVES = 3;

const normalize = (t: string) =>
  t
    .trim()
    .toLowerCase()
    .replace(/[ً-ٰٟ]/g, "")
    .replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)))
    .replace(/\s+/g, " ")
    .replace(/[.!؟?،,]/g, "");

const shuffle = <T,>(arr: T[]) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

export default function Player({ topicId }: { topicId: string }) {
  const s = useStore();
  const { student } = useMe();
  const router = useRouter();
  const found = topicById(topicId);
  const questions: Question[] = useMemo(() => (found ? questionsFor(found.topic, s.extraQuestions) : []), [found, s.extraQuestions]);

  // A fresh option order for every attempt keeps the quiz from being memorised by position.
  const [attempt, setAttempt] = useState(0);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const orders = useMemo(() => questions.map((q) => (q.kind === "mcq" ? shuffle(q.options.map((_, i) => i)) : [])), [questions, attempt]);

  const [phase, setPhase] = useState<"slides" | "quiz" | "result" | "failed">("slides");
  const [slide, setSlide] = useState(0);
  const [qi, setQi] = useState(0);
  const [pick, setPick] = useState<number | boolean | null>(null);
  const [text, setText] = useState("");
  const [checked, setChecked] = useState<null | boolean>(null);
  const [lives, setLives] = useState(LIVES);
  const [correct, setCorrect] = useState(0);
  const [wrongIdx, setWrongIdx] = useState<number[]>([]);
  const [outcome, setOutcome] = useState<LessonOutcome | null>(null);
  const [shake, setShake] = useState(false);
  const saved = useRef(false);

  if (!found || !student) return null;
  const { topic, subject } = found;
  const total = topic.slides.length + questions.length;
  const doneSteps = phase === "slides" ? slide : topic.slides.length + qi + (checked !== null ? 1 : 0);
  const q = questions[qi];

  const restart = () => {
    setAttempt((a) => a + 1);
    setPhase("quiz");
    setQi(0); setPick(null); setText(""); setChecked(null); setLives(LIVES); setCorrect(0); setWrongIdx([]); setOutcome(null);
    saved.current = false;
  };

  const check = () => {
    if (!q) return;
    let ok = false;
    if (q.kind === "mcq") ok = orders[qi][pick as number] === q.answer;
    else if (q.kind === "tf") ok = pick === q.answer;
    else ok = q.answer.some((a) => normalize(a) === normalize(text));
    setChecked(ok);
    if (ok) setCorrect((c) => c + 1);
    else {
      setLives((l) => l - 1);
      setWrongIdx((w) => [...w, qi]);
      setShake(true);
      setTimeout(() => setShake(false), 350);
    }
  };

  const next = () => {
    const livesLeft = lives;
    if (checked === false && livesLeft <= 0) return setPhase("failed");
    if (qi + 1 < questions.length) {
      setQi(qi + 1); setPick(null); setText(""); setChecked(null);
      return;
    }
    if (!saved.current) {
      saved.current = true;
      setOutcome(s.completeTopic(student.id, topic.id, correct, questions.length, wrongIdx, livesLeft));
    }
    setPhase("result");
  };

  const canCheck = q?.kind === "input" ? text.trim().length > 0 : pick !== null;
  const correctText = q ? (q.kind === "mcq" ? q.options[q.answer] : q.kind === "tf" ? (q.answer ? "صح" : "خطأ") : q.answer[0]) : "";

  return (
    <div className="flex min-h-dvh flex-col bg-cream">
      {/* top bar */}
      <header className="sticky top-0 z-20 bg-honey-500 shadow-[0_3px_0_rgba(138,90,0,.2)]">
        <div className="mx-auto flex max-w-2xl items-center gap-3 px-4 py-3">
          <button onClick={() => router.back()} aria-label="خروج" className="flex h-10 w-10 items-center justify-center rounded-xl text-white hover:bg-white/20"><X className="h-7 w-7" strokeWidth={3} /></button>
          <div className="flex-1"><ProgressBar pct={(doneSteps / total) * 100} color="bg-white" height="h-4" /></div>
          {phase === "quiz" && (
            <div className="flex items-center gap-1 rounded-full bg-white px-3 py-1" aria-label={`${lives} محاولات`}>
              {Array.from({ length: LIVES }).map((_, i) => <Heart key={i} className={`h-5 w-5 ${i < lives ? "fill-berry-500 text-berry-500" : "text-stone-300"}`} />)}
            </div>
          )}
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 pb-48 pt-6">
        {phase === "slides" && (
          <div className="pop flex flex-1 flex-col items-center text-center" key={slide}>
            <div className="mb-1 text-sm font-bold text-honey-700">{subject.name} · {topic.title}</div>
            <h1 className="mb-5 text-3xl font-extrabold text-honey-900">{topic.slides[slide].title}</h1>
            {topic.slides[slide].visual && <div className="mb-6 flex min-h-36 items-center justify-center"><VisualView v={topic.slides[slide].visual!} /></div>}
            <div className="w-full rounded-3xl border-2 border-honey-300 bg-white p-6 text-start text-xl font-bold leading-loose text-ink shadow-sm">{topic.slides[slide].body}</div>
          </div>
        )}

        {phase === "quiz" && q && (
          <div className={`flex flex-1 flex-col ${shake ? "shake" : ""}`} key={qi}>
            <h1 className="mb-5 text-center text-2xl font-extrabold text-honey-900">{q.q}</h1>
            {"visual" in q && q.visual && <div className="mb-6 flex justify-center"><VisualView v={q.visual} /></div>}

            {q.kind === "mcq" && (
              <div className="grid grid-cols-2 gap-3">
                {orders[qi].map((orig, pos) => {
                  const sel = pick === pos;
                  const state = checked === null ? (sel ? "sel" : "idle") : orig === q.answer ? "right" : sel ? "wrong" : "idle";
                  const cls = { idle: "border-honey-100 bg-white text-ink", sel: "border-honey-400 bg-honey-50 text-honey-800 ring-2 ring-honey-400", right: "border-leaf-500 bg-leaf-100 text-leaf-600", wrong: "border-berry-500 bg-berry-100 text-berry-600" }[state];
                  return (
                    <button key={pos} disabled={checked !== null} onClick={() => setPick(pos)}
                      className={`btn3d min-h-24 rounded-2xl border-2 border-b-[5px] p-3 text-lg font-extrabold leading-snug ${cls}`}>{q.options[orig]}</button>
                  );
                })}
              </div>
            )}

            {q.kind === "tf" && (
              <div className="grid grid-cols-2 gap-3">
                {[true, false].map((v) => {
                  const sel = pick === v;
                  const state = checked === null ? (sel ? "sel" : "idle") : v === q.answer ? "right" : sel ? "wrong" : "idle";
                  const cls = { idle: "border-honey-100 bg-white text-ink", sel: "border-honey-400 bg-honey-50 text-honey-800 ring-2 ring-honey-400", right: "border-leaf-500 bg-leaf-100 text-leaf-600", wrong: "border-berry-500 bg-berry-100 text-berry-600" }[state];
                  return (
                    <button key={String(v)} disabled={checked !== null} onClick={() => setPick(v)}
                      className={`btn3d min-h-28 rounded-2xl border-2 border-b-[5px] p-3 text-3xl font-extrabold ${cls}`}>{v ? "✔ صح" : "✘ خطأ"}</button>
                  );
                })}
              </div>
            )}

            {q.kind === "input" && (
              <div>
                <input value={text} onChange={(e) => setText(e.target.value)} disabled={checked !== null} onKeyDown={(e) => e.key === "Enter" && canCheck && checked === null && check()}
                  placeholder="اكتب إجابتك هنا" autoFocus
                  className="w-full rounded-2xl border-2 border-honey-300 bg-white px-5 py-4 text-center text-2xl font-bold text-ink outline-none focus:border-honey-500" />
                {q.hint && <p className="mt-3 text-center text-base text-honey-700">💡 تلميح: {q.hint}</p>}
              </div>
            )}
          </div>
        )}

        {phase === "result" && outcome && (
          <div className="pop flex flex-1 flex-col items-center text-center">
            <Mascot mood="cheer" size={190} className="float" />
            <h1 className="mt-2 text-4xl font-extrabold text-honey-600">{outcome.stars === 3 ? "رائع جداً!" : outcome.stars === 2 ? "أحسنت!" : "أنهيت الدرس!"}</h1>
            <div className="my-4 flex gap-2">{[1, 2, 3].map((n) => <Star key={n} className={`h-12 w-12 ${n <= outcome.stars ? "fill-honey-400 text-honey-500" : "text-stone-300"}`} />)}</div>
            <div className="grid w-full max-w-sm grid-cols-3 gap-3">
              <div className="rounded-2xl bg-honey-100 p-3"><div className="text-2xl font-extrabold">+{outcome.xp}</div><div className="text-sm font-bold text-honey-800">نقطة خبرة</div></div>
              <div className="rounded-2xl bg-leaf-100 p-3"><div className="text-2xl font-extrabold text-leaf-600">{Math.round((correct / Math.max(1, questions.length)) * 100)}%</div><div className="text-sm font-bold text-leaf-600">الدقة</div></div>
              <div className="rounded-2xl bg-orange-100 p-3"><div className="flex items-center justify-center gap-1 text-2xl font-extrabold text-orange-600"><Flame className="h-6 w-6" />{outcome.streak}</div><div className="text-sm font-bold text-orange-600">أيام</div></div>
            </div>
            {!outcome.firstTime && <p className="mt-3 text-sm text-ink/60">إعادة الدرس تمنح نقاطاً أقل.</p>}
            {outcome.newBadges.length > 0 && (
              <div className="mt-5 w-full max-w-sm rounded-3xl bg-white p-4 ring-2 ring-honey-300">
                <div className="mb-2 text-lg font-extrabold text-honey-900">🎉 شارات جديدة!</div>
                {outcome.newBadges.map((id) => {
                  const b = BADGES.find((x) => x.id === id);
                  return b ? <div key={id} className="flex items-center gap-3 py-1 text-start"><span className="text-3xl">{b.emoji}</span><span><b>{b.name}</b><span className="block text-sm text-ink/60">{b.desc}</span></span></div> : null;
                })}
              </div>
            )}
          </div>
        )}

        {phase === "failed" && (
          <div className="pop flex flex-1 flex-col items-center text-center">
            <Mascot mood="sad" size={190} />
            <h1 className="mt-2 text-3xl font-extrabold text-berry-600">انتهت المحاولات</h1>
            <p className="mt-2 max-w-sm text-lg text-ink/70">لا بأس، التعلّم يحتاج تكراراً. راجع الدرس ثم حاول مرة أخرى.</p>
          </div>
        )}
      </main>

      {/* bottom action area */}
      <footer className="fixed inset-x-0 bottom-0 z-30">
        {checked !== null && phase === "quiz" ? (
          <div className={`slide-up ${checked ? "bg-leaf-100" : "bg-berry-100"} px-4 pb-6 pt-4`}>
            <div className="mx-auto max-w-2xl">
              <div className={`mb-3 flex items-center gap-3 text-2xl font-extrabold ${checked ? "text-leaf-600" : "text-berry-600"}`}>
                <span className={`flex h-10 w-10 items-center justify-center rounded-full ${checked ? "bg-leaf-500" : "bg-berry-500"} text-white`}>{checked ? <Check className="h-6 w-6" /> : <X className="h-6 w-6" />}</span>
                {checked ? "ممتاز!" : "ليست الإجابة الصحيحة"}
              </div>
              {!checked && <p className="mb-1 text-lg font-bold text-berry-600">الإجابة الصحيحة: {correctText}</p>}
              {q?.explain && <p className="mb-3 text-base text-ink/80">{q.explain}</p>}
              <Btn3D variant={checked ? "green" : "red"} size="lg" className="w-full" onClick={next}>{lives <= 0 && !checked ? "متابعة" : "استمرار"}</Btn3D>
            </div>
          </div>
        ) : (
          <div className="border-t-2 border-honey-100 bg-cream px-4 pb-6 pt-4">
            <div className="mx-auto max-w-2xl">
              {phase === "slides" && (
                <Btn3D size="lg" className="w-full" onClick={() => (slide + 1 < topic.slides.length ? setSlide(slide + 1) : setPhase("quiz"))}>
                  {slide + 1 < topic.slides.length ? "التالي" : "ابدأ الاختبار"}
                </Btn3D>
              )}
              {phase === "quiz" && <Btn3D size="lg" className="w-full" disabled={!canCheck} onClick={check}>تحقق</Btn3D>}
              {phase === "result" && <Btn3D variant="green" size="lg" className="w-full" onClick={() => router.back()}>متابعة</Btn3D>}
              {phase === "failed" && (
                <div className="grid grid-cols-2 gap-3">
                  <Btn3D variant="white" size="lg" onClick={() => { setPhase("slides"); setSlide(0); restart(); setPhase("slides"); }}>راجع الدرس</Btn3D>
                  <Btn3D size="lg" onClick={restart}>حاول مجدداً</Btn3D>
                </div>
              )}
            </div>
          </div>
        )}
      </footer>
    </div>
  );
}
