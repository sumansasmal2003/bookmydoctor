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
    <div className="max-w-full mx-auto bg-gradient-to-br from-blue-50/60 to-purple-50/60 dark:from-gray-900 dark:to-gray-800 rounded-xl shadow-xl overflow-hidden border border-gray-200/80 dark:border-gray-600">

      <div className="flex">
        {/* Time Column */}
        <div className="w-20 flex-shrink-0 sticky left-0 bg-gradient-to-b from-blue-50/80 to-purple-50/80 dark:bg-gradient-to-b dark:from-gray-700 dark:to-gray-600 border-r border-gray-200/80 dark:border-gray-600">
          <div className="h-16 flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 border-b border-gray-200/80 dark:border-gray-600">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">TIME</span>
          </div>
          {timeSlots.map((hour) => (
            <div
              key={hour}
              className="h-16 border-b border-gray-200/80 dark:border-gray-600 text-right pr-3 text-sm text-gray-600 dark:text-gray-400 flex items-center justify-end font-medium"
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
                className="h-16 border-b border-l border-gray-200/80 dark:border-gray-600 p-2 text-center bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600"
              >
                <div className="text-xs text-gray-600 dark:text-gray-400 font-medium mb-1">
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

            {/* Time Slot Cells */}
            {timeSlots.map((hour) => (
                <React.Fragment key={hour}>
                    {days.map((date) => {
                    // Calculate the start and end of the current hour slot
                    const hourStart = date.hour(hour).startOf('hour');
                    const hourEnd = hourStart.add(1, 'hour');

                    // Filter appointments that fall within the current hour slot
                    const appointmentsInHour = getAppointmentsForDay(date)
                        .filter(appt => {
                        // Parse appointment start and calculate appointment end time
                        const apptStart = dayjs(`${appt.date} ${appt.startTime}`, 'YYYY-MM-DD HH:mm');
                        const apptEnd = apptStart.add(appt.duration, 'minutes');
                        // Include if any part of the appointment overlaps with this hour slot
                        return apptStart.isBefore(hourEnd) && apptEnd.isAfter(hourStart);
                        });

                    return (
                        <div
                        key={`${date.format('YYYY-MM-DD')}-${hour}`}
                        className="h-16 border-b border-l border-gray-200/80 dark:border-gray-600 relative"
                        >
                        {/* Container for all appointments in this time block */}
                        <div className="absolute inset-0 p-1 space-y-px overflow-hidden flex flex-col justify-center">
                            {appointmentsInHour.map((appt) => {
                            // Determine the color class based on appointment category
                            const colorClass =
                                categoryColors[appt.category?.toLowerCase()] || categoryColors.default;

                            // Create a human-readable time range string
                            const timeRange = `${dayjs(`${appt.date} ${appt.startTime}`, 'YYYY-MM-DD HH:mm').format('h:mm A')} - ${dayjs(`${appt.date} ${appt.endTime}`, 'YYYY-MM-DD HH:mm').format('h:mm A')}`;

                            return (
                                <div
                                key={`${appt.id}-${hour}`}
                                className={`rounded-lg ${colorClass} p-2 cursor-pointer hover:shadow-sm transition-all`}
                                onClick={(e) => {
                                    // Prevent the parent slot click and handle appointment selection
                                    e.stopPropagation();
                                    onAppointmentSelect(appt);
                                }}
                                >
                                {/* Display the patient's name */}
                                <p className="text-xs font-medium truncate text-gray-800 dark:text-gray-100">
                                    {appt.patientName}
                                </p>
                                {/* Display the time range for the appointment */}
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

      {/* Color Legend */}
      <div className="flex flex-wrap items-center justify-center gap-4 px-4 py-4 bg-white/80 dark:bg-gray-800/80 rounded-xl shadow-md mt-6 mx-4 border border-gray-200/80 dark:border-gray-600">
        {Object.entries(colors).map(([key, value]) => (
          <div
            key={key}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/90 dark:bg-gray-700/90 border border-gray-200/80 dark:border-gray-600 backdrop-blur-sm"
          >
            <div className={`w-3 h-3 rounded-full ${value}`} />
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
