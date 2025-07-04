import { useEffect, useRef, useState } from "react";

interface TextScrambleProps {
  text: string;
  className?: string;
  speed?: number;
  chars?: string;
  onComplete?: () => void;
}

const TextScramble = ({ 
  text, 
  className = "", 
  speed = 50,
  chars = "!<>-_\\/[]{}—=+*^?#________",
  onComplete
}: TextScrambleProps) => {
  const [displayText, setDisplayText] = useState("");
  const frameRef = useRef<number>();
  const queueRef = useRef<Array<{ from: string; to: string; start: number; end: number; char?: string }>>([]);
  const frameRequestRef = useRef(0);
  const resolveRef = useRef<(() => void) | null>(null);

  const randomChar = () => chars[Math.floor(Math.random() * chars.length)];

  const update = () => {
    let output = '';
    let complete = 0;
    
    for (let i = 0, n = queueRef.current.length; i < n; i++) {
      const { from, to, start, end, char } = queueRef.current[i];
      
      if (frameRequestRef.current >= end) {
        complete++;
        output += to;
      } else if (frameRequestRef.current >= start) {
        if (!char || Math.random() < 0.28) {
          queueRef.current[i].char = randomChar();
        }
        output += queueRef.current[i].char!;
      } else {
        output += from;
      }
    }
    
    setDisplayText(output);
    
    if (complete === queueRef.current.length) {
      if (resolveRef.current) {
        resolveRef.current();
        resolveRef.current = null;
      }
      onComplete?.();
    } else {
      frameRequestRef.current++;
      frameRef.current = requestAnimationFrame(update);
    }
  };

  const setText = (newText: string): Promise<void> => {
    const oldText = displayText;
    const length = Math.max(oldText.length, newText.length);
    const promise = new Promise<void>((resolve) => {
      resolveRef.current = resolve;
    });
    
    queueRef.current = [];
    for (let i = 0; i < length; i++) {
      const from = oldText[i] || '';
      const to = newText[i] || '';
      const start = Math.floor(Math.random() * 40);
      const end = start + Math.floor(Math.random() * 40);
      queueRef.current.push({ from, to, start, end });
    }
    
    frameRequestRef.current = 0;
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
    }
    frameRef.current = requestAnimationFrame(update);
    
    return promise;
  };

  useEffect(() => {
    setText(text);
    
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [text]);

  return <span className={className}>{displayText}</span>;
};

export default TextScramble;