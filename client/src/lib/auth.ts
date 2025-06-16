import { supabase } from './supabase';

export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
  token?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export class AuthService {
  static async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      // Admin login check
      if (credentials.email === 'admin@cuca.ao' && credentials.password === 'cuca2024') {
        const adminToken = 'admin-token-' + Date.now();
        localStorage.setItem('supabase.auth.token', adminToken);
        
        const adminUser: User = {
          id: 'admin-supabase',
          email: 'admin@cuca.ao',
          username: 'admin',
          firstName: 'Admin',
          lastName: 'CUCA',
          role: 'admin'
        };
        
        localStorage.setItem('auth_user', JSON.stringify(adminUser));
        
        return {
          success: true,
          message: 'Login de administrador realizado com sucesso',
          user: adminUser,
          token: adminToken
        };
      }

      // Regular user login with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) {
        return {
          success: false,
          message: 'Credenciais inválidas'
        };
      }

      if (data.user && data.session) {
        const user: User = {
          id: data.user.id,
          email: data.user.email!,
          username: data.user.user_metadata?.username || data.user.email!.split('@')[0],
          firstName: data.user.user_metadata?.firstName || '',
          lastName: data.user.user_metadata?.lastName || '',
          role: data.user.user_metadata?.role || 'user'
        };

        localStorage.setItem('auth_user', JSON.stringify(user));
        
        return {
          success: true,
          message: 'Login realizado com sucesso',
          user,
          token: data.session.access_token
        };
      }

      return {
        success: false,
        message: 'Erro no login'
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'Erro interno do servidor'
      };
    }
  }

  static async register(userData: RegisterRequest): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            username: userData.username,
            firstName: userData.firstName,
            lastName: userData.lastName,
            role: 'user'
          }
        }
      });

      if (error) {
        return {
          success: false,
          message: error.message
        };
      }

      return {
        success: true,
        message: 'Conta criada com sucesso! Verifique seu email para confirmar.'
      };
    } catch (error) {
      console.error('Register error:', error);
      return {
        success: false,
        message: 'Erro interno do servidor'
      };
    }
  }

  static async logout(): Promise<void> {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('auth_user');
      localStorage.removeItem('supabase.auth.token');
    }
  }

  static async getCurrentUser(): Promise<User | null> {
    try {
      // Check for admin token
      const adminToken = localStorage.getItem('supabase.auth.token');
      if (adminToken && adminToken.startsWith('admin-token-')) {
        const adminUser = localStorage.getItem('auth_user');
        if (adminUser) {
          return JSON.parse(adminUser);
        }
      }

      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error || !user) {
        localStorage.removeItem('auth_user');
        return null;
      }

      const userData: User = {
        id: user.id,
        email: user.email!,
        username: user.user_metadata?.username || user.email!.split('@')[0],
        firstName: user.user_metadata?.firstName || '',
        lastName: user.user_metadata?.lastName || '',
        role: user.user_metadata?.role || 'user'
      };

      localStorage.setItem('auth_user', JSON.stringify(userData));
      return userData;
    } catch (error) {
      console.error('Get current user error:', error);
      localStorage.removeItem('auth_user');
      return null;
    }
  }

  static getUser(): User | null {
    const userData = localStorage.getItem('auth_user');
    return userData ? JSON.parse(userData) : null;
  }

  static isAuthenticated(): boolean {
    return !!this.getUser();
  }

  static isAdmin(): boolean {
    const user = this.getUser();
    return user?.role === 'admin';
  }

  static getToken(): string | null {
    return localStorage.getItem('supabase.auth.token');
  }
}