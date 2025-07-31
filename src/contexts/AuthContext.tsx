import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isGuest: boolean;
  loginAsGuest: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    // Charger l'utilisateur depuis localStorage
    const savedUser = localStorage.getItem('user');
    const savedGuest = localStorage.getItem('isGuest');
    
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else if (savedGuest === 'true') {
      setIsGuest(true);
    }
  }, []);

  const hashPassword = async (password: string): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const hashedPassword = await hashPassword(password);
      
      const foundUser = users.find((u: any) => 
        u.email === email && u.password === hashedPassword
      );
      
      if (foundUser) {
        const userData = {
          id: foundUser.id,
          name: foundUser.name,
          email: foundUser.email,
          createdAt: new Date(foundUser.createdAt)
        };
        
        setUser(userData);
        setIsGuest(false);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('isGuest', 'false');
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Erreur de connexion:', error);
      return false;
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      
      // Vérifier si l'email existe déjà
      if (users.find((u: any) => u.email === email)) {
        return false;
      }
      
      const hashedPassword = await hashPassword(password);
      const newUser = {
        id: Date.now().toString(),
        name,
        email,
        password: hashedPassword,
        createdAt: new Date().toISOString()
      };
      
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      
      const userData = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        createdAt: new Date(newUser.createdAt)
      };
      
      setUser(userData);
      setIsGuest(false);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('isGuest', 'false');
      
      return true;
    } catch (error) {
      console.error('Erreur d\'inscription:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setIsGuest(false);
    localStorage.removeItem('user');
    localStorage.removeItem('isGuest');
  };

  const loginAsGuest = () => {
    setUser(null);
    setIsGuest(true);
    localStorage.removeItem('user');
    localStorage.setItem('isGuest', 'true');
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      isGuest,
      loginAsGuest
    }}>
      {children}
    </AuthContext.Provider>
  );
};