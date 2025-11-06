// src/context/AuthContext.tsx (Updated with updateUser function)

import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { User, logoutUser } from '@/services/auth/authService';

// --- Type Definitions & Context ---
import { AuthContext, AuthContextType } from '@/context/AuthContext-definition';



export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('user');
    // console.log("AuthProvider init: Stored User found?", !!storedUser);
    try {
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState<string | null>(() => {
    const storedToken = localStorage.getItem("authToken");
    // console.log("AuthProvider init: Stored Token found?", !!storedToken);
    return storedToken;
  });
  
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    setIsLoading(false);
  }, []);

  const login = (newToken: string, newUser: User) => {
    localStorage.removeItem("cartSessionId"); // Clear guest cart session on login
    localStorage.setItem("authToken", newToken);
    localStorage.setItem("user", JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  // ✅ --- NEW FUNCTION TO UPDATE USER STATE ---
  // This function will be called from the Profile Page after a successful update.
  const updateUser = (updatedUser: User) => {
    // Update the user state in this context
    setUser(updatedUser);
    // Also update the user data in localStorage to keep it in sync
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };
  
  const logout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error("Server logout failed, proceeding with client-side logout.", error);
    } finally {
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      setToken(null);
      setUser(null);
      window.location.href = '/login'; 
    }
  };

  // ✅ Add the new function to the context value
  const value = { user, token, isLoading, login, logout, updateUser };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};