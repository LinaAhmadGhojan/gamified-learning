<div align="center">

# 🐯 يلا نتعلّم · Yalla Neta'allam

### منصة تعلّم عربية بأسلوب الألعاب: دروس قصيرة، اختبارات سريعة، نقاط وشارات

A **gamified learning platform in Arabic (RTL)** for schools: bite-size lessons, instant quizzes, XP, streaks and badges for students, plus a full dashboard for teachers. One codebase, designed **mobile-first** and scaled up to a web experience.

![Next.js](https://img.shields.io/badge/Next.js-App_Router-black?logo=nextdotjs)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178c6?logo=typescript&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-4-38bdf8?logo=tailwindcss&logoColor=white)
![Arabic](https://img.shields.io/badge/Arabic-RTL-ffb800)

<p align="center">
  <img src="docs/screenshots/student-mobile/01-welcome.jpg" width="23%" alt="Welcome screen with the tiger mascot" />
  <img src="docs/screenshots/student-mobile/04-home.jpg" width="23%" alt="Student learning space" />
  <img src="docs/screenshots/student-mobile/13-lesson-slide-1.jpg" width="23%" alt="A lesson slide" />
  <img src="docs/screenshots/student-mobile/16-quiz-correct.jpg" width="23%" alt="Quiz with instant feedback" />
</p>

</div>

---

## 💡 The idea

Students drop out of study apps because they feel like homework. This platform borrows what makes games sticky: short sessions, instant feedback, visible progress and a friendly mascot (**نمّور**, the tiger). Teachers get what they actually need: who is stuck, which lesson is too hard, and what is waiting to be graded.

## 🎮 For students

| | |
|---|---|
| **Learning space** | One card per subject with progress, last activity and a daily goal ring |
| **Class hub** | Announcements, discussions, quick learn and assignments in four big buttons, plus a quick "ask the class" box |
| **Quick learn** | Subjects → levels → topics. Levels unlock when the previous one is finished |
| **Lesson player** | Illustrated slides, then a quiz with **3 lives**, instant feedback ("ممتاز!" or the correct answer) and a result screen with stars |
| **Question types** | Multiple choice (options shuffled every attempt), true/false, typed answers (Arabic digits and diacritics are normalised) |
| **Gamification** | XP, levels with titles, daily goal, streaks, 3-star ratings, 8 badges, weekly and all-time leaderboard |
| **Assignments** | Description, PDF attachment, comments thread, add work (text and file), mark as done, see score and feedback |
| **Chat-style channels** | Teacher announcements (WhatsApp look) and a Q&A discussion where teachers approve the best answer |

### 📚 Content: 6 subjects, 38 topics, 110+ questions

الرياضيات (الهندسة والقياس) · العلوم (الكائنات الحية والمادة والطاقة) · اللغة العربية (النحو والإملاء) · اللغة الإنجليزية (المفردات والقواعد) · التربية الإسلامية (العقيدة والعبادات والأخلاق) · الاجتماعيات (الوطن العربي والخرائط)

Geometry lessons include **generated SVG diagrams** (angles drawn from their degree value, triangles, quadrilaterals, parallel and perpendicular lines), so one question template covers any angle.

## 👩‍🏫 For teachers

A separate role with its own layout. Everything a student does appears here live (open two browsers to see it).

| | |
|---|---|
| **Overview** | Students, average completion, submissions waiting, active today; weekly activity chart; students who need attention (idle for 3+ days) |
| **Class page** | Student table, assignments with submission stats, announcements, discussions and performance per lesson |
| **Smart insight** | Per lesson: completion, accuracy, and the **hardest question** ("38% got this wrong") so you know what to re-teach |
| **Assignments** | Create with deadline, points and attachment; open a submission, write a grade and feedback |
| **Content** | Browse every slide and question; **add your own questions** that appear in students' quizzes immediately |
| **Reports** | Class averages, hardest lessons, most active students, CSV export |

## 🖼️ Every screen

All screenshots come from the real app (static build) with the seeded demo data.

### 📱 Student · mobile

#### 1. Getting in

<table><tr>
<td align="center" valign="top" width="33%"><img src="docs/screenshots/student-mobile/01-welcome.jpg" width="90%" alt="Welcome"><br><sub>Welcome</sub></td>
<td align="center" valign="top" width="33%"><img src="docs/screenshots/student-mobile/02-login-chooser.jpg" width="90%" alt="Choose an account"><br><sub>Choose an account</sub></td>
<td align="center" valign="top" width="33%"><img src="docs/screenshots/student-mobile/03-signup.jpg" width="90%" alt="New account"><br><sub>New account</sub></td>
</tr></table>

#### 2. Learning space and class hub

<table><tr>
<td align="center" valign="top" width="20%"><img src="docs/screenshots/student-mobile/04-home.jpg" width="95%" alt="Learning space"><br><sub>Learning space</sub></td>
<td align="center" valign="top" width="20%"><img src="docs/screenshots/student-mobile/05-home-full.jpg" width="95%" alt="Full page"><br><sub>Full page</sub></td>
<td align="center" valign="top" width="20%"><img src="docs/screenshots/student-mobile/06-class-hub.jpg" width="95%" alt="Class hub"><br><sub>Class hub</sub></td>
<td align="center" valign="top" width="20%"><img src="docs/screenshots/student-mobile/07-class-hub-full.jpg" width="95%" alt="Hub, full page"><br><sub>Hub, full page</sub></td>
<td align="center" valign="top" width="20%"><img src="docs/screenshots/student-mobile/08-class-hub-arabic.jpg" width="95%" alt="Another subject"><br><sub>Another subject</sub></td>
</tr></table>

#### 3. Announcements and discussions

<table><tr>
<td align="center" valign="top" width="50%"><img src="docs/screenshots/student-mobile/09-announcements.jpg" width="55%" alt="Announcements (teacher → class)"><br><sub>Announcements (teacher → class)</sub></td>
<td align="center" valign="top" width="50%"><img src="docs/screenshots/student-mobile/10-discussions.jpg" width="55%" alt="Q&A with an approved answer"><br><sub>Q&A with an approved answer</sub></td>
</tr></table>

#### 4. Quick learn: levels and topics

<table><tr>
<td align="center" valign="top" width="33%"><img src="docs/screenshots/student-mobile/11-levels-locked.jpg" width="85%" alt="Levels (the next one is locked)"><br><sub>Levels (the next one is locked)</sub></td>
<td align="center" valign="top" width="33%"><img src="docs/screenshots/student-mobile/12-topics.jpg" width="85%" alt="Topics with progress"><br><sub>Topics with progress</sub></td>
<td align="center" valign="top" width="33%"><img src="docs/screenshots/student-mobile/19-topics-after-lesson.jpg" width="85%" alt="After a lesson: stars"><br><sub>After a lesson: stars</sub></td>
</tr></table>

#### 5. The lesson player

<table><tr>
<td align="center" valign="top" width="33%"><img src="docs/screenshots/student-mobile/13-lesson-slide-1.jpg" width="85%" alt="Slide with a generated diagram"><br><sub>Slide with a generated diagram</sub></td>
<td align="center" valign="top" width="33%"><img src="docs/screenshots/student-mobile/14-lesson-slide-2.jpg" width="85%" alt="Next slide"><br><sub>Next slide</sub></td>
<td align="center" valign="top" width="33%"><img src="docs/screenshots/student-mobile/15-quiz-multiple-choice.jpg" width="85%" alt="Quiz: multiple choice"><br><sub>Quiz: multiple choice</sub></td>
</tr></table>

<table><tr>
<td align="center" valign="top" width="33%"><img src="docs/screenshots/student-mobile/16-quiz-correct.jpg" width="85%" alt="Instant feedback"><br><sub>Instant feedback</sub></td>
<td align="center" valign="top" width="33%"><img src="docs/screenshots/student-mobile/17-quiz-typed-answer.jpg" width="85%" alt="Quiz: typed answer"><br><sub>Quiz: typed answer</sub></td>
<td align="center" valign="top" width="33%"><img src="docs/screenshots/student-mobile/18-lesson-result.jpg" width="85%" alt="Result: stars, XP, streak"><br><sub>Result: stars, XP, streak</sub></td>
</tr></table>

#### 6. Mistakes and lives

<table><tr>
<td align="center" valign="top" width="33%"><img src="docs/screenshots/student-mobile/20-quiz-wrong.jpg" width="85%" alt="Wrong answer shows the right one"><br><sub>Wrong answer shows the right one</sub></td>
<td align="center" valign="top" width="33%"><img src="docs/screenshots/student-mobile/21-quiz-true-false.jpg" width="85%" alt="True / false question"><br><sub>True / false question</sub></td>
<td align="center" valign="top" width="33%"><img src="docs/screenshots/student-mobile/22-lives-finished.jpg" width="85%" alt="Out of lives: review and retry"><br><sub>Out of lives: review and retry</sub></td>
</tr></table>

#### 7. Assignments

<table><tr>
<td align="center" valign="top" width="20%"><img src="docs/screenshots/student-mobile/23-assignments-list.jpg" width="95%" alt="Assignments"><br><sub>Assignments</sub></td>
<td align="center" valign="top" width="20%"><img src="docs/screenshots/student-mobile/24-assignment-detail.jpg" width="95%" alt="Assignment details"><br><sub>Assignment details</sub></td>
<td align="center" valign="top" width="20%"><img src="docs/screenshots/student-mobile/25-assignment-comments.jpg" width="95%" alt="Comments thread"><br><sub>Comments thread</sub></td>
<td align="center" valign="top" width="20%"><img src="docs/screenshots/student-mobile/26-add-work.jpg" width="95%" alt="Add work"><br><sub>Add work</sub></td>
<td align="center" valign="top" width="20%"><img src="docs/screenshots/student-mobile/27-assignment-submitted.jpg" width="95%" alt="Submitted"><br><sub>Submitted</sub></td>
</tr></table>

#### 8. Ranking and profile

<table><tr>
<td align="center" valign="top" width="50%"><img src="docs/screenshots/student-mobile/28-ranking.jpg" width="45%" alt="Weekly leaderboard"><br><sub>Weekly leaderboard</sub></td>
<td align="center" valign="top" width="50%"><img src="docs/screenshots/student-mobile/29-profile-full.jpg" width="45%" alt="Profile: XP, week activity, badges, subjects"><br><sub>Profile: XP, week activity, badges, subjects</sub></td>
</tr></table>

### 💻 Student · web

The same screens re-laid out for a laptop: side navigation with stats and daily goal, multi-column grids, split views.

**Welcome**

<img src="docs/screenshots/student-web/01-welcome.jpg" alt="Welcome" width="100%">

**Choose an account**

<img src="docs/screenshots/student-web/02-login-chooser.jpg" alt="Choose an account" width="100%">

**Learning space**

<img src="docs/screenshots/student-web/03-home.jpg" alt="Learning space" width="100%">

**Class hub**

<img src="docs/screenshots/student-web/04-class-hub.jpg" alt="Class hub" width="100%">

**Announcements**

<img src="docs/screenshots/student-web/05-announcements.jpg" alt="Announcements" width="100%">

**Discussions**

<img src="docs/screenshots/student-web/06-discussions.jpg" alt="Discussions" width="100%">

**Levels**

<img src="docs/screenshots/student-web/07-levels.jpg" alt="Levels" width="100%">

**Topics**

<img src="docs/screenshots/student-web/08-topics.jpg" alt="Topics" width="100%">

**Lesson slide**

<img src="docs/screenshots/student-web/09-lesson-slide.jpg" alt="Lesson slide" width="100%">

**Lesson slide with a formula**

<img src="docs/screenshots/student-web/10-lesson-slide-2.jpg" alt="Lesson slide with a formula" width="100%">

**Quiz**

<img src="docs/screenshots/student-web/11-quiz.jpg" alt="Quiz" width="100%">

**Feedback**

<img src="docs/screenshots/student-web/12-quiz-correct.jpg" alt="Feedback" width="100%">

**Typed answer**

<img src="docs/screenshots/student-web/13-quiz-typed.jpg" alt="Typed answer" width="100%">

**Result**

<img src="docs/screenshots/student-web/14-lesson-result.jpg" alt="Result" width="100%">

**Assignments, split view**

<img src="docs/screenshots/student-web/15-assignments.jpg" alt="Assignments, split view" width="100%">

**Leaderboard**

<img src="docs/screenshots/student-web/16-ranking.jpg" alt="Leaderboard" width="100%">

**Profile**

<img src="docs/screenshots/student-web/17-profile.jpg" alt="Profile" width="100%">

### 👩‍🏫 Teacher · web

**Sign in**: Pick a teacher account.

<img src="docs/screenshots/teacher-web/01-login-chooser.jpg" alt="Sign in" width="100%">

**Overview**: KPIs, weekly activity, students who need attention, classes and submissions waiting for grading.

<img src="docs/screenshots/teacher-web/02-overview.jpg" alt="Overview" width="100%">

**Class · students**: Level, completion, accuracy, streak and last activity per student.

<img src="docs/screenshots/teacher-web/03-class-students.jpg" alt="Class · students" width="100%">

**Class · assignments**: Submission and grading progress for each assignment.

<img src="docs/screenshots/teacher-web/04-class-assignments.jpg" alt="Class · assignments" width="100%">

**Class · announcements**: Post to the whole class.

<img src="docs/screenshots/teacher-web/05-class-announcements.jpg" alt="Class · announcements" width="100%">

**Class · discussions**: Answer questions and approve the best reply.

<img src="docs/screenshots/teacher-web/06-class-discussions.jpg" alt="Class · discussions" width="100%">

**Class · performance**: Completion and accuracy per lesson, plus the hardest question.

<img src="docs/screenshots/teacher-web/07-class-performance.jpg" alt="Class · performance" width="100%">

**Grading**: Open a submission, write a score and feedback.

<img src="docs/screenshots/teacher-web/08-grading.jpg" alt="Grading" width="100%">

**New assignment**: Class, title, description, points, deadline and attachment.

<img src="docs/screenshots/teacher-web/09-create-assignment.jpg" alt="New assignment" width="100%">

**Content library**: Every slide and question of a lesson.

<img src="docs/screenshots/teacher-web/10-content-library.jpg" alt="Content library" width="100%">

**Add a question**: Multiple choice, true/false or typed; it shows up in students' quizzes at once.

<img src="docs/screenshots/teacher-web/11-add-question.jpg" alt="Add a question" width="100%">

**Reports**: Class averages, hardest lessons, most active students, CSV export.

<img src="docs/screenshots/teacher-web/12-reports.jpg" alt="Reports" width="100%">

### 📱 Teacher · mobile

The dashboard collapses into a drawer menu on a phone.

<table><tr>
<td align="center" valign="top" width="20%"><img src="docs/screenshots/teacher-mobile/01-overview.jpg" width="95%" alt="Overview"><br><sub>Overview</sub></td>
<td align="center" valign="top" width="20%"><img src="docs/screenshots/teacher-mobile/02-menu.jpg" width="95%" alt="Menu"><br><sub>Menu</sub></td>
<td align="center" valign="top" width="20%"><img src="docs/screenshots/teacher-mobile/03-class.jpg" width="95%" alt="Class page"><br><sub>Class page</sub></td>
<td align="center" valign="top" width="20%"><img src="docs/screenshots/teacher-mobile/04-assignments.jpg" width="95%" alt="Assignments"><br><sub>Assignments</sub></td>
<td align="center" valign="top" width="20%"><img src="docs/screenshots/teacher-mobile/05-reports.jpg" width="95%" alt="Reports"><br><sub>Reports</sub></td>
</tr></table>


## ⚙️ How the game mechanics work

- **XP per lesson:** `10 + 5 × correct answers + 10 bonus for 3 stars`; repeating a lesson gives 40%.
- **Stars:** 3 = all correct with no lives lost, 2 = at least 70% correct, 1 = finished.
- **Level:** every 120 XP, with titles (مستكشف، متعلّم، مجتهد، متفوّق، نابغة، أسطورة).
- **Streak:** increases when you learn on consecutive days and resets after a missed day.
- **Badges:** first lesson, 3 and 7-day streaks, 100 and 500 XP, perfect score, 10 lessons, master a whole subject.
- **Lives:** 3 per quiz attempt; losing all of them ends the attempt and you review and retry.

## 🛠️ Tech and decisions

| | |
|---|---|
| Framework | Next.js (App Router), TypeScript, static export |
| Styling | Tailwind CSS 4, lucide-react, **Baloo Bhaijaan 2** (rounded Arabic font) |
| RTL | `dir="rtl"` at the root with logical properties (`ps-`, `start-`, `ms-`) so layouts mirror correctly |
| Mascot and diagrams | Pure SVG components (mood variants: happy, cheering, sad, thinking), no image assets |
| State | React context persisted in `localStorage`, with the `storage` event syncing tabs live |
| Routing | Dynamic routes (`/class/[id]`, `/lesson/[topic]`, ...) pre-rendered with `generateStaticParams` |

```
src/
├─ app/            welcome, home, class/[id]/..., lesson/[topic], ranking, profile, teacher/...
├─ components/     Mascot, Visuals (SVG diagrams), Chat, StudentShell, TeacherShell, UI kit
└─ lib/
   ├─ content/     the 6 subjects (slides + questions), easy to extend
   ├─ gamify.ts    XP, levels, badges, streak and date helpers
   ├─ analytics.ts completion, accuracy and "hardest question" calculations
   └─ store.tsx    state and actions
```

### Add a lesson

Content is plain data. Add a topic to a subject file in `src/lib/content/` with the `slide(...)` and `mcq / tf / input(...)` helpers, and it appears everywhere (levels, progress, teacher analytics).

## ▶️ Run it

```bash
npm install
npm run dev        # http://localhost:3000
```

Log in with any ready-made student or teacher account (no password in the demo). Open the student and teacher views in two different browsers to see submissions and grades flow between them.

Static export for any hosting:

```bash
npm run build      # outputs ./out
# sub-folder:  NEXT_PUBLIC_BASE_PATH=/gamified-learning npm run build
```

## 🚧 Honest limitations and next steps

- **Data lives in the browser.** Live sync works between tabs of one browser, not across devices. A real deployment needs a backend (PostgreSQL + Prisma) and WebSockets for chat.
- **No real authentication**; the login screen picks a demo account.
- **File uploads are simulated** (the file name is stored, not the file).
- **Arabic only** for now (lesson text included); an English UI would need a translated content set.
- **Next:** voice questions and Arabic text-to-speech for younger students, spaced repetition for wrong answers, parent view, push notifications for deadlines, and automated tests (Playwright).
