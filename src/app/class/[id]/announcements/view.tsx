"use client";

import { AnnouncementFeed } from "@/components/Chat";
import { PageBar } from "@/components/ui";

export default function View({ id }: { id: string }) {
  return (
    <div className="space-y-4">
      <PageBar title="الإعلانات" back={`/class/${id}`} />
      <AnnouncementFeed classId={id} canPost={false} />
    </div>
  );
}
