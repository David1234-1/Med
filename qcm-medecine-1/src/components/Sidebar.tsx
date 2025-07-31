import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Home, 
  Upload, 
  BookOpen, 
  MessageSquare, 
  User, 
  Moon, 
  Sun,
  Menu,
  X
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const { isDark, toggleTheme } = useTheme();
  const { user, isGuest, logout } = useAuth();

  const menuItems = [
    { path: '/', icon: Home, label: 'Tableau de bord' },
    { path: '/import', icon: Upload, label: 'Importer des cours' },
    { path: '/study', icon: BookOpen, label: 'Réviser' },
    { path: '/assistant', icon: MessageSquare, label: 'Assistant IA' },
    { path: '/profile', icon: User, label: 'Profil' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Overlay pour mobile */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: isOpen ? 0 : -300 }}
        transition={{ type: 'spring', damping: 20 }}
        className={`fixed left-0 top-0 h-full w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-50 lg:relative lg:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                QCM Médecine
              </h1>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                    isActive(item.path)
                      ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="flex items-center space-x-3 w-full px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              {isDark ? (
                <>
                  <Sun className="w-5 h-5" />
                  <span>Mode clair</span>
                </>
              ) : (
                <>
                  <Moon className="w-5 h-5" />
                  <span>Mode sombre</span>
                </>
              )}
            </button>

            {/* User Info */}
            <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              {user ? (
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {user.email}
                  </p>
                  <button
                    onClick={logout}
                    className="text-xs text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    Se déconnecter
                  </button>
                </div>
              ) : isGuest ? (
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Mode invité
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Données locales uniquement
                  </p>
                  <button
                    onClick={logout}
                    className="text-xs text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    Quitter
                  </button>
                </div>
              ) : (
                <div className="space-y-1">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Non connecté
                  </p>
                  <Link
                    to="/profile"
                    className="text-xs text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    Se connecter
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 left-4 z-30 lg:hidden p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
      >
        <Menu className="w-5 h-5" />
      </button>
    </>
  );
};

export default Sidebar;