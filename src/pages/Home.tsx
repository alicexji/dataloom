import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Play, Layers, Zap } from 'lucide-react';
import HeroCanvas from '../components/HeroCanvas';

interface HomeProps {
  onNavigate: (page: string) => void;
}

export default function Home({ onNavigate }: HomeProps) {
  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="min-h-[80vh] flex flex-col justify-center relative overflow-hidden -mx-6 md:-mx-12 px-6 md:px-12">
        <HeroCanvas className="absolute inset-0 -z-10 opacity-40" />
        
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="text-7xl md:text-[10rem] font-black uppercase leading-[0.85] tracking-tighter mb-8">
              Transform <br />
              <span className="text-accent italic">Data</span> Into <br />
              Art
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-xl md:text-2xl max-w-xl mb-12 opacity-70 leading-relaxed"
          >
            Turn everyday datasets into expressive, living visualizations. 
            Aether bridges the gap between raw information and avant-garde aesthetics.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap gap-6"
          >
            <button 
              onClick={() => onNavigate('create')}
              className="brutalist-button flex items-center gap-3"
            >
              Create Artwork <ArrowRight size={20} />
            </button>
            <button 
              onClick={() => onNavigate('portfolio')}
              className="px-6 py-3 font-display font-bold uppercase tracking-wider border-2 border-transparent hover:border-ink transition-all"
            >
              View Portfolio
            </button>
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-32 grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-ink/10 mt-20">
        <div className="space-y-6">
          <div className="w-12 h-12 brutalist-border flex items-center justify-center bg-accent text-white">
            <Layers size={24} />
          </div>
          <h3 className="text-2xl font-black uppercase tracking-tight">01. Upload Data</h3>
          <p className="opacity-60 leading-relaxed">
            Import CSV, JSON, or paste raw text. Our engine parses complex structures into visual coordinates.
          </p>
        </div>

        <div className="space-y-6">
          <div className="w-12 h-12 brutalist-border flex items-center justify-center bg-white">
            <Play size={24} />
          </div>
          <h3 className="text-2xl font-black uppercase tracking-tight">02. Choose Style</h3>
          <p className="opacity-60 leading-relaxed">
            Select from flow fields, particle systems, or organic blobs. Each style interprets data through a unique lens.
          </p>
        </div>

        <div className="space-y-6">
          <div className="w-12 h-12 brutalist-border flex items-center justify-center bg-ink text-white">
            <Zap size={24} />
          </div>
          <h3 className="text-2xl font-black uppercase tracking-tight">03. Generate Art</h3>
          <p className="opacity-60 leading-relaxed">
            Tweak parameters in real-time. Export your high-resolution creation as a digital artifact.
          </p>
        </div>
      </section>

      {/* Featured Quote */}
      <section className="py-32 text-center max-w-3xl mx-auto">
        <h2 className="text-4xl md:text-6xl font-display italic font-light leading-tight">
          "Data is the new paint; <br />
          algorithms are the new brush."
        </h2>
        <p className="mt-8 text-xs uppercase tracking-[0.3em] font-bold opacity-30">— Aether Manifesto</p>
      </section>
    </div>
  );
}
