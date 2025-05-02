import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
// import { getServerSession } from "next-auth";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }   // 👈 关键：params 是 Promise
): Promise<NextResponse> {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.redirect("/api/auth/signin");
  }

  const { id } = await params;               // 必须 await

  const formData = await req.formData();
  const title   = formData.get("title")  as string;
  const content = formData.get("content") as string;
  const tags    = formData.get("tags")    as string;

  if (!title || !content) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  await prisma.note.update({
    where: { id },
    data: { title, content, tags },
  });

  // 编辑完成跳回首页（或改成详情页也行）
  return NextResponse.redirect(new URL("/", req.url));
}
