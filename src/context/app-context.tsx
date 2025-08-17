'use client';

import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useRouter } from 'next/navigation';
// import { supabase } from  '@/lib/supabaseClient'; 

type User = {
  id: string;
  email: string;
  username: string;
  storeId?: string;
  avatar?: string;
};

type Role = 'buyer' | 'vendor';

interface AppContextType {
  isLoggedIn: boolean;
  user: User | null;
  role: Role;
  login: (user: User) => void;
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

  const login = useCallback((userData: User) => {
    const fullUser = {
      ...userData,
      avatar: userData.avatar || `https://avatar.vercel.sh/${userData.email}.png`
    };

    setUser(fullUser);
    setIsLoggedIn(true);

    // Default role → if storeId exists, assume vendor, else buyer
    const initialRole: Role = fullUser.storeId ? 'vendor' : 'buyer';
    setRole(initialRole);

    sessionStorage.setItem('user', JSON.stringify(fullUser));
    sessionStorage.setItem('role', initialRole);
    
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

    const updateStoreId = useCallback((storeId: string) => {
    if (!user) return;

    const updatedUser = { ...user, storeId };
    setUser(updatedUser);
    setRole("vendor");

    sessionStorage.setItem("user", JSON.stringify(updatedUser));
    sessionStorage.setItem("role", "vendor");
  }, [user]);

  const value = { isLoggedIn, user, role, login, logout, setRole: handleSetRole, updateStoreId}

  // Render children only after session storage has been checked.
  // This prevents hydration mismatches and content flashing.
  return (
    <AppContext.Provider value={value}>
      {isMounted ? children : null}
    </AppContext.Provider>
  );
};
