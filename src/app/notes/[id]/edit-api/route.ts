import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.redirect("/api/auth/signin");
  }

  const formData = await req.formData();
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const tagsRaw = formData.get("tags") as string;

  if (!title || !content) {
    return NextResponse.json(
      { error: "Missing title or content" },
      { status: 400 }
    );
  }

  // 检查权限：确认当前用户是否有权限编辑
  const note = await prisma.note.findUnique({
    where: { id: params.id },
  });

  if (!note || note.userId !== session.user.id) {
    return NextResponse.json(
      { error: "Not authorized or note not found" },
      { status: 403 }
    );
  }

  // 更新笔记
  await prisma.note.update({
    where: { id: params.id },
    data: {
      title,
      content,
      tags: tagsRaw ?? "",
    },
  });

  // 编辑完成后重定向到该笔记详情页
  return NextResponse.redirect(new URL(`/notes/${params.id}`, req.url));
}
