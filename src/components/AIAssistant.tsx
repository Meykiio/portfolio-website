import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Minimize2, Maximize2 } from "lucide-react";
import TextScramble from "./TextScramble";

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hey! I'm Sifeddine's AI assistant. I can tell you about his projects, mindset, and work. What would you like to know?",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const simulateAIResponse = (userMessage: string): string => {
    const responses = {
      projects: "Sifeddine loves building tools that think and automate repetitive tasks. His projects focus on AI integration, automation systems, and creative tools that blend technology with intuition.",
      mindset: "His mindset is all about 'building things that run without me' - not from laziness, but because time is worth more than repetition. He believes in systemizing the boring and turning broken things into useful tools.",
      work: "He works alone a lot but is never really alone - AI assistants, side projects, and creative ideas are always helping out. Based in Algiers, he's focused on freedom - both financial and mental.",
      tech: "He works with modern web technologies, AI integration, and automation systems. Always exploring the intersection of psychology, design, and technology.",
      contact: "You can reach out through the contact section below, or just continue chatting here! I can help answer questions about his work and approach.",
    };

    const message = userMessage.toLowerCase();
    if (message.includes('project')) return responses.projects;
    if (message.includes('mindset') || message.includes('philosophy')) return responses.mindset;
    if (message.includes('work') || message.includes('what') || message.includes('who')) return responses.work;
    if (message.includes('tech') || message.includes('technology') || message.includes('build')) return responses.tech;
    if (message.includes('contact') || message.includes('reach')) return responses.contact;
    
    return "That's an interesting question! Sifeddine is passionate about building systems that think and automate the mundane. He believes in creating tools that provide both financial and mental freedom. What specific aspect would you like to explore?";
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: simulateAIResponse(inputValue),
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 2000);
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    setIsMinimized(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Enhanced Chat Window */}
      {isOpen && !isMinimized && (
        <Card className="mb-4 w-96 h-[500px] glass-effect animate-scale-in flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border/20">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              </div>
              <div>
                <div className="text-sm font-mono font-semibold">AI Assistant</div>
                <div className="text-xs text-muted-foreground">Always here to help</div>
              </div>
            </div>
            <div className="flex gap-1">
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 w-6 p-0"
                onClick={() => setIsMinimized(true)}
              >
                <Minimize2 className="h-3 w-3" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 w-6 p-0"
                onClick={() => setIsOpen(false)}
              >
                ×
              </Button>
            </div>
          </div>

          {/* Messages Area */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 text-sm ${
                      message.sender === 'user'
                        ? 'bg-primary text-primary-foreground ml-4'
                        : 'bg-muted mr-4'
                    }`}
                  >
                    {message.sender === 'ai' ? (
                      <TextScramble text={message.text} speed={20} />
                    ) : (
                      message.text
                    )}
                    <div className={`text-xs mt-1 opacity-70 ${
                      message.sender === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-lg p-3 text-sm mr-4">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="p-4 border-t border-border/20">
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask me anything about Sifeddine..."
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1 bg-background/50"
              />
              <Button 
                onClick={handleSendMessage}
                size="sm"
                disabled={!inputValue.trim() || isTyping}
                className="px-3"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Minimized Chat */}
      {isOpen && isMinimized && (
        <Card className="mb-4 p-3 w-64 glass-effect animate-scale-in cursor-pointer" onClick={() => setIsMinimized(false)}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></div>
              </div>
              <span className="text-sm font-mono">AI Assistant</span>
            </div>
            <Maximize2 className="h-3 w-3 text-muted-foreground" />
          </div>
        </Card>
      )}

      {/* Chat Bubble Button */}
      <Button
        onClick={toggleChat}
        size="lg"
        className="w-14 h-14 rounded-full bg-primary/10 hover:bg-primary/20 border border-primary/30 backdrop-blur-md relative overflow-hidden group"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {isOpen ? (
          <span className="text-primary text-xl relative z-10">×</span>
        ) : (
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-3 h-3 bg-primary rounded-full mb-1 animate-pulse"></div>
            <div className="flex gap-1">
              <div className="w-1 h-1 bg-primary/60 rounded-full animate-bounce"></div>
              <div className="w-1 h-1 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-1 h-1 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        )}
      </Button>
    </div>
  );
};

export default AIAssistant;