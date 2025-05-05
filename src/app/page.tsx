import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";
import Link from "next/link";
import { redirect } from "next/navigation";
import { NotesList } from "@/components/NoteList";
import type { Note } from "@/components/NoteList";
const prisma = new PrismaClient();

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/api/auth/signin");
  }

  const searchQuery = q || "";

  const notes = await prisma.note.findMany({
    where: {
      user: { email: session.user.email! },
      ...(searchQuery && {
        OR: [
          { title: { contains: searchQuery } },
          { content: { contains: searchQuery } },
          { tags: { contains: searchQuery } },
        ],
      }),
    },
    orderBy: { updatedAt: "desc" },
  });

  const notesForClient: Note[] = notes.map((n) => ({
    id: n.id,
    title: n.title,
    updatedAt: n.updatedAt.toISOString(),
    status: n.status as "approved" | "pending" | "rejected",
    tags: n.tags,
  }));

  return (
    <div className="min-h-screen p-8 sm:p-16 font-sans bg-white text-black">
      <main className="max-w-2xl mx-auto flex flex-col gap-6 animate-fadeIn">
        <form method="GET" className="mb-4">
          <input
            type="text"
            name="q"
            placeholder="Search notes..."
            defaultValue={searchQuery}
            className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </form>

        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">📚 Your Notes</h1>
          <Link
            href="/notes/new"
            className="text-blue-600 hover:text-blue-800 text-sm transition-colors duration-300 hover:scale-105 inline-block"
          >
            + New Note
          </Link>
        </div>

        {notes.length === 0 ? (
          <p className="text-gray-500 animate-fadeIn">
            You don’t have any notes yet.
          </p>
        ) : (
          <ul className="flex flex-col gap-4">
            {/* ⬇️ 用带动画的 NotesList 代替手写 li 循环 */}
            <NotesList notes={notesForClient} />
          </ul>
        )}
      </main>
    </div>
  );
}
