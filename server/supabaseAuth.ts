import { createClient } from '@supabase/supabase-js';
import * as jwt from 'jsonwebtoken';
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
    
    // First try to verify as custom JWT (for admin)
    try {
      const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      
      // If this is a custom admin JWT, use it
      if (decoded.id === 'admin-supabase' && decoded.role === 'admin') {
        req.supabaseUser = {
          id: decoded.id,
          email: decoded.email,
          role: decoded.role
        };
        return next();
      }
    } catch (jwtError) {
      // Not a custom JWT, continue to Supabase verification
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

// Custom login handler that supports username
export const supabaseLoginHandler: RequestHandler = async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log('Supabase Login attempt for user:', username);

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Usuário e senha são obrigatórios'
      });
    }

    // Check for admin login first
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      console.log('Admin login detected via Supabase');
      
      if (!supabase) {
        return res.status(500).json({
          success: false,
          message: 'Supabase não configurado'
        });
      }

      // For admin, we'll create a custom JWT token instead of using Supabase auth
      // since email logins might be disabled
      try {
        const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
        
        const adminPayload = {
          id: 'admin-supabase',
          email: 'admin@cuca.ao',
          role: 'admin',
          username: 'admin',
          firstName: 'Admin',
          lastName: 'CUCA'
        };

        const token = jwt.sign(adminPayload, JWT_SECRET, { expiresIn: '24h' });

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
          session: {
            access_token: token,
            token_type: 'bearer',
            expires_in: 86400 // 24 hours
          }
        });
      } catch (adminError) {
        console.error('Error in admin authentication:', adminError);
        return res.status(500).json({
          success: false,
          message: 'Erro na autenticação do administrador'
        });
      }
    }

    // First, get user by username from our database
    console.log('Supabase Login: Looking for regular user:', username);
    const { storage } = await import('./storage.js');
    const user = await storage.getCustomerByUsername(username);

    console.log('Supabase Login: User found:', user ? { id: user.id, username: user.username, email: user.email, role: user.role } : 'null');

    if (!user) {
      console.log('Supabase Login: User not found in database');
      return res.status(401).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Conta desativada'
      });
    }

    // Verify password using bcrypt
    console.log('Supabase Login: Verifying password for user:', username);
    const bcrypt = await import('bcrypt');
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    console.log('Supabase Login: Password validation result:', isPasswordValid);

    if (!isPasswordValid) {
      console.log('Supabase Login: Password validation failed');
      return res.status(401).json({
        success: false,
        message: 'Senha incorreta'
      });
    }

    // Create or get Supabase user by email
    let supabaseUser;
    try {
      if (!supabase) {
        throw new Error('Supabase not configured');
      }
      
      // Try to get existing user
      const { data: existingUsers } = await supabase.auth.admin.listUsers();
      supabaseUser = existingUsers.users.find(u => u.email === user.email);

      if (!supabaseUser) {
        // Create new Supabase user
        const { data, error } = await supabase.auth.admin.createUser({
          email: user.email,
          password: password,
          user_metadata: {
            username: user.username,
            first_name: user.firstName,
            last_name: user.lastName,
            role: user.role || 'user'
          },
          email_confirm: true
        });

        if (error) throw error;
        supabaseUser = data.user;
      }
    } catch (error) {
      console.error('Error managing Supabase user:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }

    // Create a session using signInWithPassword
    const { data: authData, error: authError } = await supabase!.auth.signInWithPassword({
      email: user.email,
      password: password
    });

    if (authError) {
      console.error('Error creating Supabase session:', authError);
      // Fallback: return user data without Supabase session
      res.json({
        success: true,
        message: 'Login realizado com sucesso',
        user: {
          id: user.id.toString(),
          email: user.email,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role || 'user'
        },
        session: null
      });
      return;
    }

    res.json({
      success: true,
      message: 'Login realizado com sucesso',
      user: {
        id: authData.user.id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role || 'user'
      },
      session: {
        access_token: authData.session?.access_token,
        refresh_token: authData.session?.refresh_token,
        expires_in: authData.session?.expires_in,
        token_type: authData.session?.token_type,
        user: authData.user
      }
    });

  } catch (error) {
    console.error('Error in supabaseLoginHandler:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Register handler that creates both database and Supabase users
export const supabaseRegisterHandler: RequestHandler = async (req, res) => {
  try {
    const { username, email, password, firstName, lastName } = req.body;

    if (!username || !email || !password || !firstName || !lastName) {
      return res.status(400).json({
        success: false,
        message: 'Todos os campos são obrigatórios'
      });
    }

    const { storage } = await import('./storage.js');
    const bcrypt = await import('bcrypt');

    // Check if username or email already exists
    const existingUser = await storage.getCustomerByUsername(username);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Nome de usuário já está em uso'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user in database
    const newUser = await storage.createCustomer({
      username,
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role: 'user',
      isActive: true
    });

    // Create user in Supabase
    const { data, error } = await supabase!.auth.admin.createUser({
      email,
      password,
      user_metadata: {
        username,
        first_name: firstName,
        last_name: lastName,
        role: 'user'
      },
      email_confirm: true
    });

    if (error) {
      console.error('Error creating Supabase user:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro ao criar usuário no sistema de autenticação'
      });
    }

    res.json({
      success: true,
      message: 'Conta criada com sucesso! Você já pode fazer login.',
      user: {
        id: data.user.id,
        email: newUser.email,
        username: newUser.username,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        role: newUser.role
      }
    });

  } catch (error: any) {
    console.error('Error in supabaseRegisterHandler:', error);
    
    if (error.code === '23505') {
      if (error.constraint?.includes('email')) {
        return res.status(400).json({
          success: false,
          message: 'Email já está em uso'
        });
      }
      if (error.constraint?.includes('username')) {
        return res.status(400).json({
          success: false,
          message: 'Nome de usuário já está em uso'
        });
      }
    }

    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Logout handler (client-side only with Supabase)
export const supabaseLogoutHandler: RequestHandler = (req, res) => {
  res.json({
    success: true,
    message: 'Logout realizado com sucesso'
  });
};

// Update user metadata (admin only)
export const updateUserMetadataHandler: RequestHandler = async (req, res) => {
  try {
    const { userId, metadata } = req.body;
    
    if (!userId || !metadata) {
      return res.status(400).json({
        success: false,
        message: 'ID do usuário e metadata são obrigatórios'
      });
    }

    const { data, error } = await supabase!.auth.admin.updateUserById(userId, {
      user_metadata: metadata
    });

    if (error) {
      console.error('Error updating user metadata:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro ao atualizar dados do usuário'
      });
    }

    res.json({
      success: true,
      user: data.user
    });
  } catch (error) {
    console.error('Error in updateUserMetadataHandler:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// List all users (admin only)
export const listUsersHandler: RequestHandler = async (req, res) => {
  try {
    const { data, error } = await supabase!.auth.admin.listUsers();

    if (error) {
      console.error('Error listing users:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro ao listar usuários'
      });
    }

    res.json({
      success: true,
      users: data.users.map(user => ({
        id: user.id,
        email: user.email,
        role: user.user_metadata?.role || 'user',
        created_at: user.created_at,
        last_sign_in_at: user.last_sign_in_at
      }))
    });
  } catch (error) {
    console.error('Error in listUsersHandler:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Type declaration for user in request
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