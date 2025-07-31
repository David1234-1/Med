import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Home, 
  Upload, 
  BookOpen, 
  MessageSquare, 
  User, 
  X
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const location = useLocation();

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
        className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 z-50 lg:relative lg:translate-x-0"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">
                QCM Médecine
              </h1>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
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
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <div className="text-sm text-gray-500">
              © 2024 QCM Médecine
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default Sidebar;