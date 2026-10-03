import { levelParams } from "@/lib/params";
import View from "./view";

export function generateStaticParams() {
  return levelParams();
}

export default async function Page({ params }: { params: Promise<{ id: string; level: string }> }) {
  const { id, level } = await params;
  return <View id={id} levelId={level} />;
}
