
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Settings, Save, Database, Mail, Shield } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

interface SystemSettings {
  id: string;
  maintenance_mode: boolean;
  contact_email: string;
  auto_backup: boolean;
  audit_retention_days: number;
  max_file_size_mb: number;
  allowed_file_types: string[];
  email_notifications: boolean;
  system_message: string;
}

const AdminSettings = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);

  const { data: settings, isLoading } = useQuery({
    queryKey: ['admin-settings'],
    queryFn: async (): Promise<SystemSettings> => {
      // Since we don't have a settings table yet, return default values
      // In a real implementation, this would fetch from a settings table
      return {
        id: '1',
        maintenance_mode: false,
        contact_email: 'admin@sifeddine.xyz',
        auto_backup: true,
        audit_retention_days: 90,
        max_file_size_mb: 10,
        allowed_file_types: ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx'],
        email_notifications: true,
        system_message: 'Welcome to Sifeddine.xyz admin portal'
      };
    },
  });

  const updateSettingsMutation = useMutation({
    mutationFn: async (updatedSettings: Partial<SystemSettings>) => {
      // In a real implementation, this would update the settings table
      console.log('Updating settings:', updatedSettings);
      
      // Log the activity
      await supabase.from('user_activity').insert({
        activity_type: 'SETTINGS_UPDATE',
        activity_data: {
          description: 'Admin updated system settings',
          changes: updatedSettings
        }
      });

      return updatedSettings;
    },
    onSuccess: () => {
      toast({
        title: "Settings Updated",
        description: "System settings have been updated successfully.",
      });
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ['admin-settings'] });
    },
    onError: (error) => {
      console.error('Settings update error:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update system settings. Please try again.",
        variant: "destructive",
      });
    },
  });

  const cleanupAuditLogsMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.rpc('cleanup_audit_logs');
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Cleanup Complete",
        description: "Old audit logs have been cleaned up successfully.",
      });
    },
    onError: (error) => {
      console.error('Cleanup error:', error);
      toast({
        title: "Cleanup Failed",
        description: "Failed to clean up audit logs. Please try again.",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!settings) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white font-space-grotesk flex items-center gap-2">
            <Settings className="w-6 h-6" />
            System Settings
          </h1>
          <p className="text-gray-400 mt-1">Configure system-wide settings and preferences</p>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button
                variant="outline"
                onClick={() => setIsEditing(false)}
                className="border-gray-700 text-gray-300 hover:bg-gray-800"
              >
                Cancel
              </Button>
              <Button
                onClick={() => updateSettingsMutation.mutate(settings)}
                disabled={updateSettingsMutation.isPending}
                className="bg-electric-cyan text-dark hover:bg-electric-cyan/90"
              >
                {updateSettingsMutation.isPending ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </>
          ) : (
            <Button
              onClick={() => setIsEditing(true)}
              className="bg-electric-cyan text-dark hover:bg-electric-cyan/90"
            >
              Edit Settings
            </Button>
          )}
        </div>
      </div>

      {/* General Settings */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">General Settings</CardTitle>
          <CardDescription className="text-gray-400">
            Basic system configuration and preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-gray-300">Maintenance Mode</Label>
              <p className="text-sm text-gray-400">
                Enable to show maintenance page to users
              </p>
            </div>
            <Switch
              checked={settings.maintenance_mode}
              onCheckedChange={(checked) => {
                if (isEditing) {
                  settings.maintenance_mode = checked;
                }
              }}
              disabled={!isEditing}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact_email" className="text-gray-300">Contact Email</Label>
            <Input
              id="contact_email"
              type="email"
              value={settings.contact_email}
              onChange={(e) => {
                if (isEditing) {
                  settings.contact_email = e.target.value;
                }
              }}
              disabled={!isEditing}
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="system_message" className="text-gray-300">System Message</Label>
            <Textarea
              id="system_message"
              value={settings.system_message}
              onChange={(e) => {
                if (isEditing) {
                  settings.system_message = e.target.value;
                }
              }}
              disabled={!isEditing}
              className="bg-gray-800 border-gray-700 text-white"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Security & Audit
          </CardTitle>
          <CardDescription className="text-gray-400">
            Security policies and audit configuration
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="audit_retention" className="text-gray-300">Audit Log Retention (Days)</Label>
            <Input
              id="audit_retention"
              type="number"
              value={settings.audit_retention_days}
              onChange={(e) => {
                if (isEditing) {
                  settings.audit_retention_days = parseInt(e.target.value);
                }
              }}
              disabled={!isEditing}
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="max_file_size" className="text-gray-300">Max File Size (MB)</Label>
            <Input
              id="max_file_size"
              type="number"
              value={settings.max_file_size_mb}
              onChange={(e) => {
                if (isEditing) {
                  settings.max_file_size_mb = parseInt(e.target.value);
                }
              }}
              disabled={!isEditing}
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>

          <div className="flex justify-end">
            <Button
              onClick={() => cleanupAuditLogsMutation.mutate()}
              disabled={cleanupAuditLogsMutation.isPending}
              variant="outline"
              className="border-gray-700 text-gray-300 hover:bg-gray-800"
            >
              {cleanupAuditLogsMutation.isPending ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Cleaning...
                </>
              ) : (
                <>
                  <Database className="w-4 h-4 mr-2" />
                  Cleanup Old Logs
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Notifications
          </CardTitle>
          <CardDescription className="text-gray-400">
            Configure email and system notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-gray-300">Email Notifications</Label>
              <p className="text-sm text-gray-400">
                Receive email alerts for system events
              </p>
            </div>
            <Switch
              checked={settings.email_notifications}
              onCheckedChange={(checked) => {
                if (isEditing) {
                  settings.email_notifications = checked;
                }
              }}
              disabled={!isEditing}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-gray-300">Auto Backup</Label>
              <p className="text-sm text-gray-400">
                Automatically backup system data
              </p>
            </div>
            <Switch
              checked={settings.auto_backup}
              onCheckedChange={(checked) => {
                if (isEditing) {
                  settings.auto_backup = checked;
                }
              }}
              disabled={!isEditing}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSettings;
