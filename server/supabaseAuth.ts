import { createClient } from '@supabase/supabase-js';
import type { RequestHandler } from 'express';

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Middleware to verify Supabase JWT token
export const requireSupabaseAuth: RequestHandler = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false, 
        message: 'Token de acesso requerido' 
      });
    }

    const token = authHeader.split(' ')[1];
    
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

    const { data, error } = await supabase.auth.admin.updateUserById(userId, {
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
    const { data, error } = await supabase.auth.admin.listUsers();

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