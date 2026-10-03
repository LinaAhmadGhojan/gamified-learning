import type { Question, Slide, Visual } from "../types";

export const mcq = (q: string, options: string[], answer: number, explain?: string, visual?: Visual): Question => ({
  kind: "mcq", q, options, answer, explain, visual,
});
export const tf = (q: string, answer: boolean, explain?: string, visual?: Visual): Question => ({
  kind: "tf", q, answer, explain, visual,
});
export const input = (q: string, answer: string[], hint?: string, explain?: string): Question => ({
  kind: "input", q, answer, hint, explain,
});
export const slide = (title: string, body: string, visual?: Visual): Slide => ({ title, body, visual });

export const emoji = (text: string): Visual => ({ kind: "emoji", text });
export const angle = (deg: number, label?: string): Visual => ({ kind: "angle", deg, label });
export const formula = (text: string): Visual => ({ kind: "formula", text });
