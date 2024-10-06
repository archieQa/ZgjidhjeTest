// src/pages/tutoring/FindTutorPage.jsx
import React from 'react';

const FindTutorPage = () => {
    return (
        <div className="min-h-screen bg-white p-6">
            <h1 className="text-3xl font-bold mb-4">Find a Tutor</h1>
            <p className="text-gray-700 mb-6">Browse available tutors to get the help you need.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Replace with actual tutor card components */}
                <div className="bg-gray-100 p-4 rounded shadow">
                    <h2 className="text-lg font-semibold">Tutor Name</h2>
                    <p className="mt-1 text-gray-600">Subject expertise: Math, Algebra, Calculus</p>
                    <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">Book Now</button>
                </div>
            </div>
        </div>
    );
};

export default FindTutorPage;
