'use client';

import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useRouter } from 'next/navigation';

type User = {
  name: string;
  email: string;
  username: string;
  avatar?: string;
};

type Role = 'buyer' | 'vendor';

interface AppContextType {
  isLoggedIn: boolean;
  user: User | null;
  role: Role;
  login: (user: Omit<User, 'avatar' | 'name'>) => void;
  logout: () => void;
  setRole: (role: Role) => void;
}

export const AppContext = createContext<AppContextType | null>(null);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<Role>('buyer');
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
    try {
      const storedUser = sessionStorage.getItem('user');
      const storedRole = sessionStorage.getItem('role');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
        setRole((storedRole as Role) || 'buyer');
        setIsLoggedIn(true);
      }
    } catch (error) {
        console.error("Could not parse session storage:", error);
        sessionStorage.clear();
    }
  }, []);

  const login = useCallback((userData: Omit<User, 'avatar' | 'name'>) => {
    const fullUser = {
        name: userData.username,
        username: userData.username,
        email: userData.email,
        avatar: `https://avatar.vercel.sh/${userData.email}.png`
    };
    setUser(fullUser);
    setIsLoggedIn(true);
    setRole('buyer'); 
    sessionStorage.setItem('user', JSON.stringify(fullUser));
    sessionStorage.setItem('role', 'buyer');
    router.push('/home');
  }, [router]);

  const logout = useCallback(() => {
    setIsLoggedIn(false);
    setUser(null);
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('role');
    router.push('/login');
  }, [router]);

  const handleSetRole = useCallback((newRole: Role) => {
    setRole(newRole);
    sessionStorage.setItem('role', newRole);
  }, []);

  const value = { isLoggedIn, user, role, login, logout, setRole: handleSetRole };

  // Render children only after session storage has been checked.
  // This prevents hydration mismatches and content flashing.
  return (
    <AppContext.Provider value={value}>
      {isMounted ? children : null}
    </AppContext.Provider>
  );
};
