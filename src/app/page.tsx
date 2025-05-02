// 'use client';

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { PrismaClient } from "@prisma/client";
import Link from "next/link";

const prisma = new PrismaClient();

export default async function HomePage({ searchParams }: { searchParams: { q?: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    redirect("/api/auth/signin");
  }

  const searchQuery = searchParams.q || "";

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


  return (
    <div className="min-h-screen p-8 sm:p-16 font-sans bg-white text-black">
      <main className="max-w-2xl mx-auto flex flex-col gap-6">
        <form method="GET" className="mb-4">
          <input
            type="text"
            name="q"
            placeholder="Search notes..."
            defaultValue={searchParams.q ?? ""}
            className="w-full border p-2 rounded"
          />
        </form>

        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">📚 Your Notes</h1>
          <Link
            href="/notes/new"
            className="text-blue-600 hover:underline text-sm"
          >
            + New Note
          </Link>
        </div>

        {notes.length === 0 ? (
          <p className="text-gray-500">You don’t have any notes yet.</p>
        ) : (


        <ul className="flex flex-col gap-4">
          {notes.map((note) => (
            <li key={note.id} className="border p-4 rounded hover:shadow-lg hover:-translate-y-1 transition">
              <Link href={`/notes/${note.id}`}>
                <h2 className="text-lg font-semibold">{note.title}</h2>
                <p className="text-sm text-gray-500">
                  Updated: {new Date(note.updatedAt).toLocaleString()}
                </p>
              </Link>

              {/* 标签显示 */}
              {note.tags && note.tags.trim() !== "" && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {note.tags.split(",").map((tag, index) => (
                    <span
                      key={index}
                      className="bg-gray-200 text-gray-800 text-xs px-2 py-1 rounded-full"
                    >
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              )}

              <div className="mt-2">
                <Link
                  href={`/notes/${note.id}/edit`}
                  className="text-sm text-blue-500 hover:underline"
                >
                  Edit
                </Link>
              </div>
            </li>
          ))}
        </ul>


        )}
      </main>
    </div>
  );
}
