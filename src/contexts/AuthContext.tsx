import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserPreferences } from '../types';
import { authService } from '../lib/auth';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, username: string, password: string) => Promise<void>;
  logout: () => void;
  updatePreferences: (preferences: Partial<UserPreferences>) => Promise<void>;
  updatePoints: (points: number) => Promise<void>;
  updateStudyTime: (minutes: number) => Promise<void>;
  createGuestUser: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Charger l'utilisateur au démarrage
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const loggedInUser = await authService.login(email, password);
      setUser(loggedInUser);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, username: string, password: string) => {
    try {
      setIsLoading(true);
      const newUser = await authService.register(email, username, password);
      setUser(newUser);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const updatePreferences = async (preferences: Partial<UserPreferences>) => {
    if (!user) return;
    
    try {
      await authService.updatePreferences(preferences);
      setUser(prev => prev ? { ...prev, preferences: { ...prev.preferences, ...preferences } } : null);
    } catch (error) {
      throw error;
    }
  };

  const updatePoints = async (points: number) => {
    if (!user) return;
    
    try {
      await authService.updatePoints(points);
      setUser(prev => prev ? { ...prev, points: prev.points + points } : null);
    } catch (error) {
      throw error;
    }
  };

  const updateStudyTime = async (minutes: number) => {
    if (!user) return;
    
    try {
      await authService.updateStudyTime(minutes);
      setUser(prev => prev ? { ...prev, studyTime: prev.studyTime + minutes } : null);
    } catch (error) {
      throw error;
    }
  };

  const createGuestUser = () => {
    const guestUser = authService.createGuestUser();
    setUser(guestUser);
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    updatePreferences,
    updatePoints,
    updateStudyTime,
    createGuestUser,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};