import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { authService } from './lib/auth';
import { databaseUtils } from './lib/database';
import { User } from './types';

// Composants de layout
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import LoadingScreen from './components/ui/LoadingScreen';

// Pages
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import Study from './pages/Study';
import Profile from './pages/Profile';
import Auth from './pages/Auth';
import NotFound from './pages/NotFound';

// Contextes
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log('Initialisation de l\'application...');
        
        // Initialiser la base de données
        await databaseUtils.initializeDatabase();
        
        // Charger l'utilisateur actuel
        const currentUser = authService.getCurrentUser();
        setUser(currentUser);
        
        console.log('Application initialisée avec succès');
      } catch (error) {
        console.error('Erreur lors de l\'initialisation:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
            <AnimatePresence mode="wait">
              {user ? (
                <motion.div
                  key="authenticated"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex h-screen"
                >
                  <Sidebar />
                  <div className="flex-1 flex flex-col overflow-hidden">
                    <Header />
                    <main className="flex-1 overflow-y-auto p-6">
                      <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/courses" element={<Courses />} />
                        <Route path="/study" element={<Study />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </main>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="auth"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Routes>
                    <Route path="/auth" element={<Auth />} />
                    <Route path="*" element={<Navigate to="/auth" replace />} />
                  </Routes>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;