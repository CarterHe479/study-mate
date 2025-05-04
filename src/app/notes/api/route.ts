import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// 简单的敏感词列表
const sensitiveWords = ["badword", "inappropriate", "spam", "广告"];

function checkContentSafety(content: string): boolean {
  const lowerContent = content.toLowerCase();
  return sensitiveWords.some((word) => lowerContent.includes(word));
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.redirect("/api/auth/signin");
  }

  const formData = await req.formData();
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const tagsRaw = formData.get("tags") as string;

  if (!title || !content) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  // 🛡️ 内容审核
  const hasSensitiveContent = checkContentSafety(title) || checkContentSafety(content);

  const status = hasSensitiveContent ? "rejected" : "approved";

  await prisma.note.create({
    data: {
      title,
      content,
      tags: tagsRaw ?? "",
      user: { connect: { email: session.user.email! } },
      status,  // ✅ 存储审核状态
    },
  });

  return NextResponse.redirect(new URL("/", req.url));
}
