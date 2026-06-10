import { useState, useRef } from 'react';

export default function TodoInput({ onAdd }) {
  const [text, setText] = useState('');
  const inputRef = useRef(null);

  function handleAdd() {
    const success = onAdd(text);
    if (success) setText('');
    inputRef.current?.focus();
  }

  function handleChange(e) {
    setText(e.target.value);
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleAdd();
  }

  return (
    <div className="flex gap-2.5 mb-5">
      <input
        ref={inputRef}
        type="text"
        className="flex-1 px-4 py-[13px] border-2 border-[#aed9e0] rounded-xl text-[0.95rem] bg-white text-[#333] outline-none transition-all duration-200 focus:border-[#7bbfc9] focus:shadow-[0_0_0_3px_rgba(174,217,224,0.25)] placeholder:text-[#bbb]"
        placeholder="할 일을 입력하세요..."
        maxLength={100}
        value={text}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
      <button
        className="px-5 py-[13px] border-0 rounded-xl text-[0.88rem] font-semibold cursor-pointer bg-[#aed9e0] text-[#2a6b74] hover:bg-[#98cdd5] transition-colors duration-[180ms] active:scale-[0.96] whitespace-nowrap"
        onClick={handleAdd}
      >
        추가
      </button>
    </div>
  );
}
