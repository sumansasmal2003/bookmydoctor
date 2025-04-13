import React, { useState } from 'react';
import { FaUserMd } from 'react-icons/fa';

const DoctorSelector = ({ doctors, selectedDoctorId, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedDoctor = doctors.find(doc => doc.id === selectedDoctorId);

  return (
    <div className="w-full relative z-10">
      {/* Label */}
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
        Select Doctor
      </label>

      {/* Dropdown Button */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2.5 pl-10 w-full border rounded-lg cursor-pointer bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 shadow-sm"
      >
        <FaUserMd className="absolute left-3 text-purple-600 dark:text-blue-400" />
        {selectedDoctor ? (
          <div className="flex items-center gap-2">
            <img
              src={selectedDoctor.profilePic}
              alt={selectedDoctor.name}
              className="w-6 h-6 rounded-full object-cover"
            />
            <span className="text-sm font-medium">{selectedDoctor.name}</span>
          </div>
        ) : (
          <span className="text-sm text-gray-500 dark:text-gray-400">Select a doctor</span>
        )}
      </div>

      {/* Dropdown List */}
      {isOpen && (
        <ul className="absolute top-full mt-2 w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-20 h-[200px] overflow-y-auto">
          {doctors.map(doc => (
            <li
              key={doc.id}
              onClick={() => {
                onSelect(doc.id); // Set selected doctor
                setIsOpen(false); // Close dropdown
              }}
              className="flex items-center gap-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
            >
              <img
                src={doc.profilePic}
                alt={doc.name}
                className="w-8 h-8 rounded-full object-cover"
              />
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {doc.name}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DoctorSelector;
