import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * 删除指定 id 的笔记
 * 动态参数通过 Promise 形式提供 (Next.js 15 要求)
 */
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  // 1️⃣ 解析动态参数
  const { id } = await params;

  // 2️⃣ 如果你需要鉴权，请恢复 getServerSession 检查
  // const session = await getServerSession(authOptions);
  // if (!session || !session.user) {
  //   return NextResponse.redirect("/api/auth/signin");
  // }

  // 3️⃣ 删除笔记
  await prisma.note.delete({
    where: { id /* userId: session?.user.id 也可一并校验 */ },
  });

  // 4️⃣ 删除成功后跳回首页（或返回 JSON 都可）
  return NextResponse.redirect(new URL("/", _req.url));
  // 若想返回 JSON →   return NextResponse.json({ success: true });
}
