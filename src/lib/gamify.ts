import { ALL_TOPICS, SUBJECTS } from "./content";
import type { State, Student } from "./types";

export const XP_PER_LEVEL = 120;
export const DAILY_GOAL = 30;

export const iso = (offset = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

export const daysBetween = (a: string, b: string) =>
  Math.round((new Date(b + "T12:00:00").getTime() - new Date(a + "T12:00:00").getTime()) / 86400000);

export function levelInfo(xp: number) {
  const level = Math.floor(xp / XP_PER_LEVEL) + 1;
  const into = xp % XP_PER_LEVEL;
  return { level, into, need: XP_PER_LEVEL, pct: Math.round((into / XP_PER_LEVEL) * 100) };
}

export const LEVEL_TITLES = ["مستكشف", "متعلّم", "مجتهد", "متفوّق", "نابغة", "أسطورة"];
export const levelTitle = (level: number) => LEVEL_TITLES[Math.min(LEVEL_TITLES.length - 1, Math.floor((level - 1) / 2))];

export interface BadgeDef {
  id: string;
  name: string;
  emoji: string;
  desc: string;
}

export const BADGES: BadgeDef[] = [
  { id: "first", name: "بداية الرحلة", emoji: "🌱", desc: "أنهِ أول درس لك" },
  { id: "streak3", name: "ثلاثة أيام", emoji: "🔥", desc: "تعلّم ٣ أيام متتالية" },
  { id: "streak7", name: "أسبوع كامل", emoji: "🏅", desc: "تعلّم ٧ أيام متتالية" },
  { id: "xp100", name: "نجم صاعد", emoji: "⭐", desc: "اجمع ١٠٠ نقطة خبرة" },
  { id: "xp500", name: "بطل المعرفة", emoji: "🏆", desc: "اجمع ٥٠٠ نقطة خبرة" },
  { id: "perfect", name: "علامة كاملة", emoji: "💯", desc: "أنهِ درساً بثلاث نجوم" },
  { id: "scholar", name: "المثابر", emoji: "📚", desc: "أنهِ ١٠ دروس" },
  { id: "master", name: "متقن المادة", emoji: "🎓", desc: "أنهِ كل دروس مادة واحدة" },
];

export function earnedBadges(student: Student, progress: State["progress"][string] = {}): string[] {
  const done = Object.keys(progress);
  const earned = new Set<string>(student.badges);
  if (done.length >= 1) earned.add("first");
  if (student.streak >= 3) earned.add("streak3");
  if (student.streak >= 7) earned.add("streak7");
  if (student.xp >= 100) earned.add("xp100");
  if (student.xp >= 500) earned.add("xp500");
  if (Object.values(progress).some((r) => r.stars === 3)) earned.add("perfect");
  if (done.length >= 10) earned.add("scholar");
  for (const s of SUBJECTS) {
    const ids = s.levels.flatMap((l) => l.topics.map((t) => t.id));
    if (ids.length && ids.every((id) => progress[id])) earned.add("master");
  }
  return [...earned];
}

export const starsFor = (correct: number, total: number, livesLeft: number) =>
  correct === total && livesLeft === 3 ? 3 : correct / total >= 0.7 ? 2 : 1;

export const xpForResult = (correct: number, stars: number) => 10 + correct * 5 + (stars === 3 ? 10 : 0);

export function subjectProgress(subjectId: string, progress: State["progress"][string] = {}) {
  const topics = SUBJECTS.find((s) => s.id === subjectId)?.levels.flatMap((l) => l.topics) ?? [];
  const done = topics.filter((t) => progress[t.id]).length;
  return { done, total: topics.length, pct: topics.length ? Math.round((done / topics.length) * 100) : 0 };
}

export function overallProgress(progress: State["progress"][string] = {}) {
  const done = ALL_TOPICS.filter((t) => progress[t.topic.id]).length;
  return { done, total: ALL_TOPICS.length, pct: Math.round((done / ALL_TOPICS.length) * 100) };
}

/** A level is unlocked when the previous level in the same subject is complete. */
export function isLevelUnlocked(subjectId: string, levelIndex: number, progress: State["progress"][string] = {}) {
  if (levelIndex === 0) return true;
  const prev = SUBJECTS.find((s) => s.id === subjectId)?.levels[levelIndex - 1];
  return !!prev && prev.topics.every((t) => progress[t.id]);
}

const rel = new Intl.RelativeTimeFormat("ar", { numeric: "auto" });
export function timeAgo(ts: number, now = Date.now()) {
  const min = Math.round((now - ts) / 60000);
  if (min < 1) return "الآن";
  if (min < 60) return rel.format(-min, "minute");
  const h = Math.round(min / 60);
  if (h < 24) return rel.format(-h, "hour");
  return rel.format(-Math.round(h / 24), "day");
}

export const clock = (ts: number) =>
  new Date(ts).toLocaleTimeString("ar-u-nu-latn", { hour: "2-digit", minute: "2-digit", hour12: true });

export const fmtDate = (isoDate: string) =>
  new Date(isoDate + "T12:00:00").toLocaleDateString("ar-u-nu-latn", { day: "numeric", month: "long" });
