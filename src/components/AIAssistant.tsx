
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import TextScramble from "./TextScramble";

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hey! I'm Sifeddine's AI assistant. I can tell you about his projects, mindset, and weird experiments. What would you like to know?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const aiResponses = [
    "Sifeddine believes in building systems, not stress. He automates anything that feels repetitive.",
    "His projects like RealCaptcha turn boring security into games. That's his style - making useful things fun.",
    "He's currently working on AI emotion training through games and automated ad generation. Always something weird cooking!",
    "Based in Algiers, he works alone but never really alone - AI assistants and side projects keep him company.",
    "His philosophy: if you do something twice, systematize it. If it's boring, automate it. If it's weird, follow it.",
    "Want to collaborate? He's looking for people who think sideways and aren't afraid of building strange, useful things.",
  ];

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: inputValue,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
      const aiMessage: Message = {
        id: messages.length + 2,
        text: randomResponse,
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Window */}
      {isOpen && (
        <Card className="mb-4 w-80 h-96 glass-effect animate-scale-in flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-border/20">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              </div>
              <div className="text-sm font-mono text-muted-foreground">
                Sifeddine's AI Assistant
              </div>
            </div>
          </div>
          
          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-lg text-sm ${
                  message.isUser 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {message.isUser ? message.text : (
                    <TextScramble text={message.text} speed={30} />
                  )}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-muted text-muted-foreground p-3 rounded-lg text-sm">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Input */}
          <div className="p-4 border-t border-border/20">
            <div className="flex gap-2">
              <Input 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me about Sifeddine..."
                className="flex-1 text-sm"
              />
              <Button 
                size="sm" 
                onClick={handleSendMessage}
                disabled={!inputValue.trim()}
              >
                Send
              </Button>
            </div>
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
