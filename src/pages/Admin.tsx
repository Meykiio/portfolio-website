
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ProjectsManager } from '@/components/admin/ProjectsManager';
import { BlogsManager } from '@/components/admin/BlogsManager';
import { MessagesManager } from '@/components/admin/MessagesManager';
import { AiChatsManager } from '@/components/admin/AiChatsManager';
import { LogOut, Database, MessageSquare, FileText, Code, Bot } from 'lucide-react';

const Admin = () => {
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <p className="text-gray-400 mt-2">Manage your website content and data</p>
          </div>
          <Button onClick={handleSignOut} variant="outline" className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white">
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>

        <Tabs defaultValue="projects" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-gray-800 border border-gray-700">
            <TabsTrigger value="projects" className="flex items-center gap-2">
              <Code className="w-4 h-4" />
              Projects
            </TabsTrigger>
            <TabsTrigger value="blogs" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Blogs
            </TabsTrigger>
            <TabsTrigger value="messages" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Messages
            </TabsTrigger>
            <TabsTrigger value="ai-chats" className="flex items-center gap-2">
              <Bot className="w-4 h-4" />
              AI Chats
            </TabsTrigger>
          </TabsList>

          <TabsContent value="projects">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="w-5 h-5" />
                  Projects Management
                </CardTitle>
                <CardDescription>Create, edit, and manage your portfolio projects</CardDescription>
              </CardHeader>
              <CardContent>
                <ProjectsManager />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="blogs">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Blog Management
                </CardTitle>
                <CardDescription>Create, edit, and publish blog posts</CardDescription>
              </CardHeader>
              <CardContent>
                <BlogsManager />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="messages">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Contact Messages
                </CardTitle>
                <CardDescription>View and manage contact form messages</CardDescription>
              </CardHeader>
              <CardContent>
                <MessagesManager />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ai-chats">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="w-5 h-5" />
                  AI Chat History
                </CardTitle>
                <CardDescription>View Jarvis AI chat conversations</CardDescription>
              </CardHeader>
              <CardContent>
                <AiChatsManager />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
