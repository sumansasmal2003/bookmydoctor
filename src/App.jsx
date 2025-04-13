// src/App.jsx
import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import {
  Menu,
  X,
  Calendar as CalendarIcon,
  List,
  Sun,
  Moon
} from 'lucide-react';
import { FaHandHoldingMedical } from 'react-icons/fa6';

// Import Components
import Calendar from './components/Calendar';
import AppointmentModal from './components/AppointmentModal';
import DateSelector from './components/DateSelector';
import Sidebar from './components/Sidebar';
import ReadOnlyCalendar from './components/ReadOnlyCalendar';
import AppointmentDetailsModal from './components/AppointmentDetailsModal';
import ToastNotification from './components/ToastNotification';
import DoctorSearch from './components/DoctorSearch'; // New DoctorSearch component
import DoctorDetails from './components/DoctorDetails';

import { AnimatePresence } from 'framer-motion';
import doctors from './data/doctors';

const App = () => {
  // ---- STATE MANAGEMENT ----
  const [theme, setTheme] = useState('light'); // Current theme: 'light' or 'dark'
  const [selectedDate, setSelectedDate] = useState(dayjs()); // Date chosen for booking/editing
  const [weekStart, setWeekStart] = useState(dayjs().startOf('week')); // Start of current week view
  const [appointments, setAppointments] = useState([]); // All saved appointments
  const [selectedAppointment, setSelectedAppointment] = useState(null); // Appointment currently being edited or viewed
  const [isModalOpen, setIsModalOpen] = useState(false); // Controls the AppointmentModal visibility
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Controls mobile sidebar visibility
  const [currentView, setCurrentView] = useState('booking'); // View mode: 'booking' or 'appointments'
  const [filteredDoctorId, setFilteredDoctorId] = useState(''); // For filtering appointments in overview
  const [notification, setNotification] = useState(null); // Global toast notification message
  const [color, setColor] = useState(); // Toast notification background gradient
  const [selectedBookingDoctor, setSelectedBookingDoctor] = useState(''); // Holds doctor ID from DoctorSearch for new bookings

  // ---- EFFECTS ----

  // Apply theme by toggling the 'dark' class on the root element
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  // Load appointments from localStorage on initial render
  useEffect(() => {
    try {
      const storedAppointments = localStorage.getItem('appointments');
      if (storedAppointments) {
        const parsedAppointments = JSON.parse(storedAppointments).map(apt => ({
          ...apt,
          date: dayjs(apt.date), // Convert string back to dayjs object
        }));
        setAppointments(parsedAppointments);
      }
    } catch (error) {
      console.error("Error loading appointments from localStorage:", error);
    }
  }, []);

  // Save appointments to localStorage on appointments state change
  useEffect(() => {
    try {
      const appointmentsToStore = appointments.map(apt => ({
        ...apt,
        date: dayjs(apt.date), // Save as ISO string
      }));
      localStorage.setItem('appointments', JSON.stringify(appointmentsToStore));
    } catch (error) {
      console.error("Error saving appointments to localStorage:", error);
    }
  }, [appointments]);

  // ---- HANDLERS ----

  // Toggle theme (light/dark)
  const toggleTheme = () => setTheme(prev => (prev === 'light' ? 'dark' : 'light'));

  // Update weekStart when a new date is selected (e.g., from DateSelector)
  const handleDateSelect = (date) => setWeekStart(date.startOf('week'));

  // Save new or updated appointment
  const handleSaveAppointment = (appointment) => {
    setAppointments(prev => {
      const exists = prev.some(a => a.id === appointment.id);
      return exists
        ? prev.map(a => (a.id === appointment.id ? appointment : a))
        : [...prev, appointment];
    });
    setIsModalOpen(false);
    setSelectedAppointment(null);
  };

  // Handle appointment click: either editing or deleting the appointment.
  const handleAppointmentClick = (appointment, action = 'edit') => {
    if (action === 'delete') {
      setAppointments(prev => prev.filter(a => a.id !== appointment.id));
    } else {
      setSelectedAppointment(appointment);
      setSelectedDate(appointment.date);
      setIsModalOpen(true);
    }
  };

  // Handle clicking on an empty slot to create a new appointment
  const handleSlotClick = (date) => {
    setSelectedDate(date);
    setSelectedAppointment(null);
    setSelectedBookingDoctor(''); // Reset doctor selection
    setIsModalOpen(true);
  };
  // Close the appointment modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAppointment(null);
  };

  // Change main view via sidebar navigation
  const handleViewChange = (view) => {
    setCurrentView(view);
    setIsSidebarOpen(false);
  };

  // Toggle sidebar visibility (mobile)
  const toggleSidebar = () => setIsSidebarOpen(prev => !prev);

  // Show toast notification (with customizable color)
  const showNotification = (message, colorCode) => {
    setNotification(message);
    setColor(colorCode);
    setTimeout(() => setNotification(null), 10000);
  };

  // ---- RENDERING ----

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50/60 to-purple-50/60 dark:from-gray-900 dark:to-gray-800 font-sans">

      {/* Sidebar Navigation */}
      <Sidebar
        currentView={currentView}
        onViewChange={handleViewChange}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        appointmentCount={appointments.length}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header Bar */}
        <header className="bg-white/90 dark:bg-gray-800/90 shadow-lg p-4 flex justify-between items-center backdrop-blur-sm border-b border-gray-200/80 dark:border-gray-600">
          <div className="flex items-center space-x-4">
            {/* Toggle sidebar (mobile) */}
            <button
              onClick={toggleSidebar}
              className="md:hidden p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white focus:outline-none"
              aria-label="Open sidebar"
            >
              <Menu size={24} />
            </button>
            {/* Toggle theme button */}
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white focus:outline-none cursor-pointer border rounded-full shadow-xl"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon size={24} /> : <Sun size={24} />}
            </button>
          </div>
          {/* App Title and Logo */}
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
              BookMyDoctor
            </h1>
            <FaHandHoldingMedical className="text-purple-400 text-2xl dark:text-purple-300" />
          </div>
        </header>

        {/* Main Body: Conditional rendering of Booking or Appointments view */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900 p-4 md:p-6 lg:p-8">
          {currentView === 'booking' && (
            <>
              {/* DoctorSearch Component for selecting a doctor for booking */}
              <DoctorSearch
                doctors={doctors}
                onDoctorSelect={(doctorId) => {
                    setSelectedBookingDoctor(doctorId);     // Set selected doctor
                    setSelectedAppointment(null);           // Make sure it's a new booking
                    setIsModalOpen(true);                   // Open booking modal
                }}
                />

              {/* Date Selector for Booking View */}
              <DateSelector selectedDate={weekStart} onSelect={handleDateSelect} />

              {/* Calendar View showing available time slots */}
              <Calendar
                weekStart={weekStart}
                appointments={appointments}
                onSlotClick={handleSlotClick}
                onAppointmentClick={handleAppointmentClick}
              />
            </>
          )}

          {currentView === 'doctors' && (
            <>
            <DoctorDetails
              onDoctorSelect={(doctorId) => {
                setSelectedBookingDoctor(doctorId);
                setSelectedAppointment(null);
                setIsModalOpen(true);
              }}
            />

            {isModalOpen && (
              <AppointmentModal
                date={dayjs()} // Or your preferred default date
                onClose={() => setIsModalOpen(false)}
                onSave={(appointmentData) => {
                  // Handle save logic here
                  console.log('Saving appointment:', appointmentData);
                  setIsModalOpen(false);
                }}
                initialDoctor={selectedBookingDoctor}
              />
            )}
          </>
          )}

          {currentView === 'appointments' && (
            <div className="space-y-6">
              {/* Appointments Overview with doctor filter */}
              <div className="bg-white/90 dark:bg-gray-800/90 p-4 rounded-xl shadow-xl backdrop-blur-sm border border-gray-200/80 dark:border-gray-600">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                    Appointments Overview
                  </h2>
                  <select
                    value={filteredDoctorId}
                    onChange={(e) => setFilteredDoctorId(e.target.value)}
                    className="p-2 rounded-lg border border-gray-300/90 dark:border-gray-600 bg-white/95 dark:bg-gray-700/95 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-300/50 dark:focus:ring-purple-400/50"
                  >
                    <option value="">All Doctors</option>
                    {doctors.map(doc => (
                      <option key={doc.id} value={doc.id}>{doc.name}</option>
                    ))}
                  </select>
                </div>

                {/* Date Selector for Appointments View */}
                <DateSelector selectedDate={weekStart} onSelect={handleDateSelect} />

                {/* Read-Only Calendar to display appointments */}
                <ReadOnlyCalendar
                  weekStart={weekStart}
                  appointments={
                    filteredDoctorId
                      ? appointments.filter(a => a.doctor === filteredDoctorId)
                      : appointments
                  }
                  onAppointmentSelect={appt => setSelectedAppointment(appt)}
                />
              </div>

              {/* Read-only Appointment Details Modal */}
              {selectedAppointment && (
                <AppointmentDetailsModal
                  appointment={selectedAppointment}
                  doctors={doctors}
                  onClose={() => setSelectedAppointment(null)}
                />
              )}
            </div>
          )}
        </main>
      </div>

      {/* Booking/Edit Modal */}
      {isModalOpen && (
        <AppointmentModal
          date={selectedDate}
          onClose={handleCloseModal}
          // When saving, update the appointments and display a notification.
          onSave={(appointmentData) => {
            handleSaveAppointment(appointmentData);
            showNotification(
              `Appointment ${selectedAppointment ? 'updated' : 'created'} successfully!`,
              'from-green-500 to-blue-500'
            );
          }}
          existingAppointment={selectedAppointment}
          allAppointments={appointments}
          // Pre-fill the doctor field if a doctor is selected in the search component.
          initialDoctor={selectedBookingDoctor}
        />
      )}

      {/* Global Toast Notification */}
      <AnimatePresence>
        {notification && (
          <ToastNotification
            message={notification}
            onClose={() => setNotification(null)}
            color={color}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
