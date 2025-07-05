import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  MessageSquare, 
  FolderOpen, 
  PenTool,
  Users,
  Settings,
  Eye,
  Plus
} from "lucide-react";

const Admin = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  // Mock data - replace with real data from Supabase
  const mockStats = {
    totalProjects: 12,
    totalBlogs: 8,
    totalMessages: 45,
    activeChats: 3
  };

  const mockMessages = [
    { id: 1, user: "Anonymous", message: "Great portfolio!", timestamp: "2 hours ago", status: "unread" },
    { id: 2, user: "John Doe", message: "Interested in collaboration", timestamp: "5 hours ago", status: "read" },
    { id: 3, user: "Sarah Smith", message: "Love your AI projects", timestamp: "1 day ago", status: "replied" }
  ];

  const mockChatSessions = [
    { id: 1, user: "Visitor #123", messages: 15, duration: "12m", status: "active" },
    { id: 2, user: "Visitor #124", messages: 8, duration: "5m", status: "ended" },
    { id: 3, user: "Visitor #125", messages: 23, duration: "18m", status: "active" }
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-space text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your content and monitor interactions</p>
        </div>

        {/* Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="projects" className="flex items-center gap-2">
              <FolderOpen className="h-4 w-4" />
              Projects
            </TabsTrigger>
            <TabsTrigger value="blogs" className="flex items-center gap-2">
              <PenTool className="h-4 w-4" />
              Blogs
            </TabsTrigger>
            <TabsTrigger value="messages" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Messages
            </TabsTrigger>
            <TabsTrigger value="chats" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              AI Chats
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="p-6 glass-effect">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Projects</p>
                    <p className="text-3xl font-bold">{mockStats.totalProjects}</p>
                  </div>
                  <FolderOpen className="h-8 w-8 text-primary" />
                </div>
              </Card>
              
              <Card className="p-6 glass-effect">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Blog Posts</p>
                    <p className="text-3xl font-bold">{mockStats.totalBlogs}</p>
                  </div>
                  <PenTool className="h-8 w-8 text-primary" />
                </div>
              </Card>
              
              <Card className="p-6 glass-effect">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Messages</p>
                    <p className="text-3xl font-bold">{mockStats.totalMessages}</p>
                  </div>
                  <MessageSquare className="h-8 w-8 text-primary" />
                </div>
              </Card>
              
              <Card className="p-6 glass-effect">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active Chats</p>
                    <p className="text-3xl font-bold">{mockStats.activeChats}</p>
                  </div>
                  <Users className="h-8 w-8 text-primary" />
                </div>
              </Card>
            </div>

            <Card className="p-6 glass-effect">
              <h3 className="font-semibold mb-4">Recent Activity</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <span className="text-sm">New message from John Doe</span>
                  <span className="text-xs text-muted-foreground">2 hours ago</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <span className="text-sm">AI chat session ended - 23 messages</span>
                  <span className="text-xs text-muted-foreground">4 hours ago</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <span className="text-sm">New project "AI Toolkit" published</span>
                  <span className="text-xs text-muted-foreground">1 day ago</span>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="font-semibold text-xl">Manage Projects</h2>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Project
              </Button>
            </div>
            
            <Card className="p-6 glass-effect">
              <p className="text-center text-muted-foreground py-8">
                Connect to Supabase to manage projects with full CRUD functionality.
                <br />
                <Button variant="link" className="mt-2">
                  Set up Supabase Integration
                </Button>
              </p>
            </Card>
          </TabsContent>

          {/* Blogs Tab */}
          <TabsContent value="blogs" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="font-semibold text-xl">Manage Blog Posts</h2>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                New Post
              </Button>
            </div>
            
            <Card className="p-6 glass-effect">
              <p className="text-center text-muted-foreground py-8">
                Connect to Supabase to create and manage blog posts.
                <br />
                <Button variant="link" className="mt-2">
                  Set up Supabase Integration
                </Button>
              </p>
            </Card>
          </TabsContent>

          {/* Messages Tab */}
          <TabsContent value="messages" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="font-semibold text-xl">Contact Messages</h2>
              <Button variant="outline" size="sm">
                Mark all as read
              </Button>
            </div>
            
            <div className="space-y-4">
              {mockMessages.map((message) => (
                <Card key={message.id} className="p-4 glass-effect">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold">{message.user}</span>
                        <Badge variant={
                          message.status === 'unread' ? 'destructive' : 
                          message.status === 'read' ? 'secondary' : 'default'
                        }>
                          {message.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{message.message}</p>
                      <span className="text-xs text-muted-foreground">{message.timestamp}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        Reply
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* AI Chats Tab */}
          <TabsContent value="chats" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="font-semibold text-xl">AI Chat Sessions</h2>
              <Button variant="outline" size="sm">
                Export Chat Data
              </Button>
            </div>
            
            <div className="space-y-4">
              {mockChatSessions.map((session) => (
                <Card key={session.id} className="p-4 glass-effect">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div>
                        <span className="font-semibold">{session.user}</span>
                        <div className="text-sm text-muted-foreground">
                          {session.messages} messages • {session.duration}
                        </div>
                      </div>
                      <Badge variant={session.status === 'active' ? 'default' : 'secondary'}>
                        {session.status}
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                        View Chat
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;