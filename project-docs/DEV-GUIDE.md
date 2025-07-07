
# Developer Setup Guide - Sifeddine.xyz

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v18 or higher)
- **npm** or **yarn** package manager
- **Git** for version control
- **Supabase account** (for backend services)

### Initial Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd sifeddine.xyz
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Configuration**
   - Copy the example environment file:
     ```bash
     cp .env.example .env.local
     ```
   - Fill in the required environment variables (see below)

4. **Start development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Access the application**
   - Frontend: `http://localhost:5173`
   - Admin panel: `http://localhost:5173/admin` (requires authentication)

## 🔐 Environment Variables

Create a `.env.local` file with the following variables:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: For AI Chat functionality
VITE_OPENAI_API_KEY=your_openai_api_key

# Optional: For analytics
VITE_GOOGLE_ANALYTICS_ID=your_ga_id
```

### Getting Supabase Credentials
1. Go to [supabase.com](https://supabase.com)
2. Create a new project or use existing
3. Navigate to Settings → API
4. Copy the URL and anon key

## 📦 Available Scripts

```bash
# Development
npm run dev              # Start development server with hot reload
npm run build            # Build for production
npm run preview          # Preview production build locally

# Code Quality
npm run lint             # Run ESLint
npm run type-check       # Run TypeScript compiler check

# Database (Supabase)
npx supabase start       # Start local Supabase instance
npx supabase stop        # Stop local Supabase instance
npx supabase db reset    # Reset local database
npx supabase gen types   # Generate TypeScript types
```

## 🏗️ Tech Stack Overview

### Frontend
- **React 18** → UI library with hooks and context
- **TypeScript** → Type-safe JavaScript
- **Vite** → Fast build tool and dev server
- **Tailwind CSS** → Utility-first CSS framework
- **shadcn/ui** → Pre-built component library
- **React Router** → Client-side routing
- **TanStack Query** → Server state management

### Backend
- **Supabase** → Backend-as-a-Service platform
  - PostgreSQL database with Row Level Security
  - Authentication and user management
  - Edge Functions for serverless logic
  - Real-time subscriptions
  - File storage

### State Management
- **React Context** → Authentication state
- **TanStack Query** → Server state caching
- **Local Storage** → Client-side persistence

## 🎨 Styling Guidelines

### Design System
- **Primary Color**: Electric Cyan (`#00FFFF`)
- **Background**: Dark brutalist (`hsl(0, 0%, 6.5%)`)
- **Typography**: Space Grotesk (headings), Inter (body)
- **Effects**: Glassmorphism with backdrop blur

### Component Structure
```typescript
// Example component structure
import React from 'react';
import { cn } from '@/lib/utils';

interface ComponentProps {
  className?: string;
  children: React.ReactNode;
}

export const Component: React.FC<ComponentProps> = ({ 
  className, 
  children 
}) => {
  return (
    <div className={cn("base-styles", className)}>
      {children}
    </div>
  );
};
```

## 🔧 Common Development Tasks

### Adding New Components
1. Create component in `src/components/`
2. Use TypeScript interfaces for props
3. Follow naming convention: PascalCase
4. Export from component file
5. Add to relevant page/layout

### Database Changes
1. Create migration in `supabase/migrations/`
2. Test locally with `npx supabase db reset`
3. Update TypeScript types: `npx supabase gen types`
4. Apply to production via Supabase dashboard

### Adding New Pages
1. Create page component in `src/pages/`
2. Add route in `App.tsx`
3. Update navigation if needed
4. Consider authentication requirements

## 🐛 Debugging Tips

### Common Issues
- **Build failures**: Check TypeScript errors and imports
- **Supabase errors**: Verify environment variables and RLS policies
- **Styling issues**: Check Tailwind class conflicts
- **Auth problems**: Ensure user roles are properly set

### Debug Tools
- React Developer Tools browser extension
- Supabase dashboard for database inspection
- Browser console for client-side errors
- Network tab for API call debugging

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
