import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { authApi } from '../api/auth';
import { User } from '@/types';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        setIsLoading(false);
        return;
      }

      const currentUser = await authApi.getCurrentUser();
      if (currentUser.role !== 'admin') {
        logout();
        return;
      }

      setUser(currentUser);
      localStorage.setItem('adminUser', JSON.stringify(currentUser));
    } catch (error) {
      console.error('Auth check failed:', error);
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const { token, user: loggedInUser } = await authApi.login(email, password);

      if (loggedInUser.role !== 'admin') {
        throw new Error('Accès refusé. Seuls les administrateurs peuvent se connecter.');
      }

      localStorage.setItem('adminToken', token);
      localStorage.setItem('adminUser', JSON.stringify(loggedInUser));
      setUser(loggedInUser);
      navigate('/');
    } catch (error: any) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    setUser(null);
    navigate('/auth/login');
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
  };
}
