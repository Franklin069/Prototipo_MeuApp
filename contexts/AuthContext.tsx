import React, { createContext, useContext, useState, ReactNode } from 'react';
import usersData from '../data/users.json';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  profile: 'admin' | 'user';
  active: boolean;
}

interface AuthContextType {
  user: User | null;
  users: User[];
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (id: string, userData: Partial<User>) => void;
  createUser: (userData: Omit<User, 'id'>) => void;
  deleteUser: (id: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(usersData);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const foundUser = users.find(
        u => u.email === email && u.password === password && u.active
      );
      
      if (foundUser) {
        setUser(foundUser);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erro no login:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
  };

  const updateUser = (id: string, userData: Partial<User>) => {
    setUsers(prevUsers => 
      prevUsers.map(u => u.id === id ? { ...u, ...userData } : u)
    );
    
    if (user && user.id === id) {
      setUser(prev => prev ? { ...prev, ...userData } : null);
    }
  };

  const createUser = (userData: Omit<User, 'id'>) => {
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
    };
    setUsers(prev => [...prev, newUser]);
  };

  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
    if (user && user.id === id) {
      setUser(null);
    }
  };

  const value: AuthContextType = {
    user,
    users,
    isAuthenticated: !!user,
    isAdmin: user?.profile === 'admin',
    login,
    logout,
    updateUser,
    createUser,
    deleteUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
};