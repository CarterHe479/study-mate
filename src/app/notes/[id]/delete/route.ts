import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest, context: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.redirect("/api/auth/signin");
  }

  const { id } = context.params;  // ✅ 注意这里不需要 await 了

  await prisma.note.delete({
    where: {
      id,
      user: { email: session.user.email! },
    },
  });

  return NextResponse.redirect(new URL("/", req.url));
}
