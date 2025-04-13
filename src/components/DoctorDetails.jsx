// src/pages/DoctorDetails.jsx
import React from 'react';
import { FaUserMd } from 'react-icons/fa';
import doctors from '../data/doctors'; // You must have profilePic, id, name, specialization, etc.

const DoctorDetails = ({ onDoctorSelect }) => {

  const handleBook = (doctorId) => {
    // Optional: redirect to booking route or open booking modal
    onDoctorSelect(doctorId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <h1 className="text-3xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
        Meet Our Doctors
      </h1>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {doctors.map((doc) => (
          <div
            key={doc.id}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 transition-transform hover:scale-[1.01]"
          >
            <img
              src={doc.profilePic}
              alt={doc.name}
              className="w-full h-48 object-cover"
            />

            <div className="p-5">
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-300 mb-1">
                <FaUserMd />
                <h2 className="text-xl font-semibold">{doc.name}</h2>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 italic">
                {doc.specialization}
              </p>

              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                {doc.bio || 'Experienced and dedicated to patient care.'}
              </p>

              <button
                onClick={() => handleBook(doc.id)}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-2 rounded-lg transition-all cursor-pointer"
              >
                Book Appointment
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorDetails;
