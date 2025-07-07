
# System Design Architecture - Sifeddine.xyz

## 🏗️ High-Level Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Supabase       │    │  External APIs  │
│   (React/Vite)  │◄──►│   Backend        │◄──►│  (OpenAI, etc.) │
│                 │    │                  │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         ├─ UI Components        ├─ PostgreSQL DB        ├─ AI Services
         ├─ State Management     ├─ Authentication       ├─ Analytics
         ├─ Routing              ├─ Edge Functions       └─ Monitoring
         └─ Asset Management     └─ Storage Buckets
```

## 🔐 Authentication System

### User Flow Architecture
```
Visitor → Landing Page ─┐
                        ├─ Public Access (AI Chat, Portfolio)
                        └─ Login Required ─┐
                                          ├─ Regular User (Profile)
                                          └─ Admin User (Dashboard)
```

### Authentication Components
- **AuthContext.tsx** → Centralized auth state management
- **ProtectedRoute.tsx** → Route-level access control
- **Login.tsx** → Authentication interface
- **Supabase Auth** → Backend authentication service

### User Roles & Permissions
```typescript
type UserRole = 'admin' | 'user';

// Admin Capabilities
- Full CRUD on projects, blogs, messages
- AI chat monitoring and analytics
- User management and role assignment
- System configuration access

// User Capabilities
- Profile management
- Personal AI chat history
- Limited content interaction
```

### Session Management
- **Persistent Sessions** → Auto-refresh tokens via Supabase
- **Role-based Redirects** → Admin users → `/admin`, Others → `/`
- **Protected Routes** → Automatic redirect to login for unauthorized access
- **Session Storage** → LocalStorage for client-side persistence

## 🗄️ Database Architecture

### Core Tables Structure

#### **profiles**
```sql
- id (UUID, PK)
- user_id (UUID, FK to auth.users)
- email (TEXT)
- display_name (TEXT)
- role (TEXT: 'admin' | 'user')
- created_at, updated_at (TIMESTAMP)
```

#### **projects**
```sql
- id (UUID, PK)
- title, description, content (TEXT)
- image_url, demo_url, github_url (TEXT)
- technologies (TEXT[])
- featured (BOOLEAN)
- created_at, updated_at (TIMESTAMP)
```

#### **blogs**
```sql
- id (UUID, PK)
- title, slug, excerpt, content (TEXT)
- image_url (TEXT)
- published (BOOLEAN)
- created_at, updated_at (TIMESTAMP)
```

#### **messages**
```sql
- id (UUID, PK)
- name, email, subject, message (TEXT)
- status (TEXT: 'unread' | 'read' | 'replied')
- created_at (TIMESTAMP)
```

#### **ai_chat_messages**
```sql
- id (UUID, PK)
- user_id (UUID, nullable for anonymous)
- message, response (TEXT)
- timestamp (TIMESTAMP)
```

### Row Level Security (RLS) Policies

#### **Public Access**
- **Blogs** → Published blogs readable by everyone
- **Projects** → All projects visible to public
- **Messages** → Anyone can insert contact messages

#### **User Access**
- **Profiles** → Users can only access their own profile
- **AI Chats** → Users see only their chat history

#### **Admin Access**
- **All Tables** → Full CRUD permissions for admin role
- **Analytics** → Access to system metrics and logs

### Data Relationships
```
auth.users ──► profiles (1:1)
           └─► ai_chat_messages (1:many)

profiles ──► role-based access control

projects ──► public display
blogs ────► public (if published)
messages ─► admin management only
```

## 🔄 API Layer & Core Logic

### Frontend API Calls
```typescript
// Supabase Client Integration
import { supabase } from '@/integrations/supabase/client';

// Authentication API
- supabase.auth.signInWithPassword()
- supabase.auth.signOut()
- supabase.auth.onAuthStateChange()

// Data API
- supabase.from('table').select()
- supabase.from('table').insert()
- supabase.from('table').update()
- supabase.from('table').delete()
```

### Edge Functions Architecture
```
/functions/
├── chat-with-jarvis/     # AI Chat Backend
│   ├── index.ts         # Main handler
│   └── cors.ts          # CORS configuration
└── [future functions]   # Analytics, notifications, etc.
```

#### **chat-with-jarvis Function**
- **Purpose** → Handle AI chat requests with OpenAI integration
- **Features** → Rate limiting, session management, error handling
- **Security** → API key protection, user authentication optional
- **Performance** → Streaming responses, caching strategies

### State Management Architecture

#### **Global State (React Context)**
- **AuthContext** → User authentication state
- **Theme Context** → Dark/light mode (future)
- **Settings Context** → User preferences (future)

#### **Server State (TanStack Query)**
- **Query Keys** → Organized by entity type
- **Caching Strategy** → Aggressive caching with smart invalidation
- **Optimistic Updates** → Immediate UI feedback
- **Error Handling** → Graceful degradation and retry logic

#### **Local State (Component Level)**
- **Form State** → React Hook Form for complex forms
- **UI State** → useState for component-specific state
- **Session State** → localStorage for anonymous AI chats

## 🌐 External System Integrations

### **OpenAI Integration**
- **Service** → GPT-4 for AI chat responses
- **Implementation** → Edge function proxy for security
- **Features** → Context awareness, conversation memory
- **Rate Limiting** → Prevent abuse and manage costs

### **Analytics & Monitoring**
- **Built-in Analytics** → Custom tracking via Supabase
- **Performance Monitoring** → Vite build metrics
- **Error Tracking** → Console logging and error boundaries
- **User Behavior** → Page views, interaction tracking

### **Email & Notifications**
- **Contact Forms** → Direct to admin notification system
- **Future Integration** → Email service for automated responses
- **Push Notifications** → Browser notifications for admin alerts

## 🔧 Development & Deployment Architecture

### **Local Development**
```
npm run dev → Vite Dev Server (localhost:5173)
├── Hot Module Replacement
├── TypeScript Compilation
├── Tailwind CSS Processing
└── Supabase Local Instance (optional)
```

### **Build Process**
```
npm run build → Production Build
├── TypeScript Compilation
├── Tree Shaking & Code Splitting
├── Asset Optimization
├── Source Map Generation
└── Static File Generation
```

### **Deployment Pipeline**
```
Git Push → Lovable.dev → Production Deploy
├── Automatic SSL
├── CDN Distribution
├── Environment Variables
└── Database Migrations (manual approval)
```

## 🛡️ Security Architecture

### **Frontend Security**
- **Input Sanitization** → XSS prevention
- **CSRF Protection** → Supabase built-in protection
- **Content Security Policy** → Strict CSP headers
- **Environment Variables** → Secure API key management

### **Backend Security**
- **Row Level Security** → Database-level access control
- **API Rate Limiting** → Prevent abuse and DoS
- **SQL Injection Prevention** → Parameterized queries
- **Authentication Tokens** → JWT-based session management

### **Data Protection**
- **Encryption at Rest** → Supabase PostgreSQL encryption
- **Encryption in Transit** → HTTPS/TLS 1.3
- **PII Handling** → Minimal data collection
- **GDPR Compliance** → Data deletion capabilities

## 📊 Performance & Scalability

### **Frontend Performance**
- **Code Splitting** → Route-based and component-based
- **Lazy Loading** → Images and non-critical components
- **Caching Strategy** → Service worker and browser caching
- **Bundle Optimization** → Tree shaking and minification

### **Backend Performance**
- **Database Indexing** → Optimized queries for frequent operations
- **Connection Pooling** → Supabase managed connections
- **Edge Functions** → Serverless scaling
- **CDN Integration** → Global content distribution

### **Scalability Considerations**
- **Horizontal Scaling** → Supabase auto-scaling
- **Database Optimization** → Query optimization and indexing
- **Caching Layers** → Multiple levels of caching
- **Load Balancing** → Automatic load distribution

This architecture provides a solid foundation for current needs while remaining flexible enough to accommodate future growth and feature additions.
