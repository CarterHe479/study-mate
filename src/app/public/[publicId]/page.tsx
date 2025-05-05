import { prisma } from "@/lib/prisma";
import ReactMarkdown from "react-markdown";

export default async function PublicNotePage({ params }: { params: { publicId: string } }) {
  const note = await prisma.note.findUnique({
    where: { publicId: params.publicId },
  });

  if (!note || !note.isPublic) {
    return <p className="p-6 text-red-500">This note is not available publicly.</p>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">{note.title}</h1>
      <p className="text-sm text-gray-500 mb-4">
        Last updated: {new Date(note.updatedAt).toLocaleString()}
      </p>
      <div className="prose lg:prose-lg leading-relaxed bg-white rounded-lg shadow px-6 py-8">
        <ReactMarkdown>{note.content}</ReactMarkdown>
      </div>
    </div>
  );
}
