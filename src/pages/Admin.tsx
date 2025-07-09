
import React, { useState } from 'react';
import { Suspense } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LogOut, Users, MessageSquare, FileText, BarChart3, Settings, Folder, Activity, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import AdminLoadingState from '@/components/admin/AdminLoadingState';
import PerformanceMonitor from '@/components/PerformanceMonitor';
import SecurityAudit from '@/components/SecurityAudit';

// Lazy load admin components for better performance
import { 
  AdminDashboard,
  AdminSettings,
  ProjectsManager,
  BlogsManager,
  MessagesManager,
  AiChatsManager
} from '@/components/LazyComponents';

const Admin = () => {
  const { user, signOut, loading, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [signOutLoading, setSignOutLoading] = useState(false);

  const handleSignOut = async () => {
    setSignOutLoading(true);
    try {
      await signOut();
      toast({
        title: "Signed out",
        description: "You have been signed out successfully.",
      });
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSignOutLoading(false);
    }
  };

  // Show loading state while checking authentication
  if (loading) {
    return <AdminLoadingState />;
  }

  // This should be handled by ProtectedRoute, but adding as backup
  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-gray-400 mb-6">You don't have permission to access this page.</p>
          <Button onClick={() => navigate('/')} className="bg-electric-cyan text-dark hover:bg-electric-cyan/90">
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900/50">
        <div className="flex items-center justify-between p-6">
          <div>
            <h1 className="text-2xl font-bold text-white font-space-grotesk">
              Admin Dashboard
            </h1>
            <p className="text-gray-400 mt-1">
              Welcome back, {user.email}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => navigate('/')}
              className="border-gray-700 text-gray-300 hover:bg-gray-800"
            >
              View Site
            </Button>
            <Button
              variant="outline"
              onClick={handleSignOut}
              disabled={signOutLoading}
              className="border-gray-700 text-gray-300 hover:bg-gray-800"
            >
              <LogOut className="w-4 h-4 mr-2" />
              {signOutLoading ? 'Signing out...' : 'Sign Out'}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-gray-900 border-gray-800 p-1">
            <TabsTrigger value="overview" className="data-[state=active]:bg-electric-cyan data-[state=active]:text-dark">
              <BarChart3 className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="projects" className="data-[state=active]:bg-electric-cyan data-[state=active]:text-dark">
              <Folder className="w-4 h-4 mr-2" />
              Projects
            </TabsTrigger>
            <TabsTrigger value="blogs" className="data-[state=active]:bg-electric-cyan data-[state=active]:text-dark">
              <FileText className="w-4 h-4 mr-2" />
              Blogs
            </TabsTrigger>
            <TabsTrigger value="messages" className="data-[state=active]:bg-electric-cyan data-[state=active]:text-dark">
              <MessageSquare className="w-4 h-4 mr-2" />
              Messages
            </TabsTrigger>
            <TabsTrigger value="ai-chats" className="data-[state=active]:bg-electric-cyan data-[state=active]:text-dark">
              <Users className="w-4 h-4 mr-2" />
              AI Chats
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-electric-cyan data-[state=active]:text-dark">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </TabsTrigger>
            <TabsTrigger value="performance" className="data-[state=active]:bg-electric-cyan data-[state=active]:text-dark">
              <Activity className="w-4 h-4 mr-2" />
              Performance
            </TabsTrigger>
            <TabsTrigger value="security" className="data-[state=active]:bg-electric-cyan data-[state=active]:text-dark">
              <Shield className="w-4 h-4 mr-2" />
              Security
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Suspense fallback={<AdminLoadingState />}>
              <AdminDashboard />
            </Suspense>
          </TabsContent>

          <TabsContent value="projects">
            <Suspense fallback={<AdminLoadingState />}>
              <ProjectsManager />
            </Suspense>
          </TabsContent>

          <TabsContent value="blogs">
            <Suspense fallback={<AdminLoadingState />}>
              <BlogsManager />
            </Suspense>
          </TabsContent>

          <TabsContent value="messages">
            <Suspense fallback={<AdminLoadingState />}>
              <MessagesManager />
            </Suspense>
          </TabsContent>

          <TabsContent value="ai-chats">
            <Suspense fallback={<AdminLoadingState />}>
              <AiChatsManager />
            </Suspense>
          </TabsContent>

          <TabsContent value="settings">
            <Suspense fallback={<AdminLoadingState />}>
              <AdminSettings />
            </Suspense>
          </TabsContent>

          <TabsContent value="performance">
            <PerformanceMonitor />
          </TabsContent>

          <TabsContent value="security">
            <SecurityAudit />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
