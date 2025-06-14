# CUCA Beer - Professional Sales Landing Page

## Overview

This is a professional sales landing page for CUCA beer, showcasing the brand's rich heritage through an interactive and dynamically animated React-based frontend. The application features a modern tech stack with React, Express.js, PostgreSQL, and is optimized for deployment on Vercel with serverless functions.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **Animations**: Framer Motion for smooth transitions and interactions
- **Build Tool**: Vite for fast development and optimized builds
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for lightweight client-side routing

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Session Management**: Dual authentication system (sessions for traditional deployment, JWT for Vercel)
- **API Design**: RESTful endpoints with proper error handling
- **Middleware**: Custom logging, CORS, and authentication middleware

### Database Architecture
- **Database**: PostgreSQL (Supabase cloud hosting)
- **ORM**: Drizzle ORM with type-safe schema definitions
- **Migrations**: Drizzle Kit for schema management
- **Connection**: postgres-js driver with SSL for Supabase compatibility
- **Authentication**: Supabase Auth with JWT tokens

## Key Components

### Authentication System
- **Primary**: Supabase Authentication with JWT tokens
- **Admin Panel**: Role-based access control using Supabase user metadata
- **Frontend**: React hooks with automatic token management
- **Backend**: JWT verification middleware with Supabase service key
- **Security**: Supabase handles password hashing, secure sessions, and token refresh

### Content Management
- **Product Catalog**: Dynamic product showcase with image optimization
- **Contact System**: Message handling with admin moderation
- **Fan Gallery**: User-generated content with approval workflow
- **Analytics**: Event tracking and usage statistics

### Performance Optimization
- **Lazy Loading**: Component-level code splitting and lazy loading
- **Image Optimization**: WebP format support with fallbacks
- **Caching**: Query caching with TanStack Query
- **Bundle Optimization**: Separate builds for client and server

## Data Flow

1. **Client Requests**: React frontend makes API calls through TanStack Query
2. **Authentication**: Middleware validates sessions/JWT tokens
3. **Database Operations**: Drizzle ORM handles type-safe database interactions
4. **Response Processing**: Express middleware formats and logs responses
5. **Error Handling**: Centralized error handling with proper HTTP status codes

## External Dependencies

### Core Dependencies
- **@radix-ui/react-***: Accessible UI components
- **framer-motion**: Animation library
- **drizzle-orm**: Type-safe ORM
- **express**: Web framework
- **bcrypt**: Password hashing
- **jsonwebtoken**: JWT authentication

### Development Dependencies
- **vite**: Build tool and dev server
- **typescript**: Type checking
- **tailwindcss**: Utility-first CSS framework
- **esbuild**: Fast JavaScript bundler

### Cloud Services
- **Supabase**: PostgreSQL database hosting with built-in auth and real-time features
- **Vercel**: Serverless deployment platform

## Deployment Strategy

### Vercel Deployment
- **Functions**: Serverless functions for API routes
- **Static Assets**: Optimized static file serving
- **Environment Variables**: Secure configuration management
- **Build Process**: Dual build system (Vite for frontend, esbuild for backend)

### Configuration Files
- `vercel.json`: Deployment configuration with rewrites and functions
- `build-vercel.js`: Custom build script for Vercel compatibility
- `tsconfig.vercel.json`: TypeScript configuration for serverless environment

### Error Resolution
- **Module Resolution**: Fixed ES module imports for Vercel compatibility
- **Session Handling**: Implemented fallback strategies for serverless environments
- **Build Optimization**: External dependencies properly configured for serverless

## Changelog

- June 14, 2025: Initial setup with PostgreSQL/Neon database
- June 14, 2025: Complete migration to Supabase database with postgres-js driver
- June 14, 2025: Complete migration to Supabase authentication system replacing session-based auth
- June 14, 2025: Migrated from Neon to Supabase database - removed all Neon dependencies and configured full Supabase integration

## User Preferences

Preferred communication style: Simple, everyday language.