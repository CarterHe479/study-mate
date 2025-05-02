import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
// import type { PageProps } from "next";


async function updateNote(formData: FormData) {
  "use server";

  const noteId = formData.get("noteId") as string;
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const tagsRaw = formData.get("tags") as string;

  if (!noteId || !title || !content) {
    throw new Error("Missing required fields");
  }

  await prisma.note.update({
    where: { id: noteId },
    data: { title, content, tags: tagsRaw ?? "" },
  });

  redirect(`/notes/${noteId}`);
}

export default async function EditNotePage({params,}: {params: Promise<{ id: string }>;}) {
  const { id } = await params;          // ① 先 await
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/api/auth/signin");
  }

  const note = await prisma.note.findUnique({ where: { id } });

  if (!note || note.userId !== session.user.id) {
    return (
      <p className="p-6 text-red-500">
        Note not found or you don’t have permission.
      </p>
    );
  }

  /* 其余 JSX 保持不变 */
return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">✏️ Edit Note</h1>
      <form action={updateNote} className="flex flex-col gap-4">
        <input type="hidden" name="noteId" value={note.id} />

        <div>
          <label className="block mb-1 font-medium">Title</label>
          <input
            type="text"
            name="title"
            defaultValue={note.title}
            required
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Content (Markdown)</label>
          <textarea
            name="content"
            rows={8}
            defaultValue={note.content}
            required
            className="w-full border p-2 rounded"
          ></textarea>
        </div>

        <div>
          <label className="block mb-1 font-medium">Tags (comma separated)</label>
          <input
            type="text"
            name="tags"
            defaultValue={note.tags ?? ""}
            placeholder="e.g. study, nextjs, project"
            className="w-full border p-2 rounded"
          />
        </div>

        <button
          type="submit"
          className="bg-green-600 text-white py-2 rounded hover:bg-green-700 transition-colors shadow hover:shadow-lg"
        >
          Update Note
        </button>
      </form>
    </div>
  );
}

