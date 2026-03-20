import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MOCK_PORTFOLIO } from '../constants';
import { Artwork } from '../types';
import { X, Maximize2, Tag } from 'lucide-react';

export default function Portfolio() {
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);

  return (
    <div className="space-y-16">
      <header className="max-w-2xl">
        <h1 className="text-6xl font-black uppercase tracking-tighter mb-6">Archive</h1>
        <p className="text-lg opacity-60">
          A curated collection of digital artifacts generated from diverse datasets. 
          Each piece represents a unique intersection of logic and expression.
        </p>
      </header>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {MOCK_PORTFOLIO.map((art, index) => (
          <motion.div
            key={art.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group cursor-pointer"
            onClick={() => setSelectedArtwork(art)}
          >
            <div className="aspect-square brutalist-border bg-white relative overflow-hidden mb-4">
              {/* Placeholder for actual generated art thumbnail */}
              <div className="absolute inset-0 flex items-center justify-center opacity-10 group-hover:opacity-20 transition-opacity">
                <div className="w-full h-full bg-gradient-to-br from-accent to-ink rotate-45 scale-150" />
              </div>
              
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-ink/5 backdrop-blur-sm">
                <Maximize2 className="text-ink" size={32} />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-black uppercase tracking-tight">{art.title}</h3>
                <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">{art.style.replace('-', ' ')}</span>
              </div>
              <p className="text-sm opacity-60 line-clamp-2">{art.description}</p>
              <div className="flex gap-2 pt-2">
                {art.tags.map((tag: string) => (
                  <span key={tag} className="text-[9px] uppercase font-bold tracking-widest px-2 py-1 bg-ink/5 rounded-full">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedArtwork && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-bg/95 backdrop-blur-xl p-6 md:p-12 flex items-center justify-center"
          >
            <button 
              onClick={() => setSelectedArtwork(null)}
              className="absolute top-8 right-8 p-2 hover:bg-ink/5 rounded-full transition-colors"
            >
              <X size={32} />
            </button>

            <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="aspect-square brutalist-border bg-white relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-ink/20 animate-pulse" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-xs uppercase tracking-[0.5em] font-bold opacity-20 italic">Visualizing {selectedArtwork.title}...</p>
                </div>
              </div>

              <div className="space-y-8">
                <div>
                  <span className="text-xs font-bold uppercase tracking-[0.3em] text-accent mb-4 block">Artifact #{selectedArtwork.id}</span>
                  <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none mb-6">
                    {selectedArtwork.title}
                  </h2>
                  <p className="text-xl opacity-70 leading-relaxed">
                    {selectedArtwork.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-8 py-8 border-y border-ink/10">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-40 block mb-2">Dataset</span>
                    <p className="font-display font-bold">{selectedArtwork.dataSummary}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-40 block mb-2">Style</span>
                    <p className="font-display font-bold uppercase">{selectedArtwork.style.replace('-', ' ')}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  {selectedArtwork.tags.map((tag: string) => (
                    <div key={tag} className="flex items-center gap-2 px-3 py-1.5 brutalist-border bg-white text-[10px] font-bold uppercase tracking-widest">
                      <Tag size={10} /> {tag}
                    </div>
                  ))}
                </div>

                <button className="brutalist-button w-full">
                  Download High-Res Artifact
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
