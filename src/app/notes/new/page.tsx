"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";

export default function NewNotePage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");

  return (
    <div className="max-w-2xl mx-auto p-6 animate-fadeIn">
      <h1 className="text-2xl font-bold mb-4">📝 Create a New Note</h1>
      <form
        action="/notes/api"
        method="POST"
        className="flex flex-col gap-4 bg-white shadow p-6 rounded-lg transition-all hover:shadow-lg"
      >
        <div>
          <label className="block mb-1 font-medium">Title</label>
          <input
            type="text"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            placeholder="Enter note title"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Content (Markdown)</label>
          <textarea
            name="content"
            rows={8}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            placeholder="Write your note here..."
          ></textarea>
        </div>

        <div>
          <label className="block mb-1 font-medium">Tags (comma separated)</label>
          <input
            type="text"
            name="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="e.g. study, nextjs, project"
            className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-all shadow hover:shadow-lg transform hover:scale-105"
        >
          💾 Save Note
        </button>
      </form>

      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-2">Live Preview</h2>
        <div className="border rounded p-4 min-h-[100px] bg-gray-50 transition-all hover:shadow-inner">
          <ReactMarkdown>{content || "*Nothing to preview yet.*"}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
