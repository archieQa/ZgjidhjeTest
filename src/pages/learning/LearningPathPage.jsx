// src/pages/learning/LearningPathPage.jsx
import React from 'react';

const LearningPathPage = () => {
    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <h1 className="text-3xl font-bold mb-6">Learning Paths</h1>
            <p className="text-gray-600 mb-8">
                Tailor your learning experience by choosing a path that suits your goals.
            </p>
            <div className="bg-white p-6 rounded shadow">
                <h2 className="text-xl font-semibold">Basic Algebra</h2>
                <p className="text-gray-700 mt-2">Learn the fundamentals of algebra in easy steps.</p>
                <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">Start Learning</button>
            </div>
        </div>
    );
};

export default LearningPathPage;
