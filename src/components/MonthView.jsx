import { useMemo } from 'react';
import { DAY_NAMES, formatDate, getSunday, getWeekOffsetForDate } from '../utils/dateUtils';

function getMonthDateClasses(day, baseMonth, todayStr, dayStr, i) {
  const isOtherMonth = day.getMonth() !== baseMonth;
  const isToday = dayStr === todayStr;
  const isSunday = i === 0;
  const isSaturday = i === 6;

  let textColor;
  if (isOtherMonth) {
    textColor = isSunday ? 'text-[#f5b8b6]' : isSaturday ? 'text-[#b8cce8]' : 'text-[#ccc]';
  } else if (isSunday) {
    textColor = 'text-[#e53935]';
  } else if (isSaturday) {
    textColor = 'text-[#5b8dd9]';
  } else if (isToday) {
    textColor = 'text-[#2a7a84]';
  } else {
    textColor = 'text-[#444]';
  }

  const fontWeight = isToday && !isOtherMonth ? 'font-extrabold' : 'font-medium';
  return `text-center text-[0.82rem] ${fontWeight} ${textColor} py-[5px]`;
}

export default function MonthView({ monthOffset, weekOffset, onMonthChange, onWeekChange }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = formatDate(today);
  const currentWeekSundayStr = formatDate(getSunday(weekOffset));

  const base = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1);
  const monthLabel = `${base.getFullYear()}년 ${base.getMonth() + 1}월`;
  const baseMonth = base.getMonth();

  const weeks = useMemo(() => {
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    const b = new Date(t.getFullYear(), t.getMonth() + monthOffset, 1);

    const firstOfMonth = new Date(b.getFullYear(), b.getMonth(), 1);
    const lastOfMonth = new Date(b.getFullYear(), b.getMonth() + 1, 0);

    const start = new Date(firstOfMonth);
    start.setDate(firstOfMonth.getDate() - firstOfMonth.getDay());

    const end = new Date(lastOfMonth);
    end.setDate(lastOfMonth.getDate() + (6 - lastOfMonth.getDay()));

    const result = [];
    const cursor = new Date(start);
    while (cursor <= end) {
      const days = [];
      const sunday = new Date(cursor);
      for (let i = 0; i < 7; i++) {
        days.push(new Date(cursor));
        cursor.setDate(cursor.getDate() + 1);
      }
      result.push({ sunday, days });
    }
    return result;
  }, [monthOffset]);

  return (
    <>
      <div className="flex items-center justify-between py-1 pb-2 px-0.5">
        <button
          className="w-6 h-6 shrink-0 border-0 rounded-[6px] bg-[#e4f3f6] text-[#4a8a96] text-[1.2rem] leading-none cursor-pointer flex items-center justify-center transition-colors duration-[180ms] hover:bg-[#c9e8ed]"
          onClick={() => onMonthChange(monthOffset - 1)}
        >
          &#8249;
        </button>
        <span className="text-[0.85rem] font-bold text-[#4a8a96]">{monthLabel}</span>
        <button
          className="w-6 h-6 shrink-0 border-0 rounded-[6px] bg-[#e4f3f6] text-[#4a8a96] text-[1.2rem] leading-none cursor-pointer flex items-center justify-center transition-colors duration-[180ms] hover:bg-[#c9e8ed]"
          onClick={() => onMonthChange(monthOffset + 1)}
        >
          &#8250;
        </button>
      </div>

      <div>
        <div className="grid grid-cols-7 mb-1">
          {DAY_NAMES.map((name, i) => (
            <span
              key={name}
              className={`text-center text-[0.68rem] font-semibold py-1 ${
                i === 0 ? 'text-[#e53935]' : i === 6 ? 'text-[#5b8dd9]' : 'text-[#99bcc1]'
              }`}
            >
              {name}
            </span>
          ))}
        </div>

        {weeks.map(({ sunday, days }) => {
          const rowSundayStr = formatDate(sunday);
          const isActiveWeek = rowSundayStr === currentWeekSundayStr;

          return (
            <div
              key={rowSundayStr}
              className={`grid grid-cols-7 rounded-lg cursor-pointer transition-colors duration-150 py-px px-0.5 ${
                isActiveWeek
                  ? 'bg-[#e4f3f6] hover:bg-[#d4ecf0]'
                  : 'hover:bg-[#f0f9fb]'
              }`}
              onClick={() => onWeekChange(getWeekOffsetForDate(sunday))}
            >
              {days.map((day, i) => {
                const dayStr = formatDate(day);
                return (
                  <span key={dayStr} className={getMonthDateClasses(day, baseMonth, todayStr, dayStr, i)}>
                    {day.getDate()}
                  </span>
                );
              })}
            </div>
          );
        })}
      </div>
    </>
  );
}
