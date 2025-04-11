// src/components/AppointmentDetailsModal.jsx
import React from 'react';
import dayjs from 'dayjs';
import { X } from 'lucide-react'; // Close icon

// -----------------------------
// Reusable subcomponent to display each detail in a label-value pair
const DetailItem = ({ label, value }) => (
  <div className="flex items-start border-b border-gray-200 dark:border-gray-700 pb-2">
    <dt className="w-1/3 font-medium text-gray-600 dark:text-gray-300 text-sm">
      {label}
    </dt>
    <dd className="w-2/3 text-gray-800 dark:text-gray-100 text-sm">
      {value || 'N/A'}
    </dd>
  </div>
);

// -----------------------------
// Main modal component
const AppointmentDetailsModal = ({ appointment, onClose, doctors }) => {
  // If no appointment is passed, don't render the modal
  if (!appointment) return null;

  // Find the doctor object from the provided list using the appointment's doctor ID
  const doctor = doctors.find(d => d.id === appointment.doctor);

  // Format appointment date
  const formattedDate = dayjs(appointment.date).format('MMM D, YYYY');

  // Create a time range string: fallback if endTime is missing
  const timeRange = `${appointment.startTime || appointment.time} - ${
    appointment.endTime ||
    dayjs(`${appointment.date} ${appointment.time}`, 'YYYY-MM-DD HH:mm')
      .add(appointment.duration, 'minute')
      .format('HH:mm')
  }`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-md p-4">
      {/* Modal container */}
      <div className="relative bg-white/80 dark:bg-gray-800/80 rounded-2xl shadow-2xl p-8 max-w-lg w-full border border-gray-200 dark:border-gray-700">

        {/* Top-right close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100 focus:outline-none"
          aria-label="Close Appointment Details"
        >
          <X size={24} />
        </button>

        {/* Modal Title */}
        <h3 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-100 text-center">
          Appointment Details
        </h3>

        {/* Appointment detail fields */}
        <dl className="space-y-4">
          <DetailItem label="Patient" value={appointment.patientName} />
          <DetailItem label="Doctor" value={doctor ? doctor.name : 'Unknown Doctor'} />
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
