'use client';

type Props = {
  noteId: string;
};

export default function DeleteButton({ noteId }: Props) {
  return (
    <form action={`/notes/${noteId}/delete`} method="POST">
      <button
        type="submit"
        className="text-red-500 hover:underline text-sm"
        onClick={(e) => {
          if (!confirm("Are you sure you want to delete this note?")) {
            e.preventDefault();
          }
        }}
      >
        Delete
      </button>
    </form>
  );
}
