import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import ReactMarkdown from "react-markdown";
import Link from "next/link";
import DeleteButton from "@/components/DeleteButton";

async function createPublicLink(noteId: string) {
  "use server";
  const { customAlphabet } = await import('nanoid');
  const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789', 12);

  const publicId = nanoid();
  await prisma.note.update({
    where: { id: noteId },
    data: { isPublic: true, publicId },
  });

  // ✅ 加上这一行，点完按钮自动刷新页面
  redirect(`/notes/${noteId}`);
}

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

      {/* === 旧的纯 <div className="prose">... === 替换为 ↓ === */}
      <div className="mt-6 bg-white rounded-lg shadow px-6 py-8 transition hover:shadow-lg">
        <article className="prose lg:prose-lg leading-relaxed">
          <ReactMarkdown>{note.content}</ReactMarkdown>
        </article>
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

      {note.isPublic && note.publicId && (
        <div className="mt-4">
          <p className="text-sm text-gray-500">
            Public Link:{" "}
            <a
              href={`/public/${note.publicId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline break-all"
            >
              {process.env.NEXT_PUBLIC_SITE_URL}/public/{note.publicId}
            </a>
          </p>
        </div>
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

      <form action={async () => {
        "use server";
        await createPublicLink(note.id);
      }} >
        <button type="submit" className="text-sm text-green-500 hover:underline ml-4">
          {note.isPublic ? '✅ Public Link Created' : 'Make Public'}
        </button>
      </form>
    </div>
  );
}
