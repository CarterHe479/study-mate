"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma"; // 取决于你的 prisma 初始化位置

export async function deleteTodo(formData: FormData) {
  const id = formData.get("id") as string | null;
  if (!id) return;

  await prisma.todo.delete({ where: { id } });
  revalidatePath("/");          // 刷新首页列表
}
