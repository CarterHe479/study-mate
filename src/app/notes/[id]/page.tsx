import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import ReactMarkdown from "react-markdown";
import Link from "next/link";
import DeleteButton from "@/components/DeleteButton";
import type { PageProps } from "next";

export default async function NoteDetailPage({ params }: PageProps<{ id: string }>) {
    const session = await getServerSession(authOptions);
  
    if (!session || !session.user) {
      redirect("/api/auth/signin");
    }
  
    const { id } = params; // ✅ 改这里，去掉 await
  
    const note = await prisma.note.findUnique({
      where: { id },
    });
  
    if (!note || note.userId !== session.user.id) {
      return <p className="p-6 text-red-500">Note not found or you don’t have permission.</p>;
    }
  
    return (
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-2">{note.title}</h1>
        <p className="text-sm text-gray-500 mb-4">
          Last updated: {new Date(note.updatedAt).toLocaleString()}
        </p>
        <div className="prose max-w-none">
          <ReactMarkdown>{note.content}</ReactMarkdown>
        </div>
  
        {/* Tags 展示 */}
        {note.tags && (
          <p className="mt-4 text-sm text-gray-600">
            Tags: {note.tags}
          </p>
        )}
  
        <div className="mt-6 flex justify-between">
          <Link href="/" className="text-blue-500 hover:underline">
            ← Back to Home
          </Link>
          <DeleteButton noteId={note.id} />
        </div>
      </div>
    );
  }
  