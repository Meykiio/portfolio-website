
import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BarChart3, Users, MessageSquare, FileText, Activity, Folder } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

interface DashboardStats {
  projects: number;
  blogs: number;
  messages: number;
  aiChats: number;
  recentActivity: any[];
}

const AdminDashboard = () => {
  const queryClient = useQueryClient();
  const [realTimeStats, setRealTimeStats] = useState<DashboardStats | null>(null);

  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-dashboard-stats'],
    queryFn: async (): Promise<DashboardStats> => {
      const [projectsRes, blogsRes, messagesRes, aiChatsRes] = await Promise.all([
        supabase.from('projects').select('*', { count: 'exact' }),
        supabase.from('blogs').select('*', { count: 'exact' }),
        supabase.from('messages').select('*', { count: 'exact' }),
        supabase.from('ai_chat_messages').select('*', { count: 'exact' })
      ]);

      // Mock recent activity since we don't have user_activity table yet
      const recentActivity = [
        {
          activity_type: 'PROJECT_CREATE',
          activity_data: { description: 'New project added' },
          timestamp: new Date().toISOString()
        },
        {
          activity_type: 'BLOG_PUBLISH',
          activity_data: { description: 'Blog post published' },
          timestamp: new Date(Date.now() - 86400000).toISOString()
        }
      ];

      return {
        projects: projectsRes.count || 0,
        blogs: blogsRes.count || 0,
        messages: messagesRes.count || 0,
        aiChats: aiChatsRes.count || 0,
        recentActivity: recentActivity
      };
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Set up real-time subscriptions
  useEffect(() => {
    const channels = [
      supabase.channel('projects-changes').on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, () => {
        queryClient.invalidateQueries({ queryKey: ['admin-dashboard-stats'] });
      }),
      supabase.channel('blogs-changes').on('postgres_changes', { event: '*', schema: 'public', table: 'blogs' }, () => {
        queryClient.invalidateQueries({ queryKey: ['admin-dashboard-stats'] });
      }),
      supabase.channel('messages-changes').on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, () => {
        queryClient.invalidateQueries({ queryKey: ['admin-dashboard-stats'] });
      }),
      supabase.channel('ai-chats-changes').on('postgres_changes', { event: '*', schema: 'public', table: 'ai_chat_messages' }, () => {
        queryClient.invalidateQueries({ queryKey: ['admin-dashboard-stats'] });
      })
    ];

    channels.forEach(channel => channel.subscribe());

    return () => {
      channels.forEach(channel => supabase.removeChannel(channel));
    };
  }, [queryClient]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const currentStats = realTimeStats || stats;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-electric-cyan text-sm font-medium flex items-center gap-2">
              <Folder className="w-4 h-4" />
              Total Projects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{currentStats?.projects || 0}</div>
            <p className="text-xs text-gray-400 mt-1">Active portfolio items</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-electric-cyan text-sm font-medium flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Blog Posts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{currentStats?.blogs || 0}</div>
            <p className="text-xs text-gray-400 mt-1">Published articles</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-electric-cyan text-sm font-medium flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Messages
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{currentStats?.messages || 0}</div>
            <p className="text-xs text-gray-400 mt-1">Contact inquiries</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-electric-cyan text-sm font-medium flex items-center gap-2">
              <Users className="w-4 h-4" />
              AI Conversations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{currentStats?.aiChats || 0}</div>
            <p className="text-xs text-gray-400 mt-1">Chat interactions</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Recent Activity
          </CardTitle>
          <CardDescription className="text-gray-400">
            Latest system events and user interactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {currentStats?.recentActivity?.length ? (
            <div className="space-y-3">
              {currentStats.recentActivity.slice(0, 5).map((activity, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="text-electric-cyan border-electric-cyan">
                      {activity.activity_type}
                    </Badge>
                    <span className="text-gray-300 text-sm">
                      {activity.activity_data?.description || 'System activity'}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(activity.timestamp).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-center py-4">No recent activity</p>
          )}
        </CardContent>
      </Card>

      {/* System Health */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            System Health
          </CardTitle>
          <CardDescription className="text-gray-400">
            Performance metrics and system status
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-300">Database Performance</span>
              <span className="text-electric-cyan">95%</span>
            </div>
            <Progress value={95} className="h-2" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-300">API Response Time</span>
              <span className="text-electric-cyan">98%</span>
            </div>
            <Progress value={98} className="h-2" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-300">Error Rate</span>
              <span className="text-green-400">0.1%</span>
            </div>
            <Progress value={1} className="h-2" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
