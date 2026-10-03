import { SUBJECTS, subjectById } from "./content";
import { CLASS_DEFS } from "./seed";

/** Static-export route parameters (every class, level and topic that exists at build time). */
export const classParams = () => CLASS_DEFS.map((c) => ({ id: c.id }));

export const levelParams = () =>
  CLASS_DEFS.flatMap((c) => (subjectById(c.subjectId)?.levels ?? []).map((l) => ({ id: c.id, level: l.id })));

export const topicParams = () => SUBJECTS.flatMap((s) => s.levels.flatMap((l) => l.topics.map((t) => ({ topic: t.id }))));

export const classDef = (id: string) => CLASS_DEFS.find((c) => c.id === id);
