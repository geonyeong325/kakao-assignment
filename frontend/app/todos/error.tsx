"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-5xl mb-4">⚠️</p>
        <h2 className="text-xl font-bold text-gray-800 mb-2">문제가 발생했습니다</h2>
        <p className="text-gray-500 text-sm mb-6">
          서버에 연결할 수 없거나 오류가 발생했습니다.
          <br />
          백엔드 서버가 실행 중인지 확인해주세요.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer"
          >
            다시 시도
          </button>
          <Link href="/todos">
            <button className="border border-gray-300 text-gray-600 hover:bg-gray-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer">
              목록으로
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
