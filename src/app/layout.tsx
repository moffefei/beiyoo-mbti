import type { Metadata } from "next";
import "./globals.css";
import DebugPanel from "@/components/DebugPanel";

export const metadata: Metadata = {
  title: "Beiyoo MBTI 人格测试",
  description: "发现你的真实人格类型，分享给你的朋友！",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">
        {children}
        <DebugPanel />
      </body>
    </html>
  );
}
