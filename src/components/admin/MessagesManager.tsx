
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye, Trash2, Mail, MailOpen } from 'lucide-react';
import { toast } from 'sonner';

interface Message {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  status: string | null;
  created_at: string;
}

export const MessagesManager = () => {
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: messages, isLoading } = useQuery({
    queryKey: ['messages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Message[];
    },
  });

  const updateMessageStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from('messages')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      toast.success('Message status updated');
    },
    onError: (error) => {
      toast.error('Failed to update message status');
      console.error('Update message status error:', error);
    },
  });

  const deleteMessageMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      toast.success('Message deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete message');
      console.error('Delete message error:', error);
    },
  });

  const handleView = (message: Message) => {
    setSelectedMessage(message);
    setIsDialogOpen(true);
    
    // Mark as read if it's unread
    if (message.status === 'unread') {
      updateMessageStatusMutation.mutate({ id: message.id, status: 'read' });
    }
  };

  const handleStatusChange = (id: string, status: string) => {
    updateMessageStatusMutation.mutate({ id, status });
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this message?')) {
      deleteMessageMutation.mutate(id);
    }
  };

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case 'read':
        return <Badge variant="secondary">Read</Badge>;
      case 'replied':
        return <Badge className="bg-green-600">Replied</Badge>;
      case 'unread':
      default:
        return <Badge className="bg-blue-600">Unread</Badge>;
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading messages...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Contact Messages ({messages?.length || 0})</h3>
        <div className="flex gap-2">
          <Badge variant="outline">
            Unread: {messages?.filter(m => m.status === 'unread').length || 0}
          </Badge>
          <Badge variant="outline">
            Read: {messages?.filter(m => m.status === 'read').length || 0}
          </Badge>
          <Badge variant="outline">
            Replied: {messages?.filter(m => m.status === 'replied').length || 0}
          </Badge>
        </div>
      </div>

      <div className="rounded-md border border-gray-700">
        <Table>
          <TableHeader>
            <TableRow className="border-gray-700">
              <TableHead>From</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {messages?.map((message) => (
              <TableRow 
                key={message.id} 
                className={`border-gray-700 ${message.status === 'unread' ? 'bg-blue-950/20' : ''}`}
              >
                <TableCell className="font-medium">
                  <div>
                    <div className="flex items-center gap-2">
                      {message.status === 'unread' ? (
                        <Mail className="w-4 h-4 text-blue-400" />
                      ) : (
                        <MailOpen className="w-4 h-4 text-gray-400" />
                      )}
                      {message.name}
                    </div>
                    <div className="text-sm text-gray-400">{message.email}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="max-w-xs truncate">
                    {message.subject || message.message.substring(0, 50) + '...'}
                  </div>
                </TableCell>
                <TableCell>
                  <Select
                    value={message.status || 'unread'}
                    onValueChange={(status) => handleStatusChange(message.id, status)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unread">Unread</SelectItem>
                      <SelectItem value="read">Read</SelectItem>
                      <SelectItem value="replied">Replied</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>{new Date(message.created_at).toLocaleDateString()}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" onClick={() => handleView(message)}>
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleDelete(message.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl bg-gray-800 border-gray-700">
          <DialogHeader>
            <DialogTitle>Message Details</DialogTitle>
          </DialogHeader>
          {selectedMessage && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-300">From:</label>
                  <p className="text-white">{selectedMessage.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-300">Email:</label>
                  <p className="text-white">{selectedMessage.email}</p>
                </div>
              </div>
              {selectedMessage.subject && (
                <div>
                  <label className="text-sm font-medium text-gray-300">Subject:</label>
                  <p className="text-white">{selectedMessage.subject}</p>
                </div>
              )}
              <div>
                <label className="text-sm font-medium text-gray-300">Message:</label>
                <div className="mt-2 p-4 bg-gray-700 rounded-lg">
                  <p className="text-white whitespace-pre-wrap">{selectedMessage.message}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-300">Status:</label>
                  <p>{getStatusBadge(selectedMessage.status)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-300">Received:</label>
                  <p className="text-white">{new Date(selectedMessage.created_at).toLocaleString()}</p>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => window.open(`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject || 'Your message'}`)}
                >
                  Reply via Email
                </Button>
                <Button onClick={() => setIsDialogOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
