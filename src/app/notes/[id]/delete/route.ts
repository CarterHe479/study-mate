import { NextRequest, NextResponse, type RouteHandlerContext } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest, context: RouteHandlerContext) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.redirect("/api/auth/signin");
  }

  const { id } = context.params;

  await prisma.note.delete({
    where: {
      id,
      user: { email: session.user.email! },
    },
  });

  return NextResponse.redirect(new URL("/", req.url));
}
