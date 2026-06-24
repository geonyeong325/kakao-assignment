import Link from "next/link";
import { getTodos } from "@/app/actions";

export default async function TodosPage() {
  const todos = await getTodos();
  const completedCount = todos.filter((t: any) => t.completed).length;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">할 일 목록</h1>
            {todos.length > 0 && (
              <p className="text-sm text-gray-500 mt-1">
                {completedCount}/{todos.length}개 완료
              </p>
            )}
          </div>
          <Link href="/todos/new">
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer">
              + 새 할 일
            </button>
          </Link>
        </div>

        {todos.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-5xl mb-4">📝</p>
            <p className="text-lg font-medium">아직 할 일이 없어요</p>
            <p className="text-sm mt-1">위 버튼을 눌러 추가해보세요</p>
          </div>
        ) : (
          <ul className="space-y-2">
            {todos.map((todo: any) => (
              <li
                key={todo.id}
                className="bg-white border border-gray-200 rounded-lg px-4 py-3 flex items-center justify-between shadow-sm hover:shadow transition-shadow"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${
                      todo.completed
                        ? "bg-green-400 border-green-400"
                        : "border-gray-300"
                    }`}
                  />
                  <span
                    className={`${
                      todo.completed
                        ? "line-through text-gray-400"
                        : "text-gray-800"
                    }`}
                  >
                    {todo.title}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  {todo.completed && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                      완료
                    </span>
                  )}
                  <Link href={`/todos/${todo.id}`}>
                    <button className="text-sm text-blue-500 hover:text-blue-700 hover:underline cursor-pointer">
                      수정
                    </button>
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
