import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {

  const { id } = await params;
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.redirect("/api/auth/signin");
  }

  // 找到这条笔记
  const note = await prisma.note.findUnique({
    where: { id },
  });

  // 权限校验
  if (!note || note.userId !== session.user.id) {
    return NextResponse.json(
      { error: "Not authorized or note not found." },
      { status: 403 }
    );
  }

  // 删除笔记
  await prisma.note.delete({
    where: { id },
  });

  return NextResponse.redirect(new URL("/", req.url));
}
