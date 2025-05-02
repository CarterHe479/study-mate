import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }  // 👈 params is a Promise
  ): Promise<NextResponse> {
    const { id } = await params;

  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.redirect("/api/auth/signin");
  }


  await prisma.note.delete({
    where: {
      id,
      user: { email: session.user.email! },
    },
  });

  return NextResponse.json({ success: true });
}
