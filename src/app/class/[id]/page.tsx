import { classParams } from "@/lib/params";
import Hub from "./hub";

export function generateStaticParams() {
  return classParams();
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <Hub id={id} />;
}
