import { topicParams } from "@/lib/params";
import Player from "./player";

export function generateStaticParams() {
  return topicParams();
}

export default async function Page({ params }: { params: Promise<{ topic: string }> }) {
  const { topic } = await params;
  return <Player topicId={topic} />;
}
