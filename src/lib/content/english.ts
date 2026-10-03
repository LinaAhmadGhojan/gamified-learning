import type { Subject } from "../types";
import { emoji, formula, input, mcq, slide, tf } from "./helpers";

export const english: Subject = {
  id: "english",
  name: "اللغة الإنجليزية",
  emoji: "🔤",
  from: "#64b5f6",
  to: "#1e66d0",
  levels: [
    {
      id: "english-1",
      title: "المستوى ١: المفردات",
      topics: [
        {
          id: "en-animals", title: "Animals · الحيوانات", emoji: "🐾",
          slides: [
            slide("حيوانات أليفة", "cat = قطة · dog = كلب · bird = عصفور · fish = سمكة. نقول: I have a cat.", emoji("🐱🐶🐦🐟")),
            slide("حيوانات المزرعة", "cow = بقرة · sheep = خروف · horse = حصان · chicken = دجاجة.", emoji("🐄🐑🐴🐔")),
          ],
          questions: [
            mcq("What is «كلب» in English?", ["cat", "dog", "bird", "fish"], 1),
            mcq("🐄 = ?", ["horse", "sheep", "cow", "chicken"], 2),
            input("اكتب بالإنجليزية: قطة", ["cat", "a cat"], "ثلاثة أحرف."),
          ],
        },
        {
          id: "en-colors", title: "Colors & Numbers · الألوان والأرقام", emoji: "🎨",
          slides: [
            slide("الألوان", "red = أحمر · blue = أزرق · green = أخضر · yellow = أصفر · black = أسود · white = أبيض.", emoji("🔴🔵🟢🟡")),
            slide("الأرقام", "one 1 · two 2 · three 3 · four 4 · five 5 · six 6 · seven 7 · eight 8 · nine 9 · ten 10.", formula("1 2 3 4 5 6 7 8 9 10")),
          ],
          questions: [
            mcq("What color is the sun? ☀️", ["blue", "yellow", "green", "black"], 1),
            mcq("«seven» means:", ["٦", "٧", "٨", "٩"], 1),
            input("Write the number 5 in English:", ["five"], "f _ _ e"),
          ],
        },
        {
          id: "en-family", title: "Family · العائلة", emoji: "👨‍👩‍👧",
          slides: [
            slide("أفراد العائلة", "father = أب · mother = أم · brother = أخ · sister = أخت · grandfather = جد · grandmother = جدة.", emoji("👨‍👩‍👧‍👦")),
            slide("جمل بسيطة", "This is my mother. He is my brother. She is my sister.", formula("This is my ...")),
          ],
          questions: [
            mcq("«أخت» بالإنجليزية:", ["brother", "sister", "mother", "father"], 1),
            mcq("This is my ____ (جدّتي).", ["grandfather", "grandmother", "sister", "brother"], 1),
            tf("«father» تعني أمّ.", false, "father = أب، mother = أم."),
          ],
        },
      ],
    },
    {
      id: "english-2",
      title: "المستوى ٢: القواعد",
      topics: [
        {
          id: "en-present", title: "Present Simple · المضارع البسيط", emoji: "⏱️",
          slides: [
            slide("للعادات والحقائق", "نستخدمه للأشياء المتكررة: I play football. They live in Amman. للمفرد الغائب نضيف s: He plays. She likes.", formula("He / She / It + verb + s")),
            slide("النفي", "نستخدم do not / does not: I do not like tea. She does not play.", formula("does not + verb")),
          ],
          questions: [
            mcq("She ____ to school every day.", ["go", "goes", "going", "gone"], 1),
            mcq("They ____ football on Fridays.", ["plays", "play", "playing", "played"], 1),
            mcq("He ____ not like milk.", ["do", "does", "is", "are"], 1),
          ],
        },
        {
          id: "en-plurals", title: "Plurals · الجمع", emoji: "📚",
          slides: [
            slide("القاعدة العامة", "نضيف s: book → books. وإن انتهت بـ s أو sh أو ch نضيف es: box → boxes, watch → watches.", formula("book → books")),
            slide("جموع شاذة", "child → children · man → men · woman → women · foot → feet · mouse → mice.", emoji("🧒🧒")),
          ],
          questions: [
            mcq("Plural of «box»:", ["boxs", "boxes", "boxies", "box"], 1),
            mcq("Plural of «child»:", ["childs", "childes", "children", "childrens"], 2),
            input("Plural of «man»:", ["men"], "أحرف قليلة وشاذّة."),
          ],
        },
        {
          id: "en-questions", title: "Questions · الأسئلة", emoji: "❓",
          slides: [
            slide("أدوات الاستفهام", "What = ماذا · Where = أين · When = متى · Who = من · Why = لماذا · How = كيف.", formula("Wh- questions")),
            slide("أمثلة", "What is your name? Where do you live? How old are you?", emoji("💬")),
          ],
          questions: [
            mcq("____ do you live? (أين تعيش؟)", ["Who", "Where", "Why", "When"], 1),
            mcq("«Why» means:", ["كيف", "متى", "لماذا", "من"], 2),
            mcq("____ is your name?", ["What", "Where", "How", "When"], 0),
          ],
        },
      ],
    },
  ],
};
