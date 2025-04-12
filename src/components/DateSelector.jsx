import React, { useState } from 'react';
import dayjs from 'dayjs';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const DateSelector = ({ selectedDate, onSelect }) => {
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [showYearPicker, setShowYearPicker] = useState(false);
  const days = Array.from({ length: 7 }, (_, i) => selectedDate.add(i, 'day'));
  const currentYear = selectedDate.year();
  const years = Array.from({ length: 21 }, (_, i) => currentYear - 10 + i);

  const handleMonthSelect = (monthIndex) => {
    onSelect(selectedDate.month(monthIndex));
    setShowMonthPicker(false);
  };

  const handleYearSelect = (year) => {
    onSelect(selectedDate.year(year));
    setShowYearPicker(false);
  };

  return (
    <div className="max-w-full mx-auto mb-6 p-4 bg-gradient-to-br from-blue-50/60 to-purple-50/60 dark:from-gray-900 dark:to-gray-800 rounded-xl shadow-xl border border-gray-200/80 dark:border-gray-600 relative z-10">

      {/* Header Navigation */}
      <div className="flex items-center justify-between mb-2">
        <button
          onClick={() => onSelect(selectedDate.subtract(1, 'week'))}
          className="p-2 rounded-lg hover:bg-gray-100/80 dark:hover:bg-gray-700/80 transition-colors"
        >
          <FaChevronLeft className="text-gray-600 dark:text-gray-300" />
        </button>

        <div className="flex items-center gap-2">
          <span
            onClick={() => {
              setShowMonthPicker(!showMonthPicker);
              setShowYearPicker(false);
            }}
            className="cursor-pointer font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-100/80 dark:hover:bg-gray-700/80 px-3 py-1.5 rounded-lg transition-colors"
          >
            {selectedDate.format('MMMM')}
          </span>
          <span
            onClick={() => {
              setShowYearPicker(!showYearPicker);
              setShowMonthPicker(false);
            }}
            className="cursor-pointer font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-100/80 dark:hover:bg-gray-700/80 px-3 py-1.5 rounded-lg transition-colors"
          >
            {selectedDate.format('YYYY')}
          </span>
        </div>

        <button
          onClick={() => onSelect(selectedDate.add(1, 'week'))}
          className="p-2 rounded-lg hover:bg-gray-100/80 dark:hover:bg-gray-700/80 transition-colors"
        >
          <FaChevronRight className="text-gray-600 dark:text-gray-300" />
        </button>
      </div>

      {/* Month Picker */}
      {showMonthPicker && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white/95 dark:bg-gray-800/95 rounded-xl shadow-lg p-3 grid grid-cols-3 gap-2 z-20 backdrop-blur-sm border border-gray-200/80 dark:border-gray-600">
          {months.map((m, i) => (
            <button
              key={i}
              onClick={() => handleMonthSelect(i)}
              className={`px-4 py-2 rounded-lg transition-all ${
                selectedDate.month() === i
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                  : 'bg-gray-100/80 dark:bg-gray-700/80 text-gray-700 dark:text-gray-200 hover:bg-gray-200/50 dark:hover:bg-gray-600/80'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      )}

      {/* Year Picker */}
      {showYearPicker && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white/95 dark:bg-gray-800/95 rounded-xl shadow-lg p-3 grid grid-cols-4 gap-2 z-20 backdrop-blur-sm border border-gray-200/80 dark:border-gray-600">
          {years.map(yr => (
            <button
              key={yr}
              onClick={() => handleYearSelect(yr)}
              className={`px-3 py-2 rounded-lg transition-all ${
                selectedDate.year() === yr
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                  : 'bg-gray-100/80 dark:bg-gray-700/80 text-gray-700 dark:text-gray-200 hover:bg-gray-200/50 dark:hover:bg-gray-600/80'
              }`}
            >
              {yr}
            </button>
          ))}
        </div>
      )}

      {/* Week Days */}
      <div className="grid grid-cols-7 gap-1.5 mt-4">
        {days.map(date => {
          const isToday = date.isSame(dayjs(), 'day');
          return (
            <button
              key={date.format('YYYY-MM-DD')}
              onClick={() => onSelect(date)}
              className={`p-2 flex flex-col items-center justify-center rounded-xl transition-all ${
                isToday
                  ? 'bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-md'
                  : 'bg-white/80 dark:bg-gray-700/80 hover:bg-gray-100/80 dark:hover:bg-gray-600/80'
              } border border-gray-200/80 dark:border-gray-600`}
            >
              <div className={`text-sm font-medium ${isToday ? 'text-white' : 'text-gray-600 dark:text-gray-300'}`}>
                {date.format('ddd')}
              </div>
              <div className={`text-lg font-semibold ${isToday ? 'text-white' : 'text-gray-800 dark:text-gray-200'}`}>
                {date.format('D')}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default DateSelector;
