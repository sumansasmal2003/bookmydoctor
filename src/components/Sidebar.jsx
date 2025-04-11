// src/components/Sidebar.jsx
import React from 'react';
import { Calendar as CalendarIcon, List, X } from 'lucide-react'; // Icons for navigation
import { FaPhone } from 'react-icons/fa6'; // Emergency icon

// Sidebar component for main navigation and emergency contact
const Sidebar = ({ currentView, onViewChange, isOpen, onClose, appointmentCount = 0 }) => {

  // Navigation items for sidebar
  const navItems = [
    { id: 'booking', label: 'Book Doctor', icon: CalendarIcon },
    { id: 'appointments', label: 'Appointments', icon: List },
  ];

  return (
    <>
      {/* Overlay for mobile to close sidebar on outside click */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-transparent bg-opacity-70 z-30 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Drawer */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 p-4 transform transition-transform duration-300 ease-in-out flex flex-col shadow-lg
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0
        bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100`}
      >

        {/* Logo and Close Button */}
        <div className="flex justify-center items-center gap-4 mb-8 w-full">
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-700 via-fuchsia-700 to-emerald-700">
            BookMyDoctor
          </h2>
          {/* Mobile Close Button */}
          <button
            onClick={onClose}
            className="md:hidden hover:text-gray-200 focus:outline-none bg-white dark:bg-gray-800 p-1 rounded-lg text-black dark:text-gray-100"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1">
          <ul>
            {navItems.map((item) => (
              <li key={item.id} className="mb-3">
                <button
                  onClick={() => onViewChange(item.id)}
                  className={`w-full cursor-pointer flex items-center px-4 py-3 rounded-lg transition-colors duration-200
                    ${currentView === item.id
                      ? 'bg-slate-200 bg-opacity-70 text-blue-800 shadow-inner dark:bg-gray-800 dark:text-blue-200 font-bold'
                      : 'text-blue-600 hover:bg-white hover:bg-opacity-10 hover:text-blue-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-blue-200 font-bold'
                    }`}
                >
                  {/* Icon and Label */}
                  <item.icon size={20} className="mr-3" />
                  <span className="flex items-center gap-2">
                    {item.label}
                    {/* Show appointment count only for 'Appointments' tab */}
                    {item.id === 'appointments' && appointmentCount > 0 && (
                      <span className="ml-1 text-xs font-semibold bg-red-500 text-white rounded-full px-2 py-0.5">
                        {appointmentCount}
                      </span>
                    )}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Sidebar Footer – Emergency Contact Info */}
        <div className="mt-auto text-center text-sm text-blue-700 dark:text-blue-300 border-t-2">
          <div className="flex items-center justify-center gap-3 mt-2">
            {/* Emergency Phone Icon */}
            <div className="bg-blue-400 p-2.5 text-white rounded-xl">
              <FaPhone />
            </div>
            {/* Phone Number & Label */}
            <div className="flex flex-col items-center justify-center">
              <p className="italic font-semibold text-sm">Emergency Call:</p>
              <p className="font-mono text-xs font-semibold text-amber-500">+91 1234567890</p>
            </div>
          </div>
          <p className="mt-2 font-bold text-xs">&copy; {new Date().getFullYear()} BookMyDoctor</p>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
