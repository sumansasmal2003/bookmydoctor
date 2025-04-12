import React from 'react';
import { FaTimes, FaCheckCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';

const ToastNotification = ({ message, onClose, color = 'from-green-500 to-blue-500' }) => (
  <motion.div
    initial={{ y: 100, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    exit={{ y: 100, opacity: 0 }}
    className={`fixed top-4 left-1/2 transform -translate-x-1/2
      sm:left-auto sm:translate-x-0 sm:top-4 sm:right-4
      p-4 pr-8 rounded-xl shadow-xl flex items-center gap-3
      max-w-sm w-full z-50 backdrop-blur-sm
      bg-gradient-to-r ${color} dark:${color.replace(/from|to/g, m => m + '-600')}
      border border-white/20 dark:border-gray-600/80
      ring-1 ring-black/5 dark:ring-white/10`}
  >
    <FaCheckCircle className="text-xl text-white/90 dark:text-gray-100" />

    <span className="font-medium text-white/95 dark:text-gray-100">{message}</span>

    <button
      onClick={onClose}
      className="absolute top-2 right-2 p-1 rounded-full hover:bg-white/10 transition-colors"
      aria-label="Close Notification"
    >
      <FaTimes className="w-4 h-4 text-white/80 hover:text-white dark:text-gray-300" />
    </button>
  </motion.div>
);

export default ToastNotification;
