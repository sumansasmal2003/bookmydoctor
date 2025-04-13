// src/components/AppointmentDetailsModal.jsx
import React from 'react';
import dayjs from 'dayjs';
import { X } from 'lucide-react'; // Import the close icon from lucide-react

// -----------------------------
// Reusable subcomponent: DetailItem
// This component displays a single label and its associated value in a row.
// If no value is provided, it displays 'N/A'.
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

// -----------------------------
// Main component: AppointmentDetailsModal
// This modal shows detailed appointment information.
// Props:
// - appointment: the appointment object containing all the appointment details.
// - onClose: function to close the modal.
// - doctors: an array of doctor objects used to lookup doctor details.

const AppointmentDetailsModal = ({ appointment, onClose, doctors }) => {
  if (!appointment) return null;

   // If there is no appointment provided, do not render the modal.
  const doctor = doctors.find(d => d.id === appointment.doctor);

   // Format the appointment date using dayjs (e.g., "Mar 3, 2023").
  const formattedDate = dayjs(appointment.date).format('MMM D, YYYY');

  // Build a string showing the appointment time range.
  // If endTime is missing, calculate it by adding duration to the start time.
  const timeRange = `${appointment.startTime || appointment.time} - ${
    appointment.endTime ||
    dayjs(`${appointment.date} ${appointment.time}`, 'YYYY-MM-DD HH:mm')
      .add(appointment.duration, 'minute')
      .format('HH:mm')
  }`;

  return (
    // Full-screen overlay with a gradient background for visual appeal in both light and dark modes.
    <div className="fixed inset-0 z-50 flex items-center justify-center
      bg-gradient-to-br from-amber-50 to-blue-100 backdrop-blur-sm
      dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800 p-4">

      {/* Modal container with a semi-transparent background and gentle horizontal gradient */}
      <div className="relative bg-white/95 dark:bg-gray-800/95 rounded-2xl
        shadow-xl p-8 max-w-lg w-full border border-gray-200
        dark:border-gray-600 ring-1 ring-black/5
        dark:ring-white/10">

        {/* Close button positioned at the top-right corner */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-amber-600 hover:text-amber-700
            dark:text-gray-300 dark:hover:text-gray-100 transition-colors
            focus:outline-none cursor-pointer"
          aria-label="Close"
        >
          <X size={24} />
        </button>

        {/* Modal Title: Displays the header of the modal */}
        <h3 className="text-2xl font-semibold mb-6
          dark:text-gray-100 text-center bg-gradient-to-r from-amber-600 to-blue-600
          dark:from-amber-400 dark:to-blue-400 bg-clip-text text-transparent">
          Appointment Details
        </h3>

        {/* Detail Section: Uses the DetailItem component to display each piece of information */}
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
