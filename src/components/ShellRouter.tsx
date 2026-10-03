"use client";

import { usePathname } from "next/navigation";
import StudentShell from "./StudentShell";

/** Picks the right chrome: none for the welcome screen, teacher routes bring their own, everything else is the student app. */
export default function ShellRouter({ children }: { children: React.ReactNode }) {
  const path = usePathname().replace(/\/$/, "") || "/";
  if (path === "/" || path.startsWith("/teacher")) return <>{children}</>;
  return <StudentShell>{children}</StudentShell>;
}
