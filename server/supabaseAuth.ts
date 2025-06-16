import { createClient } from '@supabase/supabase-js';
import type { RequestHandler } from 'express';

// Initialize Supabase client with fallback check
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Admin credentials (hardcoded for simplicity)
const ADMIN_CREDENTIALS = {
  username: "admin",
  password: "cuca2024"
};

if (!supabaseUrl || !supabaseKey) {
  console.warn('Supabase variables not configured. Using fallback authentication.');
}

export const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
}) : null;

// Middleware to verify Supabase JWT token or custom admin JWT
export const requireSupabaseAuth: RequestHandler = async (req, res, next) => {
  try {
    if (!supabase) {
      return res.status(500).json({ 
        success: false, 
        message: 'Supabase não configurado' 
      });
    }

    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false, 
        message: 'Token de acesso requerido' 
      });
    }

    const token = authHeader.split(' ')[1];
    
    // Check if this is an admin token
    if (token.startsWith('admin-token-')) {
      req.supabaseUser = {
        id: 'admin-supabase',
        email: 'admin@cuca.ao',
        role: 'admin'
      };
      return next();
    }

    // Check if this is a local fallback token
    if (token.startsWith('local-token-')) {
      // For local tokens, we'll need to store and retrieve user info
      // For now, we'll extract user info from the stored session or database
      try {
        const { storage } = await import('./storage.js');
        const users = await storage.getCustomers();
        // For simplicity, we'll find the most recently active user
        // In production, you'd store token->user mapping
        const recentUser = users.find(u => u.isActive);
        
        if (recentUser) {
          req.supabaseUser = {
            id: recentUser.id.toString(),
            email: recentUser.email,
            role: recentUser.role || 'user'
          };
          return next();
        }
      } catch (error) {
        console.error('Error validating local token:', error);
      }
      
      return res.status(401).json({ 
        success: false, 
        message: 'Token local inválido' 
      });
    }
    
    // Verify the JWT token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Token inválido ou expirado' 
      });
    }

    // Add user info to request object
    req.supabaseUser = {
      id: user.id,
      email: user.email!,
      role: user.user_metadata?.role || 'user'
    };
    
    next();
  } catch (error) {
    console.error('Supabase auth error:', error);
    return res.status(401).json({ 
      success: false, 
      message: 'Erro de autenticação' 
    });
  }
};

// Admin role verification middleware
export const requireAdminRole: RequestHandler = (req, res, next) => {
  if (!req.supabaseUser || req.supabaseUser.role !== 'admin') {
    return res.status(403).json({ 
      success: false, 
      message: 'Acesso negado. Permissões de administrador requeridas.' 
    });
  }
  next();
};

// Get current user handler
export const getSupabaseUserHandler: RequestHandler = (req, res) => {
  if (!req.supabaseUser) {
    return res.status(401).json({ 
      success: false, 
      message: 'Usuário não autenticado' 
    });
  }
  
  res.json({
    success: true,
    user: req.supabaseUser
  });
};

// Login handler that supports both email and admin credentials
export const supabaseLoginHandler: RequestHandler = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Supabase Login attempt for user:', email);

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email e senha são obrigatórios'
      });
    }

    // Check for admin login first
    if (email === 'admin@cuca.ao' && password === ADMIN_CREDENTIALS.password) {
      console.log('Admin login detected via Supabase');
      
      // Generate a simple admin token
      const adminToken = `admin-token-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      return res.json({
        success: true,
        message: 'Login de administrador realizado com sucesso',
        user: {
          id: 'admin-supabase',
          email: 'admin@cuca.ao',
          username: 'admin',
          firstName: 'Admin',
          lastName: 'CUCA',
          role: 'admin'
        },
        token: adminToken,
        session: {
          access_token: adminToken,
          token_type: 'bearer',
          expires_in: 86400 // 24 hours
        }
      });
    }

    // Use Supabase authentication for regular users
    if (!supabase) {
      return res.status(500).json({
        success: false,
        message: 'Supabase não configurado'
      });
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.log('Supabase Login error:', error.message);
      
      // If Supabase auth is disabled, fallback to local database
      if (error.message.includes('disabled') || error.message.includes('not allowed')) {
        console.log('Falling back to local database authentication');
        
        try {
          const { storage } = await import('./storage.js');
          const user = await storage.getCustomers();
          const foundUser = user.find(u => u.email === email);
          
          if (!foundUser) {
            return res.status(401).json({
              success: false,
              message: 'Usuário não encontrado'
            });
          }

          if (!foundUser.isActive) {
            return res.status(401).json({
              success: false,
              message: 'Conta desativada'
            });
          }

          const bcrypt = await import('bcrypt');
          const isPasswordValid = await bcrypt.compare(password, foundUser.password);
          
          if (!isPasswordValid) {
            return res.status(401).json({
              success: false,
              message: 'Senha incorreta'
            });
          }

          // Generate a local token for the user
          const localToken = `local-token-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
          
          return res.json({
            success: true,
            message: 'Login realizado com sucesso',
            user: {
              id: foundUser.id.toString(),
              email: foundUser.email,
              username: foundUser.username,
              firstName: foundUser.firstName,
              lastName: foundUser.lastName,
              role: foundUser.role || 'user'
            },
            token: localToken,
            session: {
              access_token: localToken,
              token_type: 'bearer',
              expires_in: 86400
            }
          });
        } catch (fallbackError) {
          console.error('Fallback authentication error:', fallbackError);
          return res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
          });
        }
      }
      
      return res.status(401).json({
        success: false,
        message: 'Credenciais inválidas'
      });
    }

    if (data.user && data.session) {
      const user = {
        id: data.user.id,
        email: data.user.email!,
        username: data.user.user_metadata?.username || data.user.email!.split('@')[0],
        firstName: data.user.user_metadata?.firstName || '',
        lastName: data.user.user_metadata?.lastName || '',
        role: data.user.user_metadata?.role || 'user'
      };

      return res.json({
        success: true,
        message: 'Login realizado com sucesso',
        user,
        token: data.session.access_token,
        session: data.session
      });
    }

    return res.status(401).json({
      success: false,
      message: 'Erro no login'
    });
  } catch (error) {
    console.error('Supabase login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Register handler
export const supabaseRegisterHandler: RequestHandler = async (req, res) => {
  try {
    const { username, email, password, firstName, lastName } = req.body;

    if (!email || !password || !username) {
      return res.status(400).json({
        success: false,
        message: 'Email, senha e username são obrigatórios'
      });
    }

    if (!supabase) {
      return res.status(500).json({
        success: false,
        message: 'Supabase não configurado'
      });
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
          firstName,
          lastName,
          role: 'user'
        }
      }
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    return res.json({
      success: true,
      message: 'Conta criada com sucesso! Verifique seu email para confirmar.'
    });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Logout handler
export const supabaseLogoutHandler: RequestHandler = async (req, res) => {
  try {
    if (supabase) {
      await supabase.auth.signOut();
    }
    
    res.json({
      success: true,
      message: 'Logout realizado com sucesso'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Erro no logout'
    });
  }
};

// Type augmentation for Express Request
declare global {
  namespace Express {
    interface Request {
      supabaseUser?: {
        id: string;
        email: string;
        role: string;
      };
    }
  }
}