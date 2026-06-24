"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewTodoPage() {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    await fetch("/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: title.trim(), completed: false }),
    });
    router.push("/todos");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/todos"
          className="text-sm text-gray-500 hover:text-gray-700 mb-6 inline-block"
        >
          ← 목록으로
        </Link>
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <h1 className="text-xl font-bold text-gray-800 mb-5">새 할 일 추가</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="할 일을 입력하세요"
              autoFocus
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={loading || !title.trim()}
                className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-5 py-2 rounded-lg font-medium transition-colors cursor-pointer"
              >
                {loading ? "저장 중..." : "저장"}
              </button>
              <Link href="/todos">
                <button
                  type="button"
                  className="border border-gray-300 text-gray-600 hover:bg-gray-50 px-5 py-2 rounded-lg font-medium transition-colors cursor-pointer"
                >
                  취소
                </button>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
