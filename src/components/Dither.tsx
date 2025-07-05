
import { useEffect, useRef } from "react";

interface DitherProps {
  className?: string;
  color1?: string;
  color2?: string;
  scale?: number;
  speed?: number;
  intensity?: number;
}

const Dither = ({
  className = "",
  color1 = "#000000",
  color2 = "#ffffff",
  scale = 4,
  speed = 0.5,
  intensity = 0.8,
}: DitherProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };

    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : { r: 0, g: 0, b: 0 };
    };

    const color1Rgb = hexToRgb(color1);
    const color2Rgb = hexToRgb(color2);

    const ditherMatrix = [
      [0, 8, 2, 10],
      [12, 4, 14, 6],
      [3, 11, 1, 9],
      [15, 7, 13, 5]
    ];

    const animate = () => {
      time += speed * 0.01;
      
      const imageData = ctx.createImageData(canvas.width, canvas.height);
      const data = imageData.data;

      for (let y = 0; y < canvas.height; y += scale) {
        for (let x = 0; x < canvas.width; x += scale) {
          // Create noise pattern
          const noise = Math.sin(x * 0.01 + time) * Math.cos(y * 0.01 + time) * intensity;
          const threshold = (noise + 1) * 0.5; // Normalize to 0-1
          
          // Get dither threshold
          const ditherX = Math.floor(x / scale) % 4;
          const ditherY = Math.floor(y / scale) % 4;
          const ditherThreshold = ditherMatrix[ditherY][ditherX] / 16;
          
          // Choose color based on threshold
          const useColor2 = threshold > ditherThreshold;
          const selectedColor = useColor2 ? color2Rgb : color1Rgb;
          
          // Fill the scaled pixel block
          for (let dy = 0; dy < scale && y + dy < canvas.height; dy++) {
            for (let dx = 0; dx < scale && x + dx < canvas.width; dx++) {
              const index = ((y + dy) * canvas.width + (x + dx)) * 4;
              data[index] = selectedColor.r;     // Red
              data[index + 1] = selectedColor.g; // Green
              data[index + 2] = selectedColor.b; // Blue
              data[index + 3] = 255;             // Alpha
            }
          }
        }
      }

      ctx.putImageData(imageData, 0, 0);
      animationId = requestAnimationFrame(animate);
    };

    window.addEventListener("resize", resize);
    resize();
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationId);
    };
  }, [color1, color2, scale, speed, intensity]);

  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-full ${className}`}
      style={{ imageRendering: 'pixelated' }}
    />
  );
};

export default Dither;
