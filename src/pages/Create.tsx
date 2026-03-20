import React, { useState, useCallback } from 'react';
import { motion } from 'motion/react';
import { Upload, FileText, Settings, Download, Play, RefreshCw, Layers, Palette, Sliders } from 'lucide-react';
import { ArtStyle, ArtSettings, DataPoint } from '../types';
import { PALETTES } from '../constants';
import { cn } from '../utils/cn';
import GenerativeCanvas from '../components/GenerativeCanvas';
import * as d3 from 'd3';

const DEFAULT_SETTINGS: ArtSettings = {
  palette: PALETTES[1].colors,
  density: 0.5,
  speed: 1,
  randomness: 0.5,
  mapping: {
    size: '',
    color: '',
    motion: '',
  }
};

const SAMPLE_DATA: DataPoint[] = Array.from({ length: 100 }, (_, i) => ({
  id: i,
  value: Math.random() * 100,
  intensity: Math.random(),
  category: Math.random() > 0.5 ? 'A' : 'B'
}));

export default function Create() {
  const [data, setData] = useState<DataPoint[]>(SAMPLE_DATA);
  const [style, setStyle] = useState<ArtStyle>('data-grid-composition');
  const [settings, setSettings] = useState<ArtSettings>(DEFAULT_SETTINGS);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [dataKeys, setDataKeys] = useState<string[]>(Object.keys(SAMPLE_DATA[0]));

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      try {
        if (file.name.endsWith('.json')) {
          const parsed = JSON.parse(content);
          const dataArray = Array.isArray(parsed) ? parsed : [parsed];
          setData(dataArray);
          setDataKeys(Object.keys(dataArray[0]));
        } else {
          const parsed = d3.csvParse(content);
          setData(parsed);
          setDataKeys(parsed.columns);
        }
      } catch (err) {
        alert('Failed to parse data. Please check format.');
      }
    };
    reader.readAsText(file);
  };

  const downloadCanvas = () => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `dataloom-artifact-${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 min-h-[800px] h-full w-full">
      {/* Sidebar Controls */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? 'auto' : '4rem' }}
        className="lg:w-96 flex flex-col gap-6 shrink-0"
      >
        <div className="brutalist-border bg-white p-6 space-y-8 overflow-y-auto max-h-[80vh] lg:max-h-none">
          {/* Data Input */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest opacity-40">
              <FileText size={14} /> Data Source
            </div>
            <div className="relative">
              <input 
                type="file" 
                accept=".csv,.json"
                onChange={handleFileUpload}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <div className="brutalist-border border-dashed p-4 text-center hover:bg-ink/5 transition-colors">
                <Upload className="mx-auto mb-2 opacity-40" size={20} />
                <p className="text-[10px] font-bold uppercase tracking-widest">Upload CSV / JSON</p>
              </div>
            </div>
            <div className="text-[9px] opacity-40 flex justify-between">
              <span>{data.length} points loaded</span>
              <button onClick={() => setData(SAMPLE_DATA)} className="hover:underline">Reset to Sample</button>
            </div>
          </section>

          {/* Style Selection */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest opacity-40">
              <Layers size={14} /> Visual Style
            </div>
            <div className="grid grid-cols-1 gap-2">
              {(['structural-dots', 'data-grid-composition', 'radial-pathway', 'shape-overlap', 'connected-grid', 'flow-field', 'particle-system', 'geometric-grid', 'organic-blob', 'noise-landscape', 'translucent-discs'] as ArtStyle[]).map(s => (
                <button
                  key={s}
                  onClick={() => setStyle(s)}
                  className={cn(
                    "text-left px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-all",
                    style === s ? "bg-ink text-white" : "hover:bg-ink/5 border border-ink/10"
                  )}
                >
                  {s.replace('-', ' ')}
                </button>
              ))}
            </div>
          </section>

          {/* Parameters */}
          <section className="space-y-6">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest opacity-40">
              <Sliders size={14} /> Parameters
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                  <span>Density</span>
                  <span>{Math.round(settings.density * 100)}%</span>
                </div>
                <input 
                  type="range" min="0.1" max="1" step="0.05" 
                  value={settings.density}
                  onChange={e => setSettings({...settings, density: parseFloat(e.target.value)})}
                  className="w-full accent-accent"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                  <span>Speed</span>
                  <span>{settings.speed}x</span>
                </div>
                <input 
                  type="range" min="0" max="5" step="0.1" 
                  value={settings.speed}
                  onChange={e => setSettings({...settings, speed: parseFloat(e.target.value)})}
                  className="w-full accent-accent"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                  <span>Randomness</span>
                  <span>{Math.round(settings.randomness * 100)}%</span>
                </div>
                <input 
                  type="range" min="0" max="1" step="0.05" 
                  value={settings.randomness}
                  onChange={e => setSettings({...settings, randomness: parseFloat(e.target.value)})}
                  className="w-full accent-accent"
                />
              </div>
            </div>
          </section>

          {/* Palette */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest opacity-40">
              <Palette size={14} /> Palette
            </div>
            <div className="flex flex-wrap gap-2">
              {PALETTES.map(p => (
                <button
                  key={p.name}
                  onClick={() => setSettings({...settings, palette: p.colors})}
                  className={cn(
                    "w-8 h-8 rounded-full border border-ink/10 overflow-hidden flex",
                    settings.palette === p.colors ? "ring-2 ring-accent ring-offset-2" : ""
                  )}
                  title={p.name}
                >
                  {p.colors.slice(0, 2).map(c => (
                    <div key={c} className="flex-1" style={{ backgroundColor: c }} />
                  ))}
                </button>
              ))}
            </div>
          </section>

          {/* Mapping */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest opacity-40">
              <Settings size={14} /> Data Mapping
            </div>
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-[9px] font-bold uppercase opacity-40">Size Property</label>
                <select 
                  value={settings.mapping.size}
                  onChange={e => setSettings({...settings, mapping: {...settings.mapping, size: e.target.value}})}
                  className="w-full text-[10px] p-2 brutalist-border bg-white"
                >
                  <option value="">None</option>
                  {dataKeys.map(k => <option key={k} value={k}>{k}</option>)}
                </select>
              </div>
            </div>
          </section>
        </div>
      </motion.aside>

      {/* Canvas Area */}
      <div className="flex-1 flex flex-col gap-6">
        <div className="flex-1 brutalist-border bg-white relative overflow-hidden min-h-[500px]">
          <GenerativeCanvas 
            data={data} 
            style={style} 
            settings={settings} 
            className="w-full h-full"
          />
          
          <div className="absolute top-6 left-6 flex items-center gap-3">
            <div className="px-3 py-1 bg-ink text-white text-[10px] font-bold uppercase tracking-widest">
              Live Preview
            </div>
            <div className="px-3 py-1 bg-white brutalist-border text-[10px] font-bold uppercase tracking-widest">
              {style.replace('-', ' ')}
            </div>
          </div>

          <div className="absolute bottom-6 right-6 flex gap-3">
            <button 
              onClick={() => setSettings({...settings, randomness: Math.random()})}
              className="p-3 bg-white brutalist-border hover:bg-ink hover:text-white transition-colors"
              title="Randomize"
            >
              <RefreshCw size={20} />
            </button>
            <button 
              onClick={downloadCanvas}
              className="p-3 bg-accent text-white brutalist-border hover:scale-105 transition-transform"
              title="Export PNG"
            >
              <Download size={20} />
            </button>
          </div>
        </div>

        {/* Data Preview */}
        <div className="brutalist-border bg-white p-6 h-48 overflow-auto">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-xs font-bold uppercase tracking-widest opacity-40">Data Stream</h4>
            <span className="text-[9px] opacity-40">{data.length} rows</span>
          </div>
          <table className="w-full text-[10px] font-mono">
            <thead>
              <tr className="text-left border-b border-ink/10">
                {dataKeys.slice(0, 5).map(k => <th key={k} className="pb-2 pr-4 opacity-40">{k}</th>)}
              </tr>
            </thead>
            <tbody>
              {data.slice(0, 10).map((d, i) => (
                <tr key={i} className="border-b border-ink/5 last:border-0">
                  {dataKeys.slice(0, 5).map(k => <td key={k} className="py-2 pr-4">{String(d[k])}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
