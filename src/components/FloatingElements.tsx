import { useEffect, useState } from "react";

interface FloatingElementProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}

const FloatingElement = ({ children, delay = 0, duration = 3, className = "" }: FloatingElementProps) => {
  return (
    <div 
      className={`animate-float ${className}`}
      style={{
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`
      }}
    >
      {children}
    </div>
  );
};

const FloatingElements = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Floating Code Snippets */}
      <FloatingElement delay={0} className="absolute top-20 left-10 opacity-10">
        <div className="font-mono text-xs text-primary p-2 glass-effect rounded">
          {'{ system: "automated" }'}
        </div>
      </FloatingElement>
      
      <FloatingElement delay={1.5} className="absolute top-40 right-20 opacity-10">
        <div className="font-mono text-xs text-primary p-2 glass-effect rounded">
          {'if (boring) automate()'}
        </div>
      </FloatingElement>
      
      <FloatingElement delay={3} className="absolute bottom-40 left-20 opacity-10">
        <div className="font-mono text-xs text-primary p-2 glass-effect rounded">
          {'build(weird && useful)'}
        </div>
      </FloatingElement>
      
      <FloatingElement delay={2} className="absolute bottom-60 right-10 opacity-10">
        <div className="font-mono text-xs text-primary p-2 glass-effect rounded">
          {'freedom++'}
        </div>
      </FloatingElement>

      {/* Floating Geometric Shapes */}
      <FloatingElement delay={0.5} duration={4} className="absolute top-32 right-32 opacity-20">
        <div className="w-6 h-6 border border-primary/30 rotate-45"></div>
      </FloatingElement>
      
      <FloatingElement delay={2.5} duration={5} className="absolute top-80 left-32 opacity-20">
        <div className="w-4 h-4 bg-primary/20 rounded-full"></div>
      </FloatingElement>
      
      <FloatingElement delay={1} duration={6} className="absolute bottom-80 right-40 opacity-20">
        <div className="w-8 h-1 bg-primary/30"></div>
      </FloatingElement>
    </div>
  );
};

export default FloatingElements;