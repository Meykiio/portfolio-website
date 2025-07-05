import { useState } from "react";
import { Card } from "@/components/ui/card";

interface InteractiveCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
}

const InteractiveCard = ({ children, className = "", glowColor = "primary" }: InteractiveCardProps) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePosition({ x, y });
  };

  return (
    <Card 
      className={`relative overflow-hidden transition-all duration-300 ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Glow effect that follows mouse */}
      {isHovering && (
        <div 
          className="absolute pointer-events-none transition-opacity duration-300 w-32 h-32 rounded-full blur-xl"
          style={{
            left: mousePosition.x - 64,
            top: mousePosition.y - 64,
            opacity: isHovering ? 1 : 0,
            background: `hsl(var(--${glowColor}) / 0.2)`,
          }}
        />
      )}
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </Card>
  );
};

export default InteractiveCard;