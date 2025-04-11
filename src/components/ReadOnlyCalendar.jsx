// src/components/ReadOnlyCalendar.jsx
import React from 'react';
import dayjs from 'dayjs';

// Category-based color styling for appointment blocks
const categoryColors = {
  emergency: 'bg-red-100 dark:bg-red-900 border-l-4 border-red-400 dark:border-red-600',
  examination: 'bg-amber-100 dark:bg-amber-900 border-l-4 border-amber-400 dark:border-amber-600',
  consultation: 'bg-blue-100 dark:bg-blue-900 border-l-4 border-blue-400 dark:border-blue-600',
  'routine checkup': 'bg-green-100 dark:bg-green-900 border-l-4 border-green-400 dark:border-green-600',
  'sick visit': 'bg-purple-100 dark:bg-purple-900 border-l-4 border-purple-400 dark:border-purple-600',
  default: 'bg-gray-100 dark:bg-gray-900 border-l-4 border-gray-400 dark:border-gray-600',
};

// Color dot legend styling
const colors = {
  emergency: 'bg-red-400 dark:bg-red-600',
  examination: 'bg-amber-400 dark:bg-amber-600',
  consultation: 'bg-blue-400 dark:bg-blue-600',
  'routine checkup': 'bg-green-400 dark:bg-green-600',
  'sick visit': 'bg-purple-400 dark:bg-purple-600',
  default: 'bg-gray-400 dark:bg-gray-600',
};

const ReadOnlyCalendar = ({ weekStart, appointments, onAppointmentSelect }) => {
  // Generate 7 days starting from the provided weekStart
  const days = Array.from({ length: 7 }, (_, i) => weekStart.add(i, 'day'));

  // Generate 12 time slots from 8 AM to 8 PM
  const timeSlots = Array.from({ length: 12 }, (_, i) => i + 8);

  // Filter appointments for a specific date
  const getAppointmentsForDay = (date) => {
    const dateStr = date.format('YYYY-MM-DD');
    return appointments.filter(appt => appt.date === dateStr);
  };

  return (
    <div className="max-w-full mx-auto bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden border border-gray-100 dark:border-gray-600">

      <div className="flex">
        {/* Time Column */}
        <div className="w-20 flex-shrink-0 bg-gray-50 dark:bg-gray-700 border-r border-gray-100 dark:border-gray-600">
          <div className="h-16 flex items-center justify-center bg-gray-50 dark:bg-gray-700 border-b border-gray-100 dark:border-gray-600">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-300">Time</span>
          </div>
          {timeSlots.map((hour) => (
            <div
              key={hour}
              className="h-16 border-b border-gray-100 dark:border-gray-600 text-right pr-3 text-sm text-gray-500 dark:text-gray-300 flex items-center justify-end"
            >
              {dayjs().hour(hour).minute(0).format('h:mm A')}
            </div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="flex-1 overflow-x-auto">
          <div className="grid grid-cols-7 min-w-[800px]">

            {/* Day Headers */}
            {days.map((date) => (
              <div
                key={date.format('YYYY-MM-DD')}
                className="h-16 border-b border-l border-gray-100 dark:border-gray-600 p-2 text-center bg-gray-50 dark:bg-gray-700"
              >
                <div className="text-xs text-gray-500 dark:text-gray-300 font-medium mb-1">
                  {date.format('ddd')}
                </div>
                <div className="text-lg font-semibold text-gray-700 dark:text-gray-100">
                  {date.format('D')}
                </div>
              </div>
            ))}

            {/* Time Slot Cells with Appointments */}
            {timeSlots.map((hour) => (
              <React.Fragment key={hour}>
                {days.map((date) => {
                  const hourStart = date.hour(hour).startOf('hour');
                  const hourEnd = hourStart.add(1, 'hour');

                  // Get all appointments that overlap this time slot
                  const appointmentsInHour = getAppointmentsForDay(date)
                    .filter(appt => {
                      const apptStart = dayjs(`${appt.date} ${appt.startTime}`);
                      const apptEnd = apptStart.add(appt.duration, 'minutes');
                      return apptStart.isBefore(hourEnd) && apptEnd.isAfter(hourStart);
                    });

                  return (
                    <div
                      key={`${date.format('YYYY-MM-DD')}-${hour}`}
                      className="h-16 border-b border-l border-gray-100 dark:border-gray-600 relative"
                    >
                      <div className="absolute inset-0 p-1 space-y-px overflow-hidden">
                        {/* Render each overlapping appointment */}
                        {appointmentsInHour.map((appt) => {
                          const colorClass = categoryColors[appt.category?.toLowerCase()] || categoryColors.default;
                          const timeRange = `${dayjs(`${appt.date} ${appt.startTime}`).format('h:mm A')} - ${dayjs(`${appt.date} ${appt.endTime}`).format('h:mm A')}`;

                          return (
                            <div
                              key={`${appt.id}-${hour}`}
                              className={`rounded-lg ${colorClass} p-2 cursor-pointer hover:bg-opacity-80 transition-opacity`}
                              onClick={() => onAppointmentSelect(appt)}
                            >
                              <p className="text-xs font-medium truncate text-gray-800 dark:text-gray-100">
                                {appt.patientName}
                              </p>
                              <p className="text-[11px] truncate text-gray-600 dark:text-gray-300">
                                {timeRange}
                              </p>
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

      {/* Category Color Legend */}
      <div className="flex flex-wrap items-center justify-center gap-4 px-4 py-4 bg-white dark:bg-gray-800 rounded-xl shadow-md mt-6">
        {Object.entries(colors).map(([key, value]) => (
          <div
            key={key}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600"
          >
            <div className={`w-2 h-2 rounded-full ${value}`} />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
              {key}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReadOnlyCalendar;
