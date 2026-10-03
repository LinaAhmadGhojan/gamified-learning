"use client";

import { DiscussionFeed } from "@/components/Chat";
import { PageBar } from "@/components/ui";
import { useMe } from "@/lib/store";

export default function View({ id }: { id: string }) {
  const { student } = useMe();
  if (!student) return null;
  return (
    <div className="space-y-4">
      <PageBar title="النقاشات" back={`/class/${id}`} />
      <DiscussionFeed classId={id} me={{ id: student.id, role: "student" }} />
    </div>
  );
}
