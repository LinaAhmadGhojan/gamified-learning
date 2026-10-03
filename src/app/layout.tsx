import type { Metadata, Viewport } from "next";
import { Baloo_Bhaijaan_2 } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/lib/store";
import ShellRouter from "@/components/ShellRouter";
import Toasts from "@/components/Toasts";

const baloo = Baloo_Bhaijaan_2({ variable: "--font-baloo", subsets: ["arabic", "latin"], weight: ["400", "500", "600", "700", "800"] });

export const metadata: Metadata = {
  title: "يلا نتعلّم - منصة تعلّم تفاعلية",
  description: "منصة تعلّم عربية بأسلوب الألعاب: دروس قصيرة، اختبارات سريعة، نقاط وشارات، وواجبات ونقاشات بين الطلاب والمعلمين.",
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#ffb800" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ar" dir="rtl" className={`${baloo.variable} h-full antialiased`}>
      <body className="min-h-full font-sans">
        <StoreProvider>
          <ShellRouter>{children}</ShellRouter>
          <Toasts />
        </StoreProvider>
      </body>
    </html>
  );
}
