import TeacherShell from "@/components/TeacherShell";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <TeacherShell>{children}</TeacherShell>;
}
