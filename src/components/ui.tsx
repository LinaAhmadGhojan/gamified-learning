"use client";

import { ArrowRight, MoreVertical, X } from "lucide-react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";

const btn = {
  primary: "bg-honey-600 text-white border-honey-800",
  white: "bg-white text-honey-700 border-honey-300 ring-1 ring-honey-300",
  green: "bg-leaf-500 text-white border-leaf-600",
  red: "bg-berry-500 text-white border-berry-600",
  dark: "bg-honey-900 text-white border-black/40",
  soft: "bg-honey-100 text-honey-800 border-honey-300",
};

/** The chunky button from the design: flat colour with a darker "thickness" under it. */
export function Btn3D({
  children, variant = "primary", size = "md", icon: Icon, className = "", ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: keyof typeof btn; size?: "sm" | "md" | "lg"; icon?: LucideIcon }) {
  const sz = size === "sm" ? "px-4 py-2 text-base border-b-[3px]" : size === "lg" ? "px-8 py-4 text-xl border-b-[5px]" : "px-6 py-3 text-lg border-b-4";
  return (
    <button
      {...rest}
      className={`btn3d inline-flex items-center justify-center gap-2 rounded-2xl font-bold tracking-wide disabled:cursor-not-allowed disabled:opacity-50 ${sz} ${btn[variant]} ${className}`}
    >
      {Icon && <Icon className="h-5 w-5" />}
      {children}
    </button>
  );
}

export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <section className={`rounded-3xl bg-white p-5 shadow-[0_2px_0_rgba(138,90,0,.12)] ring-1 ring-honey-100 ${className}`}>{children}</section>;
}

/** Yellow header bar (back arrow, title, menu) used by every inner page. */
export function PageBar({ title, back, right }: { title: string; back?: string; right?: React.ReactNode }) {
  return (
    <header className="sticky top-0 z-30 bg-honey-500 text-white shadow-[0_3px_0_rgba(138,90,0,.2)] lg:static lg:rounded-3xl">
      <div className="flex items-center gap-3 px-4 py-3.5">
        {back ? (
          <Link href={back} aria-label="رجوع" className="flex h-10 w-10 items-center justify-center rounded-xl hover:bg-white/20">
            <ArrowRight className="h-7 w-7" strokeWidth={3} />
          </Link>
        ) : (
          <span className="w-10" />
        )}
        <h1 className="flex-1 truncate text-center text-xl font-extrabold tracking-wide sm:text-2xl">{title}</h1>
        {right ?? <span className="flex h-10 w-10 items-center justify-center"><MoreVertical className="h-6 w-6 opacity-70" /></span>}
      </div>
    </header>
  );
}

export function Pill({ children, tone = "honey", className = "" }: { children: React.ReactNode; tone?: "honey" | "green" | "red" | "blue" | "gray"; className?: string }) {
  const t = {
    honey: "bg-honey-100 text-honey-800",
    green: "bg-leaf-100 text-leaf-600",
    red: "bg-berry-100 text-berry-600",
    blue: "bg-sky-100 text-sky-700",
    gray: "bg-stone-100 text-stone-600",
  }[tone];
  return <span className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full px-3 py-1 text-sm font-bold ${t} ${className}`}>{children}</span>;
}

export function ProgressBar({ pct, color = "bg-leaf-500", height = "h-3" }: { pct: number; color?: string; height?: string }) {
  return (
    <div className={`w-full overflow-hidden rounded-full bg-black/10 ${height}`}>
      <div className={`h-full rounded-full transition-all duration-500 ${color}`} style={{ width: `${Math.max(0, Math.min(100, pct))}%` }} />
    </div>
  );
}

export function Ring({ pct, size = 64, stroke = 8, color = "#58cc02", children }: { pct: number; size?: number; stroke?: number; color?: string; children?: React.ReactNode }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(0,0,0,.08)" strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - Math.min(1, pct / 100))} className="transition-all duration-700" />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-center">{children}</div>
    </div>
  );
}

export function Avatar({ emoji, size = 44, bg = "#ffe9a8" }: { emoji: string; size?: number; bg?: string }) {
  return (
    <span className="inline-flex shrink-0 items-center justify-center rounded-full ring-2 ring-white" style={{ width: size, height: size, background: bg, fontSize: size * 0.55 }} aria-hidden>
      {emoji}
    </span>
  );
}

export function Modal({ title, onClose, children, wide }: { title: string; onClose: () => void; children: React.ReactNode; wide?: boolean }) {
  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-honey-900/50 backdrop-blur-sm sm:items-center sm:p-4" onClick={onClose}>
      <div className={`slide-up max-h-[92vh] w-full overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl ${wide ? "max-w-2xl" : "max-w-md"}`} onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-honey-100 bg-white/95 px-6 py-4 backdrop-blur">
          <h2 className="text-xl font-extrabold text-honey-900">{title}</h2>
          <button onClick={onClose} aria-label="إغلاق" className="rounded-xl p-1.5 text-honey-700 hover:bg-honey-50"><X className="h-6 w-6" /></button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

export const inputCls =
  "w-full rounded-2xl border-2 border-honey-100 bg-honey-50/50 px-4 py-3 text-base text-ink outline-none transition placeholder:text-honey-700/50 focus:border-honey-400 focus:bg-white";

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-base font-bold text-honey-900">{label}</span>
      {children}
    </label>
  );
}

export function Empty({ emoji, text }: { emoji: string; text: string }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-3xl border-2 border-dashed border-honey-200 py-10 text-center text-base text-honey-700/70">
      <span className="text-5xl">{emoji}</span>
      {text}
    </div>
  );
}
