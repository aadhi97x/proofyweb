import React from 'react';
import { motion } from 'framer-motion';
import { Zap, ShieldCheck, ArrowRight, Cpu, Activity } from 'lucide-react';

interface CTASectionProps {
  onStart: () => void;
}

const CTASection: React.FC<CTASectionProps> = ({ onStart }) => {
  return (
    <section className="py-40 relative px-4 overflow-hidden">
      {/* Background Animated Pulse */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-neon/[0.02] rounded-full blur-[180px] pointer-events-none animate-pulse-slow"></div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-6xl mx-auto glass border border-white/10 rounded-[5rem] p-16 md:p-32 text-center space-y-12 relative shadow-[0_50px_100px_rgba(0,0,0,0.8)] overflow-hidden group bg-charcoal/60 backdrop-blur-3xl"
      >
        <div className="absolute inset-0 bg-grid-forensic opacity-[0.05] pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neon/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

        <div className="relative z-10 space-y-8">
          <div className="flex items-center justify-center gap-4 text-neon/40 mb-12">
            <Cpu size={20} className="group-hover:rotate-90 transition-transform duration-1000" />
            <div className="h-px w-20 bg-white/5"></div>
            <span className="text-[11px] font-black uppercase tracking-[1em] italic">Protocol Termination</span>
            <div className="h-px w-20 bg-white/5"></div>
            <Activity size={20} />
          </div>

          <div className="space-y-6">
            <h2 className="text-6xl md:text-8xl font-black tracking-tighter text-white uppercase italic leading-[0.8]">
              Restore <span className="text-white/20">Universal</span> <br />
              <span className="text-neon">Trust.</span>
            </h2>
            <p className="text-2xl text-white/30 max-w-2xl mx-auto leading-relaxed italic font-light">
              Stop wondering. Use our tools today to find out if images and videos are real or AI-generated.
            </p>
          </div>
        </div>

        <div className="relative z-10 pt-10 flex flex-col items-center gap-10">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onStart}
            className="group/btn relative px-16 py-7 bg-white text-charcoal font-black rounded-[2.5rem] hover:bg-neon hover:shadow-neon transition-all duration-500 shadow-2xl text-[13px] uppercase tracking-[0.5em] flex items-center gap-6 overflow-hidden"
          >
            <Zap size={20} className="relative z-10 group-hover/btn:animate-bounce" />
            <span className="relative z-10">Initiate Protocol</span>
            <ArrowRight size={20} className="relative z-10 group-hover/btn:translate-x-2 transition-transform" />

            {/* Inner Button Glow */}
            <div className="absolute inset-x-0 bottom-0 h-1 bg-neon opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
          </motion.button>

          <div className="flex items-center gap-6 opacity-40">
            <div className="flex items-center gap-2">
              <ShieldCheck size={14} className="text-neon" />
              <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Forensic_Grade_Encrypted</span>
            </div>
            <div className="w-1 h-1 bg-white/20 rounded-full"></div>
            <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">v2.0.4 // STABLE</span>
          </div>
        </div>

        {/* Decorative corner accents */}
        <div className="absolute top-12 left-12 w-24 h-24 border-t border-l border-white/5 rounded-tl-[4.5rem]"></div>
        <div className="absolute bottom-12 right-12 w-24 h-24 border-b border-r border-white/5 rounded-br-[4.5rem]"></div>
      </motion.div>
    </section>
  );
};

export default CTASection;
