// ---------- Learning content ----------

export type Visual =
  | { kind: "angle"; deg: number; label?: string }
  | { kind: "emoji"; text: string }
  | { kind: "triangle"; type: "equilateral" | "isosceles" | "scalene" | "right" }
  | { kind: "shape"; type: "square" | "rectangle" | "rhombus" | "trapezoid" | "parallelogram" }
  | { kind: "formula"; text: string }
  | { kind: "lines"; type: "parallel" | "perpendicular" | "intersecting" };

export interface Slide {
  title: string;
  body: string;
  visual?: Visual;
}

export type Question =
  | { kind: "mcq"; q: string; options: string[]; answer: number; visual?: Visual; explain?: string }
  | { kind: "tf"; q: string; answer: boolean; visual?: Visual; explain?: string }
  | { kind: "input"; q: string; answer: string[]; hint?: string; explain?: string };

export interface Topic {
  id: string;
  title: string;
  emoji: string;
  slides: Slide[];
  questions: Question[];
}

export interface Level {
  id: string;
  title: string;
  topics: Topic[];
}

export interface Subject {
  id: string;
  name: string;
  emoji: string;
  /** Card background gradient */
  from: string;
  to: string;
  levels: Level[];
}

// ---------- People & classes ----------

export interface Student {
  id: string;
  name: string;
  avatar: string;
  xp: number;
  streak: number;
  /** ISO date of the last learning activity */
  lastActive: string;
  badges: string[];
  /** XP earned per day, key = ISO date */
  daily: Record<string, number>;
}

export interface Teacher {
  id: string;
  name: string;
  avatar: string;
  title: string;
}

export interface ClassRoom {
  id: string;
  subjectId: string;
  grade: string;
  teacherId: string;
  studentIds: string[];
}

// ---------- Class activity ----------

export interface Announcement {
  id: string;
  classId: string;
  text: string;
  at: number;
  emoji?: string;
  pinned?: boolean;
}

export interface DiscussionMsg {
  id: string;
  classId: string;
  authorId: string;
  role: "student" | "teacher";
  kind: "problem" | "solution" | "message";
  text: string;
  at: number;
  /** Teacher confirmed this answer */
  approved?: boolean;
}

export interface Assignment {
  id: string;
  classId: string;
  title: string;
  description: string;
  points: number;
  due: string; // ISO date
  attachment?: string;
  createdAt: number;
}

export type SubmissionStatus = "assigned" | "submitted" | "graded";

export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  status: SubmissionStatus;
  text?: string;
  file?: string;
  submittedAt?: number;
  score?: number;
  feedback?: string;
}

export interface AssignmentComment {
  id: string;
  assignmentId: string;
  authorId: string;
  role: "student" | "teacher";
  text: string;
  at: number;
}

export interface TopicResult {
  stars: number; // 1..3
  best: number; // best accuracy 0..100
  attempts: number;
  doneAt: string;
}

export interface State {
  students: Student[];
  teachers: Teacher[];
  classes: ClassRoom[];
  announcements: Announcement[];
  discussions: DiscussionMsg[];
  assignments: Assignment[];
  submissions: Submission[];
  comments: AssignmentComment[];
  /** studentId -> topicId -> result */
  progress: Record<string, Record<string, TopicResult>>;
  /** topicId -> times each question was answered wrong (all students) */
  wrong: Record<string, number[]>;
  /** topicId -> total attempts (for accuracy) */
  attempts: Record<string, number>;
  /** Questions added by teachers */
  extraQuestions: Record<string, Question[]>;
  session: { role: "student" | "teacher"; id: string } | null;
}
