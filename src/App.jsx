// src/App.jsx
import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { Menu, X, Calendar as CalendarIcon, List, Sun, Moon } from 'lucide-react';
import { FaHandHoldingMedical } from "react-icons/fa6";

// Component imports
import Calendar from './components/Calendar';
import AppointmentModal from './components/AppointmentModal';
import DateSelector from './components/DateSelector';
import Sidebar from './components/Sidebar';
import ReadOnlyCalendar from './components/ReadOnlyCalendar';
import AppointmentDetailsModal from './components/AppointmentDetailsModal';
import ToastNotification from './components/ToastNotification';

import { AnimatePresence } from 'framer-motion';

const App = () => {
  // --- STATE MANAGEMENT ---

  const [theme, setTheme] = useState('light'); // Light or dark mode
  const [selectedDate, setSelectedDate] = useState(dayjs()); // Date user is interacting with
  const [weekStart, setWeekStart] = useState(dayjs().startOf('week')); // Beginning of current calendar view
  const [appointments, setAppointments] = useState([]); // All saved appointments
  const [selectedAppointment, setSelectedAppointment] = useState(null); // Currently viewed/edited appointment
  const [isModalOpen, setIsModalOpen] = useState(false); // Control for booking/editing modal
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile sidebar
  const [currentView, setCurrentView] = useState('booking'); // 'booking' or 'appointments' view
  const [filteredDoctorId, setFilteredDoctorId] = useState(''); // Filter by doctor ID
  const [notification, setNotification] = useState(null); // Notification message
  const [color, setColor] = useState(); // Notification color

  // List of doctors
  const doctors = [
    { id: 'doc1', name: 'Dr. Alice Smith (Cardiology)' },
    { id: 'doc2', name: 'Dr. Bob Johnson (Neurology)' },
    { id: 'doc3', name: 'Dr. Carol Williams (Pediatrics)' },
  ];

  // --- EFFECTS ---

  // Apply the selected theme to the root element
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  // Load appointments from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('appointments');
      if (stored) {
        const parsed = JSON.parse(stored).map(appt => ({
          ...appt,
          date: dayjs(appt.date),
        }));
        setAppointments(parsed);
      }
    } catch (e) {
      console.error('Error loading appointments:', e);
    }
  }, []);

  // Save appointments to localStorage
  useEffect(() => {
    try {
      const toStore = appointments.map(appt => ({
        ...appt,
        date: appt.date.toISOString(),
      }));
      localStorage.setItem('appointments', JSON.stringify(toStore));
    } catch (e) {
      console.error('Error saving appointments:', e);
    }
  }, [appointments]);

  // --- HANDLERS ---

  const toggleTheme = () => setTheme(prev => (prev === 'light' ? 'dark' : 'light'));

  const handleDateSelect = (date) => setWeekStart(date.startOf('week'));

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

  const handleAppointmentClick = (appointment, action = 'edit') => {
    if (action === 'delete') {
      setAppointments(prev => prev.filter(a => a.id !== appointment.id));
    } else {
      setSelectedAppointment(appointment);
      setSelectedDate(appointment.date);
      setIsModalOpen(true);
    }
  };

  const handleSlotClick = (date) => {
    setSelectedDate(date);
    setSelectedAppointment(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAppointment(null);
  };

  const handleViewChange = (view) => {
    setCurrentView(view);
    setIsSidebarOpen(false);
  };

  const toggleSidebar = () => setIsSidebarOpen(prev => !prev);

  const showNotification = (message, colorCode) => {
    setNotification(message);
    setColor(colorCode);
    setTimeout(() => setNotification(null), 10000);
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 font-sans">
      {/* Sidebar Navigation */}
      <Sidebar
        currentView={currentView}
        onViewChange={handleViewChange}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        appointmentCount={appointments.length}
      />

      {/* Main Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header Bar */}
        <header className="bg-white dark:bg-gray-800 shadow-md p-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleSidebar}
              className="md:hidden p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white focus:outline-none"
              aria-label="Open sidebar"
            >
              <Menu size={24} />
            </button>
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white focus:outline-none"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon size={24} /> : <Sun size={24} />}
            </button>
          </div>
          {/* App Title */}
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-l from-rose-500 via-fuchsia-500 to-cyan-500">
              BookMyDoctor
            </h1>
            <FaHandHoldingMedical className="text-rose-400 text-2xl" />
          </div>
        </header>

        {/* Main View Logic */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900 p-4 md:p-6 lg:p-8">
          {currentView === 'booking' && (
            <>
              <DateSelector selectedDate={weekStart} onSelect={handleDateSelect} />
              <Calendar
                weekStart={weekStart}
                appointments={appointments}
                onSlotClick={handleSlotClick}
                onAppointmentClick={handleAppointmentClick}
              />
            </>
          )}

          {currentView === 'appointments' && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Appointments Overview</h2>
                  <select
                    value={filteredDoctorId}
                    onChange={(e) => setFilteredDoctorId(e.target.value)}
                    className="p-2 border rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-600"
                  >
                    <option value="">All Doctors</option>
                    {doctors.map(doc => (
                      <option key={doc.id} value={doc.id}>{doc.name}</option>
                    ))}
                  </select>
                </div>

                <DateSelector selectedDate={weekStart} onSelect={handleDateSelect} />

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

              {/* View-only appointment details modal */}
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

      {/* Booking Modal */}
      {isModalOpen && (
        <AppointmentModal
          date={selectedDate}
          onClose={handleCloseModal}
          onSave={(appointmentData) => {
            handleSaveAppointment(appointmentData);
            showNotification(`Appointment ${selectedAppointment ? 'updated' : 'created'} successfully!`, 'bg-green-500');
          }}
          existingAppointment={selectedAppointment}
          allAppointments={appointments}
        />
      )}

      {/* Toast Notification */}
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
