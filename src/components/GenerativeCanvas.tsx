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
      } else if (style === 'noise-landscape') {
        renderNoise(ctx, canvas.width, canvas.height, data, settings);
      } else if (style === 'translucent-discs') {
        renderTranslucentDiscs(ctx, canvas.width, canvas.height, data, settings);
      } else if (style === 'organic-mandalas') {
        renderOrganicMandalas(ctx, canvas.width, canvas.height, data, settings);
      } else if (style === 'connected-grid') {
        renderConnectedGrid(ctx, canvas.width, canvas.height, data, settings);
      } else if (style === 'abstract-score') {
        renderAbstractScore(ctx, canvas.width, canvas.height, data, settings);
      } else if (style === 'flowing-bars') {
        renderFlowingBars(ctx, canvas.width, canvas.height, data, settings);
      } else if (style === 'glitch-topography') {
        renderGlitchTopography(ctx, canvas.width, canvas.height, data, settings);
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

function renderOrganicMandalas(ctx: CanvasRenderingContext2D, w: number, h: number, data: DataPoint[], settings: ArtSettings) {
  const time = Date.now() * 0.0002 * settings.speed;
  const count = Math.min(data.length, 8);
  
  applyNoiseTexture(ctx, w, h, 0.03);

  data.slice(0, count).forEach((d, i) => {
    const cx = (0.1 + 0.8 * (i / count)) * w;
    const cy = (0.25 + 0.5 * Math.cos(time * 0.7 + i)) * h;
    const baseRadius = 120 * settings.density;
    
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(time * (i % 2 === 0 ? 1 : -1) * 3);

    // Multiple layers of rotation and complex geometry
    for (let layer = 0; layer < 4; layer++) {
      ctx.save();
      ctx.rotate(time * layer * 0.8 + (i * 0.5));
      const layerColor = settings.palette[(i + layer) % settings.palette.length];
      
      const petals = 6 + layer * 6;
      for (let j = 0; j < petals; j++) {
        ctx.rotate((Math.PI * 2) / petals);
        ctx.strokeStyle = layerColor;
        ctx.globalAlpha = 0.4 - layer * 0.08;
        ctx.lineWidth = 1.2 - layer * 0.2;
        
        // Intricate petal shape
        ctx.beginPath();
        ctx.moveTo(0, 0);
        const pLen = 70 * (1 - layer * 0.18);
        ctx.bezierCurveTo(25, -40, 50, -40, pLen, 0);
        ctx.bezierCurveTo(50, 40, 25, 40, 0, 0);
        ctx.stroke();
        
        // Inner detail lines
        if (layer < 2) {
          ctx.beginPath();
          ctx.moveTo(10, 0);
          ctx.lineTo(pLen - 10, 0);
          ctx.stroke();
        }
      }
      ctx.restore();
    }
    
    // Concentric growth rings with dash pattern
    ctx.globalAlpha = 0.08;
    ctx.strokeStyle = '#000';
    ctx.setLineDash([2, 4]);
    for (let r = 1; r < 6; r++) {
      ctx.beginPath();
      ctx.arc(0, 0, baseRadius * r * 0.25, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.setLineDash([]);
    
    ctx.restore();
  });
}

function renderConnectedGrid(ctx: CanvasRenderingContext2D, w: number, h: number, data: DataPoint[], settings: ArtSettings) {
  const time = Date.now() * 0.0008 * settings.speed;
  const cols = 15;
  const rows = 15;
  const cellW = w / cols;
  const cellH = h / rows;

  applyNoiseTexture(ctx, w, h, 0.02);

  // Background grid with subtle variation
  ctx.strokeStyle = '#e8e8e8';
  ctx.lineWidth = 0.4;
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
      const active = noise > 0.15;
      const radius = active ? 14 * (1 + noise) : 2.5;
      
      if (active) {
        const color = settings.palette[idx % settings.palette.length];
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.75;
        
        // Draw organic "bridge" to neighbors (Metaball-like)
        const neighbors = [[1, 0], [0, 1], [1, 1]];
        neighbors.forEach(([dc, dr]) => {
          const nc = c + dc;
          const nr = r + dr;
          if (nc < cols && nr < rows) {
            const nNoise = Math.sin(nc * 0.5 + nr * 0.5 + time * 1.2);
            if (nNoise > 0.15) {
              const nx = nc * cellW + cellW / 2;
              const ny = nr * cellH + cellH / 2;
              
              ctx.beginPath();
              ctx.moveTo(x, y);
              const bridgeW = radius * 0.5;
              ctx.lineWidth = bridgeW;
              ctx.strokeStyle = color;
              ctx.globalAlpha = 0.25;
              ctx.lineTo(nx, ny);
              ctx.stroke();
            }
          }
        });

        // Node center with inner glow
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#fff';
        ctx.globalAlpha = 0.3;
        ctx.beginPath();
        ctx.arc(x, y, radius * 0.5, 0, Math.PI * 2);
        ctx.fill();
        
        // Technical crosshair
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 0.8;
        ctx.globalAlpha = 0.6;
        ctx.beginPath();
        ctx.moveTo(x - radius, y); ctx.lineTo(x + radius, y);
        ctx.moveTo(x, y - radius); ctx.lineTo(x, y + radius);
        ctx.stroke();
      } else {
        ctx.fillStyle = '#bbb';
        ctx.globalAlpha = 0.15;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
}

function renderAbstractScore(ctx: CanvasRenderingContext2D, w: number, h: number, data: DataPoint[], settings: ArtSettings) {
  const time = Date.now() * 0.0004 * settings.speed;
  const lineCount = 12;
  const spacing = h / (lineCount + 2);
  const margin = 100;

  applyNoiseTexture(ctx, w, h, 0.04);

  // Draw horizontal lines (staves) with subtle variation
  ctx.strokeStyle = '#bbb';
  ctx.lineWidth = 0.6;
  for (let i = 1; i <= lineCount; i++) {
    const y = i * spacing + spacing;
    ctx.beginPath();
    ctx.moveTo(margin, y);
    ctx.lineTo(w - margin, y);
    ctx.stroke();
    
    // Secondary lines for "musical" feel
    ctx.globalAlpha = 0.15;
    ctx.beginPath();
    ctx.moveTo(margin, y - 5);
    ctx.lineTo(w - margin, y - 5);
    ctx.stroke();
    ctx.globalAlpha = 1;
  }

  // Draw musical-like elements with more complexity
  data.slice(0, 150).forEach((d, i) => {
    const lineIdx = (i % lineCount) + 1;
    const x = (i * 25 + time * 70) % (w - margin * 2) + margin;
    const y = lineIdx * spacing + spacing;
    
    const color = settings.palette[i % settings.palette.length];
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    
    const type = i % 8;
    
    if (type === 0) {
      // "Clef" like symbol
      ctx.font = 'italic 28px serif';
      ctx.globalAlpha = 0.5;
      ctx.fillText('∮', x, y + 12);
    } else if (type === 1) {
      // Vertical bar with flag and data dot
      ctx.fillRect(x, y - 25, 2, 50);
      ctx.beginPath();
      ctx.arc(x, y + 25, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(x, y - 25);
      ctx.bezierCurveTo(x + 20, y - 20, x + 15, y - 10, x + 5, y - 5);
      ctx.stroke();
    } else if (type === 2) {
      // Grouped notes with thick beam
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.arc(x + 20, y - 12, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + 20, y - 12);
      ctx.stroke();
    } else if (type === 3) {
      // "Rest" symbol
      ctx.font = '20px serif';
      ctx.fillText('≀', x, y + 8);
    } else if (type === 4) {
      // Dynamic marking
      ctx.font = 'italic bold 10px serif';
      ctx.fillText('pp', x, y + 20);
    } else {
      // Floating data dots with connection
      ctx.globalAlpha = 0.25;
      const dy = Math.sin(time + i) * 25;
      ctx.beginPath();
      ctx.arc(x, y + dy, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x, y + dy);
      ctx.stroke();
    }
  });
}

function renderFlowingBars(ctx: CanvasRenderingContext2D, w: number, h: number, data: DataPoint[], settings: ArtSettings) {
  const time = Date.now() * 0.0008 * settings.speed;
  const count = 350;
  
  applyNoiseTexture(ctx, w, h, 0.02);
  
  // Ghosting effect for trails
  ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
  ctx.fillRect(0, 0, w, h);

  for (let i = 0; i < count; i++) {
    const d = data[i % data.length];
    const progress = (i / count);
    const x = progress * w;
    
    // Multi-wave motion
    const wave1 = Math.sin(progress * 5 + time) * 100;
    const wave2 = Math.cos(progress * 10 - time * 0.6) * 50;
    const wave3 = Math.sin(time * 0.2 + i * 0.05) * 20;
    const baseY = h / 2 + wave1 + wave2 + wave3;
    
    const sizeVal = settings.mapping.size ? Number(d[settings.mapping.size]) || 1 : 1;
    const barW = (2.5 + settings.randomness * 8) * sizeVal;
    const barH = (15 + sizeVal * 40) * (1 + Math.sin(time * 1.5 + i * 0.15) * 0.6);
    
    ctx.save();
    ctx.translate(x, baseY);
    ctx.rotate(Math.sin(progress * 15 + time) * 1.1);
    
    const color = settings.palette[i % settings.palette.length];
    ctx.fillStyle = color;
    ctx.globalAlpha = 0.7;
    
    // Draw bar with shadow and highlight
    ctx.shadowBlur = 8;
    ctx.shadowColor = color;
    ctx.fillRect(-barW/2, -barH/2, barW, barH);
    
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#fff';
    ctx.globalAlpha = 0.4;
    ctx.fillRect(-barW/2, -barH/2, barW/2, 3);
    
    // Bottom accent
    ctx.fillStyle = '#000';
    ctx.globalAlpha = 0.2;
    ctx.fillRect(-barW/2, barH/2 - 3, barW, 3);
    
    ctx.restore();
  }
}

function renderGlitchTopography(ctx: CanvasRenderingContext2D, w: number, h: number, data: DataPoint[], settings: ArtSettings) {
  const time = Date.now() * 0.0005 * settings.speed;
  const rows = 40;
  const cols = 40;
  const cellW = w / cols;
  const cellH = h / rows;

  applyNoiseTexture(ctx, w, h, 0.05);

  ctx.save();
  ctx.translate(w / 2, h / 2);
  ctx.rotate(Math.PI / 6); // Perspective tilt
  ctx.translate(-w / 2, -h / 2);

  for (let r = 0; r < rows; r++) {
    ctx.beginPath();
    ctx.strokeStyle = settings.palette[r % settings.palette.length];
    ctx.lineWidth = 0.8;
    ctx.globalAlpha = 0.3;

    for (let c = 0; c < cols; c++) {
      const idx = (r * cols + c) % data.length;
      const d = data[idx];
      const val = settings.mapping.size ? Number(d[settings.mapping.size]) || 0.5 : 0.5;
      
      const x = c * cellW;
      const noise = Math.sin(c * 0.2 + time) * Math.cos(r * 0.2 - time) * 50 * settings.randomness;
      const glitch = Math.random() < 0.01 * settings.randomness ? (Math.random() - 0.5) * 100 : 0;
      
      const y = r * cellH + (val * -100) + noise + glitch;

      if (c === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);

      // Occasional vertical "glitch" lines
      if (Math.random() < 0.005 * settings.randomness) {
        ctx.save();
        ctx.globalAlpha = 0.1;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, y + 200);
        ctx.stroke();
        ctx.restore();
      }
    }
    ctx.stroke();
  }

  // Draw some floating "data bits"
  for (let i = 0; i < 10; i++) {
    const x = Math.random() * w;
    const y = Math.random() * h;
    ctx.fillStyle = settings.palette[i % settings.palette.length];
    ctx.globalAlpha = 0.4;
    ctx.font = '8px monospace';
    ctx.fillText(Math.random().toString(16).substring(2, 8).toUpperCase(), x, y);
  }

  ctx.restore();
}
