import { useContext } from 'react';
import { AuthContextType, AuthContext } from './AuthContext-definition';

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a AuthProvider');
  }
  return context;
};
