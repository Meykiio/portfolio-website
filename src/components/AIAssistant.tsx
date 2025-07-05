import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import TextScramble from "./TextScramble";

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMessage, setCurrentMessage] = useState(0);
  
  const messages = [
    "Hey! I'm Sifeddine's AI assistant.",
    "I can tell you about his projects and mindset.",
    "Want to know something specific?",
    "I'm here to help you explore his work.",
    "Feel free to ask me anything about Sifeddine!"
  ];

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      // Cycle through messages when opening
      setCurrentMessage((prev) => (prev + 1) % messages.length);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Window */}
      {isOpen && (
        <Card className="mb-4 p-4 w-80 glass-effect animate-scale-in">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              </div>
              <div className="text-sm font-mono text-muted-foreground">
                AI Assistant
              </div>
            </div>
            
            <div className="text-sm leading-relaxed">
              <TextScramble 
                text={messages[currentMessage]} 
                speed={30}
              />
            </div>
            
            <div className="flex gap-2 pt-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs"
                onClick={() => setCurrentMessage((prev) => (prev + 1) % messages.length)}
              >
                Tell me more
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs text-primary"
              >
                Let's chat
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