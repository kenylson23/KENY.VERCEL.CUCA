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
- **Database**: PostgreSQL (Replit hosting)
- **ORM**: Drizzle ORM with type-safe schema definitions
- **Migrations**: Drizzle Kit for schema management
- **Connection**: postgres-js driver with SSL configuration

## Key Components

### Authentication System
- **Primary**: JWT tokens with fallback authentication
- **Admin Panel**: Role-based access control
- **Frontend**: React hooks with automatic token management
- **Backend**: JWT verification middleware
- **Security**: bcrypt password hashing and secure sessions

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
- **Replit**: PostgreSQL database hosting and development environment
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

- June 15, 2025: Removed all Neon database dependencies and DATABASE_URL references
- June 15, 2025: Configured application to use Replit PostgreSQL database with environment variables
- June 15, 2025: Updated authentication system to use JWT tokens with fallback support
- June 15, 2025: Cleaned up deployment files and removed external database configuration

## User Preferences

Preferred communication style: Simple, everyday language.