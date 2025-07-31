import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Import from './pages/Import';
import Study from './pages/Study';
import Assistant from './pages/Assistant';
import Profile from './pages/Profile';
import { AuthProvider } from './contexts/AuthContext';
import { StudyProvider } from './contexts/StudyContext';
import { ThemeProvider } from './contexts/ThemeContext';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ThemeProvider>
      <AuthProvider>
        <StudyProvider>
          <Router>
            <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
              <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
              
              <div className="flex-1 flex flex-col overflow-hidden">
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-gray-900">
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/import" element={<Import />} />
                    <Route path="/study" element={<Study />} />
                    <Route path="/assistant" element={<Assistant />} />
                    <Route path="/profile" element={<Profile />} />
                  </Routes>
                </main>
              </div>
            </div>
          </Router>
        </StudyProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;