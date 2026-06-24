export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="h-7 w-28 bg-gray-200 rounded animate-pulse" />
          <div className="h-9 w-24 bg-gray-200 rounded-lg animate-pulse" />
        </div>
        <ul className="space-y-2">
          {[1, 2, 3, 4].map((i) => (
            <li
              key={i}
              className="bg-white border border-gray-200 rounded-lg px-4 py-3 flex items-center gap-3 animate-pulse"
            >
              <div className="w-4 h-4 rounded-full bg-gray-200 flex-shrink-0" />
              <div
                className="h-4 bg-gray-200 rounded"
                style={{ width: `${60 + i * 10}%` }}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
