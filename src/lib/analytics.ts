import { subjectById, topicsOfSubject } from "./content";
import { daysBetween, iso } from "./gamify";
import type { State } from "./types";

export const teacherClasses = (s: State, teacherId: string) => s.classes.filter((c) => c.teacherId === teacherId);

export const classStudents = (s: State, classId: string) => {
  const c = s.classes.find((x) => x.id === classId);
  return c ? s.students.filter((st) => c.studentIds.includes(st.id)) : [];
};

/** Share of a subject's topics a student has finished (0-100). */
export function studentSubjectPct(s: State, studentId: string, subjectId: string) {
  const topics = topicsOfSubject(subjectId);
  const done = topics.filter((t) => s.progress[studentId]?.[t.id]).length;
  return topics.length ? Math.round((done / topics.length) * 100) : 0;
}

export function studentAccuracy(s: State, studentId: string, subjectId: string) {
  const ids = new Set(topicsOfSubject(subjectId).map((t) => t.id));
  const res = Object.entries(s.progress[studentId] ?? {}).filter(([id]) => ids.has(id)).map(([, r]) => r.best);
  return res.length ? Math.round(res.reduce((a, b) => a + b, 0) / res.length) : 0;
}

export function classAverage(s: State, classId: string) {
  const c = s.classes.find((x) => x.id === classId);
  if (!c) return 0;
  const st = classStudents(s, classId);
  if (!st.length) return 0;
  return Math.round(st.reduce((n, x) => n + studentSubjectPct(s, x.id, c.subjectId), 0) / st.length);
}

export function topicStats(s: State, topicId: string, studentIds: string[]) {
  const finished = studentIds.filter((id) => s.progress[id]?.[topicId]);
  const accuracy = finished.length ? Math.round(finished.reduce((n, id) => n + s.progress[id][topicId].best, 0) / finished.length) : 0;
  return { completion: studentIds.length ? Math.round((finished.length / studentIds.length) * 100) : 0, accuracy, finished: finished.length };
}

/** Which questions in a topic students miss most. */
export function hardestQuestions(s: State, topicId: string, questionCount: number) {
  const wrong = s.wrong[topicId] ?? [];
  const tries = Math.max(1, s.attempts[topicId] ?? 1);
  return Array.from({ length: questionCount }, (_, i) => ({ index: i, rate: Math.min(100, Math.round(((wrong[i] ?? 0) / tries) * 100)) }));
}

export function weeklyXp(s: State, studentIds: string[]) {
  return Array.from({ length: 7 }, (_, i) => {
    const d = iso(i - 6);
    return { day: d, xp: s.students.filter((st) => studentIds.includes(st.id)).reduce((n, st) => n + (st.daily[d] ?? 0), 0) };
  });
}

export function needsAttention(s: State, studentIds: string[]) {
  const today = iso(0);
  return s.students
    .filter((st) => studentIds.includes(st.id))
    .map((st) => ({ st, idle: daysBetween(st.lastActive, today) }))
    .filter((x) => x.idle >= 3 || x.st.streak === 0)
    .sort((a, b) => b.idle - a.idle);
}

export function pendingGrading(s: State, classIds: string[]) {
  const aIds = new Set(s.assignments.filter((a) => classIds.includes(a.classId)).map((a) => a.id));
  return s.submissions.filter((x) => aIds.has(x.assignmentId) && x.status === "submitted");
}

export const subjectNameOfClass = (s: State, classId: string) => subjectById(s.classes.find((c) => c.id === classId)?.subjectId ?? "")?.name ?? "";
