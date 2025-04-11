// src/components/ToastNotification.jsx
import React from 'react';
import { FaTimes, FaCheckCircle } from 'react-icons/fa'; // Icons for notification
import { motion } from 'framer-motion'; // Animation library

/**
 * ToastNotification component
 * Displays a temporary notification message with animation and styling.
 */
const ToastNotification = ({ message, onClose, color = 'bg-green-500' }) => (
  <motion.div
    // Animate the toast sliding in from the bottom with fade effect
    initial={{ y: 100, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    exit={{ y: 100, opacity: 0 }}
    // Responsive positioning: center top for mobile, top-right for larger screens
    className={`fixed top-4 left-1/2 transform -translate-x-1/2
      sm:left-auto sm:translate-x-0 sm:top-4 sm:right-4
      p-4 pr-8 rounded-lg text-white shadow-xl flex items-center gap-3
      max-w-sm w-full z-50 ${color}`}
  >
    {/* Success Icon */}
    <FaCheckCircle className="text-xl" />

    {/* Notification Text */}
    <span className="font-medium">{message}</span>

    {/* Close Button */}
    <button
      onClick={onClose}
      className="absolute top-2 right-2 focus:outline-none"
      aria-label="Close Notification"
    >
      <FaTimes className="text-white/80 hover:text-white" />
    </button>
  </motion.div>
);

export default ToastNotification;
