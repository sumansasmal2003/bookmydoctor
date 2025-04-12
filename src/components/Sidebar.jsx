import React from 'react';
import { Calendar as CalendarIcon, List, X } from 'lucide-react';
import { FaPhone } from 'react-icons/fa6';

const Sidebar = ({ currentView, onViewChange, isOpen, onClose, appointmentCount = 0 }) => {
  const navItems = [
    { id: 'booking', label: 'Book Doctor', icon: CalendarIcon },
    { id: 'appointments', label: 'Appointments', icon: List },
  ];

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 p-4 transform transition-transform duration-300 ease-in-out flex flex-col
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0
        bg-gradient-to-br from-blue-50/90 to-purple-50/90 dark:from-gray-800 dark:to-gray-900
        border-r border-gray-200/80 dark:border-gray-600 shadow-xl`}
      >

        {/* Header Section */}
        <div className="flex justify-center gap-3 items-center mb-8 px-2">
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
            BookMyDoctor
          </h2>
          <button
            onClick={onClose}
            className="md:hidden p-1.5 rounded-lg bg-white/80 dark:bg-gray-700/80 hover:bg-white dark:hover:bg-gray-600 transition-colors"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5 text-gray-700 dark:text-gray-200" />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => onViewChange(item.id)}
                  className={`w-full flex items-center px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer
                    ${currentView === item.id
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-blue-100/50 dark:hover:bg-gray-700/50 hover:text-blue-700 dark:hover:text-blue-300'
                    }`}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  <span className="flex items-center gap-2">
                    {item.label}
                    {item.id === 'appointments' && appointmentCount > 0 && (
                      <span className="ml-1 text-xs font-semibold bg-red-500 dark:bg-red-600 text-white rounded-full px-2 py-0.5">
                        {appointmentCount}
                      </span>
                    )}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer Section */}
        <div className="mt-auto pt-4 border-t border-gray-200/80 dark:border-gray-600">
          <div className="flex items-center gap-4 p-3 bg-white/80 dark:bg-gray-700/80 rounded-xl backdrop-blur-sm">
            <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-white">
              <FaPhone className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-600 dark:text-gray-300">Emergency:</p>
              <p className="text-sm font-semibold text-gray-800 dark:text-amber-300">+91 1234567890</p>
            </div>
          </div>
          <p className="mt-4 text-center text-xs text-gray-600 dark:text-gray-400">
            &copy; {new Date().getFullYear()} BookMyDoctor
          </p>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
