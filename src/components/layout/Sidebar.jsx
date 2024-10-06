// src/components/layout/Sidebar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import {
    ChevronLeftIcon,
    ChevronRightIcon,
    HomeIcon,
    UsersIcon,
    AcademicCapIcon,
    DevicePhoneMobileIcon,
} from '@heroicons/react/24/outline';

const Sidebar = ({ isOpen, toggleSidebar }) => {
    return (
        <aside
            className={`bg-white z-50 text-gray-800 h-full fixed top-[85px] left-0 shadow-md flex flex-col justify-between transition-all duration-500 px-10 ease-in-out transform ${isOpen ? 'w-48' : 'w-20'
                } hidden md:flex`}
        >
            {/* Toggle Button at the Top */}
            <div className="flex items-center justify-center p-2">
                <button
                    className="text-gray-800 hover:text-gray-600 focus:outline-none"
                    onClick={toggleSidebar}
                >
                    {isOpen ? (
                        <ChevronLeftIcon className="h-6 w-6" />
                    ) : (
                        <ChevronRightIcon className="h-6 w-6" />
                    )}
                </button>
            </div>

            {/* Navigation Icons Centered */}
            <div className="flex flex-col items-center justify-center flex-grow space-y-4">
                <Link
                    to="/"
                    className="block text-gray-800 hover:bg-gray-200 p-2 rounded flex flex-col items-center justify-center"
                >
                    <HomeIcon className="h-6 w-6" />
                    {isOpen ? (
                        <span className="ml-2">Home</span>
                    ) : (
                        <span className="text-xs mt-1">Home</span>
                    )}
                </Link>
                <Link
                    to="/dashboard"
                    className="block text-gray-800 hover:bg-gray-200 p-2 rounded flex flex-col items-center justify-center"
                >
                    <AcademicCapIcon className="h-6 w-6" />
                    {isOpen ? (
                        <span className="ml-2">Dashboard</span>
                    ) : (
                        <span className="text-xs mt-1">Dashboard</span>
                    )}
                </Link>
                <Link
                    to="/tutors"
                    className="block text-gray-800 hover:bg-gray-200 p-2 rounded flex flex-col items-center justify-center"
                >
                    <UsersIcon className="h-6 w-6" />
                    {isOpen ? (
                        <span className="ml-2">Tutors</span>
                    ) : (
                        <span className="text-xs mt-1">Tutors</span>
                    )}
                </Link>
            </div>
            {/* Mobile App Ad at the Bottom */}
            <div className={`flex flex-col items-center justify-center mb-28 ${isOpen ? 'transition-all duration-300 ease-in-out' : ''}`}>
                {isOpen ? (
                    <div className="bg-blue-100 p-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out flex flex-col items-center justify-center">
                        <DevicePhoneMobileIcon className="h-8 w-8 text-blue-600 mb-2" />
                        <span className="text-sm font-medium text-blue-600 text-center">Get Mobile App</span>
                    </div>
                ) : (
                    <div className="relative group flex justify-center items-center">
                        <span className="absolute left-1/2 bottom-full text-center transform -translate-x-1/2 mb-2 px-2 py-1 bg-blue-600 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            Mobile App
                        </span>
                        <div className="bg-blue-600 rounded-full p-2 cursor-pointer transform hover:scale-110 transition-transform duration-300">
                            <DevicePhoneMobileIcon className="h-6 w-6 text-white" />
                        </div>
                    </div>
                )}
            </div>
        </aside>
    );
};

export default Sidebar;
