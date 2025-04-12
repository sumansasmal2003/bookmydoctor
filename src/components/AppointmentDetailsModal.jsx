import React from 'react';
import dayjs from 'dayjs';
import { X } from 'lucide-react';

const DetailItem = ({ label, value }) => (
  <div className="flex items-start border-b border-gray-100 dark:border-gray-600 pb-2">
    <dt className="w-1/3 font-medium text-gray-700 dark:text-gray-300 text-sm">
      {label}
    </dt>
    <dd className="w-2/3 text-gray-900 dark:text-gray-100 text-sm">
      {value || 'N/A'}
    </dd>
  </div>
);

const AppointmentDetailsModal = ({ appointment, onClose, doctors }) => {
  if (!appointment) return null;

  const doctor = doctors.find(d => d.id === appointment.doctor);
  const formattedDate = dayjs(appointment.date).format('MMM D, YYYY');
  const timeRange = `${appointment.startTime || appointment.time} - ${
    appointment.endTime ||
    dayjs(`${appointment.date} ${appointment.time}`, 'YYYY-MM-DD HH:mm')
      .add(appointment.duration, 'minute')
      .format('HH:mm')
  }`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center
      bg-gradient-to-br from-amber-50 to-blue-100 backdrop-blur-sm
      dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800 p-4">

      <div className="relative bg-white/95 dark:bg-gray-800/95 rounded-2xl
        shadow-xl p-8 max-w-lg w-full border border-gray-200
        dark:border-gray-600 ring-1 ring-black/5
        dark:ring-white/10">

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-amber-600 hover:text-amber-700
            dark:text-gray-300 dark:hover:text-gray-100 transition-colors
            focus:outline-none cursor-pointer"
          aria-label="Close"
        >
          <X size={24} />
        </button>

        <h3 className="text-2xl font-semibold mb-6
          dark:text-gray-100 text-center bg-gradient-to-r from-amber-600 to-blue-600
          dark:from-amber-400 dark:to-blue-400 bg-clip-text text-transparent">
          Appointment Details
        </h3>

        <dl className="space-y-4">
          <DetailItem label="Patient" value={appointment.patientName} />
          <DetailItem label="Doctor" value={doctor?.name || 'Unknown Doctor'} />
          <DetailItem label="Date" value={formattedDate} />
          <DetailItem label="Time" value={timeRange} />
          <DetailItem label="Category" value={appointment.category} />
          <DetailItem label="Details" value={appointment.details} />
        </dl>
      </div>
    </div>
  );
};

export default AppointmentDetailsModal;
