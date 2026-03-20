import React, { useEffect, useRef } from 'react';

interface HeroCanvasProps {
  className?: string;
}

export default function HeroCanvas({ className }: HeroCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let bars: Bar[] = [];
    let mouse = { x: 0, y: 0 };

    class Bar {
      x: number;
      y: number;
      width: number;
      height: number;
      color: string;
      angle: number;
      speed: number;
      opacity: number;
      type: 'bar' | 'disc' | 'line';
      label: string;

      constructor(width: number, height: number) {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.width = Math.random() * 6 + 1;
        this.height = Math.random() * 80 + 20;
        const colors = ['#FF3E00', '#000000', '#FFD700', '#0000FF', '#00FF00', '#FF00FF', '#00FFFF', '#333333', '#FFFFFF'];
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.angle = 0;
        this.speed = Math.random() * 0.6 + 0.1;
        this.opacity = Math.random() * 0.4 + 0.1;
        this.type = Math.random() > 0.7 ? (Math.random() > 0.5 ? 'disc' : 'line') : 'bar';
        this.label = Math.random() > 0.95 ? (Math.random() * 1000).toFixed(0) : '';
      }

      update(width: number, height: number, time: number) {
        // More complex flow field using multiple frequencies
        const noise = (
          Math.sin(this.x * 0.001 + time) + 
          Math.cos(this.y * 0.001 + time * 0.5) +
          Math.sin((this.x + this.y) * 0.0005 + time * 0.2)
        ) * Math.PI;
        
        this.angle = noise;
        
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;

        // Mouse interaction - subtle attraction/repulsion
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 400) {
          const force = (400 - distance) / 400;
          this.x -= dx * force * 0.015;
          this.y -= dy * force * 0.015;
          this.opacity = Math.min(0.8, this.opacity + force * 0.01);
        }

        if (this.x > width + 150) this.x = -150;
        else if (this.x < -150) this.x = width + 150;
        if (this.y > height + 150) this.y = -150;
        else if (this.y < -150) this.y = height + 150;
      }

      draw() {
        if (!ctx) return;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        ctx.strokeStyle = this.color;

        if (this.type === 'bar') {
          ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
          // Detail line
          ctx.globalAlpha = this.opacity * 0.5;
          ctx.fillStyle = '#fff';
          ctx.fillRect(-this.width / 4, -this.height / 2, this.width / 2, this.height / 4);
        } else if (this.type === 'disc') {
          ctx.beginPath();
          ctx.arc(0, 0, this.width * 2, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = this.opacity * 0.3;
          ctx.beginPath();
          ctx.arc(0, 0, this.width * 4, 0, Math.PI * 2);
          ctx.stroke();
        } else {
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(0, -this.height);
          ctx.lineTo(0, this.height);
          ctx.stroke();
        }

        // Floating label
        if (this.label) {
          ctx.rotate(-this.angle); // Keep text upright
          ctx.font = '8px monospace';
          ctx.fillStyle = '#000';
          ctx.globalAlpha = 0.4;
          ctx.fillText(this.label, 10, 0);
        }
        
        ctx.restore();
      }
    }

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      init();
    };

    const init = () => {
      bars = [];
      const numberOfBars = (canvas.width * canvas.height) / 8000;
      for (let i = 0; i < numberOfBars; i++) {
        bars.push(new Bar(canvas.width, canvas.height));
      }
    };

    const animate = () => {
      const time = Date.now() * 0.00015;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw subtle grid background
      ctx.save();
      ctx.strokeStyle = '#000';
      ctx.globalAlpha = 0.02;
      ctx.lineWidth = 0.5;
      const gridSize = 100;
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
      ctx.restore();

      // Draw connections
      ctx.beginPath();
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 0.15;
      ctx.globalAlpha = 0.03;
      for (let i = 0; i < bars.length; i++) {
        for (let j = i + 1; j < bars.length; j++) {
          const dx = bars[i].x - bars[j].x;
          const dy = bars[i].y - bars[j].y;
          const distSq = dx * dx + dy * dy;
          if (distSq < 15000) { // ~122px
            ctx.moveTo(bars[i].x, bars[i].y);
            ctx.lineTo(bars[j].x, bars[j].y);
          }
        }
      }
      ctx.stroke();

      for (let i = 0; i < bars.length; i++) {
        bars[i].update(canvas.width, canvas.height, time);
        bars[i].draw();
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);
    resize();
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className={className}
      style={{ 
        filter: 'contrast(1.05) brightness(1.02)',
        maskImage: 'radial-gradient(circle at center, black 30%, transparent 85%)',
        WebkitMaskImage: 'radial-gradient(circle at center, black 30%, transparent 85%)'
      }}
    />
  );
}
