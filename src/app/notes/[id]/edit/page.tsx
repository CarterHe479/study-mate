import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function EditNotePage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/api/auth/signin");
  }

  const note = await prisma.note.findUnique({
    where: { id: params.id },
  });

  if (!note || note.userId !== session.user.id) {
  // if (!note) {
    return <p className="p-6 text-red-500">Note not found or you don’t have permission.</p>;
  }

  async function updateNote(formData: FormData) {
    "use server";

    const title = formData.get("title") as string;
    const content = formData.get("content") as string;

    if (!title || !content) {
      throw new Error("Title and content are required");
    }

    await prisma.note.update({
      where: { id: params.id },
      data: { title, content },
    });

    redirect("/");
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">✏️ Edit Note</h1>
      <form action={updateNote} className="flex flex-col gap-4">
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
        <button
          type="submit"
          className="bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Update Note
        </button>
      </form>
    </div>
  );
}
