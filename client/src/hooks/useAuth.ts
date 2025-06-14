import { useState, useEffect } from 'react';
import { supabase, type User, type AuthSession } from '@/lib/supabase';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export function useAuth() {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const authSession: AuthSession = {
          user: {
            id: session.user.id,
            email: session.user.email!,
            role: session.user.user_metadata?.role || 'user'
          },
          accessToken: session.access_token
        };
        setSession(authSession);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const authSession: AuthSession = {
            user: {
              id: session.user.id,
              email: session.user.email!,
              role: session.user.user_metadata?.role || 'user'
            },
            accessToken: session.access_token
          };
          setSession(authSession);
        } else {
          setSession(null);
        }
        setLoading(false);
        
        // Invalidate queries when auth state changes
        queryClient.invalidateQueries();
      }
    );

    return () => subscription.unsubscribe();
  }, [queryClient]);

  const login = useMutation({
    mutationFn: async ({ username, password }: { username: string; password: string }) => {
      // Use custom backend login endpoint that supports username
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro ao fazer login');
      }

      const data = await response.json();
      
      // Sign in to Supabase with the returned session data
      if (data.session) {
        const { error } = await supabase.auth.setSession({
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token
        });
        
        if (error) throw error;
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
    }
  });

  const register = useMutation({
    mutationFn: async ({ 
      email, 
      password, 
      firstName, 
      lastName 
    }: { 
      email: string; 
      password: string; 
      firstName: string; 
      lastName: string; 
    }) => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            role: 'user'
          }
        }
      });
      
      if (error) throw error;
      return data;
    }
  });

  const logout = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    },
    onSuccess: () => {
      setSession(null);
      queryClient.clear();
    }
  });

  return {
    user: session?.user || null,
    session,
    isLoading: loading,
    isAuthenticated: !!session,
    login,
    register,
    logout
  };
}