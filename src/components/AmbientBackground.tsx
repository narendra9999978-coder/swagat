import React, { useEffect, useRef } from 'react';

/**
 * AmbientBackground
 * Curated from: https://reactbits.dev/c/backgrounds/beams & dot-field
 * Dark Glassmorphism Ambient Light Beams & High-Performance Dot-Field Canvas
 */
export const AmbientBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Particle dot grid setup
    const spacing = 42;
    let time = 0;

    const render = () => {
      time += 0.008;
      ctx.clearRect(0, 0, width, height);

      // Subtle animated dot field
      const cols = Math.ceil(width / spacing);
      const rows = Math.ceil(height / spacing);

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = i * spacing;
          const y = j * spacing;

          // Wave equation for organic depth
          const distFromCenter = Math.hypot(x - width / 2, y - height / 2);
          const wave = Math.sin(distFromCenter * 0.003 - time * 1.5) * 0.5 + 0.5;
          const alpha = 0.04 + wave * 0.12;

          ctx.fillStyle = `rgba(148, 163, 184, ${alpha})`;
          ctx.beginPath();
          ctx.arc(x, y, 1.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden bg-black">
      {/* Dynamic Reactbits Ambient Light Beams */}
      <div 
        className="absolute -top-[25%] -left-[15%] w-[65vw] h-[65vw] rounded-full blur-[140px] pointer-events-none opacity-40 animate-pulse-subtle"
        style={{
          background: 'radial-gradient(circle, rgba(14, 165, 233, 0.45) 0%, rgba(30, 58, 138, 0.25) 45%, transparent 70%)',
          animationDuration: '9s'
        }}
      />
      <div 
        className="absolute top-[35%] -right-[15%] w-[55vw] h-[55vw] rounded-full blur-[150px] pointer-events-none opacity-30 animate-pulse-subtle"
        style={{
          background: 'radial-gradient(circle, rgba(224, 90, 16, 0.35) 0%, rgba(180, 83, 9, 0.15) 50%, transparent 75%)',
          animationDuration: '12s'
        }}
      />
      <div 
        className="absolute -bottom-[20%] left-[20%] w-[60vw] h-[60vw] rounded-full blur-[160px] pointer-events-none opacity-25"
        style={{
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.3) 0%, rgba(6, 78, 59, 0.15) 45%, transparent 75%)'
        }}
      />

      {/* High-Performance Canvas Dot-Field */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-60 mix-blend-screen" />

      {/* Subtle Dark Vignette & Mesh Overlay */}
      <div 
        className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))]"
      />
      <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[1px]" />
    </div>
  );
};
