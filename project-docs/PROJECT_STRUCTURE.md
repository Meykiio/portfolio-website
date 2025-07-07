
# Project Structure - Sifeddine.xyz

## 📁 Root Directory Structure

```
sifeddine.xyz/
├── src/                          # Main application source code
│   ├── components/               # Reusable UI components
│   │   ├── ui/                  # shadcn/ui base components
│   │   ├── admin/               # Admin dashboard components
│   │   ├── About.tsx            # About section component
│   │   ├── AIAssistant.tsx      # AI chat assistant with public access
│   │   ├── Contact.tsx          # Contact form section
│   │   ├── FloatingElements.tsx # Animated background elements
│   │   ├── Hero.tsx             # Landing page hero section
│   │   ├── InteractiveCard.tsx  # Hover-effect project cards
│   │   ├── Lab.tsx              # Lab/experiments showcase
│   │   ├── MetaBalls.tsx        # Animated MetaBalls effect
│   │   ├── Mindset.tsx          # Personal philosophy section
│   │   ├── Projects.tsx         # Project portfolio display
│   │   ├── ProtectedRoute.tsx   # Authentication wrapper
│   │   ├── Silk.tsx             # Silk animation background
│   │   └── TextScramble.tsx     # Text scrambling animation
│   ├── contexts/                # React contexts for state management
│   │   └── AuthContext.tsx      # Authentication state management
│   ├── hooks/                   # Custom React hooks
│   │   ├── use-mobile.tsx       # Mobile detection hook
│   │   └── use-toast.ts         # Toast notification hook
│   ├── integrations/            # Third-party service integrations
│   │   └── supabase/           # Supabase client and types
│   │       ├── client.ts        # Configured Supabase client
│   │       └── types.ts         # Database type definitions
│   ├── lib/                     # Utility functions and configurations
│   │   └── utils.ts             # Common utility functions
│   ├── pages/                   # Route components
│   │   ├── Admin.tsx           # Admin dashboard page
│   │   ├── Index.tsx           # Landing page
│   │   ├── Login.tsx           # Authentication page
│   │   └── NotFound.tsx        # 404 error page
│   ├── App.tsx                 # Main application component
│   ├── index.css               # Global styles and Tailwind imports
│   └── main.tsx                # Application entry point
├── supabase/                   # Supabase configuration and migrations
│   ├── functions/              # Edge functions
│   │   └── chat-with-jarvis/   # AI chat backend function
│   ├── migrations/             # Database schema migrations
│   └── config.toml             # Supabase project configuration
├── public/                     # Static assets
│   ├── favicon.ico             # Site favicon
│   ├── placeholder.svg         # Placeholder images
│   └── robots.txt              # SEO robots configuration
├── project-docs/               # Project documentation (this folder)
├── prd.md                      # Product Requirements Document
├── backend-schema.md           # Database schema documentation
├── package.json                # Node.js dependencies and scripts
├── tailwind.config.ts          # Tailwind CSS configuration
├── vite.config.ts              # Vite build configuration
└── tsconfig.json               # TypeScript configuration
```

## 🧩 Component Architecture

### Core Layout Components
- **Hero.tsx** → Landing page hero with glassmorphism effects
- **About.tsx** → Personal introduction and background
- **Projects.tsx** → Portfolio showcase with interactive cards
- **Lab.tsx** → Experimental projects and tools
- **Mindset.tsx** → Personal philosophy and approach
- **Contact.tsx** → Contact form with message handling

### Interactive Effects
- **MetaBalls.tsx** → Animated blob effects for backgrounds
- **Silk.tsx** → Flowing silk-like animations
- **FloatingElements.tsx** → Subtle floating UI elements
- **TextScramble.tsx** → Matrix-style text animations
- **InteractiveCard.tsx** → Mouse-following glow effects

### Admin Dashboard
- **AiChatsManager.tsx** → Manage AI chat sessions and logs
- **BlogsManager.tsx** → Content management for blog posts
- **MessagesManager.tsx** → Handle contact form submissions
- **ProjectsManager.tsx** → Portfolio project CRUD operations

### Authentication & State
- **AuthContext.tsx** → User authentication state management
- **ProtectedRoute.tsx** → Route protection for admin areas
- **AIAssistant.tsx** → Public AI chat with session persistence

## 🗄️ Database Layer

### Tables
- **profiles** → User profile data and roles
- **projects** → Portfolio project information
- **blogs** → Blog posts and content
- **messages** → Contact form submissions
- **ai_chat_messages** → AI conversation history

## 🎨 Styling Architecture
- **Tailwind CSS** → Utility-first styling framework
- **shadcn/ui** → Pre-built component library
- **Custom CSS** → Animations and glassmorphism effects
- **Responsive Design** → Mobile-first approach
