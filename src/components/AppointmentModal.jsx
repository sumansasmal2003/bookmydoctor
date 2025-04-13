// src/components/AppointmentModal.jsx
import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import {
  FaTimes,
  FaCalendarAlt,
  FaUser,
  FaUserMd,
  FaInfoCircle,
} from 'react-icons/fa';

import doctors from '../data/doctors';
import DoctorSelector from './DoctorSelector';

// Category color styling (for demonstration)
const categoryColors = {
  emergency: 'border-red-400 bg-red-50 dark:bg-red-900/30 dark:border-red-600',
  examination: 'border-amber-400 bg-amber-50 dark:bg-amber-900/30 dark:border-amber-600',
  consultation: 'border-purple-400 bg-purple-50 dark:bg-purple-900/30 dark:border-purple-600',
  'routine checkup': 'border-green-400 bg-green-50 dark:bg-green-900/30 dark:border-green-600',
  'sick visit': 'border-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 dark:border-indigo-600',
  default: 'border-gray-400 bg-gray-50 dark:bg-gray-900/30 dark:border-gray-600',
};

/**
 * AppointmentModal Component
 *
 * Props:
 * - date: the selected date (dayjs object)
 * - onClose: callback to close the modal
 * - onSave: callback to save the appointment data
 * - existingAppointment: if editing, the appointment data to prefill
 * - allAppointments: array of existing appointments (used for conflict checking)
 * - initialDoctor: (new prop) the doctor ID selected from the doctor search component,
 *                  used as the default when creating a new appointment.
 */
const AppointmentModal = ({
  date,
  onClose,
  onSave,
  existingAppointment,
  allAppointments = [],
  initialDoctor, // New prop for default doctor selection
}) => {
  // Determine if we are in edit mode based on existence of existingAppointment prop
  const isEditMode = !!existingAppointment;

  // State to hold form data
  const [formData, setFormData] = useState({
    patientName: '',
    doctor: '', // Will be initialized in useEffect
    startTime: '09:00',
    endTime: '09:30',
    details: '',
    category: 'consultation',
  });

  const [error, setError] = useState('');

  // ------------------------------
  // useEffect to initialize or update form state when modal opens or relevant props change.
  useEffect(() => {
    if (isEditMode) {
      // If editing, populate the form with existing appointment details.
      setFormData({
        patientName: existingAppointment.patientName || '',
        doctor: existingAppointment.doctor || (doctors[0]?.id || ''),
        // For backward compatibility, use existingAppointment.startTime or fallback to time field.
        startTime: existingAppointment.startTime || existingAppointment.time || '09:00',
        endTime: existingAppointment.endTime || '', // Let user adjust if missing.
        details: existingAppointment.details || '',
        category: existingAppointment.category || 'consultation',
      });
      // If endTime is missing, calculate a default value using duration.
      if (!existingAppointment.endTime && (existingAppointment.startTime || existingAppointment.time)) {
        const start = dayjs(`${existingAppointment.date} ${existingAppointment.startTime || existingAppointment.time}`);
        const duration = typeof existingAppointment.duration === 'number' ? existingAppointment.duration : 30;
        if (start.isValid()) {
          setFormData(prev => ({ ...prev, endTime: start.add(duration, 'minute').format('HH:mm') }));
        } else {
          setFormData(prev => ({ ...prev, endTime: '09:30' }));
        }
      }
    } else {
      // When creating a new appointment, prefill defaults.
      // Use initialDoctor if provided; otherwise, use the first doctor.
      const defaultDoctor = initialDoctor || doctors[0]?.id || '';
      const start = dayjs(date);
      setFormData({
        patientName: '',
        doctor: defaultDoctor,
        startTime: start.isValid() ? start.format('HH:mm') : '09:00',
        endTime: start.isValid() ? start.add(30, 'minute').format('HH:mm') : '09:30',
        details: '',
        category: 'consultation',
      });
    }
  }, [existingAppointment, date, isEditMode, initialDoctor]);

  // Memoized date strings for display
  const currentIsoDateStr = isEditMode
    ? existingAppointment.date
    : (dayjs(date).isValid() ? dayjs(date).format('YYYY-MM-DD') : '');
  const currentFormattedDateStr = isEditMode
    ? dayjs(existingAppointment.date).format('MMMM D, YYYY')
    : dayjs(date).format('MMMM D, YYYY');

  // ------------------------------
  // Conflict checking function: ensures no overlapping appointments for the same doctor.
  const checkConflict = React.useCallback((newAppt) => {
    if (!newAppt.date || !newAppt.startTime || !newAppt.endTime) {
      console.error("Conflict check skipped: Invalid date/time data", newAppt);
      return false;
    }
    const newStart = dayjs(`${newAppt.date} ${newAppt.startTime}`);
    const newEnd = dayjs(`${newAppt.date} ${newAppt.endTime}`);
    if (!newStart.isValid() || !newEnd.isValid()) {
      console.error("Conflict check skipped: Invalid new appointment times", newAppt);
      return false;
    }
    return allAppointments.some(appt => {
      // Skip self when editing
      if (isEditMode && appt.id === newAppt.id) return false;
      // Check same doctor and date
      if (appt.doctor !== newAppt.doctor || appt.date !== newAppt.date) return false;
      // Parse existing appointment times
      const existingStart = dayjs(`${appt.date} ${appt.startTime || appt.time}`);
      const existingEnd = appt.endTime
        ? dayjs(`${appt.date} ${appt.endTime}`)
        : existingStart.add(appt.duration || 30, 'minute');
        // Ensure both dates are valid before comparing
    if (!newStart.isValid() || !newEnd.isValid() || !existingStart.isValid() || !existingEnd.isValid()) {
        return false;
      }
      // Check for overlap
      return (
        (newStart.isBefore(existingEnd) &&
        newEnd.isAfter(existingStart)
      ));
    });
  }, [allAppointments, isEditMode]);

  // ------------------------------
  // Handle form submission: validate fields, check conflicts, then call onSave.
  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    const { patientName, doctor, startTime, endTime } = formData;
    if (!patientName || !doctor || !startTime || !endTime) {
      setError('Please fill in all required fields.');
      return;
    }
    // Date handling
    const todayStr = dayjs().format('YYYY-MM-DD');
    const appointmentDate = initialDoctor ? todayStr : currentIsoDateStr;
    if (!appointmentDate) {
      setError("Cannot save, date is invalid.");
      return;
    }
     // Time validation
     const start = dayjs(`${appointmentDate} ${startTime}`);
     const end = dayjs(`${appointmentDate} ${endTime}`);
     if (!start.isValid() || !end.isValid() || end.isBefore(start)) {
       setError('End time must be after start time.');
       return;
     }
    const appointmentData = {
    ...formData,
    id: isEditMode ? existingAppointment.id : Date.now(),
    date: appointmentDate,
    duration: end.diff(start, 'minute'),
    };
     // Check for conflicts
     if (checkConflict(appointmentData)) {
        setError('This doctor already has an appointment during the selected time.');
        return;
      }
    // Save the appointment and close the modal
    onSave(appointmentData);
    onClose();
  };

  // ------------------------------
  // Handle changes in the form inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // ------------------------------
  // Render Modal JSX with proper styling and responsiveness
  const formattedDate = currentFormattedDateStr;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center
      bg-gradient-to-br from-blue-50/60 to-purple-50/60 backdrop-blur-sm
      dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800 p-2">

      <div className="relative bg-white/95 dark:bg-gray-800/95 rounded-2xl
        shadow-xl p-6 w-full max-w-xl border border-gray-200/80
        dark:border-gray-600 ring-1 ring-black/5
        dark:ring-white/10 overflow-y-auto">

        {/* Modal Header */}
        <div className="flex justify-between items-center mb-6 pb-4
          border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-bold flex items-center gap-3
            bg-gradient-to-r from-blue-600 to-purple-600
            dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
            <FaCalendarAlt className="text-blue-500 dark:text-purple-400" />
            {isEditMode
                ? `Edit Appointment on ${formattedDate}`
                : `New Appointment on ${initialDoctor ? dayjs().format('MMMM D, YYYY') : formattedDate}`
            }

          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700
              dark:text-gray-300 dark:hover:text-gray-100 transition-colors"
            aria-label="Close"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Patient Name Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
              Patient Name
            </label>
            <div className="relative">
              <FaUser className="absolute top-3 left-3 text-blue-500 dark:text-purple-400" />
              <input
                name="patientName"
                value={formData.patientName}
                onChange={handleInputChange}
                placeholder="Enter full name"
                className="pl-10 w-full p-2.5 rounded-lg border border-gray-300/90
                  dark:border-gray-600 bg-white/95 dark:bg-gray-700/95
                  text-gray-900 dark:text-gray-100 focus:ring-2
                  focus:ring-blue-300/50 dark:focus:ring-purple-400/50"
                required
              />
            </div>
          </div>

          {/* Time Inputs */}
          <div className="grid grid-cols-2 gap-4">
            {['startTime', 'endTime'].map((field, i) => (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  {i === 0 ? 'Start Time' : 'End Time'}
                </label>
                <input
                  type="time"
                  name={field}
                  value={formData[field]}
                  onChange={handleInputChange}
                  className="w-full p-2.5 rounded-lg border border-gray-300/90
                    dark:border-gray-600 bg-white/95 dark:bg-gray-700/95
                    text-gray-900 dark:text-gray-100 focus:ring-2
                    focus:ring-blue-300/50 dark:focus:ring-purple-400/50"
                  required
                />
              </div>
            ))}
          </div>

            <DoctorSelector
                doctors={doctors}
                selectedDoctorId={formData.doctor}
                onSelect={(id) => setFormData(prev => ({ ...prev, doctor: id }))}
            />

          {/* Category Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
              Appointment Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full p-2.5 rounded-lg border border-gray-300/90
                dark:border-gray-600 bg-white/95 dark:bg-gray-700/95
                text-gray-900 dark:text-gray-100 focus:ring-2
                focus:ring-blue-300/50 dark:focus:ring-purple-400/50"
            >
              {Object.keys(categoryColors).filter(c => c !== 'default').map(c => (
                <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
              ))}
            </select>
          </div>

          {/* Details Textarea */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
              Details (Optional)
            </label>
            <textarea
              name="details"
              value={formData.details}
              onChange={handleInputChange}
              rows="2"
              placeholder="e.g. symptoms, conditions..."
              className="w-full p-2.5 rounded-lg border border-gray-300/90
                dark:border-gray-600 bg-white/95 dark:bg-gray-700/95
                text-gray-900 dark:text-gray-100 focus:ring-2
                focus:ring-blue-300/50 dark:focus:ring-purple-400/50"
            />
          </div>

          {/* Error Message */}
          {error && (
            <p className="text-red-500 dark:text-red-400 text-sm text-center font-medium">
              {error}
            </p>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg font-medium
                bg-gray-100 hover:bg-gray-200 text-gray-700
                dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-100
                transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-lg font-medium text-white
                bg-gradient-to-r from-blue-600 to-purple-600
                dark:from-blue-700 dark:to-purple-700
                hover:from-blue-700 hover:to-purple-700
                dark:hover:from-blue-600 dark:hover:to-purple-600
                transition-all"
            >
              {isEditMode ? 'Save Changes' : 'Book Now'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AppointmentModal;
