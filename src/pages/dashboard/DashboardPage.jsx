// src/pages/dashboard/DashboardPage.jsx
import React from 'react';

const DashboardPage = () => {
    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <header className="mb-6">
                <h1 className="text-3xl font-bold">Dashboard</h1>
            </header>
            <section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div className="bg-white p-4 rounded shadow">
                    <h2 className="text-xl font-semibold">Recent Activities</h2>
                    <p className="mt-2 text-gray-600">Keep track of your latest actions.</p>
                </div>
                <div className="bg-white p-4 rounded shadow">
                    <h2 className="text-xl font-semibold">Progress Overview</h2>
                    <p className="mt-2 text-gray-600">Monitor your learning journey.</p>
                </div>
                <div className="bg-white p-4 rounded shadow">
                    <h2 className="text-xl font-semibold">Notifications</h2>
                    <p className="mt-2 text-gray-600">Stay updated with the latest alerts.</p>
                </div>
            </section>
        </div>
    );
};

export default DashboardPage;
