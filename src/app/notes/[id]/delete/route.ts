import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request, context: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.redirect("/api/auth/signin");
  }

  const { id } = await context.params;

  await prisma.note.delete({
    where: {
      id,
      user: { email: session.user.email! },
    },
  });

  // ✅ 删除完成后重定向到首页
  return NextResponse.redirect(new URL("/", req.url));
}
