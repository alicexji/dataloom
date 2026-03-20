import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ArrowRight, Github, Instagram, Twitter } from 'lucide-react';
import { cn } from '@/src/utils/cn';

interface LayoutProps {
  children: React.ReactNode;
  activePage: string;
  onNavigate: (page: string) => void;
}

export default function Layout({ children, activePage, onNavigate }: LayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'create', label: 'Create' },
    { id: 'portfolio', label: 'Portfolio' },
  ];

  return (
    <div className="min-h-screen flex flex-col relative">
      <div className="grain-overlay" />
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-50 mix-blend-difference text-white px-6 py-8 md:px-12 flex justify-between items-center">
        <button 
          onClick={() => onNavigate('home')}
          className="font-display text-2xl font-black tracking-tighter uppercase"
        >
          Aether
        </button>

        <div className="hidden md:flex gap-12 items-center">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={cn(
                "text-xs uppercase tracking-[0.2em] font-bold transition-opacity hover:opacity-100",
                activePage === item.id ? "opacity-100" : "opacity-50"
              )}
            >
              {item.label}
            </button>
          ))}
        </div>

        <button 
          className="md:hidden"
          onClick={() => setIsMenuOpen(true)}
        >
          <Menu size={24} />
        </button>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[60] bg-ink text-white p-8 flex flex-col"
          >
            <div className="flex justify-end">
              <button onClick={() => setIsMenuOpen(false)}>
                <X size={32} />
              </button>
            </div>
            
            <div className="flex-1 flex flex-col justify-center gap-8">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    setIsMenuOpen(false);
                  }}
                  className="text-5xl font-display font-black uppercase tracking-tighter text-left"
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="flex gap-6 mt-auto">
              <Twitter size={20} />
              <Instagram size={20} />
              <Github size={20} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 pt-32 pb-20 px-6 md:px-12 max-w-7xl mx-auto w-full">
        {children}
      </main>

      {/* Footer */}
      <footer className="px-6 md:px-12 py-12 border-t border-ink/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div className="max-w-xs">
          <p className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-30 mb-4">Aether Lab v1.0</p>
          <p className="text-sm leading-relaxed opacity-60">
            Exploring the intersection of raw data and generative aesthetics. 
            Built for the avant-garde.
          </p>
        </div>
        
        <div className="flex gap-8">
          <div className="flex flex-col gap-2">
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-30">Social</span>
            <a href="#" className="text-sm hover:underline">Instagram</a>
            <a href="#" className="text-sm hover:underline">Twitter</a>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-30">Legal</span>
            <a href="#" className="text-sm hover:underline">Privacy</a>
            <a href="#" className="text-sm hover:underline">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
