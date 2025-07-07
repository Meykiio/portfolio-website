
# Backend Schema Documentation
## Supabase Architecture for Sifeddine.xyz

### 🗄️ **Database Schema Overview**

The backend architecture follows a modular, secure design with proper separation of concerns and role-based access control.

---

### 📊 **Core Tables**

#### **1. Authentication & User Management**

```sql
-- User Profiles (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  website_url TEXT,
  social_links JSONB DEFAULT '{}',
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Roles (separate table for scalability)
CREATE TYPE public.user_role AS ENUM ('admin', 'moderator', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role user_role NOT NULL DEFAULT 'user',
  granted_by UUID REFERENCES auth.users(id),
  granted_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, role)
);
```

#### **2. Content Management**

```sql
-- Projects Portfolio
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  content TEXT, -- Rich content/markdown
  excerpt TEXT, -- Short description for cards
  
  -- Media
  featured_image_url TEXT,
  gallery_urls TEXT[],
  
  -- Technical Details
  technologies TEXT[] DEFAULT '{}',
  github_url TEXT,
  demo_url TEXT,
  
  -- Metadata
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  featured BOOLEAN DEFAULT FALSE,
  priority INTEGER DEFAULT 0, -- For ordering
  
  -- SEO
  meta_title TEXT,
  meta_description TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ
);

-- Blog Posts
CREATE TABLE public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  
  -- Media
  featured_image_url TEXT,
  
  -- Publishing
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'scheduled', 'archived')),
  published_at TIMESTAMPTZ,
  
  -- SEO & Social
  meta_title TEXT,
  meta_description TEXT,
  og_image_url TEXT,
  
  -- Engagement
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  
  -- Categories & Tags
  categories TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### **3. Communication & Interaction**

```sql
-- Contact Messages
CREATE TABLE public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  
  -- Classification
  category TEXT DEFAULT 'general' CHECK (category IN ('general', 'business', 'technical', 'spam')),
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  
  -- Status Tracking
  status TEXT DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'replied', 'archived')),
  responded_at TIMESTAMPTZ,
  responded_by UUID REFERENCES auth.users(id),
  
  -- Metadata
  user_agent TEXT,
  ip_address INET,
  referrer TEXT,
  
  -- Anti-spam
  spam_score REAL DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI Chat Sessions (for both authenticated and anonymous users)
CREATE TABLE public.ai_chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE, -- NULL for anonymous
  session_token TEXT, -- For anonymous users
  
  -- Session Metadata
  title TEXT, -- Auto-generated from first message
  context_data JSONB DEFAULT '{}', -- User preferences, conversation context
  
  -- Status
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'archived', 'expired')),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '30 days') -- Auto-expire anonymous sessions
);

-- AI Chat Messages
CREATE TABLE public.ai_chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES public.ai_chat_sessions(id) ON DELETE CASCADE NOT NULL,
  
  -- Message Content
  message_type TEXT NOT NULL CHECK (message_type IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  
  -- Metadata
  tokens_used INTEGER,
  model_used TEXT,
  response_time_ms INTEGER,
  
  -- Context
  context_data JSONB DEFAULT '{}',
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### **4. Analytics & Monitoring**

```sql
-- Site Analytics
CREATE TABLE public.site_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Page Info
  page_path TEXT NOT NULL,
  page_title TEXT,
  referrer TEXT,
  
  -- User Info
  user_id UUID REFERENCES auth.users(id), -- NULL for anonymous
  session_id TEXT NOT NULL,
  
  -- Technical
  user_agent TEXT,
  ip_address INET,
  country_code TEXT,
  device_type TEXT,
  browser_name TEXT,
  
  -- Engagement
  duration_seconds INTEGER,
  scroll_depth REAL, -- Percentage scrolled
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- API Usage Tracking
CREATE TABLE public.api_usage_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Request Info
  endpoint TEXT NOT NULL,
  method TEXT NOT NULL,
  status_code INTEGER NOT NULL,
  
  -- User Context
  user_id UUID REFERENCES auth.users(id),
  ip_address INET,
  
  -- Performance
  response_time_ms INTEGER,
  
  -- Rate Limiting
  rate_limit_key TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### **5. System Configuration**

```sql
-- Site Settings (key-value store for configuration)
CREATE TABLE public.site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'general',
  updated_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Feature Flags
CREATE TABLE public.feature_flags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  enabled BOOLEAN DEFAULT FALSE,
  rollout_percentage INTEGER DEFAULT 0 CHECK (rollout_percentage >= 0 AND rollout_percentage <= 100),
  target_users TEXT[], -- Specific user IDs
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

### 🔐 **Row Level Security (RLS) Policies**

#### **User Profiles**
```sql
-- Users can view and edit their own profile
CREATE POLICY "Users can manage own profile" ON public.profiles
FOR ALL USING (auth.uid() = user_id);

-- Public profiles are viewable by everyone (for portfolio)
CREATE POLICY "Public profiles viewable" ON public.profiles
FOR SELECT USING (TRUE); -- Modify based on privacy requirements
```

#### **User Roles**
```sql
-- Security definer function to check roles (prevents recursion)
CREATE OR REPLACE FUNCTION public.get_user_role(user_uuid UUID)
RETURNS user_role
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT role FROM public.user_roles WHERE user_id = user_uuid LIMIT 1;
$$;

-- Only admins can manage roles
CREATE POLICY "Admins manage roles" ON public.user_roles
FOR ALL USING (public.get_user_role(auth.uid()) = 'admin');
```

#### **Content Management**
```sql
-- Public can read published content
CREATE POLICY "Public read published projects" ON public.projects
FOR SELECT USING (status = 'published');

-- Admins can manage all content
CREATE POLICY "Admins manage projects" ON public.projects
FOR ALL USING (public.get_user_role(auth.uid()) = 'admin');

-- Similar policies for blog_posts
CREATE POLICY "Public read published blogs" ON public.blog_posts
FOR SELECT USING (status = 'published');

CREATE POLICY "Admins manage blogs" ON public.blog_posts
FOR ALL USING (public.get_user_role(auth.uid()) = 'admin');
```

#### **AI Chat System**
```sql
-- Users can only access their own chat sessions
CREATE POLICY "Users access own chats" ON public.ai_chat_sessions
FOR ALL USING (
  auth.uid() = user_id OR 
  (user_id IS NULL AND session_token IS NOT NULL) -- Anonymous sessions
);

-- Messages follow session access rules
CREATE POLICY "Chat message access" ON public.ai_chat_messages
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.ai_chat_sessions 
    WHERE id = session_id AND (
      auth.uid() = user_id OR 
      (user_id IS NULL AND session_token IS NOT NULL)
    )
  )
);

-- Admins can view all chats for moderation
CREATE POLICY "Admins view all chats" ON public.ai_chat_sessions
FOR SELECT USING (public.get_user_role(auth.uid()) = 'admin');
```

#### **Contact Messages**
```sql
-- Anyone can insert messages
CREATE POLICY "Anyone can send messages" ON public.contact_messages
FOR INSERT WITH CHECK (TRUE);

-- Only admins can view/manage messages
CREATE POLICY "Admins manage messages" ON public.contact_messages
FOR ALL USING (public.get_user_role(auth.uid()) = 'admin');
```

---

### ⚡ **Database Functions & Triggers**

#### **Auto-updating Timestamps**
```sql
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to relevant tables
CREATE TRIGGER update_profiles_updated_at 
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_projects_updated_at 
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
```

#### **Auto-generate Slugs**
```sql
CREATE OR REPLACE FUNCTION public.generate_slug(title TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN lower(regexp_replace(trim(title), '[^a-zA-Z0-9]+', '-', 'g'));
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate slugs if not provided
CREATE OR REPLACE FUNCTION public.ensure_slug()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug = public.generate_slug(NEW.title);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

#### **User Profile Creation**
```sql
-- Auto-create profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, display_name)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1))
  );
  
  -- Assign default user role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

---

### 🔧 **Edge Functions Architecture**

#### **1. AI Chat Function** (`supabase/functions/ai-chat/index.ts`)
```typescript
// Purpose: Handle AI chat requests with rate limiting and context management
// Endpoints: POST /ai-chat
// Features: 
// - OpenAI integration
// - Session management
// - Rate limiting by IP/user
// - Context preservation
// - Streaming responses
```

#### **2. Contact Form Handler** (`supabase/functions/contact-form/index.ts`)
```typescript
// Purpose: Process contact form submissions with spam protection
// Endpoints: POST /contact-form
// Features:
// - Input validation
// - Spam detection
// - Email notifications
// - Admin alerts for urgent messages
```

#### **3. Analytics Collector** (`supabase/functions/analytics/index.ts`)
```typescript
// Purpose: Collect and process site analytics
// Endpoints: POST /analytics/track
// Features:
// - Page view tracking
// - User engagement metrics
// - Performance monitoring
// - Privacy-compliant data collection
```

#### **4. Content Management** (`supabase/functions/content-admin/index.ts`)
```typescript
// Purpose: Advanced content operations
// Endpoints: Multiple admin-only endpoints
// Features:
// - Bulk operations
// - SEO optimization
// - Image processing
// - Content validation
```

---

### 📁 **Storage Buckets**

#### **1. Project Assets** (`project-media`)
```sql
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'project-media',
  'project-media',
  TRUE,
  52428800, -- 50MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'video/mp4']
);
```

#### **2. Blog Content** (`blog-media`)
```sql
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'blog-media',
  'blog-media',
  TRUE,
  20971520, -- 20MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
);
```

#### **3. User Avatars** (`avatars`)
```sql
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  TRUE,
  2097152, -- 2MB
  ARRAY['image/jpeg', 'image/png', 'image/webp']
);
```

---

### 🚀 **Performance Optimizations**

#### **Indexes**
```sql
-- Frequently queried columns
CREATE INDEX idx_projects_status_featured ON public.projects(status, featured);
CREATE INDEX idx_projects_published_at ON public.projects(published_at DESC) WHERE status = 'published';
CREATE INDEX idx_blog_posts_published_at ON public.blog_posts(published_at DESC) WHERE status = 'published';
CREATE INDEX idx_contact_messages_status_created ON public.contact_messages(status, created_at DESC);
CREATE INDEX idx_ai_chat_sessions_user_updated ON public.ai_chat_sessions(user_id, updated_at DESC);

-- Full-text search indexes
CREATE INDEX idx_projects_search ON public.projects USING gin(to_tsvector('english', title || ' ' || description || ' ' || content));
CREATE INDEX idx_blog_posts_search ON public.blog_posts USING gin(to_tsvector('english', title || ' ' || content));
```

#### **Materialized Views for Analytics**
```sql
-- Popular content view
CREATE MATERIALIZED VIEW public.popular_content AS
SELECT 
  'project' as content_type,
  id,
  title,
  view_count
FROM public.projects 
WHERE status = 'published'
UNION ALL
SELECT 
  'blog' as content_type,
  id,
  title,
  view_count
FROM public.blog_posts 
WHERE status = 'published'
ORDER BY view_count DESC;

-- Refresh materialized view daily
```

---

### 🔒 **Security Measures**

#### **Rate Limiting Tables**
```sql
CREATE TABLE public.rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  identifier TEXT NOT NULL, -- IP address or user ID
  endpoint TEXT NOT NULL,
  requests_count INTEGER DEFAULT 1,
  window_start TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '1 hour'),
  UNIQUE(identifier, endpoint, window_start)
);

CREATE INDEX idx_rate_limits_identifier_endpoint ON public.rate_limits(identifier, endpoint, expires_at);
```

#### **Audit Logs**
```sql
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  table_name TEXT,
  record_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

### 📊 **Real-time Features**

#### **Enable Real-time for Key Tables**
```sql
-- Enable real-time for admin dashboard
ALTER TABLE public.contact_messages REPLICA IDENTITY FULL;
ALTER TABLE public.ai_chat_messages REPLICA IDENTITY FULL;
ALTER TABLE public.site_analytics REPLICA IDENTITY FULL;

-- Add tables to publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.contact_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.ai_chat_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.site_analytics;
```

---

### 🧪 **Development & Testing**

#### **Seed Data**
```sql
-- Insert sample site settings
INSERT INTO public.site_settings (key, value, description, category) VALUES
('site_title', '"Sifeddine.xyz — Personal OS"', 'Main site title', 'general'),
('site_description', '"Welcome to the space where systems, obsessions, and weird tools live."', 'Site meta description', 'seo'),
('contact_email', '"hello@sifeddine.xyz"', 'Primary contact email', 'contact'),
('ai_assistant_enabled', 'true', 'Enable AI assistant feature', 'features'),
('maintenance_mode', 'false', 'Site maintenance mode', 'system');

-- Create first admin user (run after user signup)
-- UPDATE public.user_roles SET role = 'admin' WHERE user_id = 'USER_UUID_HERE';
```

---

This schema provides a robust, scalable foundation for the rebuilt Sifeddine.xyz with proper security, performance optimizations, and clear separation of concerns.
