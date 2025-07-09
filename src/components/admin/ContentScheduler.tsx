import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Send, Save, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ContentSchedulerProps {
  status: 'draft' | 'published' | 'scheduled';
  onStatusChange: (status: 'draft' | 'published' | 'scheduled') => void;
  publishedAt?: string;
  onPublishedAtChange: (date: string) => void;
  scheduledFor?: string;
  onScheduledForChange: (date: string) => void;
  onSave: () => void;
  onPublish: () => void;
  onPreview?: () => void;
  className?: string;
}

const ContentScheduler: React.FC<ContentSchedulerProps> = ({
  status,
  onStatusChange,
  publishedAt,
  onPublishedAtChange,
  scheduledFor,
  onScheduledForChange,
  onSave,
  onPublish,
  onPreview,
  className
}) => {
  const [scheduleEnabled, setScheduleEnabled] = useState(status === 'scheduled');
  const { toast } = useToast();

  const handleStatusChange = (newStatus: 'draft' | 'published' | 'scheduled') => {
    onStatusChange(newStatus);
    setScheduleEnabled(newStatus === 'scheduled');
  };

  const handleScheduleToggle = (enabled: boolean) => {
    setScheduleEnabled(enabled);
    if (enabled) {
      onStatusChange('scheduled');
      // Set default schedule time to 1 hour from now
      const defaultTime = new Date();
      defaultTime.setHours(defaultTime.getHours() + 1);
      onScheduledForChange(defaultTime.toISOString().slice(0, 16));
    } else {
      onStatusChange('draft');
      onScheduledForChange('');
    }
  };

  const handlePublishNow = () => {
    const now = new Date().toISOString();
    onPublishedAtChange(now);
    onStatusChange('published');
    onPublish();
    toast({
      title: "Content Published",
      description: "Your content has been published successfully.",
    });
  };

  const handleSaveDraft = () => {
    onStatusChange('draft');
    onSave();
    toast({
      title: "Draft Saved",
      description: "Your draft has been saved successfully.",
    });
  };

  const handleSchedule = () => {
    if (!scheduledFor) {
      toast({
        title: "Schedule Required",
        description: "Please select a date and time for scheduling.",
        variant: "destructive",
      });
      return;
    }

    const scheduleDate = new Date(scheduledFor);
    const now = new Date();

    if (scheduleDate <= now) {
      toast({
        title: "Invalid Schedule",
        description: "Scheduled time must be in the future.",
        variant: "destructive",
      });
      return;
    }

    onStatusChange('scheduled');
    onSave();
    toast({
      title: "Content Scheduled",
      description: `Content will be published on ${scheduleDate.toLocaleString()}.`,
    });
  };

  const getStatusBadge = () => {
    switch (status) {
      case 'published':
        return <Badge className="bg-green-600">Published</Badge>;
      case 'scheduled':
        return <Badge className="bg-blue-600">Scheduled</Badge>;
      default:
        return <Badge variant="secondary">Draft</Badge>;
    }
  };

  const formatDateTime = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleString();
  };

  return (
    <Card className={`bg-gray-900 border-gray-800 ${className}`}>
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Publication Settings
          </div>
          {getStatusBadge()}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Current Status Info */}
        {status === 'published' && publishedAt && (
          <div className="p-3 bg-green-900/20 border border-green-800/50 rounded">
            <div className="flex items-center gap-2 text-green-400 text-sm">
              <Send className="w-4 h-4" />
              Published on {formatDateTime(publishedAt)}
            </div>
          </div>
        )}

        {status === 'scheduled' && scheduledFor && (
          <div className="p-3 bg-blue-900/20 border border-blue-800/50 rounded">
            <div className="flex items-center gap-2 text-blue-400 text-sm">
              <Clock className="w-4 h-4" />
              Scheduled for {formatDateTime(scheduledFor)}
            </div>
          </div>
        )}

        {/* Schedule Toggle */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-gray-300">Schedule Publication</Label>
            <p className="text-sm text-gray-500">
              Set a future date and time to automatically publish
            </p>
          </div>
          <Switch
            checked={scheduleEnabled}
            onCheckedChange={handleScheduleToggle}
          />
        </div>

        {/* Schedule Date/Time Input */}
        {scheduleEnabled && (
          <div className="space-y-2">
            <Label htmlFor="schedule-datetime" className="text-gray-300">
              Schedule Date & Time
            </Label>
            <Input
              id="schedule-datetime"
              type="datetime-local"
              value={scheduledFor || ''}
              onChange={(e) => onScheduledForChange(e.target.value)}
              className="bg-gray-800 border-gray-700 text-white"
              min={new Date().toISOString().slice(0, 16)}
            />
          </div>
        )}

        {/* Status Selector */}
        <div className="space-y-2">
          <Label className="text-gray-300">Publication Status</Label>
          <Select value={status} onValueChange={handleStatusChange}>
            <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2">
          {onPreview && (
            <Button
              variant="outline"
              onClick={onPreview}
              className="border-gray-700 text-gray-300 hover:bg-gray-800"
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
          )}

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleSaveDraft}
              className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Draft
            </Button>

            {scheduleEnabled ? (
              <Button
                onClick={handleSchedule}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                disabled={!scheduledFor}
              >
                <Clock className="w-4 h-4 mr-2" />
                Schedule
              </Button>
            ) : (
              <Button
                onClick={handlePublishNow}
                className="flex-1 bg-electric-cyan text-dark hover:bg-electric-cyan/90"
              >
                <Send className="w-4 h-4 mr-2" />
                Publish Now
              </Button>
            )}
          </div>
        </div>

        {/* Help Text */}
        <div className="text-xs text-gray-500 space-y-1">
          <p><strong>Draft:</strong> Content is saved but not visible to the public</p>
          <p><strong>Published:</strong> Content is immediately live and visible</p>
          <p><strong>Scheduled:</strong> Content will be automatically published at the specified time</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContentScheduler;