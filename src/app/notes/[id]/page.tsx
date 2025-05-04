import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import ReactMarkdown from "react-markdown";
import Link from "next/link";
import DeleteButton from "@/components/DeleteButton";

export default async function NoteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/api/auth/signin");
  }

  const note = await prisma.note.findUnique({
    where: { id },
  });

  if (!note || note.userId !== session.user.id) {
    return <p className="p-6 text-red-500">Note not found or you don’t have permission.</p>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6 animate-fadeIn">
      <h1 className="text-2xl font-bold mb-2">{note.title}</h1>
      <p className="text-sm text-gray-500 mb-4">
        Last updated: {new Date(note.updatedAt).toLocaleString()}
      </p>
      <div className="prose max-w-none transition-all duration-500">
        <ReactMarkdown>{note.content}</ReactMarkdown>
      </div>

      {/* Tags 展示 */}
      {note.tags && (
        <p className="mt-4 text-sm text-gray-600">
          Tags:{" "}
          <span className="inline-block bg-gray-200 px-2 py-1 rounded-full text-xs">
            {note.tags}
          </span>
        </p>
      )}

      <div className="mt-6 flex justify-between items-center">
        <Link
          href="/"
          className="text-blue-500 hover:text-blue-700 transition-colors hover:scale-105"
        >
          ← Back to Home
        </Link>
        <DeleteButton noteId={note.id} />
      </div>
    </div>
  );
}
