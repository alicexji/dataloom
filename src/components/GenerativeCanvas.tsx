import React, { useEffect, useRef } from 'react';
import { ArtStyle, ArtSettings, DataPoint } from '../types';
import * as d3 from 'd3';

interface GenerativeCanvasProps {
  data: DataPoint[];
  style: ArtStyle;
  settings: ArtSettings;
  className?: string;
}

export default function GenerativeCanvas({ data, style, settings, className }: GenerativeCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      }
    };

    window.addEventListener('resize', resize);
    resize();

    // Engine implementations
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      if (style === 'particle-system') {
        renderParticles(ctx, canvas.width, canvas.height, data, settings);
      } else if (style === 'geometric-grid') {
        renderGrid(ctx, canvas.width, canvas.height, data, settings);
      } else if (style === 'flow-field') {
        renderFlow(ctx, canvas.width, canvas.height, data, settings);
      } else if (style === 'organic-blob') {
        renderBlobs(ctx, canvas.width, canvas.height, data, settings);
      } else {
        renderNoise(ctx, canvas.width, canvas.height, data, settings);
      }

      animationRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationRef.current);
    };
  }, [data, style, settings]);

  return <canvas ref={canvasRef} className={className} />;
}

// --- Engines ---

function renderParticles(ctx: CanvasRenderingContext2D, w: number, h: number, data: DataPoint[], settings: ArtSettings) {
  const time = Date.now() * 0.001 * settings.speed;
  const count = Math.min(data.length * settings.density, 1000);
  
  ctx.globalAlpha = 0.8;
  
  for (let i = 0; i < count; i++) {
    const d = data[i % data.length];
    const x = (i / count) * w + Math.sin(time + i) * 50 * settings.randomness;
    const y = (Math.sin(time * 0.5 + i * 0.1) * 0.5 + 0.5) * h;
    
    const sizeVal = settings.mapping.size ? Number(d[settings.mapping.size]) || 1 : 1;
    const size = Math.max(2, sizeVal * 5);
    
    ctx.fillStyle = settings.palette[i % settings.palette.length];
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }
}

function renderGrid(ctx: CanvasRenderingContext2D, w: number, h: number, data: DataPoint[], settings: ArtSettings) {
  const cols = Math.floor(Math.sqrt(data.length) * settings.density) || 10;
  const rows = Math.ceil(data.length / cols);
  const cellW = w / cols;
  const cellH = h / rows;

  data.forEach((d, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = col * cellW;
    const y = row * cellH;

    const sizeVal = settings.mapping.size ? Number(d[settings.mapping.size]) || 0.5 : 0.5;
    const padding = cellW * (1 - sizeVal);

    ctx.strokeStyle = settings.palette[i % settings.palette.length];
    ctx.lineWidth = 2;
    ctx.strokeRect(x + padding/2, y + padding/2, cellW - padding, cellH - padding);
    
    if (settings.randomness > 0.5) {
      ctx.fillStyle = settings.palette[(i + 1) % settings.palette.length];
      ctx.fillRect(x + cellW/2 - 2, y + cellH/2 - 2, 4, 4);
    }
  });
}

function renderFlow(ctx: CanvasRenderingContext2D, w: number, h: number, data: DataPoint[], settings: ArtSettings) {
  const time = Date.now() * 0.0005 * settings.speed;
  ctx.strokeStyle = settings.palette[0];
  ctx.lineWidth = 1;
  ctx.globalAlpha = 0.3;

  const step = 20 / settings.density;
  for (let x = 0; x < w; x += step) {
    for (let y = 0; y < h; y += step) {
      const angle = (Math.sin(x * 0.01 + time) + Math.cos(y * 0.01 + time)) * Math.PI * settings.randomness;
      const len = 15;
      
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + Math.cos(angle) * len, y + Math.sin(angle) * len);
      ctx.stroke();
    }
  }
}

function renderBlobs(ctx: CanvasRenderingContext2D, w: number, h: number, data: DataPoint[], settings: ArtSettings) {
  const time = Date.now() * 0.001 * settings.speed;
  ctx.globalAlpha = 0.4;

  data.slice(0, Math.floor(20 * settings.density)).forEach((d, i) => {
    const x = (i / 20) * w + Math.sin(time + i) * 100;
    const y = h / 2 + Math.cos(time * 0.7 + i) * 100;
    const radius = (settings.mapping.size ? Number(d[settings.mapping.size]) || 50 : 50) * 2;

    const grad = ctx.createRadialGradient(x, y, 0, x, y, radius);
    grad.addColorStop(0, settings.palette[i % settings.palette.length]);
    grad.addColorStop(1, 'transparent');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  });
}

function renderNoise(ctx: CanvasRenderingContext2D, w: number, h: number, data: DataPoint[], settings: ArtSettings) {
  const time = Date.now() * 0.001 * settings.speed;
  ctx.beginPath();
  ctx.moveTo(0, h);

  const points = Math.min(data.length, 200);
  for (let i = 0; i <= points; i++) {
    const d = data[i % data.length];
    const x = (i / points) * w;
    const noise = Math.sin(i * 0.1 + time) * 50 * settings.randomness;
    const val = settings.mapping.size ? Number(d[settings.mapping.size]) || 0.5 : 0.5;
    const y = h - (val * h * 0.5) + noise;
    ctx.lineTo(x, y);
  }

  ctx.lineTo(w, h);
  ctx.fillStyle = settings.palette[0];
  ctx.globalAlpha = 0.2;
  ctx.fill();
  ctx.strokeStyle = settings.palette[0];
  ctx.globalAlpha = 1;
  ctx.stroke();
}
