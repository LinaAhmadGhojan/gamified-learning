"use client";

import { CheckCircle2, Clock, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { Meter } from "@/components/TCharts";
import { Avatar, Btn3D, Card, Empty, Field, Modal, Pill, inputCls } from "@/components/ui";
import { CommentsModal } from "@/app/class/[id]/assignments/view";
import { teacherClasses } from "@/lib/analytics";
import { subjectById } from "@/lib/content";
import { fmtDate, iso, timeAgo } from "@/lib/gamify";
import { useMe, useStore } from "@/lib/store";
import type { Assignment, Submission } from "@/lib/types";

export default function TeacherAssignments() {
  const s = useStore();
  const { teacher } = useMe();
  const [creating, setCreating] = useState(false);
  const [selId, setSelId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "toGrade">("all");
  const [chat, setChat] = useState(false);

  const mine = useMemo(() => (teacher ? teacherClasses(s, teacher.id) : []), [s, teacher]);
  if (!teacher) return null;
  const ids = mine.map((c) => c.id);
  const list = s.assignments
    .filter((a) => ids.includes(a.classId))
    .filter((a) => filter === "all" || s.submissions.some((x) => x.assignmentId === a.id && x.status === "submitted"))
    .sort((a, b) => b.createdAt - a.createdAt);
  const sel = list.find((a) => a.id === selId) ?? s.assignments.find((a) => a.id === selId);
  const className = (a: Assignment) => subjectById(s.classes.find((c) => c.id === a.classId)!.subjectId)?.name;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div><h1 className="text-3xl font-extrabold text-honey-900">الواجبات</h1><p className="text-lg text-ink/70">أنشئ الواجبات وصحّح تسليمات الطلاب.</p></div>
        <Btn3D icon={Plus} onClick={() => setCreating(true)}>واجب جديد</Btn3D>
      </div>

      <div className="flex gap-2">
        {([["all", "الكل"], ["toGrade", "بانتظار التصحيح"]] as const).map(([k, l]) => (
          <button key={k} onClick={() => setFilter(k)} className={`rounded-full px-5 py-2 text-base font-extrabold ${filter === k ? "bg-honey-500 text-white" : "bg-white text-honey-800 ring-1 ring-honey-200"}`}>{l}</button>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-[380px_1fr]">
        <div className="space-y-3">
          {list.length === 0 && <Empty emoji="🎉" text="لا يوجد ما يطابق." />}
          {list.map((a) => {
            const subs = s.submissions.filter((x) => x.assignmentId === a.id);
            const toGrade = subs.filter((x) => x.status === "submitted").length;
            const submitted = subs.filter((x) => x.status !== "assigned").length;
            return (
              <button key={a.id} onClick={() => setSelId(a.id)} className={`block w-full rounded-3xl bg-white p-4 text-start ring-2 transition ${selId === a.id ? "ring-honey-500" : "ring-honey-100 hover:ring-honey-300"}`}>
                <div className="flex items-start justify-between gap-2">
                  <div><div className="text-lg font-extrabold text-honey-900">{a.title}</div><div className="text-sm text-ink/60">{className(a)} · {fmtDate(a.due)}</div></div>
                  {toGrade > 0 ? <Pill tone="red">{toGrade} للتصحيح</Pill> : <Pill tone="green">مكتمل</Pill>}
                </div>
                <div className="mt-3"><Meter pct={subs.length ? Math.round((submitted / subs.length) * 100) : 0} tone="green" /></div>
              </button>
            );
          })}
        </div>

        {sel ? (
          <Grading a={sel} onComment={() => setChat(true)} />
        ) : (
          <div className="hidden items-center justify-center rounded-3xl border-2 border-dashed border-honey-200 p-10 text-lg text-honey-700/70 lg:flex">اختر واجباً لمراجعة التسليمات</div>
        )}
      </div>

      {creating && <CreateModal onClose={() => setCreating(false)} />}
      {chat && sel && <CommentsModal a={sel} me={{ id: teacher.id, role: "teacher" }} onClose={() => setChat(false)} />}
    </div>
  );
}

function Grading({ a, onComment }: { a: Assignment; onComment: () => void }) {
  const s = useStore();
  const subs = s.submissions.filter((x) => x.assignmentId === a.id);
  const order = { submitted: 0, graded: 1, assigned: 2 } as const;
  const sorted = [...subs].sort((x, y) => order[x.status] - order[y.status]);
  return (
    <Card className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div><h2 className="text-2xl font-extrabold text-honey-900">{a.title}</h2><p className="text-base text-ink/70">{a.description}</p><p className="text-sm text-ink/50">{a.points} نقاط · آخر موعد {fmtDate(a.due)}</p></div>
        <Btn3D variant="white" size="sm" onClick={onComment}>التعليقات</Btn3D>
      </div>
      <ul className="space-y-3">
        {sorted.map((sub) => <Row key={sub.id} sub={sub} a={a} />)}
      </ul>
    </Card>
  );
}

function Row({ sub, a }: { sub: Submission; a: Assignment }) {
  const s = useStore();
  const st = s.students.find((x) => x.id === sub.studentId)!;
  const [score, setScore] = useState(String(sub.score ?? ""));
  const [fb, setFb] = useState(sub.feedback ?? "");
  const [open, setOpen] = useState(false);
  const status = { assigned: <Pill tone="gray"><Clock className="h-4 w-4" />لم يسلّم</Pill>, submitted: <Pill tone="blue">بانتظار التصحيح</Pill>, graded: <Pill tone="green"><CheckCircle2 className="h-4 w-4" />{sub.score}/{a.points}</Pill> }[sub.status];

  return (
    <li className="rounded-2xl bg-honey-50 p-3">
      <button className="flex w-full items-center gap-3 text-start" onClick={() => sub.status !== "assigned" && setOpen(!open)}>
        <Avatar emoji={st.avatar} size={40} />
        <span className="flex-1 text-lg font-bold">{st.name}</span>
        {sub.submittedAt && <span className="hidden text-sm text-ink/50 sm:block">{timeAgo(sub.submittedAt)}</span>}
        {status}
      </button>
      {open && (
        <div className="mt-3 space-y-3 border-t border-honey-100 pt-3">
          {sub.text && <p className="rounded-xl bg-white p-3 text-base">{sub.text}</p>}
          {sub.file && <p className="text-sm text-ink/70" dir="ltr">📎 {sub.file}</p>}
          <div className="grid gap-2 sm:grid-cols-[110px_1fr_auto]">
            <input type="number" min={0} max={a.points} value={score} onChange={(e) => setScore(e.target.value)} placeholder={`/${a.points}`} className={inputCls} aria-label="الدرجة" />
            <input value={fb} onChange={(e) => setFb(e.target.value)} placeholder="ملاحظة للطالب" className={inputCls} />
            <Btn3D size="sm" disabled={score === "" || Number(score) < 0 || Number(score) > a.points}
              onClick={() => { s.grade(sub.id, Number(score), fb.trim()); s.toast("تم حفظ التقييم ✅"); setOpen(false); }}>حفظ</Btn3D>
          </div>
        </div>
      )}
    </li>
  );
}

function CreateModal({ onClose }: { onClose: () => void }) {
  const s = useStore();
  const { teacher } = useMe();
  const mine = teacherClasses(s, teacher!.id);
  const [f, setF] = useState({ classId: mine[0]?.id ?? "", title: "", description: "", points: "10", due: iso(5), attachment: "" });
  const [error, setError] = useState("");
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!f.title.trim() || !(Number(f.points) > 0)) return setError("أدخل عنواناً ودرجة أكبر من صفر.");
    s.createAssignment({ classId: f.classId, title: f.title.trim(), description: f.description.trim() || "لا يوجد وصف.", points: Number(f.points), due: f.due, attachment: f.attachment || undefined });
    s.toast("تم نشر الواجب للطلاب 📝");
    onClose();
  };
  return (
    <Modal title="واجب جديد" onClose={onClose}>
      <form onSubmit={submit} className="space-y-4">
        <Field label="الصف"><select className={inputCls} value={f.classId} onChange={(e) => setF({ ...f, classId: e.target.value })}>{mine.map((c) => <option key={c.id} value={c.id}>{subjectById(c.subjectId)?.name} · {c.grade}</option>)}</select></Field>
        <Field label="العنوان"><input className={inputCls} value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} autoFocus /></Field>
        <Field label="الوصف"><textarea className={inputCls} rows={3} value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="الدرجة"><input className={inputCls} type="number" value={f.points} onChange={(e) => setF({ ...f, points: e.target.value })} /></Field>
          <Field label="آخر موعد"><input className={inputCls} type="date" value={f.due} onChange={(e) => setF({ ...f, due: e.target.value })} /></Field>
        </div>
        <Field label="مرفق (اختياري)"><input type="file" className={inputCls} onChange={(e) => setF({ ...f, attachment: e.target.files?.[0]?.name ?? "" })} /></Field>
        {error && <p className="text-base font-bold text-berry-600">{error}</p>}
        <Btn3D size="lg" className="w-full">نشر الواجب</Btn3D>
      </form>
    </Modal>
  );
}
