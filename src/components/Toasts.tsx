"use client";

import { useStore } from "@/lib/store";

export default function Toasts() {
  const { toasts } = useStore();
  return (
    <div className="pointer-events-none fixed inset-x-0 top-16 z-[100] flex flex-col items-center gap-2 px-4">
      {toasts.map((t) => (
        <div key={t.id} className="pop pointer-events-auto rounded-2xl bg-honey-900 px-5 py-3 text-base font-semibold text-white shadow-xl">
          {t.text}
        </div>
      ))}
    </div>
  );
}
