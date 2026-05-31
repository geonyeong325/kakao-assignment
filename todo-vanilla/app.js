// ===== 상수 =====

const STORAGE_KEY = 'todos';
const DAY_NAMES   = ['일', '월', '화', '수', '목', '금', '토']; // 일요일 시작

// ===== 상태 =====

let todos               = [];
let nextId              = 1;
let currentFilter       = 'all';  // 상태 필터 ('all' | 'active' | 'completed')
let currentWeekOffset   = 0;      // 0 = 이번 주, -1 = 지난 주, 1 = 다음 주 ...
let selectedDate        = null;   // 선택된 날짜 ("YYYY-MM-DD"), null이면 날짜 필터 없음
let isCalendarExpanded  = true;   // 캘린더 그리드 표시 여부
let currentMonthOffset  = 0;      // 0 = 이번 달

// ===== DOM 요소 참조 =====

const todoInput          = document.getElementById('todoInput');
const addBtn             = document.getElementById('addBtn');
const todoList           = document.getElementById('todoList');
const emptyMessage       = document.getElementById('emptyMessage');
const filterTabs         = document.querySelectorAll('.filter-tab');
const prevWeekBtn        = document.getElementById('prevWeekBtn');
const nextWeekBtn        = document.getElementById('nextWeekBtn');
const calendarToggleBtn  = document.getElementById('calendarToggleBtn');
const calendarChevron    = document.getElementById('calendarChevron');
const weekRangeLabel     = document.getElementById('weekRangeLabel');
const weekOfMonthLabel   = document.getElementById('weekOfMonthLabel');
const weekDatesEl        = document.getElementById('weekDates');
const prevMonthBtn       = document.getElementById('prevMonthBtn');
const nextMonthBtn       = document.getElementById('nextMonthBtn');
const monthLabelEl       = document.getElementById('monthLabel');
const monthGridEl        = document.getElementById('monthGrid');
const calendarBodyEl     = document.getElementById('calendarBody');

// ===== 이벤트 리스너 =====

addBtn.addEventListener('click', addTodo);

todoInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') addTodo();
});

filterTabs.forEach((tab) => {
  tab.addEventListener('click', () => setFilter(tab.dataset.filter));
});

// 이전 주 — 날짜 선택 초기화 + 캘린더 자동 전개
prevWeekBtn.addEventListener('click', () => {
  currentWeekOffset--;
  selectedDate = null;
  syncMonthToWeek();
  refresh();
});

// 다음 주 — 날짜 선택 초기화
nextWeekBtn.addEventListener('click', () => {
  currentWeekOffset++;
  selectedDate = null;
  syncMonthToWeek();
  refresh();
});

// 중앙 토글 버튼 — 캘린더 그리드 접기/펼치기
calendarToggleBtn.addEventListener('click', toggleCalendar);

// 월별 캘린더 — 이전/다음 달 이동
prevMonthBtn.addEventListener('click', () => { currentMonthOffset--; renderMonthView(); });
nextMonthBtn.addEventListener('click', () => { currentMonthOffset++; renderMonthView(); });


// ===== 캘린더 토글 함수 =====

/**
 * toggleCalendar — 캘린더 그리드의 표시 상태를 반전
 */
function toggleCalendar() {
  isCalendarExpanded = !isCalendarExpanded;
  applyCalendarState();
}

/**
 * applyCalendarState — isCalendarExpanded 값에 따라 DOM 클래스를 동기화
 * 렌더 사이클마다 호출해 상태와 UI를 일치시킴
 */
function applyCalendarState() {
  calendarBodyEl.classList.toggle('collapsed', !isCalendarExpanded);
  calendarChevron.classList.toggle('collapsed', !isCalendarExpanded);
}

// ===== 월별 캘린더 토글 =====

/**
 * syncMonthToWeek — currentWeekOffset 기준 주의 수요일이 속한 달로 currentMonthOffset을 동기화
 */
function syncMonthToWeek() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const weekSunday = getSunday(currentWeekOffset);
  const midWeek = new Date(weekSunday);
  midWeek.setDate(weekSunday.getDate() + 3);
  currentMonthOffset = (midWeek.getFullYear() - today.getFullYear()) * 12
                     + (midWeek.getMonth()    - today.getMonth());
}

/**
 * getWeekOffsetForDate — 주어진 날짜(일요일)에서 오늘 기준 몇 주 차이인지 반환
 */
function getWeekOffsetForDate(date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todaySunday = new Date(today);
  todaySunday.setDate(today.getDate() - today.getDay());
  const targetSunday = new Date(date);
  targetSunday.setHours(0, 0, 0, 0);
  const diffMs = targetSunday.getTime() - todaySunday.getTime();
  return Math.round(diffMs / (7 * 24 * 60 * 60 * 1000));
}

/**
 * renderMonthView — currentMonthOffset 기준 달의 전체 캘린더 그리드를 그림
 * 각 주(row)를 클릭하면 해당 주로 주간 뷰가 이동함
 */
function renderMonthView() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const base = new Date(today.getFullYear(), today.getMonth() + currentMonthOffset, 1);

  monthLabelEl.textContent = `${base.getFullYear()}년 ${base.getMonth() + 1}월`;

  const firstOfMonth = new Date(base.getFullYear(), base.getMonth(), 1);
  const lastOfMonth  = new Date(base.getFullYear(), base.getMonth() + 1, 0);

  const startDate = new Date(firstOfMonth);
  startDate.setDate(firstOfMonth.getDate() - firstOfMonth.getDay());

  const endDate = new Date(lastOfMonth);
  endDate.setDate(lastOfMonth.getDate() + (6 - lastOfMonth.getDay()));

  monthGridEl.innerHTML = '';

  // 요일 헤더
  const headerRow = document.createElement('div');
  headerRow.className = 'month-header-row';
  DAY_NAMES.forEach((name, i) => {
    const cell = document.createElement('span');
    cell.className = 'month-header-cell';
    if (i === 0) cell.classList.add('sunday');
    if (i === 6) cell.classList.add('saturday');
    cell.textContent = name;
    headerRow.appendChild(cell);
  });
  monthGridEl.appendChild(headerRow);

  const todayStr           = formatDate(today);
  const currentWeekSundayStr = formatDate(getSunday(currentWeekOffset));

  const cursor = new Date(startDate);
  while (cursor <= endDate) {
    const rowSundayStr = formatDate(cursor);
    const weekRow = document.createElement('div');
    weekRow.className = 'month-week-row';
    if (rowSundayStr === currentWeekSundayStr) weekRow.classList.add('active-week');

    const rowSunday = new Date(cursor);
    weekRow.addEventListener('click', () => {
      currentWeekOffset = getWeekOffsetForDate(rowSunday);
      selectedDate = null;
      isCalendarExpanded = true;
      refresh();
    });

    for (let i = 0; i < 7; i++) {
      const cell = document.createElement('span');
      cell.className = 'month-date-cell';
      if (cursor.getMonth() !== base.getMonth()) cell.classList.add('other-month');
      if (formatDate(cursor) === todayStr)        cell.classList.add('today');
      if (i === 0) cell.classList.add('sunday');
      if (i === 6) cell.classList.add('saturday');
      cell.textContent = cursor.getDate();
      weekRow.appendChild(cell);
      cursor.setDate(cursor.getDate() + 1);
    }

    monthGridEl.appendChild(weekRow);
  }
}

// ===== LocalStorage 연동 =====

/**
 * saveTodos — todos 배열을 JSON 문자열로 직렬화해 LocalStorage에 저장
 */
function saveTodos() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

/**
 * loadTodos — LocalStorage에서 데이터를 불러와 todos 배열을 복원
 * date 필드 없는 기존 항목은 오늘 날짜 할당 (하위 호환)
 */
function loadTodos() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    todos = JSON.parse(stored);
    const todayStr = formatDate(new Date());
    todos.forEach((t) => { if (!t.date) t.date = todayStr; });
    if (todos.length > 0) {
      nextId = Math.max(...todos.map((t) => t.id)) + 1;
    }
  }
  refresh();
}

// ===== 날짜 유틸 함수 =====

/**
 * formatDate — Date 객체를 "YYYY-MM-DD" 문자열로 변환 (로컬 시간대 기준)
 */
function formatDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * getSunday — weekOffset 기준 해당 주 일요일(주 시작) Date를 반환
 * getDay() = 0(일)이면 오늘이 일요일이므로 그대로, 아니면 그만큼 빼서 일요일로 이동
 */
function getSunday(weekOffset) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const sunday = new Date(today);
  sunday.setDate(today.getDate() - today.getDay() + weekOffset * 7);
  return sunday;
}

/**
 * getWeekDates — weekOffset 주의 일요일~토요일 Date 배열(7개)을 반환
 */
function getWeekDates(weekOffset) {
  const sunday = getSunday(weekOffset);
  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(sunday);
    date.setDate(sunday.getDate() + i);
    return date;
  });
}

/**
 * getWeekRangeLabel — 주간 범위 문자열 반환 ("M월 D일 - D일" 형식)
 * 월이 다르면 "M월 D일 - M월 D일", 연도가 다르면 연도도 포함
 */
function getWeekRangeLabel(startDate, endDate) {
  const curYear    = new Date().getFullYear();
  const startYear  = startDate.getFullYear();
  const endYear    = endDate.getFullYear();
  const startMonth = startDate.getMonth() + 1;
  const endMonth   = endDate.getMonth() + 1;

  let label = '';
  if (startYear !== curYear) label += `${startYear}년 `;
  label += `${startMonth}월 ${startDate.getDate()}일 - `;
  if (endYear !== startYear) label += `${endYear}년 `;
  if (endMonth !== startMonth) label += `${endMonth}월 `;
  label += `${endDate.getDate()}일`;
  return label;
}

/**
 * getWeekOfMonth — 주 중간(수요일)을 기준으로 해당 주가 월의 몇 주차인지 반환
 * 수요일 기준을 쓰면 월 경계에서 대부분의 날이 속한 달을 대표할 수 있음
 */
function getWeekOfMonth(weekDates) {
  const midDate      = weekDates[3]; // 수요일
  const firstOfMonth = new Date(midDate.getFullYear(), midDate.getMonth(), 1);
  const firstWeekday = firstOfMonth.getDay(); // 해당 월 1일의 요일 (0=일)
  return Math.ceil((midDate.getDate() + firstWeekday) / 7);
}

/**
 * getActiveTodoCountForDate — 특정 날짜의 미완료 Todo 개수를 반환
 */
function getActiveTodoCountForDate(dateStr) {
  return todos.filter((t) => t.date === dateStr && !t.completed).length;
}

/**
 * getCompletedTodoCountForDate — 특정 날짜의 완료 Todo 개수를 반환
 */
function getCompletedTodoCountForDate(dateStr) {
  return todos.filter((t) => t.date === dateStr && t.completed).length;
}

/**
 * selectDate — 날짜 카드 클릭 핸들러
 * 같은 날짜를 다시 클릭하면 선택 해제 (전체 보기로 복귀)
 */
function selectDate(dateStr) {
  selectedDate = selectedDate === dateStr ? null : dateStr;
  refresh();
}

/**
 * renderWeekView — 현재 주의 날짜 카드 7개를 DOM에 그리고 캘린더 상태를 동기화
 */
function renderWeekView() {
  const weekDates = getWeekDates(currentWeekOffset);
  const todayStr  = formatDate(new Date());

  weekRangeLabel.textContent   = getWeekRangeLabel(weekDates[0], weekDates[6]);
  weekOfMonthLabel.textContent = `${getWeekOfMonth(weekDates)}주차`;

  weekDatesEl.innerHTML = '';

  weekDates.forEach((date, index) => {
    const dateStr        = formatDate(date);
    const activeCount    = getActiveTodoCountForDate(dateStr);
    const completedCount = getCompletedTodoCountForDate(dateStr);

    const card = document.createElement('div');
    card.className    = 'date-card';
    card.dataset.date = dateStr;
    card.onclick      = () => selectDate(dateStr);

    if (dateStr === todayStr)     card.classList.add('today');
    if (dateStr === selectedDate) card.classList.add('selected');
    if (index === 0) card.classList.add('sunday');   // 일요일: 첫 번째 카드
    if (index === 6) card.classList.add('saturday'); // 토요일: 마지막 카드

    // 요일 레이블
    const dayNameEl = document.createElement('span');
    dayNameEl.className   = 'day-name';
    dayNameEl.textContent = DAY_NAMES[index];

    // 날짜 숫자
    const dateNumEl = document.createElement('span');
    dateNumEl.className   = 'date-number';
    dateNumEl.textContent = date.getDate();

    // 진행 중(빨강) + 완료(초록) 개수 배지
    const countsEl = document.createElement('div');
    countsEl.className = 'date-counts';

    const pendingBadge = document.createElement('span');
    pendingBadge.className   = `count-badge count-pending${activeCount > 0 ? ' has-count' : ''}`;
    pendingBadge.textContent = activeCount > 0 ? String(activeCount) : '';

    const doneBadge = document.createElement('span');
    doneBadge.className   = `count-badge count-done${completedCount > 0 ? ' has-count' : ''}`;
    doneBadge.textContent = completedCount > 0 ? String(completedCount) : '';

    countsEl.append(pendingBadge, doneBadge);
    card.append(dayNameEl, dateNumEl, countsEl);
    weekDatesEl.appendChild(card);
  });

  // 렌더 후 캘린더 접기/펼치기 상태 DOM에 반영
  applyCalendarState();
}

// ===== 공통 렌더 함수 =====

/**
 * refresh — 주간 뷰와 Todo 목록을 함께 갱신
 */
function refresh() {
  renderWeekView();
  renderTodos();
  renderMonthView();
}

// ===== 기능 함수 =====

function setFilter(filter) {
  currentFilter = filter;
  filterTabs.forEach((tab) => {
    tab.classList.toggle('active', tab.dataset.filter === filter);
  });
  refresh();
}

/**
 * addTodo — 입력값으로 새 Todo를 생성
 * 선택된 날짜가 없으면 오늘 날짜로 설정
 */
function addTodo() {
  const text = todoInput.value.trim();

  if (!text) {
    alert('빈 값은 추가할 수 없습니다. 할 일을 입력해주세요!');
    todoInput.focus();
    return;
  }

  const newTodo = {
    id: nextId++,
    text: text,
    completed: false,
    date: selectedDate || formatDate(new Date()),
  };

  todos.push(newTodo);
  saveTodos();
  todoInput.value = '';
  todoInput.focus();
  refresh();
}

function toggleComplete(id) {
  const todo = todos.find((t) => t.id === id);
  if (todo) {
    todo.completed = !todo.completed;
    saveTodos();
    refresh();
  }
}

function deleteTodo(id) {
  todos = todos.filter((t) => t.id !== id);
  saveTodos();
  refresh();
}

function editTodo(id, newText) {
  const todo = todos.find((t) => t.id === id);
  if (todo) {
    todo.text = newText;
    saveTodos();
    refresh();
  }
}


function getFilteredTodos() {
  let filtered = todos;
  if (selectedDate) {
    filtered = filtered.filter((t) => t.date === selectedDate);
  }
  if (currentFilter === 'active')    return filtered.filter((t) => !t.completed);
  if (currentFilter === 'completed') return filtered.filter((t) =>  t.completed);
  return filtered;
}

function getEmptyMessage() {
  if (selectedDate) {
    if (currentFilter === 'active')    return '이 날의 진행 중인 할 일이 없어요';
    if (currentFilter === 'completed') return '이 날의 완료된 항목이 없어요';
    return '이 날의 할 일이 없어요';
  }
  if (currentFilter === 'active')    return '진행 중인 할 일이 없어요 🎉';
  if (currentFilter === 'completed') return '완료된 항목이 없어요';
  return '할 일을 추가해보세요 ✨';
}

function renderTodos() {
  const filtered = getFilteredTodos();
  todoList.innerHTML = '';

  emptyMessage.textContent   = getEmptyMessage();
  emptyMessage.style.display = filtered.length === 0 ? 'block' : 'none';

  filtered.forEach((todo) => {
    const li = document.createElement('li');
    li.className  = `todo-item${todo.completed ? ' completed' : ''}`;
    li.dataset.id = todo.id;

    // 체크박스
    const checkLabel = document.createElement('label');
    checkLabel.className = 'todo-check';

    const checkbox = document.createElement('input');
    checkbox.type      = 'checkbox';
    checkbox.className = 'todo-checkbox';
    checkbox.checked   = todo.completed;
    checkbox.addEventListener('change', () => toggleComplete(todo.id));

    const checkmark = document.createElement('span');
    checkmark.className = 'checkmark';

    checkLabel.append(checkbox, checkmark);

    // 텍스트
    const textSpan = document.createElement('span');
    textSpan.className   = 'todo-text';
    textSpan.textContent = todo.text;

    textSpan.addEventListener('click', () => {
      if (textSpan.getAttribute('contenteditable') === 'true') return;
      const original = todo.text;
      textSpan.setAttribute('contenteditable', 'true');
      textSpan.classList.add('editing');
      textSpan.focus();
      const range = document.createRange();
      range.selectNodeContents(textSpan);
      range.collapse(false);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);

      let done = false;
      const commit = () => {
        if (done) return;
        done = true;
        textSpan.setAttribute('contenteditable', 'false');
        textSpan.classList.remove('editing');
        const newText = textSpan.textContent.trim();
        if (newText && newText !== original) editTodo(todo.id, newText);
        else textSpan.textContent = original;
      };
      const cancel = () => {
        if (done) return;
        done = true;
        textSpan.setAttribute('contenteditable', 'false');
        textSpan.classList.remove('editing');
        textSpan.textContent = original;
      };
      textSpan.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') { e.preventDefault(); commit(); textSpan.blur(); }
        if (e.key === 'Escape') { cancel(); textSpan.blur(); }
      });
      textSpan.addEventListener('blur', commit);
    });

    // 휴지통 버튼
    const trashBtn = document.createElement('button');
    trashBtn.className       = 'btn-trash';
    trashBtn.setAttribute('aria-label', '삭제');
    trashBtn.innerHTML       = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="3 6 5 6 21 6"></polyline>
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path>
      <path d="M10 11v6M14 11v6"></path>
      <path d="M9 6V4h6v2"></path>
    </svg>`;
    trashBtn.onclick = () => deleteTodo(todo.id);

    li.append(checkLabel, textSpan, trashBtn);
    todoList.appendChild(li);
  });
}

// ===== 초기화 =====
loadTodos();
