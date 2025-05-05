// src/app/admin/page.tsx
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";           // 和首页 notes 用的同一个 authOptions
import { prisma } from "@/lib/prisma";              // 你在 actions/todos.ts 已经这样引用了 :contentReference[oaicite:0]{index=0}:contentReference[oaicite:1]{index=1}
import { redirect } from "next/navigation";
import { AdminTodoList } from "@/components/AdminTodoList"; // 动画组件 :contentReference[oaicite:2]{index=2}:contentReference[oaicite:3]{index=3}

export default async function AdminPage() {
  /* ---------- 1. 鉴权 ---------- */
  const session = await getServerSession(authOptions);

  // 未登录 ➜ NextAuth 的登录页
  if (!session || !session.user) {
    redirect("/api/auth/signin");
  }

  // 登录但不是管理员 ➜ 普通 Todo 页面
  if ((session.user.role != "admin")) {
    redirect("/todos");
  }

  /* ---------- 2. 读取全部 Todo ---------- */
  // 确认 schema.prisma 里有 `model Todo`，字段 id / title / completed / userId / updatedAt
  const allTodos = await prisma.todo.findMany({
    orderBy: { updatedAt: "desc" },
    select: { id: true, title: true, completed: true, userId: true },
  });

  /* ---------- 3. 渲染 ---------- */
  return (
    <main className="py-8 px-4">
      <section className="container mx-auto">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl mb-4">
            All Todos{" "}
            <span className="text-sm text-gray-500">({allTodos.length})</span>
          </h2>

          {allTodos.length === 0 ? (
            <p className="text-gray-500">No todos found in the system.</p>
          ) : (
            <ul className="space-y-2">
              {/* 列表 + 删除动画 */}
              <AdminTodoList todos={allTodos} />
            </ul>
          )}
        </div>
      </section>
    </main>
  );
}
