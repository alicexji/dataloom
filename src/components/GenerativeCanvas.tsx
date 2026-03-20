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
      
      if (style === 'data-grid-composition') {
        renderDataGridComposition(ctx, canvas.width, canvas.height, data, settings);
      } else if (style === 'radial-pathway') {
        renderRadialPathway(ctx, canvas.width, canvas.height, data, settings);
      } else if (style === 'shape-overlap') {
        renderShapeOverlap(ctx, canvas.width, canvas.height, data, settings);
      } else if (style === 'connected-grid') {
        renderConnectedGrid(ctx, canvas.width, canvas.height, data, settings);
      } else if (style === 'particle-system') {
        renderParticles(ctx, canvas.width, canvas.height, data, settings);
      } else if (style === 'geometric-grid') {
        renderGrid(ctx, canvas.width, canvas.height, data, settings);
      } else if (style === 'flow-field') {
        renderFlow(ctx, canvas.width, canvas.height, data, settings);
      } else if (style === 'organic-blob') {
        renderBlobs(ctx, canvas.width, canvas.height, data, settings);
      } else if (style === 'noise-landscape') {
        renderNoise(ctx, canvas.width, canvas.height, data, settings);
      } else if (style === 'translucent-discs') {
        renderTranslucentDiscs(ctx, canvas.width, canvas.height, data, settings);
      } else if (style === 'structural-dots') {
        renderStructuralDots(ctx, canvas.width, canvas.height, data, settings);
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

function applyNoiseTexture(ctx: CanvasRenderingContext2D, w: number, h: number, opacity: number = 0.05) {
  ctx.save();
  ctx.globalAlpha = opacity;
  ctx.fillStyle = '#000';
  for (let i = 0; i < 2000; i++) {
    const x = Math.random() * w;
    const y = Math.random() * h;
    const size = Math.random() * 1.5;
    ctx.fillRect(x, y, size, size);
  }
  ctx.restore();
}

function renderParticles(ctx: CanvasRenderingContext2D, w: number, h: number, data: DataPoint[], settings: ArtSettings) {
  const time = Date.now() * 0.001 * settings.speed;
  const count = Math.min(data.length * settings.density, 1500);
  
  applyNoiseTexture(ctx, w, h, 0.03);

  for (let i = 0; i < count; i++) {
    const d = data[i % data.length];
    const progress = i / count;
    const x = progress * w + Math.sin(time + i * 0.5) * 50 * settings.randomness;
    const y = (Math.sin(time * 0.3 + i * 0.2) * 0.4 + 0.5) * h + Math.cos(time * 0.2 + i * 0.1) * 20;
    
    const sizeVal = settings.mapping.size ? Number(d[settings.mapping.size]) || 1 : 1;
    const size = Math.max(1, sizeVal * 3 * (1 + settings.randomness));
    
    const color = settings.palette[i % settings.palette.length];
    ctx.globalAlpha = 0.7;
    ctx.fillStyle = color;
    
    // Draw particle with a subtle glow and chromatic aberration effect
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
    
    if (size > 2) {
      ctx.globalAlpha = 0.15;
      ctx.shadowBlur = 10;
      ctx.shadowColor = color;
      ctx.beginPath();
      ctx.arc(x, y, size * 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    // Occasional connecting lines to nearby particles with Bezier curves
    if (i % 12 === 0 && i > 1) {
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.globalAlpha = 0.08;
      ctx.lineWidth = 0.4;
      ctx.moveTo(x, y);
      const prevX = ((i-2) / count) * w + Math.sin(time + (i-2) * 0.5) * 50 * settings.randomness;
      const prevY = (Math.sin(time * 0.3 + (i-2) * 0.2) * 0.4 + 0.5) * h;
      ctx.bezierCurveTo(x + 20, y, prevX - 20, prevY, prevX, prevY);
      ctx.stroke();
    }
  }
}

function renderGrid(ctx: CanvasRenderingContext2D, w: number, h: number, data: DataPoint[], settings: ArtSettings) {
  const cols = Math.floor(20 * settings.density) || 12;
  const rows = Math.floor(20 * settings.density) || 12;
  const cellW = w / cols;
  const cellH = h / rows;
  const time = Date.now() * 0.001 * settings.speed;

  applyNoiseTexture(ctx, w, h, 0.02);

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const i = r * cols + c;
      const d = data[i % data.length];
      const x = c * cellW;
      const y = r * cellH;

      const sizeVal = settings.mapping.size ? Number(d[settings.mapping.size]) || 0.5 : 0.5;
      const rotation = (Math.sin(time + c * 0.3 + r * 0.3) * settings.randomness) * Math.PI * 2;
      
      ctx.save();
      ctx.translate(x + cellW / 2, y + cellH / 2);
      ctx.rotate(rotation);
      
      const color = settings.palette[i % settings.palette.length];
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.2;
      ctx.globalAlpha = 0.5;
      
      // Nested shapes with varying opacity
      const maxInner = 4;
      for (let j = 0; j < maxInner; j++) {
        ctx.globalAlpha = 0.5 * (1 - j / maxInner);
        const scale = (sizeVal * (1 - j / maxInner)) * 0.9;
        const sw = cellW * scale;
        const sh = cellH * scale;
        
        if (i % 3 === 0) {
          ctx.strokeRect(-sw / 2, -sh / 2, sw, sh);
        } else if (i % 3 === 1) {
          ctx.beginPath();
          ctx.arc(0, 0, sw / 2, 0, Math.PI * 2);
          ctx.stroke();
        } else {
          // Triangle
          ctx.beginPath();
          ctx.moveTo(0, -sh / 2);
          ctx.lineTo(sw / 2, sh / 2);
          ctx.lineTo(-sw / 2, sh / 2);
          ctx.closePath();
          ctx.stroke();
        }
      }

      // Technical annotations
      if (settings.randomness > 0.4 && i % 4 === 0) {
        ctx.globalAlpha = 0.3;
        ctx.font = '6px monospace';
        ctx.fillStyle = color;
        ctx.fillText(`ID:${i.toString(16).toUpperCase()}`, cellW/3, -cellH/3);
      }

      ctx.restore();
    }
  }
}

function renderFlow(ctx: CanvasRenderingContext2D, w: number, h: number, data: DataPoint[], settings: ArtSettings) {
  const time = Date.now() * 0.0005 * settings.speed;
  const step = 12 / settings.density;
  
  applyNoiseTexture(ctx, w, h, 0.04);
  ctx.lineWidth = 1.2;
  
  for (let x = 0; x < w; x += step) {
    for (let y = 0; y < h; y += step) {
      const i = Math.floor((x / w) * data.length);
      const d = data[i % data.length];
      
      const noiseVal = Math.sin(x * 0.004 + time) + Math.cos(y * 0.004 + time * 0.7);
      const angle = (noiseVal + (settings.mapping.size ? Number(d[settings.mapping.size]) || 0 : 0)) * Math.PI * settings.randomness * 2;
      
      const len = 25 * (settings.mapping.size ? Number(d[settings.mapping.size]) || 1 : 1) * (1 + Math.sin(time + i) * 0.2);
      
      ctx.strokeStyle = settings.palette[Math.floor(x / step) % settings.palette.length];
      ctx.globalAlpha = 0.15 + (Math.sin(time + x * 0.01) * 0.1);
      
      ctx.beginPath();
      ctx.moveTo(x, y);
      const cp1X = x + Math.cos(angle) * len * 0.3;
      const cp1Y = y + Math.sin(angle) * len * 0.3;
      const cp2X = x + Math.cos(angle + 0.5) * len * 0.7;
      const cp2Y = y + Math.sin(angle + 0.5) * len * 0.7;
      const endX = x + Math.cos(angle) * len;
      const endY = y + Math.sin(angle) * len;
      
      ctx.bezierCurveTo(cp1X, cp1Y, cp2X, cp2Y, endX, endY);
      ctx.stroke();
      
      // Data-driven highlights
      if (i % 8 === 0) {
        ctx.globalAlpha = 0.4;
        ctx.beginPath();
        ctx.arc(endX, endY, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
}

function renderBlobs(ctx: CanvasRenderingContext2D, w: number, h: number, data: DataPoint[], settings: ArtSettings) {
  const time = Date.now() * 0.001 * settings.speed;
  const blobCount = Math.floor(20 * settings.density);
  
  applyNoiseTexture(ctx, w, h, 0.02);
  ctx.globalCompositeOperation = 'screen';

  data.slice(0, blobCount).forEach((d, i) => {
    const x = (i / blobCount) * w + Math.sin(time * 0.4 + i) * 200 * settings.randomness;
    const y = h / 2 + Math.cos(time * 0.3 + i * 1.2) * 200 * settings.randomness;
    const baseRadius = (settings.mapping.size ? Number(d[settings.mapping.size]) || 80 : 80) * (1.2 + settings.randomness);
    
    // Multi-layered ethereal gradients
    const layers = 5;
    for (let j = 0; j < layers; j++) {
      const r = baseRadius * (1 - j * 0.15);
      const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
      const color = settings.palette[i % settings.palette.length];
      
      grad.addColorStop(0, color);
      grad.addColorStop(0.5, color + '33');
      grad.addColorStop(1, 'transparent');

      ctx.globalAlpha = 0.4 / (j + 1);
      ctx.fillStyle = grad;
      
      // Distorted circle (blobby)
      ctx.beginPath();
      for (let a = 0; a < Math.PI * 2; a += 0.2) {
        const offset = Math.sin(a * 3 + time + i) * 10 * settings.randomness;
        const rx = x + Math.cos(a) * (r + offset);
        const ry = y + Math.sin(a) * (r + offset);
        if (a === 0) ctx.moveTo(rx, ry);
        else ctx.lineTo(rx, ry);
      }
      ctx.closePath();
      ctx.fill();
    }
  });
  
  ctx.globalCompositeOperation = 'source-over';
}

function renderNoise(ctx: CanvasRenderingContext2D, w: number, h: number, data: DataPoint[], settings: ArtSettings) {
  const time = Date.now() * 0.001 * settings.speed;
  const layers = 4;
  
  applyNoiseTexture(ctx, w, h, 0.03);

  for (let l = 0; l < layers; l++) {
    ctx.beginPath();
    ctx.moveTo(0, h);

    const points = 200;
    const color = settings.palette[l % settings.palette.length];
    
    for (let i = 0; i <= points; i++) {
      const d = data[i % data.length];
      const x = (i / points) * w;
      const noise = Math.sin(i * 0.04 + time + l * 2) * 60 * settings.randomness;
      const val = settings.mapping.size ? Number(d[settings.mapping.size]) || 0.5 : 0.5;
      const y = h - (val * h * (0.2 + l * 0.15)) + noise;
      
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }

    ctx.lineTo(w, h);
    ctx.fillStyle = color;
    ctx.globalAlpha = 0.12;
    ctx.fill();
    
    ctx.strokeStyle = color;
    ctx.lineWidth = 2.5 - l * 0.5;
    ctx.globalAlpha = 0.7;
    ctx.stroke();
    
    // Add "data nodes" and vertical stems
    if (l === 0) {
      for (let i = 0; i <= points; i += 15) {
        const d = data[i % data.length];
        const x = (i / points) * w;
        const noise = Math.sin(i * 0.04 + time + l * 2) * 60 * settings.randomness;
        const val = settings.mapping.size ? Number(d[settings.mapping.size]) || 0.5 : 0.5;
        const y = h - (val * h * (0.2 + l * 0.15)) + noise;
        
        ctx.strokeStyle = '#000';
        ctx.globalAlpha = 0.1;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, h);
        ctx.stroke();

        ctx.fillStyle = color;
        ctx.globalAlpha = 0.5;
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
}

function renderTranslucentDiscs(ctx: CanvasRenderingContext2D, w: number, h: number, data: DataPoint[], settings: ArtSettings) {
  const time = Date.now() * 0.0004 * settings.speed;
  const count = Math.min(data.length, 25);
  
  applyNoiseTexture(ctx, w, h, 0.04);
  ctx.globalCompositeOperation = 'multiply';
  
  const points = data.slice(0, count).map((d, i) => {
    const x = (0.05 + 0.9 * (i / count)) * w + Math.sin(time + i) * 100 * settings.randomness;
    const y = (0.15 + 0.7 * Math.sin(time * 0.3 + i * 0.4)) * h;
    const radius = (settings.mapping.size ? Number(d[settings.mapping.size]) || 140 : 140) * (0.7 + settings.randomness);
    return { x, y, radius, color: settings.palette[i % settings.palette.length] };
  });

  // Draw complex connecting lines (curves) with varying thickness
  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i];
    const p2 = points[i+1];
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(0,0,0,0.06)';
    ctx.lineWidth = 0.5 + Math.random() * 1;
    ctx.moveTo(p1.x, p1.y);
    ctx.bezierCurveTo(p1.x + 150, p1.y - 50, p2.x - 150, p2.y + 50, p2.x, p2.y);
    ctx.stroke();
  }

  // Draw discs with inner details and grain
  points.forEach(p => {
    const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
    grad.addColorStop(0, p.color);
    grad.addColorStop(0.6, p.color + '88');
    grad.addColorStop(1, 'transparent');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fill();
    
    // Inner technical details
    ctx.strokeStyle = 'rgba(0,0,0,0.15)';
    ctx.lineWidth = 0.4;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius * 0.3, 0, Math.PI * 2);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(p.x - p.radius * 0.5, p.y);
    ctx.lineTo(p.x + p.radius * 0.5, p.y);
    ctx.stroke();

    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.beginPath();
    ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
    ctx.fill();
  });
  
  ctx.globalCompositeOperation = 'source-over';
}

function renderDataGridComposition(ctx: CanvasRenderingContext2D, w: number, h: number, data: DataPoint[], settings: ArtSettings) {
  const cols = Math.floor(6 * settings.density) || 4;
  const rows = Math.floor(6 * settings.density) || 4;
  const cellW = w / cols;
  const cellH = h / rows;
  const time = Date.now() * 0.001 * settings.speed;

  applyNoiseTexture(ctx, w, h, 0.05);

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const idx = (r * cols + c) % data.length;
      const d = data[idx];
      const x = c * cellW;
      const y = r * cellH;

      const colorIdx = Math.floor((Number(d[settings.mapping.color || '']) || idx) % settings.palette.length);
      const color = settings.palette[colorIdx];

      ctx.save();
      ctx.translate(x, y);
      
      // Background cell
      ctx.fillStyle = color;
      ctx.globalAlpha = 0.8;
      ctx.fillRect(2, 2, cellW - 4, cellH - 4);

      // Internal lines
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 4 * (1 + settings.randomness);
      ctx.globalAlpha = 0.9;
      
      const type = idx % 3;
      const sizeVal = settings.mapping.size ? Number(d[settings.mapping.size]) || 0.5 : 0.5;

      ctx.beginPath();
      if (type === 0) {
        // Diagonal
        ctx.moveTo(10, 10);
        ctx.lineTo(cellW - 10, cellH - 10);
      } else if (type === 1) {
        // Curved
        ctx.moveTo(10, cellH / 2);
        ctx.quadraticCurveTo(cellW / 2, cellH * sizeVal, cellW - 10, cellH / 2);
      } else {
        // Cross
        ctx.moveTo(cellW / 2, 10);
        ctx.lineTo(cellW / 2, cellH - 10);
        ctx.moveTo(10, cellH / 2);
        ctx.lineTo(cellW - 10, cellH / 2);
      }
      ctx.stroke();

      // Bold numeric annotation
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText(idx.toString().padStart(2, '0'), 8, 20);

      ctx.restore();
    }
  }
}

const radialPaths: { x: number, y: number, angle: number, color: string, points: {x: number, y: number}[] }[] = [];

function renderRadialPathway(ctx: CanvasRenderingContext2D, w: number, h: number, data: DataPoint[], settings: ArtSettings) {
  const time = Date.now() * 0.001 * settings.speed;
  const centerX = w / 2;
  const centerY = h / 2;
  
  if (radialPaths.length === 0 || radialPaths.length < data.length * 0.2) {
    const count = Math.floor(data.length * 0.2);
    for (let i = 0; i < count; i++) {
      radialPaths.push({
        x: centerX,
        y: centerY,
        angle: (i / count) * Math.PI * 2,
        color: settings.palette[i % settings.palette.length],
        points: [{ x: centerX, y: centerY }]
      });
    }
  }

  applyNoiseTexture(ctx, w, h, 0.02);

  radialPaths.forEach((p, i) => {
    const d = data[i % data.length];
    const speed = (settings.mapping.motion ? Number(d[settings.mapping.motion]) || 1 : 1) * settings.speed * 2;
    const sizeVal = settings.mapping.size ? Number(d[settings.mapping.size]) || 1 : 1;

    p.angle += (Math.random() - 0.5) * 0.1 * settings.randomness;
    p.x += Math.cos(p.angle) * speed;
    p.y += Math.sin(p.angle) * speed;

    // Wrap around or reset
    if (p.x < 0 || p.x > w || p.y < 0 || p.y > h) {
      p.x = centerX;
      p.y = centerY;
      p.points = [{ x: centerX, y: centerY }];
    }

    p.points.push({ x: p.x, y: p.y });
    if (p.points.length > 100) p.points.shift();

    // Draw path
    ctx.beginPath();
    ctx.strokeStyle = p.color;
    ctx.lineWidth = 8 * sizeVal;
    ctx.lineCap = 'round';
    ctx.globalAlpha = 0.6;
    ctx.moveTo(p.points[0].x, p.points[0].y);
    for (let j = 1; j < p.points.length; j++) {
      ctx.lineTo(p.points[j].x, p.points[j].y);
    }
    ctx.stroke();

    // Draw head
    ctx.fillStyle = p.color;
    ctx.globalAlpha = 1;
    ctx.beginPath();
    ctx.arc(p.x, p.y, 12 * sizeVal, 0, Math.PI * 2);
    ctx.fill();
    
    // Inner dot
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(p.x, p.y, 4 * sizeVal, 0, Math.PI * 2);
    ctx.fill();
  });
}

const overlappingShapes: { type: string, x: number, y: number, size: number, color: string, alpha: number, life: number }[] = [];

function renderShapeOverlap(ctx: CanvasRenderingContext2D, w: number, h: number, data: DataPoint[], settings: ArtSettings) {
  const time = Date.now() * 0.001 * settings.speed;
  
  if (overlappingShapes.length < 50 * settings.density) {
    const d = data[Math.floor(Math.random() * data.length)];
    overlappingShapes.push({
      type: ['grid', 'circle', 'diamond', 'clover'][Math.floor(Math.random() * 4)],
      x: Math.random() * w,
      y: Math.random() * h,
      size: (50 + Math.random() * 150) * (settings.mapping.size ? Number(d[settings.mapping.size]) || 1 : 1),
      color: settings.palette[Math.floor(Math.random() * settings.palette.length)],
      alpha: 0,
      life: 1.0
    });
  }

  applyNoiseTexture(ctx, w, h, 0.03);

  for (let i = overlappingShapes.length - 1; i >= 0; i--) {
    const s = overlappingShapes[i];
    s.life -= 0.005 * settings.speed;
    s.alpha = Math.sin(s.life * Math.PI) * 0.8;

    if (s.life <= 0) {
      overlappingShapes.splice(i, 1);
      continue;
    }

    ctx.save();
    ctx.translate(s.x, s.y);
    ctx.rotate(s.life * Math.PI * settings.randomness);
    ctx.fillStyle = s.color;
    ctx.globalAlpha = s.alpha;

    if (s.type === 'grid') {
      const gSize = s.size / 3;
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
          ctx.fillRect(c * gSize - s.size / 2, r * gSize - s.size / 2, gSize - 4, gSize - 4);
        }
      }
    } else if (s.type === 'circle') {
      ctx.beginPath();
      ctx.arc(0, 0, s.size / 2, 0, Math.PI * 2);
      ctx.fill();
    } else if (s.type === 'diamond') {
      ctx.beginPath();
      ctx.moveTo(0, -s.size / 2);
      ctx.lineTo(s.size / 2, 0);
      ctx.lineTo(0, s.size / 2);
      ctx.lineTo(-s.size / 2, 0);
      ctx.closePath();
      ctx.fill();
    } else if (s.type === 'clover') {
      for (let a = 0; a < 4; a++) {
        ctx.save();
        ctx.rotate((a * Math.PI) / 2);
        ctx.beginPath();
        ctx.arc(s.size / 4, 0, s.size / 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }
    ctx.restore();
  }
}

function renderConnectedGrid(ctx: CanvasRenderingContext2D, w: number, h: number, data: DataPoint[], settings: ArtSettings) {
  const time = Date.now() * 0.0008 * settings.speed;
  const cols = Math.floor(10 * settings.density) || 8;
  const rows = Math.floor(10 * settings.density) || 8;
  const cellW = w / cols;
  const cellH = h / rows;

  applyNoiseTexture(ctx, w, h, 0.02);

  // Background grid
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 2;
  ctx.globalAlpha = 0.1;
  for (let c = 0; c <= cols; c++) {
    ctx.beginPath(); ctx.moveTo(c * cellW, 0); ctx.lineTo(c * cellW, h); ctx.stroke();
  }
  for (let r = 0; r <= rows; r++) {
    ctx.beginPath(); ctx.moveTo(0, r * cellH); ctx.lineTo(w, r * cellH); ctx.stroke();
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const idx = r * cols + c;
      const d = data[idx % data.length];
      const x = c * cellW + cellW / 2;
      const y = r * cellH + cellH / 2;
      
      const noise = Math.sin(c * 0.5 + r * 0.5 + time * 1.2);
      const active = noise > 0.0;
      const radius = active ? 25 * (1 + noise) * settings.density : 5;
      
      if (active) {
        const color = settings.palette[idx % settings.palette.length];
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.9;
        
        // Thicker bridges
        const neighbors = [[1, 0], [0, 1]];
        neighbors.forEach(([dc, dr]) => {
          const nc = c + dc;
          const nr = r + dr;
          if (nc < cols && nr < rows) {
            const nx = nc * cellW + cellW / 2;
            const ny = nr * cellH + cellH / 2;
            ctx.beginPath();
            ctx.strokeStyle = color;
            ctx.lineWidth = 10 * settings.density;
            ctx.globalAlpha = 0.4;
            ctx.moveTo(x, y);
            ctx.lineTo(nx, ny);
            ctx.stroke();
          }
        });

        // Bigger nodes
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 4;
        ctx.globalAlpha = 0.8;
        ctx.stroke();
      }
    }
  }
}

function renderStructuralDots(ctx: CanvasRenderingContext2D, w: number, h: number, data: DataPoint[], settings: ArtSettings) {
  const time = Date.now() * 0.001 * settings.speed;
  const cols = Math.floor(15 * settings.density) || 10;
  const rows = Math.floor(15 * settings.density) || 10;
  const cellW = w / cols;
  const cellH = h / rows;

  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, w, h);

  applyNoiseTexture(ctx, w, h, 0.1);

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const idx = (r * cols + c) % data.length;
      const d = data[idx];
      const x = c * cellW + cellW / 2;
      const y = r * cellH + cellH / 2;

      const colorIdx = Math.floor((idx + time * 2) % settings.palette.length);
      const color = settings.palette[colorIdx];
      
      const sizeVal = settings.mapping.size ? Number(d[settings.mapping.size]) || 0.5 : 0.5;
      const noise = Math.sin(c * 0.4 + r * 0.4 + time) * settings.randomness;
      const radius = (cellW * 0.35) * (sizeVal + noise + 0.5);

      ctx.save();
      ctx.translate(x, y);

      // Draw connections (horizontal/vertical bars) - inspired by the image
      if (idx % 4 === 0) {
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.6;
        const barW = cellW * 1.8;
        const barH = radius * 0.5;
        ctx.fillRect(-barW / 2, -barH / 2, barW, barH);
      }
      if (idx % 7 === 0) {
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.6;
        const barW = radius * 0.5;
        const barH = cellH * 1.8;
        ctx.fillRect(-barW / 2, -barH / 2, barW, barH);
      }

      // Draw dots/shapes
      ctx.globalAlpha = 0.9;
      ctx.fillStyle = color;
      
      const shapeType = idx % 5;
      if (shapeType === 0 || shapeType === 1) {
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.fill();
      } else if (shapeType === 2) {
        ctx.strokeStyle = color;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(0, 0, radius * 0.8, 0, Math.PI * 2);
        ctx.stroke();
      } else if (shapeType === 3) {
        const s = radius * 1.6;
        ctx.fillRect(-s / 2, -s / 2, s, s);
      } else {
        // Small dense grid in cell
        const s = radius * 0.4;
        for(let i=-1; i<=1; i++) {
          for(let j=-1; j<=1; j++) {
            ctx.fillRect(i*s*1.2 - s/2, j*s*1.2 - s/2, s, s);
          }
        }
      }

      // Small accent dots
      if (idx % 3 === 0) {
        ctx.fillStyle = '#fff';
        ctx.globalAlpha = 0.4;
        ctx.beginPath();
        ctx.arc(radius * 0.4, -radius * 0.4, 3, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }
  }
}
