// src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import Footer from './components/layout/Footer';
import ChatButton from './components/layout/ChatButton';
import LandingPage from './pages/landing/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import FindTutorPage from './pages/tutoring/FindTutorPage';
import LearningPathPage from './pages/learning/LearningPathPage';
import CalculatorPage from './pages/calculator/CalculatorPage'; // Add this import

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showInput, setShowInput] = useState(false);

  // Handle scroll to show/hide input in navbar
  useEffect(() => {
    const handleScroll = () => {
      const explanationSection = document.getElementById('question-input'); // Target AppExplanationSection
      if (explanationSection) {
        const explanationTop = explanationSection.getBoundingClientRect().top;
        setShowInput(explanationTop < 50); // Adjust threshold if necessary
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <Router>
      <div className="flex">
        {/* Sidebar for navigation */}
        <Sidebar
          isOpen={isSidebarOpen}
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          className="hidden md:block"
        />
        <div
          className={`flex flex-col flex-grow transition-all duration-500 ease-in-out ${isSidebarOpen ? 'ml-0 md:ml-48 lg:ml-48' : 'lg:ml-20 md:ml-0 ml-0'
            }`}
        >
          {/* Navbar with input bar based on scroll */}
          <Navbar
            isSidebarOpen={isSidebarOpen}
            toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            showInput={showInput}
          />
          <main className="bg-gray-50 flex-grow p-0 mt-16 transition-all duration-500 ease-in-out">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/tutors" element={<FindTutorPage />} />
              <Route path="/learning-paths" element={<LearningPathPage />} />
              <Route path="/calculator" element={<CalculatorPage />} /> {/* Update this line */}
            </Routes>
          </main>
          <Footer />
          <ChatButton />
        </div>
      </div>
    </Router>
  );
}

export default App;