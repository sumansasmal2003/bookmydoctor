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

// Dummy doctor data
const doctors = [
  { id: 'doc1', name: 'Dr. Alice Smith (Cardiology)' },
  { id: 'doc2', name: 'Dr. Bob Johnson (Neurology)' },
  { id: 'doc3', name: 'Dr. Carol Williams (Pediatrics)' },
];

// Custom styling per category
const categoryColors = {
  emergency: 'border-red-400 bg-red-50 dark:bg-red-900/30 dark:border-red-600',
  examination: 'border-amber-400 bg-amber-50 dark:bg-amber-900/30 dark:border-amber-600',
  consultation: 'border-purple-400 bg-purple-50 dark:bg-purple-900/30 dark:border-purple-600',
  'routine checkup': 'border-green-400 bg-green-50 dark:bg-green-900/30 dark:border-green-600',
  'sick visit': 'border-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 dark:border-indigo-600',
  default: 'border-gray-400 bg-gray-50 dark:bg-gray-900/30 dark:border-gray-600',
};

const AppointmentModal = ({
  date, // Selected date
  onClose, // Modal close handler
  onSave, // Callback to save data
  existingAppointment, // If editing
  existingAppointments = [] // All appointments for conflict check
}) => {
  const isEditMode = !!existingAppointment;

  // ------------------------------
  // Form state initialization
  const [formData, setFormData] = useState({
    patientName: '',
    doctor: doctors[0]?.id || '',
    startTime: '09:00',
    endTime: '09:30',
    details: '',
    category: 'consultation',
  });

  const [error, setError] = useState('');

  // ------------------------------
  // Set initial values based on edit or new
  useEffect(() => {
    if (isEditMode) {
      // Set data from existing appointment
      setFormData({
        patientName: existingAppointment.patientName || '',
        doctor: existingAppointment.doctor || doctors[0]?.id,
        startTime: existingAppointment.startTime || existingAppointment.time || '09:00',
        endTime: existingAppointment.endTime || '',
        details: existingAppointment.details || '',
        category: existingAppointment.category || 'consultation',
      });

      // If no endTime, calculate using duration
      if (!existingAppointment.endTime && (existingAppointment.startTime || existingAppointment.time)) {
        const start = dayjs(`${existingAppointment.date} ${existingAppointment.startTime || existingAppointment.time}`);
        const duration = typeof existingAppointment.duration === 'number' ? existingAppointment.duration : 30;
        if (start.isValid()) {
          setFormData(prev => ({ ...prev, endTime: start.add(duration, 'minute').format('HH:mm') }));
        }
      }
    } else {
      // New booking
      const start = dayjs(date);
      setFormData({
        patientName: '',
        doctor: doctors[0]?.id || '',
        startTime: start.format('HH:mm') || '09:00',
        endTime: start.add(30, 'minute').format('HH:mm') || '09:30',
        details: '',
        category: 'consultation',
      });
    }
  }, [existingAppointment, date, isEditMode]);

  // ------------------------------
  // Validate conflicts with other appointments
  const checkConflict = (newAppt) => {
    const dateStr = dayjs(date).format('YYYY-MM-DD');
    const newStart = dayjs(`${dateStr} ${newAppt.startTime}`);
    const newEnd = dayjs(`${dateStr} ${newAppt.endTime}`);

    return existingAppointments.some(appt => {
      if (isEditMode && appt.id === newAppt.id) return false;
      if (appt.doctor !== newAppt.doctor || appt.date !== dateStr) return false;

      const apptStart = dayjs(`${appt.date} ${appt.startTime || appt.time}`);
      const apptEnd = dayjs(`${appt.date} ${appt.endTime}`);

      return (
        newStart.isBefore(apptEnd) && newEnd.isAfter(apptStart)
      );
    });
  };

  // ------------------------------
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const { patientName, doctor, startTime, endTime } = formData;
    const dateStr = dayjs(date).format('YYYY-MM-DD');

    // Validation
    if (!patientName || !doctor || !startTime || !endTime) {
      setError('Please fill in all required fields.');
      return;
    }

    const start = dayjs(`${dateStr} ${startTime}`);
    const end = dayjs(`${dateStr} ${endTime}`);
    const duration = end.diff(start, 'minute');

    if (!start.isValid() || !end.isValid() || duration <= 0) {
      setError('End time must be after start time.');
      return;
    }

    const appointment = {
      ...formData,
      id: isEditMode ? existingAppointment.id : Date.now(),
      date: dateStr,
      duration
    };

    if (checkConflict(appointment)) {
      setError('This time slot is already taken by another appointment.');
      return;
    }

    onSave(appointment);
    onClose();
  };

  // ------------------------------
  // Handle form changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // ------------------------------
  // UI Rendering
  const formattedDate = dayjs(date).format('MMMM D, YYYY');

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
            {isEditMode ? 'Edit Appointment' : 'New Appointment'} on {formattedDate}
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

          {/* Doctor Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
              Select Doctor
            </label>
            <div className="relative">
              <FaUserMd className="absolute top-3 left-3 text-purple-500 dark:text-blue-400" />
              <select
                name="doctor"
                value={formData.doctor}
                onChange={handleInputChange}
                className="pl-10 w-full p-2.5 rounded-lg border border-gray-300/90
                  dark:border-gray-600 bg-white/95 dark:bg-gray-700/95
                  text-gray-900 dark:text-gray-100 focus:ring-2
                  focus:ring-blue-300/50 dark:focus:ring-purple-400/50"
                required
              >
                {doctors.map(doc => (
                  <option key={doc.id} value={doc.id}>{doc.name}</option>
                ))}
              </select>
            </div>
          </div>

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
