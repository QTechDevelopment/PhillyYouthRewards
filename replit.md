# Philly Youth Points

## Overview

Philly Youth Points is a gamified mobile-first web application designed to encourage youth engagement with community activities in Philadelphia. The app allows users to earn points by checking in at various locations (community farms, libraries, recycling centers, landmarks) and redeem those points for rewards (movie tickets, gift cards, local attractions, gaming rewards). The system includes features like user profiles, leaderboards, activity tracking, and a comprehensive rewards store.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The client is built as a Single Page Application (SPA) using React with TypeScript, styled with Tailwind CSS and shadcn/ui components. The application follows a mobile-first responsive design pattern with a maximum width constraint for mobile optimization. Key architectural decisions include:

- **Component Library**: Uses shadcn/ui for consistent, accessible UI components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom color variables for Philadelphia-themed branding (philly-blue, philly-green, philly-gold)
- **Routing**: Client-side routing with Wouter for lightweight navigation
- **State Management**: TanStack React Query for server state management with optimistic updates
- **Layout**: Bottom navigation pattern optimized for mobile thumb navigation

### Backend Architecture
The server follows a REST API architecture built with Express.js and TypeScript:

- **API Design**: RESTful endpoints for users, locations, rewards, check-ins, and redemptions
- **Validation**: Zod schemas for runtime type validation and data integrity
- **Storage Layer**: Abstracted storage interface with in-memory implementation for development
- **Middleware**: Custom logging middleware for API request tracking
- **Development**: Vite integration for hot module replacement in development mode

### Data Storage Solutions
The application uses a flexible storage architecture:

- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Schema Management**: Drizzle migrations with shared schema definitions between client and server
- **Connection**: Neon Database serverless PostgreSQL for production deployment
- **Development**: In-memory storage implementation for rapid development and testing

### Authentication and Authorization
Currently implements a demo user system for development with planned expansion for full user management:

- **Demo Mode**: Single demo user for development and testing
- **User Model**: Complete user schema with points, levels, and profile data
- **Session Management**: Prepared for cookie-based session storage with PostgreSQL

### Data Models
Core entities include:
- **Users**: Points, levels, avatars, join dates
- **Locations**: Categorized check-in points with point values
- **Rewards**: Tiered reward system with different categories
- **Check-ins**: Point-earning activities with timestamps
- **Redemptions**: Point-spending transactions

## External Dependencies

### UI and Styling
- **shadcn/ui**: Component library built on Radix UI primitives
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Headless UI components for accessibility
- **Lucide React**: Icon library for consistent iconography

### Database and ORM
- **Drizzle ORM**: Type-safe PostgreSQL ORM with schema validation
- **Drizzle Zod**: Integration between Drizzle schemas and Zod validation
- **Neon Database**: Serverless PostgreSQL hosting

### Development Tools
- **Vite**: Build tool and development server
- **TypeScript**: Type safety across the entire stack
- **ESBuild**: Fast JavaScript bundler for production builds
- **TanStack React Query**: Server state management with caching

### Utilities
- **Date-fns**: Date manipulation and formatting
- **Class Variance Authority**: Utility for managing component variants
- **Wouter**: Lightweight client-side routing
- **Zod**: Runtime type validation and schema definition