import { useState, useEffect, useMemo } from 'react';
import WeekView from './components/WeekView';
import TodoInput from './components/TodoInput';
import FilterTabs from './components/FilterTabs';
import TodoList from './components/TodoList';
import { formatDate, syncMonthToWeek } from './utils/dateUtils';

const STORAGE_KEY = 'todos';

const EMPTY_MESSAGES = {
  all:       { date: '이 날의 할 일이 없어요',           global: '할 일을 추가해보세요' },
  active:    { date: '이 날의 진행 중인 할 일이 없어요',  global: '진행 중인 할 일이 없어요' },
  completed: { date: '이 날의 완료된 항목이 없어요',      global: '완료된 항목이 없어요' },
};

function loadTodosFromStorage() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  const parsed = JSON.parse(stored);
  const todayStr = formatDate(new Date());
  return parsed.map((t) => ({ ...t, date: t.date || todayStr }));
}

function App() {
  const [todos, setTodos] = useState(loadTodosFromStorage);
  const [filter, setFilter] = useState('all');
  const [selectedDate, setSelectedDate] = useState(null);
  const [weekOffset, setWeekOffset] = useState(0);
  const [monthOffset, setMonthOffset] = useState(0);
  const [calendarExpanded, setCalendarExpanded] = useState(true);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  function addTodo(text) {
    if (!text.trim()) {
      alert('빈 값은 추가할 수 없습니다. 할 일을 입력해주세요!');
      return false;
    }
    setTodos((prev) => [
      ...prev,
      {
        id: Date.now(),
        text: text.trim(),
        completed: false,
        date: selectedDate || formatDate(new Date()),
      },
    ]);
    return true;
  }

  function toggleTodo(id) {
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  }

  function deleteTodo(id) {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  }

  function editTodo(id, newText) {
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, text: newText } : t)));
  }

  function handlePrevWeek() {
    const next = weekOffset - 1;
    setWeekOffset(next);
    setSelectedDate(null);
    setMonthOffset(syncMonthToWeek(next));
  }

  function handleNextWeek() {
    const next = weekOffset + 1;
    setWeekOffset(next);
    setSelectedDate(null);
    setMonthOffset(syncMonthToWeek(next));
  }

  function handleSelectDate(dateStr) {
    setSelectedDate((prev) => (prev === dateStr ? null : dateStr));
  }

  function handleToggleCalendar() {
    setCalendarExpanded((prev) => !prev);
  }

  function handleWeekChangeFromMonth(newWeekOffset) {
    setWeekOffset(newWeekOffset);
    setSelectedDate(null);
    setCalendarExpanded(true);
  }

  const filteredTodos = useMemo(() => {
    let result = selectedDate ? todos.filter((t) => t.date === selectedDate) : todos;
    if (filter === 'active') return result.filter((t) => !t.completed);
    if (filter === 'completed') return result.filter((t) => t.completed);
    return result;
  }, [todos, selectedDate, filter]);

  const emptyMessage = EMPTY_MESSAGES[filter][selectedDate ? 'date' : 'global'];

  return (
    <div className="w-full max-w-[1120px]">
      <h1 className="text-[2.2rem] font-extrabold text-[#3a8a96] tracking-[-1px] mb-1 flex items-center gap-2">
        <span className="text-[#aed9e0]">✓</span> Todo list
      </h1>
      <p className="text-[0.9rem] text-[#88b5bc] mb-7">오늘 할 일을 정리해보세요</p>

      <WeekView
        weekOffset={weekOffset}
        monthOffset={monthOffset}
        selectedDate={selectedDate}
        todos={todos}
        calendarExpanded={calendarExpanded}
        onPrevWeek={handlePrevWeek}
        onNextWeek={handleNextWeek}
        onSelectDate={handleSelectDate}
        onMonthChange={setMonthOffset}
        onToggleCalendar={handleToggleCalendar}
        onWeekChangeFromMonth={handleWeekChangeFromMonth}
      />

      <TodoInput onAdd={addTodo} />

      <FilterTabs filter={filter} onFilterChange={setFilter} />

      <TodoList
        todos={filteredTodos}
        emptyMessage={emptyMessage}
        onToggle={toggleTodo}
        onDelete={deleteTodo}
        onEdit={editTodo}
      />
    </div>
  );
}

export default App;
