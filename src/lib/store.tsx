"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { earnedBadges, daysBetween, iso, starsFor, xpForResult } from "./gamify";
import { makeSeed } from "./seed";
import type { Assignment, DiscussionMsg, Question, State, TopicResult } from "./types";

const KEY = "learnapp:v1";
const uid = () => Math.random().toString(36).slice(2, 9);

function load(): State {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as State;
  } catch {}
  return makeSeed();
}

export interface LessonOutcome {
  stars: number;
  xp: number;
  newBadges: string[];
  streak: number;
  firstTime: boolean;
}

interface Ctx extends State {
  ready: boolean;
  toasts: { id: string; text: string }[];
  toast: (text: string) => void;

  login: (role: "student" | "teacher", id: string) => void;
  logout: () => void;
  register: (name: string, avatar: string) => string;

  completeTopic: (studentId: string, topicId: string, correct: number, total: number, wrongIdx: number[], livesLeft: number) => LessonOutcome;

  saveWork: (assignmentId: string, studentId: string, text: string, file?: string) => void;
  markDone: (assignmentId: string, studentId: string) => void;
  addComment: (assignmentId: string, authorId: string, role: "student" | "teacher", text: string) => void;
  grade: (submissionId: string, score: number, feedback: string) => void;
  createAssignment: (a: Omit<Assignment, "id" | "createdAt">) => void;

  postAnnouncement: (classId: string, text: string, emoji?: string) => void;
  sendDiscussion: (classId: string, authorId: string, role: "student" | "teacher", kind: DiscussionMsg["kind"], text: string) => void;
  approve: (msgId: string) => void;
  addQuestion: (topicId: string, q: Question) => void;
  reset: () => void;
}

const StoreCtx = createContext<Ctx | null>(null);

export function useNow(ms = 30000) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), ms);
    return () => clearInterval(t);
  }, [ms]);
  return now;
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<State | null>(null);
  const [toasts, setToasts] = useState<{ id: string; text: string }[]>([]);

  useEffect(() => {
    setState(load());
    // Teacher in one tab, student in another: changes show up instantly.
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY) setState(load());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const commit = useCallback((fn: (s: State) => State) => {
    setState((prev) => {
      if (!prev) return prev;
      const next = fn(prev);
      try {
        localStorage.setItem(KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  const toast = useCallback((text: string) => {
    const id = uid();
    setToasts((t) => [...t, { id, text }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  }, []);

  const value = useMemo<Ctx | null>(() => {
    if (!state) return null;
    return {
      ...state,
      ready: true,
      toasts,
      toast,

      login: (role, id) => commit((s) => ({ ...s, session: { role, id } })),
      logout: () => commit((s) => ({ ...s, session: null })),
      register: (name, avatar) => {
        const id = `s-${uid()}`;
        commit((s) => ({
          ...s,
          students: [...s.students, { id, name, avatar, xp: 0, streak: 0, lastActive: iso(-1), badges: [], daily: {} }],
          classes: s.classes.map((c) => ({ ...c, studentIds: [...c.studentIds, id] })),
          submissions: [...s.submissions, ...s.assignments.map((a) => ({ id: `sub-${a.id}-${id}`, assignmentId: a.id, studentId: id, status: "assigned" as const }))],
          progress: { ...s.progress, [id]: {} },
          session: { role: "student", id },
        }));
        return id;
      },

      completeTopic: (studentId, topicId, correct, total, wrongIdx, livesLeft) => {
        // Compute the outcome from the persisted state so double-clicks never double-award.
        const cur = load();
        const stars = starsFor(correct, total, livesLeft);
        const accuracy = Math.round((correct / Math.max(1, total)) * 100);
        const prev = cur.progress[studentId]?.[topicId];
        const xp = xpForResult(correct, stars) * (prev ? 0.4 : 1);
        const gained = Math.round(xp);
        const student = cur.students.find((x) => x.id === studentId)!;
        const today = iso(0);
        const streak = student.lastActive === today && student.streak > 0 ? student.streak : student.lastActive && daysBetween(student.lastActive, today) === 1 ? student.streak + 1 : 1;
        const result: TopicResult = {
          stars: Math.max(stars, prev?.stars ?? 0), best: Math.max(accuracy, prev?.best ?? 0),
          attempts: (prev?.attempts ?? 0) + 1, doneAt: today,
        };
        const progress = { ...cur.progress, [studentId]: { ...(cur.progress[studentId] ?? {}), [topicId]: result } };
        const updated = { ...student, xp: student.xp + gained, streak, lastActive: today, daily: { ...student.daily, [today]: (student.daily[today] ?? 0) + gained } };
        const badges = earnedBadges(updated, progress[studentId]);
        const newBadges = badges.filter((b) => !student.badges.includes(b));
        updated.badges = badges;

        commit((s) => {
          const w = [...(s.wrong[topicId] ?? [])];
          wrongIdx.forEach((i) => { w[i] = (w[i] ?? 0) + 1; });
          return {
            ...s,
            students: s.students.map((x) => (x.id === studentId ? updated : x)),
            progress,
            wrong: { ...s.wrong, [topicId]: w },
            attempts: { ...s.attempts, [topicId]: (s.attempts[topicId] ?? 0) + 1 },
          };
        });
        return { stars, xp: gained, newBadges, streak, firstTime: !prev };
      },

      saveWork: (assignmentId, studentId, text, file) =>
        commit((s) => ({
          ...s,
          submissions: s.submissions.map((x) => (x.assignmentId === assignmentId && x.studentId === studentId ? { ...x, text, file: file ?? x.file } : x)),
        })),
      markDone: (assignmentId, studentId) =>
        commit((s) => ({
          ...s,
          submissions: s.submissions.map((x) =>
            x.assignmentId === assignmentId && x.studentId === studentId ? { ...x, status: "submitted", submittedAt: Date.now() } : x,
          ),
        })),
      addComment: (assignmentId, authorId, role, text) =>
        commit((s) => ({ ...s, comments: [...s.comments, { id: uid(), assignmentId, authorId, role, text, at: Date.now() }] })),
      grade: (submissionId, score, feedback) =>
        commit((s) => ({
          ...s,
          submissions: s.submissions.map((x) => (x.id === submissionId ? { ...x, status: "graded", score, feedback } : x)),
        })),
      createAssignment: (a) =>
        commit((s) => {
          const id = `a-${uid()}`;
          const cls = s.classes.find((c) => c.id === a.classId);
          return {
            ...s,
            assignments: [{ ...a, id, createdAt: Date.now() }, ...s.assignments],
            submissions: [...s.submissions, ...(cls?.studentIds ?? []).map((sid) => ({ id: `sub-${id}-${sid}`, assignmentId: id, studentId: sid, status: "assigned" as const }))],
          };
        }),

      postAnnouncement: (classId, text, emoji) =>
        commit((s) => ({ ...s, announcements: [{ id: uid(), classId, text, emoji, at: Date.now() }, ...s.announcements] })),
      sendDiscussion: (classId, authorId, role, kind, text) =>
        commit((s) => ({ ...s, discussions: [...s.discussions, { id: uid(), classId, authorId, role, kind, text, at: Date.now() }] })),
      approve: (msgId) =>
        commit((s) => ({ ...s, discussions: s.discussions.map((d) => (d.id === msgId ? { ...d, approved: !d.approved } : d)) })),
      addQuestion: (topicId, q) =>
        commit((s) => ({ ...s, extraQuestions: { ...s.extraQuestions, [topicId]: [...(s.extraQuestions[topicId] ?? []), q] } })),
      reset: () => commit(() => ({ ...makeSeed(), session: null })),
    };
  }, [state, toasts, toast, commit]);

  if (!value) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-honey-400/30 border-t-honey-500" />
      </div>
    );
  }
  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreCtx);
  if (!ctx) throw new Error("useStore must be used inside <StoreProvider>");
  return ctx;
}

export function useMe() {
  const s = useStore();
  const student = s.session?.role === "student" ? s.students.find((x) => x.id === s.session!.id) : undefined;
  const teacher = s.session?.role === "teacher" ? s.teachers.find((x) => x.id === s.session!.id) : undefined;
  return { student, teacher, session: s.session };
}
