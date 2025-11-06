import { createContext } from 'react';
import { User } from '../services/authService';

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (newToken: string, newUser: User) => void;
  logout: () => Promise<void>;
  updateUser: (updatedUser: User) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
