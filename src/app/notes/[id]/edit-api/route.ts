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

  const formData = await req.formData();
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const tags = formData.get("tags") as string;

  if (!title || !content) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  await prisma.note.update({
    where: { id },
    data: { title, content, tags },
  });

  return NextResponse.redirect(new URL("/", req.url));
}
