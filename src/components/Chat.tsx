"use client";

import { BadgeCheck, Camera, Paperclip, Pin, Send, Smile } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { clock, timeAgo } from "@/lib/gamify";
import { useNow, useStore } from "@/lib/store";
import type { DiscussionMsg } from "@/lib/types";
import { Avatar } from "./ui";

function Composer({ placeholder, disabled, onSend, extra }: { placeholder: string; disabled?: boolean; onSend: (text: string) => void; extra?: React.ReactNode }) {
  const [text, setText] = useState("");
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || disabled) return;
    onSend(text.trim());
    setText("");
  };
  return (
    <form onSubmit={submit} className="space-y-2 bg-[#e8dfd3] px-3 pb-3 pt-2">
      {extra}
      <div className="flex items-center gap-2">
        <div className="flex flex-1 items-center gap-2 rounded-full bg-white px-4 py-1.5 shadow-sm">
          <Smile className="h-6 w-6 shrink-0 text-stone-400" />
          <input value={text} onChange={(e) => setText(e.target.value)} disabled={disabled} placeholder={placeholder}
            className="min-w-0 flex-1 bg-transparent py-2 text-base text-ink outline-none placeholder:text-stone-400 disabled:cursor-not-allowed" />
          <Paperclip className="hidden h-5 w-5 text-stone-400 sm:block" />
          <Camera className="hidden h-5 w-5 text-stone-400 sm:block" />
        </div>
        <button disabled={disabled || !text.trim()} aria-label="إرسال" className="btn3d flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-b-4 border-honey-800 bg-honey-600 text-white disabled:opacity-50">
          <Send className="h-5 w-5 rtl:-scale-x-100" />
        </button>
      </div>
    </form>
  );
}

function useAutoScroll(dep: unknown) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    ref.current?.scrollTo({ top: ref.current.scrollHeight });
  }, [dep]);
  return ref;
}

/** Teacher → class announcements, WhatsApp-style. */
export function AnnouncementFeed({ classId, canPost }: { classId: string; canPost: boolean }) {
  const s = useStore();
  const now = useNow(60000);
  const list = s.announcements.filter((a) => a.classId === classId).sort((a, b) => a.at - b.at);
  const ref = useAutoScroll(list.length);
  return (
    <div className="flex h-[calc(100dvh-8.5rem)] flex-col overflow-hidden bg-[#e8dfd3] lg:h-[72vh] lg:rounded-3xl lg:ring-1 lg:ring-honey-200">
      <div ref={ref} className="flex-1 space-y-3 overflow-y-auto p-3">
        {list.length === 0 && <p className="py-16 text-center text-base text-stone-500">لا توجد إعلانات بعد.</p>}
        {list.map((a) => (
          <div key={a.id} className="max-w-[88%] rounded-2xl rounded-ee-md bg-white p-3 shadow-sm sm:max-w-[70%]">
            {a.pinned && <div className="mb-1 flex items-center gap-1 text-sm font-bold text-honey-600"><Pin className="h-4 w-4" />مثبّت</div>}
            {a.emoji && <div className="mb-2 flex h-28 items-center justify-center rounded-xl bg-gradient-to-br from-honey-100 to-honey-300 text-6xl">{a.emoji}</div>}
            <p className="text-base leading-relaxed text-stone-800">{a.text}</p>
            <div className="mt-1 text-end text-sm text-stone-400">{clock(a.at)} · {timeAgo(a.at, now)}</div>
          </div>
        ))}
      </div>
      <Composer
        placeholder={canPost ? "اكتب إعلاناً للصف..." : "الإعلانات من المعلم فقط"}
        disabled={!canPost}
        onSend={(t) => { s.postAnnouncement(classId, t, "📢"); s.toast("تم نشر الإعلان ✅"); }}
      />
    </div>
  );
}

/** Student questions and answers. Teachers can approve a reply as the accepted solution. */
export function DiscussionFeed({ classId, me }: { classId: string; me: { id: string; role: "student" | "teacher" } }) {
  const s = useStore();
  const [kind, setKind] = useState<DiscussionMsg["kind"]>(me.role === "teacher" ? "solution" : "problem");
  const list = s.discussions.filter((d) => d.classId === classId).sort((a, b) => a.at - b.at);
  const ref = useAutoScroll(list.length);

  const author = (d: DiscussionMsg) =>
    d.role === "teacher" ? s.teachers.find((t) => t.id === d.authorId) : s.students.find((t) => t.id === d.authorId);

  return (
    <div className="flex h-[calc(100dvh-8.5rem)] flex-col overflow-hidden bg-[#e8dfd3] lg:h-[72vh] lg:rounded-3xl lg:ring-1 lg:ring-honey-200">
      <div ref={ref} className="flex-1 space-y-3 overflow-y-auto p-3">
        {list.map((d) => {
          const mine = d.authorId === me.id;
          const a = author(d);
          return (
            <div key={d.id} className={`flex flex-col ${mine ? "items-start" : "items-end"}`}>
              <div className={`max-w-[88%] rounded-2xl p-3 shadow-sm sm:max-w-[70%] ${mine ? "rounded-es-md bg-[#ffe896]" : "rounded-ee-md bg-white"}`}>
                <div className="mb-1 flex items-center gap-2 text-sm font-bold text-honey-800">
                  {a && <Avatar emoji={a.avatar} size={24} />}
                  <span>{a?.name ?? "—"}</span>
                  {d.role === "teacher" && <span className="rounded-full bg-sky-100 px-2 text-xs text-sky-700">معلّم</span>}
                  <span className={`rounded-full px-2 text-xs ${d.kind === "problem" ? "bg-berry-100 text-berry-600" : d.kind === "solution" ? "bg-leaf-100 text-leaf-600" : "bg-stone-100 text-stone-500"}`}>
                    {d.kind === "problem" ? "سؤال" : d.kind === "solution" ? "إجابة" : "رسالة"}
                  </span>
                </div>
                <p className="text-base leading-relaxed text-stone-800">{d.text}</p>
                <div className="mt-1 flex items-center justify-between gap-3 text-sm text-stone-400">
                  {d.approved ? <span className="flex items-center gap-1 font-bold text-leaf-600"><BadgeCheck className="h-4 w-4" />إجابة معتمدة</span> : <span />}
                  <span>{clock(d.at)}</span>
                </div>
                {me.role === "teacher" && d.kind === "solution" && (
                  <button onClick={() => s.approve(d.id)} className="mt-1 text-sm font-bold text-leaf-600 underline">{d.approved ? "إلغاء الاعتماد" : "اعتماد الإجابة"}</button>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <Composer
        placeholder={kind === "problem" ? "اكتب سؤالك..." : kind === "solution" ? "اكتب إجابتك..." : "اكتب رسالة..."}
        onSend={(t) => s.sendDiscussion(classId, me.id, me.role, kind, t)}
        extra={
          <div className="flex gap-2 text-sm font-bold">
            {(["problem", "solution", "message"] as const).map((k) => (
              <button type="button" key={k} onClick={() => setKind(k)} className={`rounded-full px-3 py-1 ${kind === k ? "bg-honey-600 text-white" : "bg-white/80 text-honey-800"}`}>
                {k === "problem" ? "سؤال" : k === "solution" ? "إجابة" : "رسالة"}
              </button>
            ))}
          </div>
        }
      />
    </div>
  );
}
