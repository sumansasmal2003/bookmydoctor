// src/components/DoctorSearch.jsx
import React, { useState } from 'react';

/**
 * DoctorSearch Component
 *
 * Allows users to search and select a doctor from the list.
 *
 * Props:
 * - doctors: Array of doctor objects (each with an id and a name)
 * - onDoctorSelect: Callback function that receives the selected doctor's id
 */
const DoctorSearch = ({ doctors, onDoctorSelect }) => {
  // Local state to store the search query input by the user.
  const [searchQuery, setSearchQuery] = useState('');

  // Filter the list of doctors based on the search query (case-insensitive).
  const filteredDoctors = doctors.filter(doc =>
    doc.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="mb-4">
      {/* Input Label */}
      <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">
        Search Doctor
      </label>
      {/* Search Input Field */}
      <input
        type="text"
        placeholder="Type to search..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full p-2 border-none rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 outline-none shadow-xl"
      />
      {/* Dropdown List of Filtered Doctors */}
      {searchQuery && (
        <ul className="mt-2 border-none rounded-md bg-white dark:bg-gray-700 h-[200px] overflow-y-auto shadow-xl">
          {filteredDoctors.map(doc => (
            <li key={doc.id}>
              <button
                onClick={() => {
                  // When a doctor is selected, call the parent's onDoctorSelect with the doctor's id.
                  onDoctorSelect(doc.id);
                  // Clear the search input after selection.
                  setSearchQuery('');
                }}
                className="w-full text-left p-2 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 cursor-pointer flex items-center gap-2 rounded-md"
              >
                <img src={doc.profilePic} alt={doc.name} className='w-6 h-6 rounded-full' />
                {doc.name}
              </button>
            </li>
          ))}
          {filteredDoctors.length === 0 && (
            <li className="p-2 text-sm text-gray-500 dark:text-gray-400">
              No doctor found.
            </li>
          )}
        </ul>
      )}
    </div>
  );
};

export default DoctorSearch;
