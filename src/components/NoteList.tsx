"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export type Note = {
  id: string;
  title: string;
  updatedAt: string;       // ISO 字符串
  status: "approved" | "pending" | "rejected";
  tags: string | null;
};

export function NotesList({ notes }: { notes: Note[] }) {
  return (
    <AnimatePresence>
      {notes.map((note) => (
        <motion.li
          key={note.id}
          layout                              // 布局补间
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          className="border p-4 rounded shadow bg-white group hover:shadow-lg hover:-translate-y-1 hover:scale-[1.02]"
        >
          <Link href={`/notes/${note.id}`}>
            <h2 className="text-lg font-semibold">{note.title}</h2>
            <p className="text-sm text-gray-500">
              Updated: {new Date(note.updatedAt).toLocaleString()}
            </p>

            {note.status !== "approved" && (
              <p
                className={`text-xs mt-1 ${
                  note.status === "rejected" ? "text-red-500" : "text-yellow-500"
                }`}
              >
                ⚠️ This note is <span className="font-semibold">{note.status}</span>
              </p>
            )}
          </Link>

          {note.tags?.trim() && (
            <div className="mt-2 flex flex-wrap gap-2">
              {note.tags.split(",").map((tag) => (
                <span
                  key={tag}
                  className="bg-gray-200 text-gray-800 text-xs px-2 py-1 rounded-full transition hover:bg-gray-300"
                >
                  {tag.trim()}
                </span>
              ))}
            </div>
          )}

          <div className="mt-2">
            <Link href={`/notes/${note.id}/edit`} className="text-sm text-blue-500 hover:underline">
              Edit
            </Link>
          </div>
        </motion.li>
      ))}
    </AnimatePresence>
  );
}
