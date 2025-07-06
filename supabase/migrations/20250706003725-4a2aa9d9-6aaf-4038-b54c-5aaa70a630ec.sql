
-- Create projects table
CREATE TABLE public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  content TEXT,
  image_url TEXT,
  demo_url TEXT,
  github_url TEXT,
  technologies TEXT[],
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create blogs table
CREATE TABLE public.blogs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  image_url TEXT,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create messages table (contact form messages)
CREATE TABLE public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'unread',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS policies for projects (admin only)
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin can manage projects" 
  ON public.projects 
  FOR ALL 
  USING (EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'admin'
  ));

-- Add RLS policies for blogs (admin only)
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin can manage blogs" 
  ON public.blogs 
  FOR ALL 
  USING (EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Public can read published blogs" 
  ON public.blogs 
  FOR SELECT 
  USING (published = true);

-- Add RLS policies for messages (admin only)
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin can manage messages" 
  ON public.messages 
  FOR ALL 
  USING (EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Anyone can insert messages" 
  ON public.messages 
  FOR INSERT 
  WITH CHECK (true);
