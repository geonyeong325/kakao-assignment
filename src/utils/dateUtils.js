export const DAY_NAMES = ['일', '월', '화', '수', '목', '금', '토'];

export function formatDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function getSunday(weekOffset) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const sunday = new Date(today);
  sunday.setDate(today.getDate() - today.getDay() + weekOffset * 7);
  return sunday;
}

export function getWeekDates(weekOffset) {
  const sunday = getSunday(weekOffset);
  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(sunday);
    date.setDate(sunday.getDate() + i);
    return date;
  });
}

export function getWeekRangeLabel(startDate, endDate) {
  const curYear = new Date().getFullYear();
  const startYear = startDate.getFullYear();
  const endYear = endDate.getFullYear();
  const startMonth = startDate.getMonth() + 1;
  const endMonth = endDate.getMonth() + 1;

  let label = '';
  if (startYear !== curYear) label += `${startYear}년 `;
  label += `${startMonth}월 ${startDate.getDate()}일 - `;
  if (endYear !== startYear) label += `${endYear}년 `;
  if (endMonth !== startMonth) label += `${endMonth}월 `;
  label += `${endDate.getDate()}일`;
  return label;
}

export function getWeekOfMonth(weekDates) {
  const midDate = weekDates[3];
  const firstOfMonth = new Date(midDate.getFullYear(), midDate.getMonth(), 1);
  const firstWeekday = firstOfMonth.getDay();
  return Math.ceil((midDate.getDate() + firstWeekday) / 7);
}

export function getWeekOffsetForDate(date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todaySunday = new Date(today);
  todaySunday.setDate(today.getDate() - today.getDay());
  const targetSunday = new Date(date);
  targetSunday.setHours(0, 0, 0, 0);
  const diffMs = targetSunday.getTime() - todaySunday.getTime();
  return Math.round(diffMs / (7 * 24 * 60 * 60 * 1000));
}

export function getCountsForDate(todos, dateStr) {
  const active = todos.filter((t) => t.date === dateStr && !t.completed).length;
  const done = todos.filter((t) => t.date === dateStr && t.completed).length;
  return { active, done };
}

export function syncMonthToWeek(weekOffset) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const weekSunday = getSunday(weekOffset);
  const midWeek = new Date(weekSunday);
  midWeek.setDate(weekSunday.getDate() + 3);
  return (
    (midWeek.getFullYear() - today.getFullYear()) * 12 +
    (midWeek.getMonth() - today.getMonth())
  );
}
