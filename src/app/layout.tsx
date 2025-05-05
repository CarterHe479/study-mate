// src/app/layout.tsx  ← 彻底删除 "use client"

import { ReactNode } from "react";
import MotionWrapper from "@/components/MotionWrapper";
import { Inter } from "next/font/google";
import type { Metadata } from "next";

const inter = Inter({ subsets: ["latin"] });

// ✅ 仍然可以导出 metadata
export const metadata: Metadata = {
  title: "Study‑Mate",
  description: "Notes with motion ✨",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        {/* ➜ 用客户端包装器包住 children */}
        <MotionWrapper>{children}</MotionWrapper>
      </body>
    </html>
  );
}
