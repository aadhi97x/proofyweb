import React from 'react';
import { AnalysisResult } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Info, ShieldAlert, Zap, Search } from 'lucide-react';

const AnalysisTimeline: React.FC<{ result: AnalysisResult }> = ({ result }) => {
  const timestamps = result.explanations.filter(e => e.timestamp);

  if (timestamps.length === 0) {
    return (
      <div className="py-20 flex flex-col items-center justify-center glass border border-dashed border-white/5 rounded-[3rem] opacity-20">
        <ShieldAlert size={32} className="mb-4" />
        <span className="text-[10px] font-black uppercase tracking-[0.5em]">No_Anomalies_Found</span>
      </div>
    );
  }

  return (
    <div className="space-y-16">
      <div className="relative pt-32 pb-32 px-6 md:px-20 overflow-hidden glass border border-white/5 rounded-[4rem] bg-surface/20">
        {/* Progress Line */}
        <div className="h-[2px] bg-white/5 absolute top-1/2 left-0 right-0 -translate-y-1/2 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="h-full w-1/3 bg-gradient-to-r from-transparent via-neon/40 to-transparent"
          />
        </div>

        {/* Metric Marks */}
        <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between pointer-events-none opacity-20 px-10">
          {Array.from({ length: 60 }).map((_, i) => (
            <div key={i} className={`h-3 w-[1px] bg-white/20 ${i % 10 === 0 ? 'h-6 w-[2px] bg-white/40' : i % 5 === 0 ? 'h-4 bg-white/30' : ''}`}></div>
          ))}
        </div>

        <div className="flex justify-around items-center h-48 relative z-10">
          {timestamps.map((exp, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, type: "spring", stiffness: 200, damping: 20 }}
              className="relative group cursor-pointer flex flex-col items-center"
            >
              {/* Spectral Connector */}
              <div className={`w-[2px] transition-all duration-700 pointer-events-none ${i % 2 === 0 ? 'h-20 order-1 translate-y-8 bg-gradient-to-b from-transparent to-white/10 group-hover:to-neon/40' : 'h-20 order-3 -translate-y-8 bg-gradient-to-t from-transparent to-white/10 group-hover:to-neon/40'}`}></div>

              {/* Protocol Node */}
              <div className={`relative z-20 order-2 w-5 h-5 rotate-45 border-2 transition-all duration-700 group-hover:scale-125 group-hover:rotate-[135deg] ${exp.category === 'visual' ? 'border-neon bg-neon shadow-neon' :
                exp.category === 'audio' ? 'border-purple-500 bg-purple-500 shadow-[0_0_20px_#A855F7]' :
                  'border-white/40 bg-white/20'
                }`}>
                <div className="absolute inset-0 bg-white/20 animate-ping rounded-full scale-150 opacity-0 group-hover:opacity-100"></div>
              </div>

              {/* HUD Data Overlay */}
              <div className={`absolute ${i % 2 === 0 ? 'bottom-full mb-16' : 'top-full mt-16'} left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-6 group-hover:translate-y-0 pointer-events-none z-50`}>
                <div className="glass border border-white/10 p-8 rounded-[2rem] w-80 shadow-3xl bg-[#0a0a0a]/95 backdrop-blur-2xl relative">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${exp.category === 'visual' ? 'bg-neon shadow-neon' : 'bg-purple-500'}`}></div>
                      <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em]">{exp.category}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-lg">
                      <Clock size={10} className="text-white/20" />
                      <span className="text-[11px] font-mono text-white/60 font-black">{exp.timestamp}</span>
                    </div>
                  </div>
                  <p className="text-lg leading-relaxed text-white/80 font-light italic uppercase tracking-tight group-hover:text-white transition-colors">
                    "{exp.point}"
                  </p>

                  <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[9px] font-mono text-white/10 uppercase tracking-widest">Protocol_Verify_0x{i + 1}</span>
                    <Search size={14} className="text-white/10" />
                  </div>

                  {/* Corner Accents */}
                  <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-neon/40 rounded-bl-xl"></div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-neon/40 rounded-tr-xl"></div>
                </div>
              </div>

              {/* Vertical Marker Text */}
              <div className={`absolute ${i % 2 === 0 ? '-bottom-16' : '-top-16'} flex flex-col items-center gap-2`}>
                <span className="text-[11px] font-mono font-black text-white/20 tracking-[0.3em] font-bold group-hover:text-neon transition-colors">
                  {exp.timestamp}
                </span>
                <div className="w-[1px] h-4 bg-white/10"></div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-12 pt-10 px-8">
        <div className="flex items-center gap-4 group">
          <div className="w-3 h-3 rotate-45 border-2 border-neon bg-neon shadow-neon"></div>
          <div className="space-y-0.5">
            <span className="text-[11px] font-black uppercase tracking-[0.4em] text-white/80 group-hover:text-neon transition-colors">Visual Anomaly</span>
            <p className="text-[9px] font-mono text-white/20 uppercase tracking-widest leading-none">Pixel_Drift_Detected</p>
          </div>
        </div>
        <div className="flex items-center gap-4 group">
          <div className="w-3 h-3 rotate-45 border-2 border-purple-500 bg-purple-500 shadow-[0_0_15px_#A855F7]/50"></div>
          <div className="space-y-0.5">
            <span className="text-[11px] font-black uppercase tracking-[0.4em] text-white/80 group-hover:text-purple-400 transition-colors">AI Pattern</span>
            <p className="text-[9px] font-mono text-white/20 uppercase tracking-widest leading-none">GAN_Latent_Sequence</p>
          </div>
        </div>
        <div className="flex items-center gap-4 group">
          <div className="w-3 h-3 rotate-45 border-2 border-white/20 bg-white/5"></div>
          <div className="space-y-0.5">
            <span className="text-[11px] font-black uppercase tracking-[0.4em] text-white/40 group-hover:text-white transition-colors">Metadata Marker</span>
            <p className="text-[9px] font-mono text-white/10 uppercase tracking-widest leading-none">Archival_Reference</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisTimeline;
