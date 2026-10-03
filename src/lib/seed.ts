import { ALL_TOPICS } from "./content";
import { earnedBadges, iso } from "./gamify";
import type {
  Announcement, Assignment, AssignmentComment, ClassRoom, DiscussionMsg, State, Student, Submission, Teacher, TopicResult,
} from "./types";

// Tiny deterministic generator so the demo looks the same on every load.
const rng = (seed: number) => () => {
  seed = (seed * 9301 + 49297) % 233280;
  return seed / 233280;
};

const NAMES: [string, string][] = [
  ["يزن العلي", "🐯"], ["ريم حداد", "🦊"], ["عمر خليل", "🐼"], ["سلمى ناصر", "🐰"], ["خالد منصور", "🦁"], ["هند عبيد", "🐨"],
  ["أحمد صالح", "🐸"], ["مريم الزعبي", "🦄"], ["ياسين فارس", "🐵"], ["جنى أبو زيد", "🐱"], ["زيد القاسم", "🐶"], ["دانة سليمان", "🦉"],
];

export const TEACHERS: Teacher[] = [
  { id: "t1", name: "أ. سامر الحداد", avatar: "👨‍🏫", title: "معلم الرياضيات والعلوم" },
  { id: "t2", name: "أ. هدى القاسم", avatar: "👩‍🏫", title: "معلمة اللغة العربية والتربية الإسلامية" },
  { id: "t3", name: "أ. رنا الخطيب", avatar: "👩‍🏫", title: "معلمة الإنجليزية والاجتماعيات" },
];

export const CLASS_DEFS: { id: string; subjectId: string; teacherId: string }[] = [
  { id: "c-math", subjectId: "math", teacherId: "t1" },
  { id: "c-science", subjectId: "science", teacherId: "t1" },
  { id: "c-arabic", subjectId: "arabic", teacherId: "t2" },
  { id: "c-islamic", subjectId: "islamic", teacherId: "t2" },
  { id: "c-english", subjectId: "english", teacherId: "t3" },
  { id: "c-social", subjectId: "social", teacherId: "t3" },
];

export function makeSeed(): State {
  const now = Date.now();
  const ago = (min: number) => now - min * 60000;
  const rand = rng(7);
  const today = iso(0);

  const students: Student[] = NAMES.map(([name, avatar], i) => ({
    id: `s${i + 1}`, name, avatar, xp: 0, streak: 0, lastActive: today, badges: [], daily: {},
  }));

  // Progress: stronger students finish more topics; the demo user (s1) starts fresh-ish.
  const progress: State["progress"] = {};
  const wrong: State["wrong"] = {};
  const attempts: State["attempts"] = {};
  students.forEach((s, i) => {
    progress[s.id] = {};
    const ability = i === 0 ? 0.12 : 0.25 + rand() * 0.6;
    const order = [...ALL_TOPICS];
    order.forEach(({ topic, levelId }) => {
      const lvl2 = levelId.endsWith("-2");
      if (rand() < ability * (lvl2 ? 0.55 : 1.15)) {
        const acc = Math.round(55 + rand() * 45);
        const stars = acc >= 95 ? 3 : acc >= 75 ? 2 : 1;
        const res: TopicResult = { stars, best: acc, attempts: 1 + Math.floor(rand() * 2), doneAt: iso(-Math.floor(rand() * 10)) };
        progress[s.id][topic.id] = res;
        attempts[topic.id] = (attempts[topic.id] ?? 0) + res.attempts;
        const w = wrong[topic.id] ?? (wrong[topic.id] = new Array(topic.questions.length).fill(0));
        topic.questions.forEach((_, qi) => {
          if (rand() > acc / 100) w[qi] += 1;
        });
      }
    });
    const done = Object.keys(progress[s.id]).length;
    s.xp = done * 38 + Math.floor(rand() * 30);
    s.streak = i === 0 ? 2 : Math.floor(rand() * 9);
    for (let d = 0; d < 7; d++) s.daily[iso(-d)] = d === 0 && i === 0 ? 15 : rand() < 0.7 ? Math.floor(10 + rand() * 60) : 0;
    s.lastActive = s.streak > 0 ? today : iso(-3 - Math.floor(rand() * 4));
    s.badges = earnedBadges(s, progress[s.id]);
  });

  const classes: ClassRoom[] = CLASS_DEFS.map((c) => ({ ...c, grade: "الصف السابع", studentIds: students.map((s) => s.id) }));

  const A = (id: string, classId: string, text: string, min: number, emoji?: string, pinned?: boolean): Announcement => ({
    id, classId, text, emoji, pinned, at: ago(min),
  });
  const announcements: Announcement[] = [
    A("an1", "c-math", "غداً اختبار قصير في الزوايا والمثلثات. راجعوا درس «الزوايا» في التعلّم السريع قبل النوم 🌙", 95, "📐", true),
    A("an2", "c-math", "تم رفع واجب جديد عن المثلثات. آخر موعد للتسليم بعد ٣ أيام.", 400, "📝"),
    A("an3", "c-science", "سنقوم برحلة مخبرية يوم الخميس لمراقبة الخلايا تحت المجهر. أحضروا دفاتركم 🔬", 220, "🔬", true),
    A("an4", "c-arabic", "مسابقة الإملاء الأسبوعية يوم الأحد، استعدّوا بدرس «الهمزة»!", 150, "✏️"),
    A("an5", "c-english", "Reminder: vocabulary quiz tomorrow. Revise Animals and Family.", 180, "🔤"),
    A("an6", "c-islamic", "بارك الله فيكم، نبدأ الأسبوع القادم بدرس «الصدق» مع قصة من السيرة.", 600, "🕌"),
    A("an7", "c-social", "ارسموا خريطة بسيطة لبلدكم وحدّدوا العاصمة والبحار المجاورة.", 300, "🗺️"),
  ];

  const D = (id: string, classId: string, authorId: string, role: "student" | "teacher", kind: DiscussionMsg["kind"], text: string, min: number, approved?: boolean): DiscussionMsg => ({
    id, classId, authorId, role, kind, text, at: ago(min), approved,
  });
  const discussions: DiscussionMsg[] = [
    D("d1", "c-math", "s2", "student", "problem", "ما الفرق بين الزاوية المنفرجة والزاوية المستقيمة؟ أخلط بينهما دائماً.", 180),
    D("d2", "c-math", "t1", "teacher", "solution", "المنفرجة أكبر من ٩٠° وأقل من ١٨٠°، أما المستقيمة فتساوي ١٨٠° بالضبط (تبدو كخط مستقيم).", 160, true),
    D("d3", "c-math", "s5", "student", "message", "شكراً أستاذ، صار واضحاً الآن 👍", 150),
    D("d4", "c-science", "s6", "student", "problem", "هل تحدث عملية التمثيل الضوئي في الليل؟", 300),
    D("d5", "c-science", "s3", "student", "solution", "لا، تحتاج إلى ضوء الشمس، في الليل ينتج النبات الطاقة بالتنفس فقط.", 280),
    D("d6", "c-arabic", "s4", "student", "problem", "متى نكتب التاء مفتوحة ومتى مربوطة؟", 500),
    D("d7", "c-arabic", "t2", "teacher", "solution", "المربوطة في آخر الاسم المفرد المؤنث (مدرسة)، والمفتوحة في الفعل وجمع المؤنث السالم (معلّمات).", 470, true),
    D("d8", "c-english", "s9", "student", "problem", "When do we add «es» to a plural noun?", 250),
  ];

  const as = (id: string, classId: string, title: string, description: string, points: number, dueOffset: number, attachment?: string): Assignment => ({
    id, classId, title, description, points, due: iso(dueOffset), attachment, createdAt: ago(1500),
  });
  const assignments: Assignment[] = [
    as("a1", "c-math", "واجب المثلثات", "حلّ المسائل من ١ إلى ٨ في ورقة العمل وصنّف كل مثلث حسب أضلاعه وزواياه.", 10, 3, "ورقة-المثلثات.pdf"),
    as("a2", "c-math", "وحدة القياس", "حوّل الوحدات التالية واحسب محيط ومساحة المستطيلات المعطاة.", 10, 10, "القياس.pdf"),
    as("a3", "c-science", "ملخّص الخلية", "ارسم خلية نباتية وحيوانية وسمِّ أجزاءهما بخط واضح.", 10, 5, "الخلية.pdf"),
    as("a4", "c-arabic", "إعراب الجمل", "حدّد المبتدأ والخبر والفعل والفاعل في الجمل العشر.", 10, 2, "الجمل.pdf"),
    as("a5", "c-english", "My Family", "Write 5 sentences about your family using This is my ...", 10, 4),
    as("a6", "c-islamic", "قصة عن الصدق", "اكتب قصة قصيرة عن الصدق من حياتك أو من السيرة.", 10, 7),
    as("a7", "c-social", "خريطة بلدي", "ارسم خريطة تبيّن العاصمة والبحار المجاورة.", 10, 6),
  ];

  const submissions: Submission[] = [];
  const comments: AssignmentComment[] = [];
  assignments.forEach((a, ai) => {
    students.forEach((s, si) => {
      const r = rand();
      const status = si === 0 ? "assigned" : r < 0.35 ? "assigned" : r < 0.6 ? "submitted" : "graded";
      const sub: Submission = { id: `sub-${a.id}-${s.id}`, assignmentId: a.id, studentId: s.id, status };
      if (status !== "assigned") {
        sub.text = "تم حل جميع المسائل المطلوبة، وأرفقت الورقة.";
        sub.file = "عملي.pdf";
        sub.submittedAt = ago(300 + si * 20);
      }
      if (status === "graded") {
        sub.score = 6 + Math.floor(rand() * 5);
        sub.feedback = sub.score >= 9 ? "عمل ممتاز، أحسنت!" : "جيد، راجع الأخطاء الموضّحة.";
      }
      submissions.push(sub);
    });
    comments.push({ id: `cm${ai}`, assignmentId: a.id, authorId: "s2", role: "student", text: "هل يمكن تسليم العمل كصورة؟", at: ago(500) });
    comments.push({ id: `cmt${ai}`, assignmentId: a.id, authorId: classes.find((c) => c.id === a.classId)!.teacherId, role: "teacher", text: "نعم، صورة واضحة أو ملف PDF.", at: ago(450) });
  });

  return {
    students, teachers: TEACHERS, classes, announcements, discussions, assignments, submissions, comments,
    progress, wrong, attempts, extraQuestions: {}, session: null,
  };
}
