
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Eye, Search, MessageSquare } from 'lucide-react';

interface AiChatMessage {
  id: string;
  user_id: string | null;
  message: string;
  response: string;
  timestamp: string;
}

export const AiChatsManager = () => {
  const [selectedChat, setSelectedChat] = useState<AiChatMessage | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const { data: chats, isLoading } = useQuery({
    queryKey: ['ai-chats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ai_chat_messages')
        .select('*')
        .order('timestamp', { ascending: false });

      if (error) throw error;
      return data as AiChatMessage[];
    },
  });

  const filteredChats = chats?.filter(chat =>
    chat.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chat.response.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleView = (chat: AiChatMessage) => {
    setSelectedChat(chat);
    setIsDialogOpen(true);
  };

  const truncateText = (text: string, maxLength: number = 100) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading AI chats...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">AI Chat History ({filteredChats?.length || 0})</h3>
        <div className="flex items-center space-x-2">
          <Search className="w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search chats..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64 bg-gray-700 border-gray-600"
          />
        </div>
      </div>

      <div className="rounded-md border border-gray-700">
        <Table>
          <TableHeader>
            <TableRow className="border-gray-700">
              <TableHead>User Message</TableHead>
              <TableHead>Jarvis Response</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredChats?.map((chat) => (
              <TableRow key={chat.id} className="border-gray-700">
                <TableCell className="max-w-xs">
                  <div className="flex items-start gap-2">
                    <MessageSquare className="w-4 h-4 text-blue-400 mt-1 flex-shrink-0" />
                    <span className="truncate">{truncateText(chat.message)}</span>
                  </div>
                </TableCell>
                <TableCell className="max-w-xs">
                  <div className="flex items-start gap-2">
                    <MessageSquare className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                    <span className="truncate">{truncateText(chat.response)}</span>
                  </div>
                </TableCell>
                <TableCell>{new Date(chat.timestamp).toLocaleString()}</TableCell>
                <TableCell>
                  <Button size="sm" variant="outline" onClick={() => handleView(chat)}>
                    <Eye className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-gray-800 border-gray-700">
          <DialogHeader>
            <DialogTitle>AI Chat Conversation</DialogTitle>
          </DialogHeader>
          {selectedChat && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">User ID:</label>
                  <Badge variant="outline">{selectedChat.user_id || 'Anonymous'}</Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">Timestamp:</label>
                  <p className="text-white">{new Date(selectedChat.timestamp).toLocaleString()}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-blue-400 mb-2 block flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    User Message:
                  </label>
                  <div className="p-4 bg-blue-950/30 border border-blue-800/50 rounded-lg">
                    <p className="text-white whitespace-pre-wrap">{selectedChat.message}</p>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-green-400 mb-2 block flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Jarvis Response:
                  </label>
                  <div className="p-4 bg-green-950/30 border border-green-800/50 rounded-lg">
                    <p className="text-white whitespace-pre-wrap">{selectedChat.response}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
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
