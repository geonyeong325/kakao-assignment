const TABS = [
  { key: 'all', label: '전체' },
  { key: 'active', label: '진행 중' },
  { key: 'completed', label: '완료' },
];

export default function FilterTabs({ filter, onFilterChange }) {
  return (
    <div className="flex gap-1.5 bg-white border-[1.5px] border-[#e0f0f4] rounded-xl p-[5px] mb-5">
      {TABS.map(({ key, label }) => (
        <button
          key={key}
          className={`flex-1 py-[9px] border-0 rounded-[9px] text-[0.88rem] cursor-pointer transition-all duration-[180ms] ${
            filter === key
              ? 'bg-white text-[#2a6b74] font-bold shadow-[0_1px_4px_rgba(100,180,190,0.2)]'
              : 'font-medium text-[#7aacb4] bg-transparent hover:bg-[#d4ecf0] hover:text-[#4a8a96]'
          }`}
          onClick={() => onFilterChange(key)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
