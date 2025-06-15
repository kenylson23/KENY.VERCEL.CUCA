import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import type { RequestHandler } from 'express';
import { storage } from './storage.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Admin credentials (hardcoded for simplicity)
const ADMIN_CREDENTIALS = {
  username: "admin",
  password: "cuca2024"
};

export interface JWTPayload {
  id: number | string;
  username: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

export const jwtLoginHandler: RequestHandler = async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log('JWT Login attempt for user:', username);

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Usuário e senha são obrigatórios'
      });
    }

    // Check for admin login first
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      console.log('Admin login detected');
      
      // Generate JWT token for admin
      const payload: JWTPayload = {
        id: "admin-1",
        username: "admin",
        email: "admin@cuca.ao",
        role: "admin"
      };

      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });

      return res.json({
        success: true,
        message: 'Login de administrador realizado com sucesso',
        user: {
          id: "admin-1",
          email: "admin@cuca.ao",
          username: "admin",
          firstName: "Admin",
          lastName: "CUCA",
          role: "admin"
        },
        token
      });
    }

    // Get user from database
    const user = await storage.getCustomerByUsername(username);

    if (!user) {
      console.log('User not found:', username);
      return res.status(401).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    if (!user.isActive) {
      console.log('User account is inactive:', username);
      return res.status(401).json({
        success: false,
        message: 'Conta desativada'
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log('Password validation result for user:', username, isPasswordValid);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Senha incorreta'
      });
    }

    // Generate JWT token
    const payload: JWTPayload = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role || 'user'
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });

    res.json({
      success: true,
      message: 'Login realizado com sucesso',
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role || 'user'
      },
      token
    });

  } catch (error) {
    console.error('Error in jwtLoginHandler:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

export const jwtRegisterHandler: RequestHandler = async (req, res) => {
  try {
    const { username, email, password, firstName, lastName } = req.body;

    if (!username || !email || !password || !firstName || !lastName) {
      return res.status(400).json({
        success: false,
        message: 'Todos os campos são obrigatórios'
      });
    }

    // Check if username already exists
    const existingUser = await storage.getCustomerByUsername(username);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Nome de usuário já está em uso'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await storage.createCustomer({
      username,
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role: 'user',
      isActive: true
    });

    res.json({
      success: true,
      message: 'Conta criada com sucesso! Você já pode fazer login.',
      user: {
        id: newUser.id,
        email: newUser.email,
        username: newUser.username,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        role: newUser.role
      }
    });

  } catch (error: any) {
    console.error('Error in jwtRegisterHandler:', error);
    
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

export const requireJWTAuth: RequestHandler = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false, 
        message: 'Token de acesso requerido' 
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ 
      success: false, 
      message: 'Token inválido ou expirado' 
    });
  }
};

export const requireAdminJWT: RequestHandler = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ 
      success: false, 
      message: 'Acesso negado. Permissões de administrador requeridas.' 
    });
  }
  next();
};

export const jwtGetUserHandler: RequestHandler = (req, res) => {
  if (!req.user) {
    return res.status(401).json({ 
      success: false, 
      message: 'Usuário não autenticado' 
    });
  }
  
  res.json({
    success: true,
    user: req.user
  });
};

export const jwtLogoutHandler: RequestHandler = (req, res) => {
  res.json({
    success: true,
    message: 'Logout realizado com sucesso'
  });
};

// Type declaration
declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}