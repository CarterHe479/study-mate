import { prisma } from "@/lib/prisma";
import ReactMarkdown from "react-markdown";

export default async function PublicNotePage({
  params,
}: { params: Promise<{ publicId: string }> }) {
  const { publicId } = await params;

  const note = await prisma.note.findUnique({
    where: { publicId },
  });

  if (!note || !note.isPublic) {
    return (
      <p className="p-6 text-red-500 animate-fadeIn">
        Note not found or not public.
      </p>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 animate-fadeIn">
      <h1 className="text-2xl font-bold mb-2">{note.title}</h1>
      <p className="text-sm text-gray-500 mb-4">
        Last updated: {new Date(note.updatedAt).toLocaleString()}
      </p>
      <div className="mt-6 bg-white rounded-lg shadow px-6 py-8">
        <article className="prose lg:prose-lg leading-relaxed">
          <ReactMarkdown>{note.content}</ReactMarkdown>
        </article>
      </div>
      {note.tags && (
        <p className="mt-4 text-sm text-gray-600">
          Tags:{" "}
          <span className="inline-block bg-gray-200 px-2 py-1 rounded-full text-xs">
            {note.tags}
          </span>
        </p>
      )}
    </div>
  );
}

