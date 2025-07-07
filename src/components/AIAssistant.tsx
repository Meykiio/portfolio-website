
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: "Hello! I'm Jarvis, Sifeddine's AI assistant. How can I help you today?",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentMessage = inputMessage;
    setInputMessage("");
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('chat-with-jarvis', {
        body: { message: currentMessage },
      });

      if (error) {
        throw error;
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: data.response,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error calling Jarvis:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to get response from Jarvis. Please try again.",
      });
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: "I apologize, but I'm experiencing technical difficulties. Please try again in a moment.",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating AI Button - More visible and responsive */}
      <Button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 w-14 h-14 md:w-16 md:h-16 rounded-full shadow-xl bg-primary hover:bg-primary/90 border-2 border-primary-foreground/20 hover:border-primary-foreground/40 transition-all duration-300 ${
          isOpen ? 'opacity-0 pointer-events-none scale-95' : 'opacity-100 scale-100 hover:scale-105'
        }`}
        size="icon"
      >
        <MessageCircle className="h-6 w-6 md:h-7 md:w-7 text-primary-foreground" />
        <span className="sr-only">Open AI Assistant</span>
      </Button>

      {/* Chat Interface - Better mobile support */}
      {isOpen && (
        <Card className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 w-[calc(100vw-2rem)] max-w-96 h-[70vh] max-h-[600px] md:h-[500px] glass-effect border-primary/20 shadow-2xl animate-in slide-in-from-bottom-2 slide-in-from-right-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 px-4 md:px-6">
            <CardTitle className="text-lg md:text-xl font-semibold flex items-center gap-2">
              <Bot className="h-5 w-5 md:h-6 md:w-6 text-primary" />
              Jarvis AI
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 text-muted-foreground hover:text-foreground shrink-0"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </CardHeader>
          
          <CardContent className="flex flex-col h-[calc(70vh-5rem)] max-h-[520px] md:h-[420px] p-3 md:p-4">
            {/* Messages Area */}
            <ScrollArea className="flex-1 pr-2 mb-4">
              <div className="space-y-3 md:space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex items-start gap-2 md:gap-3 ${
                      message.type === 'user' ? 'flex-row-reverse' : ''
                    }`}
                  >
                    <div className={`w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center shrink-0 ${
                      message.type === 'user' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {message.type === 'user' ? <User className="h-3 w-3 md:h-4 md:w-4" /> : <Bot className="h-3 w-3 md:h-4 md:w-4" />}
                    </div>
                    <div className={`max-w-[80%] rounded-lg px-3 py-2 text-sm md:text-base leading-relaxed ${
                      message.type === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-foreground'
                    }`}>
                      {message.content}
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex items-start gap-2 md:gap-3">
                    <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-muted flex items-center justify-center">
                      <Bot className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
                    </div>
                    <div className="bg-muted rounded-lg px-3 py-2 text-sm md:text-base">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="flex gap-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask Jarvis anything..."
                disabled={isLoading}
                className="flex-1 text-sm md:text-base h-10 md:h-11"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                size="icon"
                className="shrink-0 h-10 w-10 md:h-11 md:w-11"
              >
                <Send className="h-4 w-4" />
                <span className="sr-only">Send message</span>
              </Button>
            </div>
            
            {/* Status indicator for logged-in users */}
            {user && (
              <p className="text-xs text-muted-foreground mt-2 text-center">
                Chat history is saved for logged-in users
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default AIAssistant;
