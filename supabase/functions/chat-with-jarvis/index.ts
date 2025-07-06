import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message } = await req.json();
    const authHeader = req.headers.get('Authorization');
    
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    // Get user from token
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    
    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    if (!geminiApiKey) {
      throw new Error('Gemini API key not configured');
    }

    // System prompt about Sifeddine and the website
    const systemPrompt = `You are Jarvis, Sifeddine's advanced AI assistant integrated into his personal portfolio website. 

About Sifeddine:
- Full-stack developer and AI enthusiast based in Algiers, Algeria
- Specializes in React, Node.js, Python, and AI/ML technologies
- Philosophy: "Building systems, not stress" - focuses on creating efficient, maintainable solutions
- Has experience with modern web technologies, databases, and deployment
- Enjoys creating "weird tools" and innovative solutions
- Currently building his portfolio at sifeddine.xyz

About this website:
- Built with React, TypeScript, Tailwind CSS, and Supabase
- Features a brutalist design with glassmorphism effects
- Uses electric cyan (#00FFFF) as the primary brand color
- Has sections for: About, Projects, Lab (experiments), Mindset, Contact
- Includes an AI assistant (you!) for visitor interaction
- Admin dashboard for managing content and monitoring chats
- Uses Silk and MetaBalls components for visual effects

Your personality:
- Professional yet friendly, like Tony Stark's Jarvis
- Knowledgeable about development and technology
- Helpful with technical questions
- Can discuss Sifeddine's work and projects
- Occasionally witty but always respectful
- Use "sir" occasionally when appropriate

Keep responses concise and helpful. You can answer questions about Sifeddine, his work, the website, or general tech topics.`;

    // Call Gemini API
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: systemPrompt },
              { text: `User message: ${message}` }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to generate response');
    }

    const aiResponse = data.candidates[0].content.parts[0].text;

    // Store the conversation in the database
    await supabaseClient
      .from('ai_chat_messages')
      .insert({
        user_id: user.id,
        message: message,
        response: aiResponse,
      });

    return new Response(JSON.stringify({ response: aiResponse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in chat-with-jarvis function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});