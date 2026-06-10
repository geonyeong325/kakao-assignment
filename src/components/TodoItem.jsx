import { useState, useRef, useEffect } from 'react';

export default function TodoItem({ todo, onToggle, onDelete, onEdit }) {
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const inputRef = useRef(null);

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [editing]);

  function startEdit() {
    setEditText(todo.text);
    setEditing(true);
  }

  function commitEdit() {
    const trimmed = editText.trim();
    if (trimmed && trimmed !== todo.text) onEdit(todo.id, trimmed);
    setEditing(false);
  }

  function cancelEdit() {
    setEditText(todo.text);
    setEditing(false);
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') commitEdit();
    if (e.key === 'Escape') cancelEdit();
  }

  return (
    <li
      className={`flex items-center gap-3 bg-white border-[1.5px] rounded-[14px] px-4 py-[14px] transition-all duration-200 hover:shadow-[0_3px_12px_rgba(174,217,224,0.3)] animate-[slideIn_0.2s_ease] ${
        todo.completed ? 'border-[#d8eef2]' : 'border-[#e0f0f4]'
      }`}
    >
      <label className="flex items-center cursor-pointer shrink-0">
        <input
          type="checkbox"
          className="sr-only peer"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
        />
        <span className="w-5 h-5 border-2 border-[#aed9e0] rounded-[6px] flex items-center justify-center transition-all duration-200 peer-checked:bg-[#aed9e0] peer-checked:border-[#aed9e0]">
          {todo.completed && (
            <span className="text-white text-[0.75rem] font-bold leading-none">✓</span>
          )}
        </span>
      </label>

      {editing ? (
        <input
          ref={inputRef}
          type="text"
          className="flex-1 text-[0.95rem] leading-relaxed border-0 outline-none bg-[#f0f9fb] px-1.5 -mx-1.5 caret-[#3a8a96] rounded-[4px] text-[#333]"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onBlur={commitEdit}
          onKeyDown={handleKeyDown}
        />
      ) : (
        <span
          className={`flex-1 text-[0.95rem] break-words leading-relaxed cursor-text rounded-[4px] transition-colors duration-200 ${
            todo.completed ? 'line-through text-[#aaa]' : 'text-[#333]'
          }`}
          onClick={startEdit}
        >
          {todo.text}
        </span>
      )}

      <button
        className="bg-transparent border-0 cursor-pointer p-1 text-[#e53935] opacity-50 flex items-center shrink-0 transition-opacity duration-200 hover:opacity-100"
        aria-label="삭제"
        onClick={() => onDelete(todo.id)}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
          <path d="M10 11v6M14 11v6" />
          <path d="M9 6V4h6v2" />
        </svg>
      </button>
    </li>
  );
}
