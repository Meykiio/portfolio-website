import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle, Send, X, Bot, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ChatMessage {
  id: string;
  message: string;
  response: string;
  timestamp: string;
  isUser?: boolean;
}

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  // Anonymous session management
  const getAnonymousSessionId = () => {
    let sessionId = localStorage.getItem('ai_chat_session_id');
    if (!sessionId) {
      sessionId = `anon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('ai_chat_session_id', sessionId);
    }
    return sessionId;
  };

  const saveMessageToLocalStorage = (message: ChatMessage) => {
    const sessionId = getAnonymousSessionId();
    const existingMessages = JSON.parse(localStorage.getItem(`ai_chat_${sessionId}`) || '[]');
    existingMessages.push(message);
    localStorage.setItem(`ai_chat_${sessionId}`, JSON.stringify(existingMessages));
  };

  const loadMessagesFromLocalStorage = () => {
    const sessionId = getAnonymousSessionId();
    const storedMessages = JSON.parse(localStorage.getItem(`ai_chat_${sessionId}`) || '[]');
    return storedMessages;
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, 100);
  };

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages]);

  // Load chat history
  useEffect(() => {
    const loadChatHistory = async () => {
      setLoadingHistory(true);
      try {
        if (user) {
          // Load from database for authenticated users
          const { data, error } = await supabase
            .from('ai_chat_messages')
            .select('*')
            .eq('user_id', user.id)
            .order('timestamp', { ascending: true });

          if (error) {
            console.error('Error loading chat history:', error);
            // Fallback to localStorage if database fails
            const localMessages = loadMessagesFromLocalStorage();
            setMessages(localMessages);
          } else if (data) {
            const formattedMessages = data.map(msg => ({
              id: msg.id,
              message: msg.message,
              response: msg.response,
              timestamp: msg.timestamp,
            }));
            setMessages(formattedMessages);
          }
        } else {
          // Load from localStorage for anonymous users
          const localMessages = loadMessagesFromLocalStorage();
          setMessages(localMessages);
        }
      } catch (error) {
        console.error('Error loading chat history:', error);
        // Fallback to localStorage
        const localMessages = loadMessagesFromLocalStorage();
        setMessages(localMessages);
      } finally {
        setLoadingHistory(false);
      }
    };

    if (isOpen) {
      loadChatHistory();
    }
  }, [isOpen, user, toast]);

  const sendMessage = async () => {
    if (!newMessage.trim() || loading) return;

    const userMessage = newMessage.trim();
    setNewMessage('');
    setLoading(true);

    // Add user message to chat immediately
    const tempUserMsg = {
      id: `temp_${Date.now()}`,
      message: userMessage,
      response: '',
      timestamp: new Date().toISOString(),
      isUser: true,
    };
    setMessages(prev => [...prev, tempUserMsg]);

    try {
      // Simulate API delay for realistic experience
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const aiResponse = `Hello! I'm Sifeddine's AI assistant. I'd be happy to help you learn more about his work and projects.

Sifeddine is a full-stack developer based in Algiers who specializes in building systems that "run without him." He's passionate about automation, AI, and creating tools that feel more like play than work.

His current projects include:
- **Yuno**: A CAPTCHA system that's actually fun for humans
- **Receipto**: Turning receipts into live inventory dashboards
- **Wishdrop**: A wish wall where anonymous givers can help make dreams real

What would you like to know about his projects or approach to development?`;

      const completeMessage = {
        id: `msg_${Date.now()}`,
        message: userMessage,
        response: aiResponse,
        timestamp: new Date().toISOString(),
      };

      // Remove temp message and add complete message
      setMessages(prev => {
        const filtered = prev.filter(msg => msg.id !== tempUserMsg.id);
        return [...filtered, completeMessage];
      });

      // Save to appropriate storage
      if (user) {
        // Try to save to database for authenticated users
        try {
          await supabase.from('ai_chat_messages').insert({
            user_id: user.id,
            message: userMessage,
            response: aiResponse,
          });
        } catch (dbError) {
          console.error('Database save failed, using localStorage:', dbError);
          saveMessageToLocalStorage(completeMessage);
        }
      } else {
        // Save to localStorage for anonymous users
        saveMessageToLocalStorage(completeMessage);
      }

    } catch (error) {
      console.error('Error sending message:', error);
      
      // Remove temp message and show error
      setMessages(prev => prev.filter(msg => msg.id !== tempUserMsg.id));
      
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const renderMessages = () => {
    const chatMessages: Array<{id: string, text: string, isUser: boolean, timestamp: string}> = [];
    
    messages.forEach(msg => {
      if (msg.isUser) {
        chatMessages.push({
          id: `${msg.id}_user`,
          text: msg.message,
          isUser: true,
          timestamp: msg.timestamp
        });
      } else {
        // Add user message
        chatMessages.push({
          id: `${msg.id}_user`,
          text: msg.message,
          isUser: true,
          timestamp: msg.timestamp
        });
        // Add AI response
        chatMessages.push({
          id: `${msg.id}_ai`,
          text: msg.response,
          isUser: false,
          timestamp: msg.timestamp
        });
      }
    });

    return chatMessages.map((msg) => (
      <div key={msg.id} className={`flex gap-3 ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
        {!msg.isUser && (
          <div className="w-8 h-8 rounded-full bg-electric-cyan/20 flex items-center justify-center flex-shrink-0">
            <Bot className="w-4 h-4 text-electric-cyan" />
          </div>
        )}
        <div
          className={`max-w-[80%] p-3 rounded-lg ${
            msg.isUser
              ? 'bg-electric-cyan text-dark ml-auto'
              : 'bg-gray-800 text-white'
          }`}
        >
          <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
        </div>
        {msg.isUser && (
          <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0">
            <User className="w-4 h-4 text-gray-300" />
          </div>
        )}
      </div>
    ));
  };

  return (
    <>
      {/* Floating Action Button - Enhanced visibility and positioning */}
      <Button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-16 h-16 rounded-full bg-electric-cyan hover:bg-electric-cyan/90 text-dark shadow-lg hover:shadow-xl transition-all duration-300 ${
          isOpen ? 'hidden' : 'flex'
        } items-center justify-center`}
        style={{ zIndex: 9999 }}
        aria-label="Open AI Assistant"
      >
        <MessageCircle className="w-7 h-7" />
      </Button>

      {/* Chat Window */}
      {isOpen && (
        <>
          {/* Mobile: Full screen overlay */}
          <div className="fixed inset-0 md:hidden bg-dark" style={{ zIndex: 9998 }}>
            <div className="h-full flex flex-col">
              {/* Mobile Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-gray-900 flex-shrink-0">
                <div className="flex items-center gap-2">
                  <Bot className="w-5 h-5 text-electric-cyan" />
                  <h2 className="text-electric-cyan font-space-grotesk font-semibold">AI Assistant</h2>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-white h-8 w-8 p-0"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
              
              {/* Mobile Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
                {loadingHistory && (
                  <div className="text-center text-gray-500 text-sm">
                    Loading chat history...
                  </div>
                )}
                
                {messages.length === 0 && !loadingHistory && (
                  <div className="text-center text-gray-500 text-sm py-8">
                    <Bot className="w-12 h-12 mx-auto mb-4 text-electric-cyan/50" />
                    <p>Hello! I'm your AI assistant.</p>
                    <p>Ask me anything about Sifeddine's work!</p>
                    <p className="mt-2 text-xs text-gray-600">
                      Your chat history is saved locally
                    </p>
                  </div>
                )}
                
                {renderMessages()}
                
                {loading && (
                  <div className="flex gap-3 justify-start">
                    <div className="w-8 h-8 rounded-full bg-electric-cyan/20 flex items-center justify-center">
                      <Bot className="w-4 h-4 text-electric-cyan" />
                    </div>
                    <div className="bg-gray-800 text-white p-3 rounded-lg">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
              
              {/* Mobile Input Area */}
              <div className="border-t border-gray-800 p-4 bg-gray-900 flex-shrink-0">
                <div className="flex gap-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    className="flex-1 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-electric-cyan"
                    disabled={loading}
                  />
                  <Button
                    onClick={sendMessage}
                    disabled={loading || !newMessage.trim()}
                    className="bg-electric-cyan hover:bg-electric-cyan/90 text-dark px-4"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop: Floating Card */}
          <div className="hidden md:block fixed bottom-6 right-6" style={{ zIndex: 9998 }}>
            <Card className="w-96 h-[500px] glass-effect border-electric-cyan/30 shadow-xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 border-b border-gray-800">
                <CardTitle className="text-electric-cyan font-space-grotesk flex items-center gap-2">
                  <Bot className="w-5 h-5" />
                  AI Assistant
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-white h-8 w-8 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </CardHeader>
              
              <CardContent className="flex flex-col h-full p-0">
                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
                  {loadingHistory && (
                    <div className="text-center text-gray-500 text-sm">
                      Loading chat history...
                    </div>
                  )}
                  
                  {messages.length === 0 && !loadingHistory && (
                    <div className="text-center text-gray-500 text-sm py-8">
                      <Bot className="w-12 h-12 mx-auto mb-4 text-electric-cyan/50" />
                      <p>Hello! I'm your AI assistant.</p>
                      <p>Ask me anything about Sifeddine's work!</p>
                      <p className="mt-2 text-xs text-gray-600">
                        Your chat history is saved locally
                      </p>
                    </div>
                  )}
                  
                  {renderMessages()}
                  
                  {loading && (
                    <div className="flex gap-3 justify-start">
                      <div className="w-8 h-8 rounded-full bg-electric-cyan/20 flex items-center justify-center">
                        <Bot className="w-4 h-4 text-electric-cyan" />
                      </div>
                      <div className="bg-gray-800 text-white p-3 rounded-lg">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>
                
                {/* Input Area */}
                <div className="border-t border-gray-800 p-4">
                  <div className="flex gap-2">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type your message..."
                      className="flex-1 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-electric-cyan"
                      disabled={loading}
                    />
                    <Button
                      onClick={sendMessage}
                      disabled={loading || !newMessage.trim()}
                      className="bg-electric-cyan hover:bg-electric-cyan/90 text-dark px-3"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </>
  );
};

export default AIAssistant;