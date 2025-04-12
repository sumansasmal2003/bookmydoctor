// src/components/Calendar.jsx

import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { FaPlus } from 'react-icons/fa';

// Light/Dark mode category background styles for appointment blocks
const categoryColors = {
  emergency: 'from-red-50/90 to-red-100/80 border-l-4 border-red-400 dark:from-red-900/90 dark:to-red-800/80 dark:border-red-600',
  examination: 'from-amber-50/90 to-amber-100/80 border-l-4 border-amber-400 dark:from-amber-900/90 dark:to-amber-800/80 dark:border-amber-600',
  consultation: 'from-blue-50/90 to-blue-100/80 border-l-4 border-blue-400 dark:from-blue-900/90 dark:to-blue-800/80 dark:border-blue-600',
  'routine checkup': 'from-green-50/90 to-green-100/80 border-l-4 border-green-400 dark:from-green-900/90 dark:to-green-800/80 dark:border-green-600',
  'sick visit': 'from-purple-50/90 to-purple-100/80 border-l-4 border-purple-400 dark:from-purple-900/90 dark:to-purple-800/80 dark:border-purple-600',
  default: 'from-gray-50/90 to-gray-100/80 border-l-4 border-gray-400 dark:from-gray-900/90 dark:to-gray-800/80 dark:border-gray-600',
};

// Color legends for bottom key
const colors = {
  emergency: 'bg-red-400 dark:bg-red-600',
  examination: 'bg-amber-400 dark:bg-amber-600',
  consultation: 'bg-blue-400 dark:bg-blue-600',
  'routine checkup': 'bg-green-400 dark:bg-green-600',
  'sick visit': 'bg-purple-400 dark:bg-purple-600',
  default: 'bg-gray-400 dark:bg-gray-600',
};

const Calendar = ({ weekStart, appointments, onSlotClick, onAppointmentClick }) => {
  const days = Array.from({ length: 7 }, (_, i) => weekStart.add(i, 'day'));
  const timeSlots = Array.from({ length: 12 }, (_, i) => i + 8); // 8 AM to 8 PM

  const [showIntro, setShowIntro] = useState(false);

  // Load intro popup only once per user
  useEffect(() => {
    const hasVisited = localStorage.getItem('hasVisitedCalendar');
    if (!hasVisited) {
      setShowIntro(true);
      localStorage.setItem('hasVisitedCalendar', 'true');
    }
  }, []);

  // Filter appointments for a particular day
  const getAppointmentsForDay = (date) => {
    const dateStr = date.format('YYYY-MM-DD');
    return appointments.filter(appt => appt.date === dateStr);
  };

  return (
    <div className="max-w-full mx-auto bg-gradient-to-br from-blue-50/60 to-purple-50/60 dark:from-gray-900 dark:to-gray-800 rounded-xl shadow-xl overflow-hidden border border-gray-200/80 dark:border-gray-600">

      {/* Main Grid Section */}
      <div className="flex">
        {/* Left Time Column - Sticky */}
        <div className="w-20 md:w-24 flex-shrink-0 sticky left-0 bg-gradient-to-b from-blue-50/80 to-purple-50/80 dark:bg-gradient-to-b dark:from-gray-700 dark:to-gray-600 border-r border-gray-200/80 dark:border-gray-600">
          <div className="h-16 flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 border-b border-gray-200/80 dark:border-gray-600">
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">TIME</span>
          </div>
          {timeSlots.map(hour => (
            <div
              key={hour}
              className="h-16 md:h-20 border-b border-gray-200/80 dark:border-gray-600 flex items-center justify-center text-sm font-medium text-gray-600 dark:text-gray-400"
            >
              {dayjs().hour(hour).minute(0).format('h:mm A')}
            </div>
          ))}
        </div>

        {/* Scrollable Day Grid */}
        <div className="flex-1 overflow-x-auto scroll-smooth">
          <div className="grid grid-cols-7 min-w-[800px]">

            {/* Day Headers (sticky top) */}
            {days.map((date) => (
              <div
                key={date.format('YYYY-MM-DD')}
                className="h-16 border-b border-l border-gray-200/80 dark:border-gray-600 text-center p-2 sticky top-0 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600"
              >
                <div className="text-xs uppercase text-gray-500 dark:text-gray-400 font-medium mb-1">
                  {date.format('ddd')}
                </div>
                <div className={`text-lg font-semibold ${
                  date.isSame(dayjs(), 'day')
                    ? 'text-blue-600 dark:text-blue-300 bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900 dark:to-blue-800 w-8 h-8 rounded-full mx-auto flex items-center justify-center'
                    : 'text-gray-700 dark:text-gray-300'
                }`}>
                  {date.format('D')}
                </div>
              </div>
            ))}

            {/* Appointment Slots for Each Hour/Day */}
            {timeSlots.map((hour) => (
              <React.Fragment key={hour}>
                {days.map((date) => {
                  const hourStart = date.hour(hour).startOf('hour');
                  const hourEnd = hourStart.add(1, 'hour');

                  const appointmentsInHour = getAppointmentsForDay(date).filter(appt => {
                    const apptStart = dayjs(`${appt.date} ${appt.startTime}`, 'YYYY-MM-DD HH:mm');
                    const apptEnd = apptStart.add(appt.duration, 'minutes');
                    return apptStart.isBefore(hourEnd) && apptEnd.isAfter(hourStart);
                  });

                  return (
                    <div
                      key={`${date.format('YYYY-MM-DD')}-${hour}`}
                      className="h-16 md:h-20 border-b border-l border-gray-200/80 dark:border-gray-600 relative group hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors cursor-pointer"
                      onClick={() => onSlotClick(date.hour(hour).minute(0))}
                    >

                      {/* Plus Icon for empty slots */}
                      {appointmentsInHour.length === 0 && (
                        <div className="absolute inset-0 flex items-center justify-center opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="p-1.5 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full shadow-sm">
                            <FaPlus className="w-5 h-5 text-white" />
                          </div>
                        </div>
                      )}

                      {/* First Visit Intro Message */}
                      {showIntro && hour === 9 && date.isSame(weekStart, 'day') && (
                        <div className="absolute -top-8 left-20 -translate-x-1/2 w-[160px] bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-medium rounded-md px-3 py-2 shadow-lg z-10 animate-bounce">
                          Tap here to book a doctor 👆
                          <button
                            onClick={() => setShowIntro(false)}
                            className="absolute -top-2 -right-2 bg-white text-purple-600 p-1 rounded-full shadow"
                          >
                            ✕
                          </button>
                        </div>
                      )}

                      {/* Appointments for this time block */}
                      <div className="absolute inset-0 p-1 space-y-px overflow-hidden flex flex-col justify-center">
                        {appointmentsInHour.map(appt => {
                          const timeRange = `${dayjs(`${appt.date} ${appt.startTime}`).format('h:mm A')} - ${dayjs(`${appt.date} ${appt.endTime}`).format('h:mm A')}`;

                          return (
                            <div
                              key={appt.id}
                              className={`group/event relative rounded-lg bg-gradient-to-r ${categoryColors[appt.category?.toLowerCase()] || categoryColors.default} shadow-xs hover:shadow-sm transition-all cursor-pointer overflow-hidden`}
                              onClick={(e) => {
                                e.stopPropagation();
                                onAppointmentClick(appt);
                              }}
                            >
                              <div className="p-1.5 md:p-2 flex justify-between items-start gap-2">
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs md:text-[13px] font-semibold truncate text-gray-800 dark:text-gray-100">
                                    {appt.patientName}
                                  </p>
                                  <p className="w-full text-[10px] font-medium mt-0.5 text-gray-500 dark:text-gray-400 truncate">
                                    {timeRange}
                                  </p>
                                </div>
                                <button
                                  className="opacity-100 sm:opacity-0 group-hover/event:opacity-100 transition-opacity text-red-500 hover:text-red-600 p-0.5 -mr-1"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onAppointmentClick(appt, 'delete');
                                  }}
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile-only Navigation Hint */}
      <div className="md:hidden py-3 text-center text-xs text-gray-700 dark:text-gray-400 bg-gray-100/80 dark:bg-gray-700 border-t border-gray-200/80 dark:border-gray-600">
        <span className="animate-pulse">← Scroll to view schedule →</span>
      </div>

      {/* Appointment Category Color Legend */}
      <div className="flex flex-wrap items-center justify-center gap-4 px-4 py-4 bg-white/80 dark:bg-gray-800/80 shadow-md mt-6 border border-gray-200/80 dark:border-gray-600 w-full">
        {Object.entries(colors).map(([key, value]) => (
          <div
            key={key}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/90 dark:bg-gray-700/90 border border-gray-200/80 dark:border-gray-600 backdrop-blur-sm"
          >
            <div className={`w-3 h-3 rounded-full ${value}`} />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">{key}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
