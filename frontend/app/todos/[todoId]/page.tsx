"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

export default function EditTodoPage() {
  const { todoId: id } = useParams<{ todoId: string }>();
  const [title, setTitle] = useState("");
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch(`/api/todos/${id}`)
      .then((res) => res.json())
      .then((todo) => {
        setTitle(todo.title);
        setCompleted(todo.completed);
        setLoading(false);
      });
  }, [id]);

  const handleUpdate = async () => {
    if (!title.trim()) return;
    setSaving(true);
    await fetch(`/api/todos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: title.trim(), completed }),
    });
    router.push("/todos");
    router.refresh();
  };

  const handleDelete = async () => {
    if (!confirm("정말 삭제할까요?")) return;
    await fetch(`/api/todos/${id}`, { method: "DELETE" });
    router.push("/todos");
    router.refresh();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-10 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="h-5 w-20 bg-gray-200 rounded animate-pulse mb-6" />
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-4">
            <div className="h-6 w-24 bg-gray-200 rounded animate-pulse" />
            <div className="h-10 w-full bg-gray-200 rounded-lg animate-pulse" />
            <div className="h-5 w-20 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

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
          <h1 className="text-xl font-bold text-gray-800 mb-5">할 일 수정</h1>
          <div className="space-y-4">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={completed}
                onChange={(e) => setCompleted(e.target.checked)}
                className="w-4 h-4 accent-blue-500"
              />
              <span className="text-gray-700">완료됨</span>
            </label>
          </div>
          <div className="flex justify-between mt-6">
            <button
              onClick={handleUpdate}
              disabled={saving || !title.trim()}
              className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-5 py-2 rounded-lg font-medium transition-colors cursor-pointer"
            >
              {saving ? "저장 중..." : "수정 완료"}
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg font-medium transition-colors cursor-pointer"
            >
              삭제
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
