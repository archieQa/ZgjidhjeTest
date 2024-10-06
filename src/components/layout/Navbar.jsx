// src/components/layout/Navbar.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    ArrowRightOnRectangleIcon,
    Bars3Icon,
    HomeIcon,
    UsersIcon,
    AcademicCapIcon,
    CogIcon,
    UserCircleIcon,
    ArrowRightIcon,
    CalculatorIcon
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';


const Navbar = ({ isSidebarOpen, toggleSidebar, showInput, onQuestionSubmit }) => {
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const [question, setQuestion] = useState('');

    const handleHomeClick = (e) => {
        if (window.location.pathname === '/') {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleMenuToggle = () => {
        setMenuOpen(!menuOpen);
    };

    const handleQuestionSubmit = () => {
        if (question.trim()) {
            onQuestionSubmit(question);
            setQuestion('');
        }
    };

    const handleCalculatorClick = () => {
        navigate('/calculator');
    };


    return (
        <nav className="bg-white shadow-md px-4 py-2 flex flex-col items-center justify-between fixed top-0 left-0 right-0 z-50">
            <div className="w-full flex items-center justify-between">
                <div className="flex items-center">
                    <Link to="/" onClick={handleHomeClick} className="transition-all duration-500 ease-in-out transform">
                        <img
                            src="/assets/images/fultzi-logo.jpg"
                            alt="The Albanian Gauth Logo"
                            className="transition-all duration-500 ease-in-out h-12 w-12 sm:h-16 sm:w-16"
                        />
                    </Link>
                </div>

                <div className="hidden md:flex justify-center items-center w-full max-w-3xl">
                    {showInput && (
                        <div className="flex w-full items-center">
                            <input
                                type="text"
                                value={question}
                                onChange={(e) => setQuestion(e.target.value)}
                                placeholder="Shkruani pyetjen tuaj..."
                                className="flex-grow p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                onClick={handleQuestionSubmit}
                                className="bg-blue-500 text-white p-2 rounded-r-md hover:bg-blue-600 transition-colors duration-300"
                            >
                                <ArrowRightIcon className="h-6 w-6" />
                            </button>
                        </div>
                    )}
                </div>

                <div className="flex items-center space-x-4">
                    <button
                        className="text-gray-700 hover:text-blue-600 transition md:hidden"
                        onClick={handleMenuToggle}
                    >
                        <Bars3Icon className="h-6 w-6" />
                    </button>

                    <Link
                        to="/profile"
                        className="text-gray-700 hover:text-blue-600 transition"
                    >
                        <UserCircleIcon className="h-6 w-6" />
                    </Link>

                    <Link
                        to="/login"
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-all duration-300 ease-in-out flex items-center overflow-hidden"
                    >
                        <ArrowRightOnRectangleIcon className="h-6 w-6" />
                        <span className={`ml-2 transition-all duration-300 ease-in-out ${isSidebarOpen ? 'opacity-100 max-w-[100px]' : 'opacity-0 max-w-0 -ml-1'}`}>Login</span>
                    </Link>
                </div>
            </div>

            <div className="flex w-full items-center justify-center mt-2 md:hidden">
                {showInput && (
                    <div className="flex w-full items-center border border-gray-300 hover:border-gray-800 rounded-2xl shadow-sm p-2">
                        <input
                            type="text"
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            placeholder="Shkruani pyetjen tuaj..."
                            className="flex-grow p-2 bg-transparent focus:outline-none"
                        />
                        <div className="flex items-center">
                            <button
                                className="text-gray-500 hover:text-gray-600 mr-2"
                                onClick={handleCalculatorClick}
                            >
                                <CalculatorIcon className="h-6 w-6" />
                            </button>
                            <div className="h-6 w-px bg-gray-300 mx-2"></div>
                            <button
                                onClick={handleQuestionSubmit}
                                className="text-blue-500 hover:text-blue-600"
                            >
                                <ArrowRightIcon className="h-6 w-6" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <div
                className={`absolute ${showInput ? 'top-[129px]' : 'top-[72px]'} left-0 right-0 bg-white shadow-lg p-4 md:hidden transition-all duration-500 ease-in-out transform ${menuOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
                    }`}
            >
                <ul className="flex flex-col space-y-4">
                    <li>
                        <Link
                            to="/"
                            onClick={(e) => {
                                handleHomeClick(e);
                                setMenuOpen(false);
                            }}
                            className="flex items-center text-gray-700 hover:text-blue-600 transition"
                        >
                            <HomeIcon className="h-6 w-6" />
                            <span className="ml-2">Home</span>
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/dashboard"
                            onClick={() => setMenuOpen(false)}
                            className="flex items-center text-gray-700 hover:text-blue-600 transition"
                        >
                            <AcademicCapIcon className="h-6 w-6" />
                            <span className="ml-2">Dashboard</span>
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/tutors"
                            onClick={() => setMenuOpen(false)}
                            className="flex items-center text-gray-700 hover:text-blue-600 transition"
                        >
                            <UsersIcon className="h-6 w-6" />
                            <span className="ml-2">Tutors</span>
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/settings"
                            onClick={() => setMenuOpen(false)}
                            className="flex items-center text-gray-700 hover:text-blue-600 transition"
                        >
                            <CogIcon className="h-6 w-6" />
                            <span className="ml-2">Settings</span>
                        </Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;