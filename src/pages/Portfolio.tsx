import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MOCK_PORTFOLIO } from '../constants';
import { Artwork, ArtStyle } from '../types';
import { X, Maximize2, Tag, Search, Filter, ChevronDown } from 'lucide-react';
import { cn } from '@/src/utils/cn';

export default function Portfolio() {
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [visibleCount, setVisibleCount] = useState(9);

  const styles = ['all', 'structural-dots', 'data-grid-composition', 'radial-pathway', 'shape-overlap', 'connected-grid', 'flow-field', 'particle-system', 'geometric-grid', 'organic-blob', 'noise-landscape', 'translucent-discs'];

  const filteredArtworks = useMemo(() => {
    return MOCK_PORTFOLIO.filter(art => {
      const matchesSearch = art.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           art.tags.some((t: string) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesFilter = activeFilter === 'all' || art.style === activeFilter;
      return matchesSearch && matchesFilter;
    });
  }, [searchQuery, activeFilter]);

  const visibleArtworks = filteredArtworks.slice(0, visibleCount);

  return (
    <div className="space-y-16">
      <header className="max-w-2xl">
        <h1 className="text-6xl font-black uppercase tracking-tighter mb-6">Archive</h1>
        <p className="text-lg opacity-60">
          A curated collection of digital artifacts generated from diverse datasets. 
          Each piece represents a unique intersection of logic and expression.
        </p>
      </header>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center py-8 border-y border-ink/10">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" size={18} />
          <input 
            type="text"
            placeholder="Search artifacts or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 brutalist-border bg-white text-sm focus:outline-none focus:ring-2 ring-accent/20"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {styles.map(style => (
            <button
              key={style}
              onClick={() => setActiveFilter(style)}
              className={cn(
                "px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-all",
                activeFilter === style ? "bg-ink text-white" : "hover:bg-ink/5 border border-ink/10"
              )}
            >
              {style.replace('-', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {visibleArtworks.map((art, index) => (
            <motion.div
              key={art.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="group cursor-pointer"
              onClick={() => setSelectedArtwork(art)}
            >
              <div className="aspect-square brutalist-border bg-white relative overflow-hidden mb-4">
                {art.thumbnail ? (
                  <img 
                    src={art.thumbnail} 
                    alt={art.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center opacity-10 group-hover:opacity-20 transition-opacity">
                    <div className="w-full h-full bg-gradient-to-br from-accent to-ink rotate-45 scale-150" />
                  </div>
                )}
                
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-ink/5 backdrop-blur-sm">
                  <Maximize2 className="text-ink" size={32} />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-black uppercase tracking-tight group-hover:text-accent transition-colors">{art.title}</h3>
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
        </AnimatePresence>
      </div>

      {/* Load More */}
      {visibleCount < filteredArtworks.length && (
        <div className="flex justify-center pt-12">
          <button 
            onClick={() => setVisibleCount(prev => prev + 6)}
            className="brutalist-button flex items-center gap-2"
          >
            See More <ChevronDown size={18} />
          </button>
        </div>
      )}

      {/* Empty State */}
      {filteredArtworks.length === 0 && (
        <div className="py-20 text-center space-y-4">
          <p className="text-2xl font-display italic opacity-40">No artifacts found matching your criteria.</p>
          <button onClick={() => { setSearchQuery(''); setActiveFilter('all'); }} className="text-accent font-bold uppercase tracking-widest text-xs hover:underline">
            Clear all filters
          </button>
        </div>
      )}

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
                {selectedArtwork.thumbnail ? (
                  <img 
                    src={selectedArtwork.thumbnail} 
                    alt={selectedArtwork.title} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-ink/20 animate-pulse" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <p className="text-xs uppercase tracking-[0.5em] font-bold opacity-20 italic">Visualizing {selectedArtwork.title}...</p>
                    </div>
                  </>
                )}
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

