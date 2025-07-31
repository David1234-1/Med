import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'light' | 'dark' | 'focus' | 'exam';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    // Récupérer le thème depuis localStorage ou utiliser 'light' par défaut
    const savedTheme = localStorage.getItem('theme') as Theme;
    return savedTheme || 'light';
  });

  useEffect(() => {
    // Appliquer le thème au document
    const root = document.documentElement;
    
    // Supprimer toutes les classes de thème
    root.classList.remove('light', 'dark', 'focus', 'exam');
    
    // Ajouter la classe du thème actuel
    root.classList.add(theme);
    
    // Sauvegarder dans localStorage
    localStorage.setItem('theme', theme);
    
    // Appliquer des styles spécifiques au thème
    applyThemeStyles(theme);
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    setThemeState(prev => {
      switch (prev) {
        case 'light':
          return 'dark';
        case 'dark':
          return 'focus';
        case 'focus':
          return 'exam';
        case 'exam':
          return 'light';
        default:
          return 'light';
      }
    });
  };

  const applyThemeStyles = (currentTheme: Theme) => {
    const root = document.documentElement;
    
    switch (currentTheme) {
      case 'light':
        root.style.setProperty('--bg-primary', '#ffffff');
        root.style.setProperty('--bg-secondary', '#f9fafb');
        root.style.setProperty('--text-primary', '#111827');
        root.style.setProperty('--text-secondary', '#6b7280');
        break;
      
      case 'dark':
        root.style.setProperty('--bg-primary', '#111827');
        root.style.setProperty('--bg-secondary', '#1f2937');
        root.style.setProperty('--text-primary', '#f9fafb');
        root.style.setProperty('--text-secondary', '#d1d5db');
        break;
      
      case 'focus':
        root.style.setProperty('--bg-primary', '#fef3c7');
        root.style.setProperty('--bg-secondary', '#fde68a');
        root.style.setProperty('--text-primary', '#92400e');
        root.style.setProperty('--text-secondary', '#b45309');
        break;
      
      case 'exam':
        root.style.setProperty('--bg-primary', '#fee2e2');
        root.style.setProperty('--bg-secondary', '#fecaca');
        root.style.setProperty('--text-primary', '#991b1b');
        root.style.setProperty('--text-secondary', '#b91c1c');
        break;
    }
  };

  const value: ThemeContextType = {
    theme,
    setTheme,
    toggleTheme
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};