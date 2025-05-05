// components/AdminTodoList.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { FormEvent } from "react";
import { deleteTodo } from "@/actions/todos";

type AdminTodoListProps = {
  todos: {
    id: string;
    title: string;
    completed: boolean;
    userId: string;
  }[];
};

export function AdminTodoList({ todos }: AdminTodoListProps) {
  async function handleDelete(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await deleteTodo(new FormData(e.currentTarget));
    // 乐观更新靠 parent revalidate；这里只负责阻止默认跳转
  }

  return (
    <AnimatePresence>
      {todos.map((todo) => (
        <motion.li
          key={todo.id}
          layout          // 布局自动补间
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.25 }}
          className="p-3 bg-white rounded shadow"
        >
          <div className="flex justify-between items-center">
            <div>
              <span className={todo.completed ? "line-through text-gray-500" : ""}>
                {todo.title}
              </span>
              <span className="ml-2 text-sm text-gray-500">(User: {todo.userId})</span>
            </div>

            {/* 阻止默认跳转 → handleDelete 手动调用 server action */}
            <form onSubmit={handleDelete}>
              <input type="hidden" name="id" value={todo.id} />
              <button
                type="submit"
                className="px-2 py-1 text-white bg-red-500 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </form>
          </div>
        </motion.li>
      ))}
    </AnimatePresence>
  );
}
