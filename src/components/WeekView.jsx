import { useMemo } from 'react';
import MonthView from './MonthView';
import {
  DAY_NAMES,
  formatDate,
  getWeekDates,
  getWeekRangeLabel,
  getWeekOfMonth,
  getCountsForDate,
} from '../utils/dateUtils';

function getDayTextColor(isToday, isSelected, isSunday, isSaturday) {
  if (isSunday) return 'text-[#e53935]';
  if (isSaturday) return 'text-[#5b8dd9]';
  if (isSelected) return 'text-[#3a8a96]';
  if (isToday) return 'text-[#2a7a84]';
  return null;
}

export default function WeekView({
  weekOffset,
  monthOffset,
  selectedDate,
  todos,
  calendarExpanded,
  onPrevWeek,
  onNextWeek,
  onSelectDate,
  onMonthChange,
  onToggleCalendar,
  onWeekChangeFromMonth,
}) {
  const weekDates = useMemo(() => getWeekDates(weekOffset), [weekOffset]);
  const todayStr = formatDate(new Date());
  const rangeLabel = getWeekRangeLabel(weekDates[0], weekDates[6]);
  const weekOfMonth = getWeekOfMonth(weekDates);

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between">
        <button
          className="w-8 h-8 shrink-0 border-0 rounded-lg bg-[#e4f3f6] text-[#4a8a96] text-[1.4rem] leading-none cursor-pointer flex items-center justify-center transition-all duration-[180ms] hover:bg-[#c9e8ed] active:scale-[0.94]"
          onClick={onPrevWeek}
        >
          &#8249;
        </button>

        <button
          className="flex-1 flex flex-col items-center gap-1 bg-transparent border-0 cursor-pointer px-2 py-1.5 rounded-[10px] transition-colors duration-[180ms] hover:bg-[#f0f9fb]"
          onClick={onToggleCalendar}
        >
          <span className="text-[0.9rem] font-semibold text-[#4a8a96]">{rangeLabel}</span>
          <span className="text-[0.7rem] font-bold px-2 py-0.5 rounded-full bg-[#e4f3f6] text-[#4a8a96] tracking-[0.02em]">
            {weekOfMonth}주차
          </span>
          <span
            className={`text-[0.72rem] text-[#aad4d9] leading-none transition-transform duration-[220ms] ease-in-out ${
              calendarExpanded ? '' : '-rotate-90'
            }`}
          >
            &#9662;
          </span>
        </button>

        <button
          className="w-8 h-8 shrink-0 border-0 rounded-lg bg-[#e4f3f6] text-[#4a8a96] text-[1.4rem] leading-none cursor-pointer flex items-center justify-center transition-all duration-[180ms] hover:bg-[#c9e8ed] active:scale-[0.94]"
          onClick={onNextWeek}
        >
          &#8250;
        </button>
      </div>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          calendarExpanded ? 'max-h-[520px] opacity-100 mt-3' : 'max-h-0 opacity-0 mt-0'
        }`}
      >
        <MonthView
          monthOffset={monthOffset}
          weekOffset={weekOffset}
          onMonthChange={onMonthChange}
          onWeekChange={onWeekChangeFromMonth}
        />
        <div className="h-px bg-[#e0f0f4] mx-0.5 my-2" />
      </div>

      <div className="flex gap-1.5 mt-3 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {weekDates.map((date, index) => {
          const dateStr = formatDate(date);
          const { active, done } = getCountsForDate(todos, dateStr);
          const isToday = dateStr === todayStr;
          const isSelected = dateStr === selectedDate;
          const isSunday = index === 0;
          const isSaturday = index === 6;
          const textColor = getDayTextColor(isToday, isSelected, isSunday, isSaturday);

          return (
            <div
              key={dateStr}
              className={`flex-1 min-w-[90px] flex flex-col items-center gap-1 py-2.5 px-1 rounded-xl bg-white cursor-pointer transition-all duration-[180ms] select-none hover:border-[#aed9e0] ${
                isSelected
                  ? 'border-2 border-[#3a8a96]'
                  : isToday
                  ? 'border-[1.5px] border-[#aed9e0]'
                  : 'border-[1.5px] border-[#e0f0f4]'
              }`}
              onClick={() => onSelectDate(dateStr)}
            >
              <span className={`text-[0.72rem] font-medium ${textColor ?? 'text-[#99bcc1]'}`}>
                {DAY_NAMES[index]}
              </span>
              <span className={`text-[1rem] font-bold ${textColor ?? 'text-[#333]'}`}>
                {date.getDate()}
              </span>
              <div className="flex gap-[3px] min-h-4">
                <span
                  className={`min-w-4 h-4 px-1 rounded-full text-[0.62rem] font-bold flex items-center justify-center bg-[#c9e4ca] text-[#3a7a3c] ${
                    active > 0 ? 'visible' : 'invisible'
                  }`}
                >
                  {active > 0 ? active : ''}
                </span>
                <span
                  className={`min-w-4 h-4 px-1 rounded-full text-[0.62rem] font-bold flex items-center justify-center bg-[#fde8e8] text-[#c0392b] ${
                    done > 0 ? 'visible' : 'invisible'
                  }`}
                >
                  {done > 0 ? done : ''}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
