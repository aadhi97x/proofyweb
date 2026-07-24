
import React from 'react';
import { View } from '../types.ts';
import Logo from './Logo.tsx';
import { motion, AnimatePresence } from 'framer-motion';

interface SidebarProps {
  currentView: View;
  onNavigate: (view: View) => void;
  onReset: () => void;
  expanded: boolean;
  onToggle: () => void;
  privacyMode?: boolean;
  setPrivacyMode?: (m: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate, onReset, expanded, onToggle, privacyMode, setPrivacyMode }) => {
  const items = [
    { view: View.HOME, label: 'Home', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3' },
    { view: View.BATCH_TRIAGE, label: 'Check Many Files', icon: 'M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25' },
    { view: View.REVERSE_GROUNDING, label: 'Source Finder', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' },
    { view: View.TEXT_LAB, label: 'Check Text', icon: 'M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18c-2.305 0-4.408.867-6 2.292m0-14.25v14.25' },
    { view: View.AUDIO_LAB, label: 'Audio Analysis', icon: 'M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z M19 10v2a7 7 0 0 1-14 0v-2 M12 19v4 M8 23h8' },
    { view: View.HISTORY, label: 'Your History', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
  ];

  return (
    <>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60]"
            onClick={onToggle}
          />
        )}
      </AnimatePresence>

      <aside
        className={`fixed left-0 top-0 h-screen glass border-r border-white/5 flex flex-col p-12 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] z-[300] ${expanded ? 'w-[360px] translate-x-0' : 'w-[360px] -translate-x-full'
          }`}
      >
        <div className="mb-20">
          <Logo size="md" onClick={() => { onReset(); onToggle(); }} />
          <div className="flex items-center gap-2 mt-4 ml-1">
            <div className="w-1.5 h-1.5 rounded-full bg-neon animate-pulse"></div>
            <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.4em]">System Status: Online</p>
          </div>
        </div>

        <nav className="flex-grow space-y-3 overflow-y-auto no-scrollbar">
          {items.map((item, idx) => (
            <motion.button
              key={item.view}
              initial={false}
              animate={{ x: expanded ? 0 : -20, opacity: expanded ? 1 : 0 }}
              transition={{ delay: idx * 0.05, duration: 0.5 }}
              onClick={() => { onNavigate(item.view); onToggle(); }}
              className={`w-full flex items-center gap-5 px-6 py-5 rounded-2xl transition-all duration-500 group relative overflow-hidden ${currentView === item.view
                ? 'bg-white/5 text-neon border border-white/10 shadow-[0_0_30px_rgba(0,255,156,0.05)]'
                : 'text-white/40 hover:text-white hover:bg-white/[0.02]'
                }`}
            >
              <div className={`shrink-0 transition-all duration-500 ${currentView === item.view ? 'text-neon scale-125' : 'group-hover:scale-110 group-hover:text-white'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                </svg>
              </div>
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] whitespace-nowrap">
                {item.label}
              </span>

              {currentView === item.view && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute right-6 w-1 h-3 bg-neon rounded-full"
                />
              )}

              <div className="absolute inset-0 bg-neon/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.button>
          ))}
        </nav>

        <div className="mt-auto pt-10 border-t border-white/5 space-y-6">
          <button
            onClick={() => { onReset(); onToggle(); }}
            className="w-full relative py-5 bg-neon text-charcoal font-black rounded-2xl text-[11px] uppercase tracking-[0.3em] overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(0,255,156,0.3)] active:scale-95"
          >
            <span className="relative z-10">Start Scanning</span>
            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-700" />
          </button>

          <button
            onClick={onToggle}
            className="w-full py-5 bg-white/5 border border-white/5 text-white/30 font-bold rounded-2xl text-[10px] uppercase tracking-[0.3em] hover:bg-white/10 transition-all hover:text-white"
          >
            Close Menu
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
