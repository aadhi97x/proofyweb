
import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Shield, Layers, Target, Info, Zap } from 'lucide-react';

const ResultsPreview: React.FC = () => {
  return (
    <section className="py-40 relative overflow-visible">
      {/* Immersive Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-neon/[0.03] rounded-full blur-[150px] pointer-events-none"></div>

      <div className="relative glass border border-white/10 rounded-[5rem] p-16 md:p-32 flex flex-col items-center text-center gap-20 shadow-3xl bg-black/50 backdrop-blur-3xl overflow-hidden group">
        {/* Decorative Grid */}
        <div className="absolute inset-0 bg-grid-analysis opacity-[0.05] pointer-events-none" />

        <div className="max-w-4xl space-y-12 relative z-10">
          <div className="space-y-8">
            <div className="flex items-center justify-center gap-6 text-neon/40">
              <Activity size={16} />
              <span className="text-[11px] font-black uppercase tracking-[0.8em]">AI Checker Scrutiny</span>
              <Activity size={16} />
            </div>

            <div className="space-y-6">
              <h2 className="text-7xl font-black tracking-tighter leading-[0.85] text-white uppercase italic">
                Transparent Scoring. <br />
                <span className="text-white/20 group-hover:text-white/40 transition-colors duration-1000">No Neural Black Boxes.</span>
              </h2>
              <p className="text-2xl text-white/30 font-light italic leading-relaxed max-w-3xl mx-auto">
                Every scan yields a clear look at why we reached our conclusion. We provide solid proof so you can trust the result. Our process is 100% explainable.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-12">
            <motion.div
              whileHover={{ y: -5 }}
              className="space-y-4 p-10 glass border border-white/5 rounded-[3rem] bg-black/30 group/card"
            >
              <div className="flex items-center justify-center gap-3 text-white/20 mb-2">
                <Zap size={14} className="group-hover/card:text-cyber transition-colors" />
                <p className="text-[10px] font-black uppercase tracking-[0.3em] font-mono">Process_Delta</p>
              </div>
              <p className="text-6xl font-black text-white/90 italic tracking-tighter">~8s</p>
              <div className="h-1 w-12 bg-cyber/20 mx-auto rounded-full group-hover/card:w-20 transition-all"></div>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="space-y-4 p-10 glass border border-neon/20 rounded-[3.5rem] bg-neon/10 group/card shadow-[0_30px_60px_rgba(0,255,156,0.1)]"
            >
              <div className="flex items-center justify-center gap-3 text-neon/40 mb-2">
                <Shield size={14} className="group-hover/card:animate-pulse" />
                <p className="text-[10px] font-black uppercase tracking-[0.3em] font-mono">Confidence_Floor</p>
              </div>
              <div className="flex items-center justify-center gap-4">
                <p className="text-7xl font-black text-neon italic tracking-tighter">98%</p>
                <span className="text-2xl font-black text-neon/40 group-hover:text-neon transition-colors leading-none">+</span>
              </div>
              <div className="flex items-center justify-center gap-1.5 pt-2">
                <div className="w-1 h-1 bg-neon rounded-full animate-pulse"></div>
                <span className="text-[8px] font-mono text-neon/40 uppercase tracking-widest leading-none">High_Precision</span>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="space-y-4 p-10 glass border border-white/5 rounded-[3rem] bg-black/30 group/card"
            >
              <div className="flex items-center justify-center gap-3 text-white/20 mb-2">
                <Layers size={14} className="group-hover/card:text-neon transition-colors" />
                <p className="text-[10px] font-black uppercase tracking-[0.3em] font-mono">Signal_Nodes</p>
              </div>
              <p className="text-6xl font-black text-white/90 italic tracking-tighter">2.4k</p>
              <p className="text-[11px] font-mono text-white/20 uppercase tracking-widest">Global Pointers</p>
            </motion.div>
          </div>
        </div>

        {/* Bottom CTA Feel */}
        <div className="mt-20 flex flex-col items-center gap-6 relative z-10 opacity-40 hover:opacity-100 transition-opacity">
          <div className="flex items-center gap-4 text-white/20">
            <Target size={16} />
            <span className="text-[10px] font-black uppercase tracking-[0.5em]">Reliable Analysis Systems</span>
          </div>
          <p className="text-[10px] font-mono text-white/10 uppercase tracking-[0.8em]">NODE_ID: 0x8F92_STABLE_42</p>
        </div>

        {/* Corner Accents */}
        <div className="absolute top-12 left-12 w-20 h-20 border-t border-l border-white/10 rounded-tl-[4rem]"></div>
        <div className="absolute bottom-12 right-12 w-20 h-20 border-b border-r border-white/10 rounded-br-[4rem]"></div>
      </div>
    </section>
  );
};

export default ResultsPreview;
