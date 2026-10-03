import type { Question, Subject, Topic } from "../types";
import { arabic } from "./arabic";
import { english } from "./english";
import { islamic } from "./islamic";
import { math } from "./math";
import { science } from "./science";
import { social } from "./social";

export const SUBJECTS: Subject[] = [math, science, arabic, english, islamic, social];

export const subjectById = (id: string) => SUBJECTS.find((s) => s.id === id);

export const ALL_TOPICS: { subject: Subject; levelId: string; levelTitle: string; topic: Topic }[] = SUBJECTS.flatMap((subject) =>
  subject.levels.flatMap((l) => l.topics.map((topic) => ({ subject, levelId: l.id, levelTitle: l.title, topic }))),
);

export const topicById = (id: string) => ALL_TOPICS.find((t) => t.topic.id === id);

export const levelById = (subjectId: string, levelId: string) =>
  subjectById(subjectId)?.levels.find((l) => l.id === levelId);

/** Built-in questions plus any a teacher added. */
export function questionsFor(topic: Topic, extra: Record<string, Question[]>): Question[] {
  return [...topic.questions, ...(extra[topic.id] ?? [])];
}

export const topicsOfSubject = (subjectId: string) => subjectById(subjectId)?.levels.flatMap((l) => l.topics) ?? [];
