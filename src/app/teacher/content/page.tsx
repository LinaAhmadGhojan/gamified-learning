"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import VisualView from "@/components/Visuals";
import { Btn3D, Card, Field, Modal, Pill, inputCls } from "@/components/ui";
import { teacherClasses } from "@/lib/analytics";
import { SUBJECTS, questionsFor, subjectById } from "@/lib/content";
import { useMe, useStore } from "@/lib/store";
import type { Question, Topic } from "@/lib/types";

export default function Content() {
  const s = useStore();
  const { teacher } = useMe();
  const mineSubjects = teacher ? [...new Set(teacherClasses(s, teacher.id).map((c) => c.subjectId))] : [];
  const subjects = SUBJECTS.filter((x) => mineSubjects.includes(x.id));
  const [subId, setSubId] = useState(subjects[0]?.id ?? "math");
  const [topicId, setTopicId] = useState<string | null>(null);
  const [adding, setAdding] = useState<Topic | null>(null);
  if (!teacher) return null;
  const sub = subjectById(subId)!;
  const topic = sub.levels.flatMap((l) => l.topics).find((t) => t.id === topicId);

  return (
    <div className="space-y-5">
      <div><h1 className="text-3xl font-extrabold text-honey-900">المحتوى التعليمي</h1><p className="text-lg text-ink/70">تصفّح الدروس والأسئلة، وأضف أسئلة جديدة تظهر للطلاب فوراً.</p></div>

      <div className="no-scrollbar flex gap-2 overflow-x-auto">
        {subjects.map((x) => (
          <button key={x.id} onClick={() => { setSubId(x.id); setTopicId(null); }} className={`whitespace-nowrap rounded-full px-5 py-2.5 text-lg font-extrabold ${subId === x.id ? "bg-honey-500 text-white" : "bg-white text-honey-800 ring-1 ring-honey-200"}`}>{x.emoji} {x.name}</button>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-[340px_1fr]">
        <Card className="space-y-4">
          {sub.levels.map((l) => (
            <div key={l.id}>
              <div className="mb-2 text-base font-extrabold text-honey-800">{l.title}</div>
              <ul className="space-y-1.5">
                {l.topics.map((t) => (
                  <li key={t.id}>
                    <button onClick={() => setTopicId(t.id)} className={`flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-start text-base font-bold transition ${topicId === t.id ? "bg-honey-500 text-white" : "bg-honey-50 hover:bg-honey-100"}`}>
                      <span className="text-xl">{t.emoji}</span><span className="flex-1 truncate">{t.title}</span>
                      <span className="text-sm opacity-80">{questionsFor(t, s.extraQuestions).length} سؤال</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </Card>

        {topic ? (
          <div className="space-y-4">
            <Card>
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2"><h2 className="text-2xl font-extrabold text-honey-900">{topic.emoji} {topic.title}</h2><Btn3D size="sm" icon={Plus} onClick={() => setAdding(topic)}>إضافة سؤال</Btn3D></div>
              <h3 className="mb-2 text-lg font-extrabold">الشرائح ({topic.slides.length})</h3>
              <div className="grid gap-3 md:grid-cols-2">
                {topic.slides.map((sl, i) => (
                  <div key={i} className="rounded-2xl bg-honey-50 p-4">
                    <div className="text-lg font-extrabold">{sl.title}</div>
                    {sl.visual && <div className="my-2 flex justify-center scale-75">{<VisualView v={sl.visual} />}</div>}
                    <p className="text-base text-ink/80">{sl.body}</p>
                  </div>
                ))}
              </div>
            </Card>
            <Card>
              <h3 className="mb-3 text-lg font-extrabold">الأسئلة ({questionsFor(topic, s.extraQuestions).length})</h3>
              <ol className="space-y-3">
                {questionsFor(topic, s.extraQuestions).map((q, i) => (
                  <li key={i} className="rounded-2xl bg-honey-50 p-3">
                    <div className="flex items-start justify-between gap-2"><p className="text-base font-bold">{i + 1}. {q.q}</p>{i >= topic.questions.length && <Pill tone="green">مضاف</Pill>}</div>
                    <p className="mt-1 text-sm text-ink/70">
                      {q.kind === "mcq" ? `اختيار من متعدد · الصحيح: ${q.options[q.answer]}` : q.kind === "tf" ? `صح/خطأ · الصحيح: ${q.answer ? "صح" : "خطأ"}` : `إجابة كتابية · ${q.answer[0]}`}
                    </p>
                  </li>
                ))}
              </ol>
            </Card>
          </div>
        ) : (
          <div className="hidden items-center justify-center rounded-3xl border-2 border-dashed border-honey-200 p-10 text-lg text-honey-700/70 lg:flex">اختر درساً لعرض محتواه</div>
        )}
      </div>

      {adding && <AddQuestion topic={adding} onClose={() => setAdding(null)} />}
    </div>
  );
}

function AddQuestion({ topic, onClose }: { topic: Topic; onClose: () => void }) {
  const s = useStore();
  const [kind, setKind] = useState<Question["kind"]>("mcq");
  const [q, setQ] = useState("");
  const [opts, setOpts] = useState(["", "", "", ""]);
  const [ans, setAns] = useState(0);
  const [tfAns, setTfAns] = useState(true);
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!q.trim()) return setError("اكتب نص السؤال.");
    let question: Question;
    if (kind === "mcq") {
      const options = opts.map((o) => o.trim()).filter(Boolean);
      if (options.length < 2 || !opts[ans]?.trim()) return setError("أضف خيارين على الأقل وحدّد الإجابة الصحيحة.");
      question = { kind: "mcq", q: q.trim(), options, answer: options.indexOf(opts[ans].trim()) };
    } else if (kind === "tf") question = { kind: "tf", q: q.trim(), answer: tfAns };
    else {
      if (!text.trim()) return setError("اكتب الإجابة الصحيحة.");
      question = { kind: "input", q: q.trim(), answer: [text.trim()] };
    }
    s.addQuestion(topic.id, question);
    s.toast("أُضيف السؤال، سيظهر للطلاب في الاختبار ✅");
    onClose();
  };

  return (
    <Modal title={`سؤال جديد: ${topic.title}`} onClose={onClose}>
      <form onSubmit={submit} className="space-y-4">
        <div className="grid grid-cols-3 gap-1.5 rounded-2xl bg-honey-50 p-1 text-base font-extrabold">
          {([["mcq", "اختيار"], ["tf", "صح/خطأ"], ["input", "كتابة"]] as const).map(([k, l]) => (
            <button type="button" key={k} onClick={() => setKind(k)} className={`rounded-xl py-2 ${kind === k ? "bg-honey-500 text-white" : "text-honey-800"}`}>{l}</button>
          ))}
        </div>
        <Field label="نص السؤال"><input className={inputCls} value={q} onChange={(e) => setQ(e.target.value)} autoFocus /></Field>
        {kind === "mcq" && (
          <div className="space-y-2">
            {opts.map((o, i) => (
              <label key={i} className="flex items-center gap-2">
                <input type="radio" checked={ans === i} onChange={() => setAns(i)} className="h-5 w-5 accent-leaf-500" aria-label="الإجابة الصحيحة" />
                <input className={inputCls} value={o} onChange={(e) => setOpts(opts.map((x, j) => (j === i ? e.target.value : x)))} placeholder={`الخيار ${i + 1}`} />
              </label>
            ))}
            <p className="text-sm text-ink/60">اختر الدائرة بجانب الإجابة الصحيحة.</p>
          </div>
        )}
        {kind === "tf" && (
          <div className="grid grid-cols-2 gap-3">
            {[true, false].map((v) => <button type="button" key={String(v)} onClick={() => setTfAns(v)} className={`rounded-2xl border-2 py-3 text-xl font-extrabold ${tfAns === v ? "border-leaf-500 bg-leaf-100 text-leaf-600" : "border-honey-100"}`}>{v ? "الإجابة: صح" : "الإجابة: خطأ"}</button>)}
          </div>
        )}
        {kind === "input" && <Field label="الإجابة الصحيحة"><input className={inputCls} value={text} onChange={(e) => setText(e.target.value)} /></Field>}
        {error && <p className="text-base font-bold text-berry-600">{error}</p>}
        <Btn3D size="lg" className="w-full">إضافة السؤال</Btn3D>
      </form>
    </Modal>
  );
}
