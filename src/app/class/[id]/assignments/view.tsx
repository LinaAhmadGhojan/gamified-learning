"use client";

import { ArrowRight, CheckCircle2, FileText, MessageCircle, Plus, Send } from "lucide-react";
import { useState } from "react";
import { Btn3D, Card, Empty, Field, Modal, PageBar, Pill, inputCls } from "@/components/ui";
import { fmtDate, iso, timeAgo } from "@/lib/gamify";
import { useMe, useStore } from "@/lib/store";
import type { Assignment } from "@/lib/types";

export default function View({ id }: { id: string }) {
  const s = useStore();
  const { student } = useMe();
  const [selId, setSelId] = useState<string | null>(null);
  const [work, setWork] = useState(false);
  const [chat, setChat] = useState(false);
  if (!student) return null;

  const list = s.assignments.filter((a) => a.classId === id).sort((a, b) => a.due.localeCompare(b.due));
  const subOf = (a: Assignment) => s.submissions.find((x) => x.assignmentId === a.id && x.studentId === student.id);
  const sel = list.find((a) => a.id === selId);

  const statusPill = (a: Assignment) => {
    const st = subOf(a)?.status ?? "assigned";
    if (st === "graded") return <Pill tone="green">تم التقييم</Pill>;
    if (st === "submitted") return <Pill tone="blue">تم التسليم</Pill>;
    return a.due < iso(0) ? <Pill tone="red">متأخر</Pill> : <Pill tone="honey">مطلوب</Pill>;
  };

  return (
    <div className="space-y-4">
      <PageBar title="الواجبات" back={`/class/${id}`} />
      <div className="grid gap-5 lg:grid-cols-[360px_1fr]">
        <div className={`space-y-3 ${sel ? "hidden lg:block" : ""}`}>
          {list.length === 0 && <Empty emoji="🎉" text="لا توجد واجبات حالياً." />}
          {list.map((a) => (
            <button key={a.id} onClick={() => setSelId(a.id)}
              className={`btn3d block w-full rounded-2xl border-b-[5px] border-honey-800 px-5 py-4 text-start text-white ${selId === a.id ? "bg-honey-600 ring-4 ring-honey-300" : "bg-honey-500"}`}>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-xl font-extrabold">{a.title}</div>
                  <div className="text-sm font-semibold text-white/90">آخر موعد: {fmtDate(a.due)}</div>
                </div>
                {statusPill(a)}
              </div>
            </button>
          ))}
        </div>

        {sel ? (
          <Detail a={sel} studentId={student.id} onBack={() => setSelId(null)} onWork={() => setWork(true)} onChat={() => setChat(true)} />
        ) : (
          <div className="hidden items-center justify-center rounded-3xl border-2 border-dashed border-honey-200 p-10 text-center text-lg text-honey-700/70 lg:flex">اختر واجباً لعرض تفاصيله</div>
        )}
      </div>

      {sel && work && <WorkModal a={sel} studentId={student.id} onClose={() => setWork(false)} />}
      {sel && chat && <CommentsModal a={sel} me={{ id: student.id, role: "student" }} onClose={() => setChat(false)} />}
    </div>
  );
}

function Detail({ a, studentId, onBack, onWork, onChat }: { a: Assignment; studentId: string; onBack: () => void; onWork: () => void; onChat: () => void }) {
  const s = useStore();
  const sub = s.submissions.find((x) => x.assignmentId === a.id && x.studentId === studentId);
  const done = sub?.status === "submitted" || sub?.status === "graded";
  const count = s.comments.filter((c) => c.assignmentId === a.id).length;

  return (
    <Card className="space-y-5">
      <button onClick={onBack} className="flex items-center gap-1 text-base font-bold text-honey-600 lg:hidden"><ArrowRight className="h-5 w-5" />القائمة</button>
      <div>
        <h2 className="text-2xl font-extrabold text-honey-900">{a.title}</h2>
        <p className="text-base font-semibold text-ink/70">{a.points} نقاط</p>
      </div>
      <p className="text-lg leading-relaxed text-ink">{a.description}</p>

      <button onClick={onChat} className="flex w-full items-center gap-3 rounded-full border-2 border-honey-200 bg-white px-5 py-3 text-lg font-bold text-honey-600 hover:bg-honey-50">
        <MessageCircle className="h-6 w-6" />التعليقات {count > 0 && <Pill>{count}</Pill>}
      </button>

      {a.attachment && (
        <div>
          <div className="mb-2 text-base font-bold text-honey-900">المرفقات</div>
          <div className="inline-flex items-center gap-3 rounded-2xl border-4 border-honey-100 bg-white p-4">
            <span className="flex h-14 w-12 flex-col items-center justify-center rounded-lg bg-stone-100"><FileText className="h-6 w-6 text-stone-400" /><span className="mt-0.5 rounded bg-red-500 px-1 text-[10px] font-bold text-white">PDF</span></span>
            <span className="text-base font-bold" dir="ltr">{a.attachment}</span>
          </div>
        </div>
      )}

      {sub?.status === "graded" && (
        <div className="rounded-2xl bg-leaf-100 p-4">
          <div className="flex items-center gap-2 text-xl font-extrabold text-leaf-600"><CheckCircle2 className="h-6 w-6" />الدرجة: {sub.score} / {a.points}</div>
          {sub.feedback && <p className="mt-1 text-base text-ink">«{sub.feedback}»</p>}
        </div>
      )}

      {(sub?.text || sub?.file) && (
        <div className="rounded-2xl bg-honey-50 p-4 text-base">
          <div className="mb-1 font-bold text-honey-900">عملك</div>
          {sub.text && <p>{sub.text}</p>}
          {sub.file && <p className="mt-1 text-sm text-ink/70" dir="ltr">📎 {sub.file}</p>}
          {sub.submittedAt && <p className="mt-1 text-sm text-ink/50">سُلّم {timeAgo(sub.submittedAt)}</p>}
        </div>
      )}

      <div className="space-y-3 border-t-2 border-honey-100 pt-4">
        <div className="text-center text-base font-semibold">آخر موعد: {fmtDate(a.due)}</div>
        {!done ? (
          <>
            <Btn3D size="lg" icon={Plus} className="w-full" onClick={onWork}>إضافة عمل</Btn3D>
            <Btn3D variant="white" size="lg" className="w-full" disabled={!sub?.text && !sub?.file}
              onClick={() => { s.markDone(a.id, studentId); s.toast("تم التسليم! أحسنت ✅"); }}>تم الانتهاء</Btn3D>
          </>
        ) : (
          <div className="rounded-2xl bg-sky-100 p-3 text-center text-lg font-bold text-sky-700">تم تسليم الواجب بنجاح</div>
        )}
      </div>
    </Card>
  );
}

function WorkModal({ a, studentId, onClose }: { a: Assignment; studentId: string; onClose: () => void }) {
  const s = useStore();
  const sub = s.submissions.find((x) => x.assignmentId === a.id && x.studentId === studentId);
  const [text, setText] = useState(sub?.text ?? "");
  const [file, setFile] = useState(sub?.file ?? "");
  return (
    <Modal title="إضافة عمل" onClose={onClose}>
      <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); s.saveWork(a.id, studentId, text.trim(), file || undefined); s.toast("تم حفظ عملك"); onClose(); }}>
        <Field label="إجابتك"><textarea className={inputCls} rows={5} value={text} onChange={(e) => setText(e.target.value)} placeholder="اكتب حلّك هنا..." /></Field>
        <Field label="إرفاق ملف أو صورة (اختياري)">
          <input type="file" className={inputCls} onChange={(e) => setFile(e.target.files?.[0]?.name ?? "")} />
        </Field>
        <Btn3D size="lg" className="w-full" disabled={!text.trim() && !file}>حفظ</Btn3D>
      </form>
    </Modal>
  );
}

export function CommentsModal({ a, me, onClose }: { a: Assignment; me: { id: string; role: "student" | "teacher" }; onClose: () => void }) {
  const s = useStore();
  const [t, setT] = useState("");
  const list = s.comments.filter((c) => c.assignmentId === a.id).sort((x, y) => x.at - y.at);
  const name = (c: (typeof list)[number]) => (c.role === "teacher" ? s.teachers.find((x) => x.id === c.authorId)?.name : s.students.find((x) => x.id === c.authorId)?.name) ?? "—";
  return (
    <Modal title={`تعليقات: ${a.title}`} onClose={onClose}>
      <div className="mb-4 max-h-72 space-y-3 overflow-y-auto">
        {list.length === 0 && <p className="py-6 text-center text-base text-ink/60">لا تعليقات بعد.</p>}
        {list.map((c) => (
          <div key={c.id} className={`rounded-2xl p-3 ${c.authorId === me.id ? "bg-[#ffe896]" : "bg-honey-50"}`}>
            <div className="text-sm font-bold text-honey-800">{name(c)} {c.role === "teacher" && "· معلّم"}</div>
            <p className="text-base">{c.text}</p>
          </div>
        ))}
      </div>
      <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); if (!t.trim()) return; s.addComment(a.id, me.id, me.role, t.trim()); setT(""); }}>
        <input className={inputCls} value={t} onChange={(e) => setT(e.target.value)} placeholder="اكتب تعليقاً..." />
        <Btn3D aria-label="إرسال"><Send className="h-5 w-5 rtl:-scale-x-100" /></Btn3D>
      </form>
    </Modal>
  );
}
