import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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

  await prisma.note.create({
    data: {
      title,
      content,
      tags: tagsRaw ?? "",  // ✅ 存入 tags 字符串
      user: { connect: { email: session.user.email! } },
    },
  });
  

  return NextResponse.redirect(new URL("/", req.url));
}

