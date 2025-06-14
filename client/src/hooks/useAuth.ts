import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AuthService, type User } from '@/lib/auth';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();

  useEffect(() => {
    // Check for existing session
    const initAuth = async () => {
      try {
        const currentUser = await AuthService.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = useMutation({
    mutationFn: async ({ username, password }: { username: string; password: string }) => {
      const result = await AuthService.login({ username, password });
      
      if (!result.success) {
        throw new Error(result.message);
      }
      
      return result;
    },
    onSuccess: (data) => {
      if (data.user) {
        setUser(data.user);
      }
      queryClient.invalidateQueries();
    }
  });

  const register = useMutation({
    mutationFn: async ({ 
      username,
      email, 
      password, 
      firstName, 
      lastName 
    }: { 
      username: string;
      email: string; 
      password: string; 
      firstName: string; 
      lastName: string; 
    }) => {
      const result = await AuthService.register({
        username,
        email,
        password,
        firstName,
        lastName
      });
      
      if (!result.success) {
        throw new Error(result.message);
      }
      
      return result;
    }
  });

  const logout = useMutation({
    mutationFn: async () => {
      await AuthService.logout();
    },
    onSuccess: () => {
      setUser(null);
      queryClient.clear();
    }
  });

  return {
    user,
    isLoading: loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    login,
    register,
    logout
  };
}