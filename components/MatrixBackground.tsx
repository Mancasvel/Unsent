"use client";

import React, { useEffect, useRef } from "react";

export default function MatrixBackground(): React.JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Fullscreen canvas
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();

    // Caracteres Matrix (japoneses + números + letras)
    const letters = "アァイィウヴエカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンabcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = Array(columns).fill(1);

    // Colores morados en degradado
    const colors = [
      "#8B5CF6", // purple-500
      "#A855F7", // purple-600
      "#9333EA", // purple-700
      "#7C3AED", // purple-800
      "#6B46C1", // purple-900
      "#C084FC", // purple-400
      "#DDD6FE", // purple-200
    ];

    const draw = () => {
      // Fondo semi-transparente para crear el efecto de desvanecimiento
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${fontSize}px monospace`;

      drops.forEach((y, i) => {
        const text = letters.charAt(Math.floor(Math.random() * letters.length));
        const x = i * fontSize;
        
        // Seleccionar color morado aleatorio
        const colorIndex = Math.floor(Math.random() * colors.length);
        ctx.fillStyle = colors[colorIndex];
        
        // Añadir efecto de brillo más intenso para algunos caracteres
        if (Math.random() > 0.9) {
          ctx.shadowColor = "#8B5CF6";
          ctx.shadowBlur = 10;
        } else {
          ctx.shadowBlur = 0;
        }

        ctx.fillText(text, x, y * fontSize);

        // Reset drop to top randomly
        if (y * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }

        drops[i]++;
      });

      requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => {
      resizeCanvas();
      // Recalcular columnas cuando cambie el tamaño
      const newColumns = Math.floor(canvas.width / fontSize);
      drops.length = newColumns;
      drops.fill(1);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 z-[-1] pointer-events-none"
      style={{ 
        background: "linear-gradient(180deg, #000000 0%, #1a0d2e 50%, #000000 100%)" 
      }}
    />
  );
} 