// src/components/DateSelector.jsx
import React, { useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

// Hardcoded month names for display
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const DateSelector = ({ selectedDate, onSelect }) => {
  // Control visibility of month/year pickers
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [showYearPicker, setShowYearPicker] = useState(false);

  // Week days based on the selected starting date
  const days = Array.from({ length: 7 }, (_, i) => selectedDate.add(i, 'day'));

  // ----- Handlers -----

  // When a month is selected
  const handleMonthSelect = (monthIndex) => {
    const newDate = selectedDate.month(monthIndex);
    onSelect(newDate);
    setShowMonthPicker(false);
  };

  // When a year is selected
  const handleYearSelect = (year) => {
    const newDate = selectedDate.year(year);
    onSelect(newDate);
    setShowYearPicker(false);
  };

  // Dynamic year range (current ±10)
  const currentYear = selectedDate.year();
  const years = Array.from({ length: 21 }, (_, i) => currentYear - 10 + i);

  // ----- Render -----

  return (
    <div className="max-w-full mx-auto mb-6 p-4 bg-white dark:bg-gray-800 rounded-xl shadow dark:shadow-gray-700 relative z-10">

      {/* Header Row: Navigation + Month & Year Display */}
      <div className="flex items-center justify-between mb-2">

        {/* Left Chevron: Go to Previous Week */}
        <button
          onClick={() => onSelect(selectedDate.subtract(1, 'week'))}
          className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          <FaChevronLeft className="text-gray-600 dark:text-gray-300" />
        </button>

        {/* Month & Year - Clickable Text to Toggle Picker */}
        <div className="flex items-center gap-2">
          <span
            onClick={() => {
              setShowMonthPicker(!showMonthPicker);
              setShowYearPicker(false);
            }}
            className="cursor-pointer font-medium text-gray-800 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700 px-2 py-1 rounded"
          >
            {selectedDate.format('MMMM')}
          </span>
          <span
            onClick={() => {
              setShowYearPicker(!showYearPicker);
              setShowMonthPicker(false);
            }}
            className="cursor-pointer font-medium text-gray-800 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700 px-2 py-1 rounded"
          >
            {selectedDate.format('YYYY')}
          </span>
        </div>

        {/* Right Chevron: Go to Next Week */}
        <button
          onClick={() => onSelect(selectedDate.add(1, 'week'))}
          className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          <FaChevronRight className="text-gray-600 dark:text-gray-300" />
        </button>
      </div>

      {/* ----- Month Picker Dropdown ----- */}
      {showMonthPicker && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg p-4 grid grid-cols-3 gap-2 z-20 md:w-fit w-full">
          {months.map((m, index) => (
            <button
              key={index}
              onClick={() => handleMonthSelect(index)}
              className={`py-1 rounded transition-colors ${
                selectedDate.month() === index
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
              } hover:bg-blue-400 hover:text-white cursor-pointer`}
            >
              {m}
            </button>
          ))}
        </div>
      )}

      {/* ----- Year Picker Dropdown ----- */}
      {showYearPicker && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg p-4 grid grid-cols-4 gap-2 z-20 md:w-fit w-full">
          {years.map((yr) => (
            <button
              key={yr}
              onClick={() => handleYearSelect(yr)}
              className={`py-1 rounded transition-colors ${
                selectedDate.year() === yr
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
              } hover:bg-blue-400 hover:text-white cursor-pointer`}
            >
              {yr}
            </button>
          ))}
        </div>
      )}

      {/* ----- Week Day Buttons ----- */}
      <div className="grid grid-cols-7 gap-1 mt-4">
        {days.map((date) => (
          <button
            key={date.format('YYYY-MM-DD')}
            onClick={() => onSelect(date)}
            className="p-2 text-center rounded bg-blue-100 dark:bg-blue-900"
          >
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {date.format('ddd')}
            </div>
            <div className="text-lg text-gray-800 dark:text-gray-100">
              {date.format('D')}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default DateSelector;
