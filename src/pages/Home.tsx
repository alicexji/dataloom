import React from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowRight, Play, Layers, Zap, Eye, Database, Code } from 'lucide-react';
import HeroCanvas from '../components/HeroCanvas';
import { MOCK_PORTFOLIO } from '../constants';

interface HomeProps {
  onNavigate: (page: string) => void;
}

export default function Home({ onNavigate }: HomeProps) {
  const { scrollYProgress } = useScroll();
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  const featuredWorks = MOCK_PORTFOLIO.slice(0, 6);

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="min-h-screen flex flex-col justify-center relative overflow-hidden -mx-6 md:-mx-12 px-6 md:px-12">
        <HeroCanvas className="absolute inset-0 -z-10 opacity-70" />
        
        {/* Subtle data stream background */}
        <div className="absolute inset-0 -z-20 opacity-[0.03] pointer-events-none select-none overflow-hidden flex flex-col justify-around">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="whitespace-nowrap text-[10px] font-mono tracking-[1em] animate-marquee">
              {Array(20).fill('01011010010110100101101001011010').join(' ')}
            </div>
          ))}
        </div>

        <motion.div 
          style={{ opacity }}
          className="max-w-7xl mx-auto w-full"
        >
          <motion.div
            initial={{ opacity: 0, y: 100, rotateX: 45 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="perspective-1000"
          >
            <h1 className="text-[12vw] md:text-[18vw] font-black uppercase leading-[0.75] tracking-tighter mb-16 select-none">
              Data <br />
              <span className="text-accent italic relative">
                Loom
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ delay: 1, duration: 1.5, ease: "circOut" }}
                  className="absolute -bottom-4 left-0 h-4 bg-ink/10 -z-10"
                />
              </span>
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col md:flex-row gap-16 items-start md:items-end justify-between"
          >
            <div className="space-y-8">
              <p className="text-2xl md:text-4xl max-w-2xl opacity-90 leading-[1.1] font-display font-medium">
                The intersection of raw information and avant-garde aesthetics. 
                We weave datasets into living digital artifacts.
              </p>
              <div className="flex gap-4">
                <span className="px-3 py-1 bg-ink text-white text-[10px] font-bold uppercase tracking-widest">v2.0.0</span>
                <span className="px-3 py-1 border border-ink/20 text-[10px] font-bold uppercase tracking-widest">Generative Engine</span>
              </div>
            </div>
            
            <div className="flex flex-col gap-8 items-start md:items-end">
              <button 
                onClick={() => onNavigate('create')}
                className="brutalist-button flex items-center gap-4 group text-xl px-10 py-6"
              >
                Start Weaving <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
              </button>
              <p className="text-[10px] uppercase tracking-[0.3em] font-bold opacity-40 text-right">
                Interactive Canvas <br /> Powered by Gemini
              </p>
            </div>
          </motion.div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
        >
          <span className="text-[10px] uppercase tracking-[0.5em] font-bold">Scroll to Explore</span>
          <div className="w-px h-12 bg-ink animate-bounce" />
        </motion.div>
      </section>

      {/* Parallax Content Section */}
      <section className="py-40 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-24 items-center">
          <motion.div style={{ y: y1 }} className="space-y-12">
            <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none">
              Logic <br /> Meets <br /> <span className="text-accent">Chaos</span>
            </h2>
            <p className="text-xl opacity-60 leading-relaxed max-w-md">
              Our engine uses mathematical flow fields and noise algorithms to interpret your data. 
              What was once a spreadsheet becomes a symphony of motion and color.
            </p>
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-2">
                <span className="text-4xl font-display font-bold">100%</span>
                <p className="text-[10px] uppercase font-bold opacity-40">Deterministic</p>
              </div>
              <div className="space-y-2">
                <span className="text-4xl font-display font-bold">∞</span>
                <p className="text-[10px] uppercase font-bold opacity-40">Possibilities</p>
              </div>
            </div>
          </motion.div>

          <motion.div style={{ y: y2 }} className="aspect-[3/4] brutalist-border bg-ink relative overflow-hidden group cursor-crosshair">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/40 to-transparent opacity-50 group-hover:opacity-80 transition-opacity" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Code size={120} className="text-white/10 group-hover:scale-110 transition-transform duration-700" />
            </div>
            <div className="absolute bottom-8 left-8 text-white">
              <p className="text-xs uppercase tracking-widest font-bold mb-2">Algorithm v4.2</p>
              <h4 className="text-2xl font-black uppercase">Recursive Flow</h4>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Works */}
      <section className="py-40 border-t border-ink/10">
        <div className="flex justify-between items-end mb-20">
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-accent">Gallery</span>
            <h2 className="text-6xl font-black uppercase tracking-tighter">Featured Artifacts</h2>
          </div>
          <button 
            onClick={() => onNavigate('portfolio')}
            className="text-xs font-bold uppercase tracking-widest border-b-2 border-ink pb-2 hover:text-accent hover:border-accent transition-colors"
          >
            View Full Archive
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {featuredWorks.map((art, index) => (
            <motion.div
              key={art.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative"
            >
              <div className="aspect-square brutalist-border bg-white overflow-hidden mb-6 relative">
                <div className="absolute inset-0 bg-ink/5 group-hover:bg-accent/10 transition-colors" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => onNavigate('portfolio')}
                    className="w-16 h-16 rounded-full bg-ink text-white flex items-center justify-center hover:scale-110 transition-transform"
                  >
                    <Eye size={24} />
                  </button>
                </div>
              </div>
              <h3 className="text-2xl font-black uppercase tracking-tight group-hover:text-accent transition-colors">{art.title}</h3>
              <p className="text-sm opacity-50 mt-2">{art.style.replace('-', ' ')}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Interactive CTA */}
      <section className="py-40 text-center relative overflow-hidden -mx-6 md:-mx-12 px-6 md:px-12 bg-ink text-white">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <HeroCanvas />
        </div>
        <div className="relative z-10 space-y-12">
          <h2 className="text-7xl md:text-9xl font-black uppercase tracking-tighter leading-none">
            Ready to <br /> <span className="italic text-accent">Loom?</span>
          </h2>
          <p className="text-xl opacity-60 max-w-xl mx-auto">
            Join the collective of creative coders and data artists. 
            Start your first visualization today.
          </p>
          <button 
            onClick={() => onNavigate('create')}
            className="brutalist-button bg-accent border-white text-white hover:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]"
          >
            Launch Creator
          </button>
        </div>
      </section>
    </div>
  );
}

