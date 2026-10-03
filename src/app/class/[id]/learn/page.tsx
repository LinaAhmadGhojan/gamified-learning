import { classParams } from "@/lib/params";
import View from "./view";

export function generateStaticParams() {
  return classParams();
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <View id={id} />;
}
