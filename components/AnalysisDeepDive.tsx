
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Scan, Eye, Radio, Activity } from 'lucide-react';

const categories = [
  {
    id: 'visual',
    title: "Detailed AI Scan",
    detail: "Decomposing 128 dynamic facial tensors to identify micro-inconsistencies in sub-surface scattering, pore-level texture, and light bounce logic. Catching the 'uncanny valley' where diffusion models still fail perfect replication.",
    metrics: ["Sub-surface Symmetry", "Optical Flow Logic", "Latent Texture Noise"],
    icon: Eye,
    color: "var(--neon)"
  },
  {
    id: 'audio',
    title: "Spectral Voice Fingerprinting",
    detail: "Deep frequency analysis for text-to-speech compression artifacts and phoneme-level timing shifts. We verify breathing entropy and vocal jitter patterns that synthetic clones almost always omit or unnaturally regularize.",
    metrics: ["Phoneme Jitter", "Formant Entropy", "Spectral Aliasing"],
    icon: Radio,
    color: "var(--cyber)"
  },
  {
    id: 'temporal',
    title: "Temporal Continuity Engine",
    detail: "Frame-by-frame check ensuring that motion vectors and environmental reflections remain logically consistent across time. Detecting frame-swapping, GAN-stitching, and pixel-level motion smear.",
    metrics: ["Vector Cohesion", "Drift Delta", "Persistence Logic"],
    icon: Activity,
    color: "var(--neon)"
  }
];

const AnalysisDeepDive: React.FC = () => {
  const [active, setActive] = useState<string | null>('visual');

  return (
    <section className="space-y-16 py-24 relative overflow-hidden">
      <div className="flex flex-col lg:flex-row gap-20 items-start">
        <div className="lg:w-1/3 space-y-8 sticky top-32">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-px w-8 bg-neon/40"></div>
              <h3 className="text-[11px] font-black text-neon uppercase tracking-[0.6em]">Layer Analysis</h3>
            </div>
            <h2 className="text-5xl md:text-6xl font-black tracking-tighter italic uppercase leading-[0.9]">Detection <span className="text-white/20">Protocols</span></h2>
          </div>
          <p className="text-white/40 text-lg leading-relaxed italic font-light max-w-sm">
            Our AI scanner works in three ways, checking every detail of digital files to see if they are real.
          </p>

          <div className="pt-8 border-t border-white/5 flex items-center gap-6">
            <div className="w-12 h-12 rounded-2xl glass border border-white/5 flex items-center justify-center text-neon">
              <Scan size={24} />
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] font-black uppercase text-white tracking-widest">Live Engine</span>
              <p className="text-[9px] font-mono text-white/20 uppercase tracking-tighter">Status: 0x82_Optimized</p>
            </div>
          </div>
        </div>

        <div className="lg:w-2/3 w-full space-y-6">
          {categories.map((cat, idx) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.8 }}
              viewport={{ once: true }}
              className={`glass border transition-all duration-700 rounded-[2.5rem] overflow-hidden ${active === cat.id ? 'bg-black/70 border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.5)]' : 'bg-black/40 border-white/5 hover:border-white/10'}`}
            >
              <button
                onClick={() => setActive(active === cat.id ? null : cat.id)}
                className="w-full flex items-center justify-between p-10 text-left group"
              >
                <div className="flex items-center gap-8">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-700 ${active === cat.id ? 'bg-white text-charcoal scale-110 shadow-xl' : 'bg-white/5 text-white/20 group-hover:text-white'}`}>
                    <cat.icon size={24} strokeWidth={active === cat.id ? 2.5 : 1.5} />
                  </div>
                  <div className="space-y-1">
                    <span className={`text-2xl font-black italic uppercase tracking-tighter transition-all duration-500 ${active === cat.id ? 'text-white' : 'text-white/30 group-hover:text-white/50'}`}>
                      {cat.title}
                    </span>
                    <div className="flex items-center gap-3">
                      <div className={`w-1 h-1 rounded-full transition-colors ${active === cat.id ? 'bg-neon shadow-neon' : 'bg-white/10'}`}></div>
                      <span className="text-[9px] font-mono font-bold text-white/10 uppercase tracking-widest">Vector_Verified</span>
                    </div>
                  </div>
                </div>
                <div className={`w-10 h-10 rounded-xl border border-white/5 flex items-center justify-center transition-all duration-500 ${active === cat.id ? 'bg-neon/10 text-neon border-neon/20 rotate-180' : 'text-white/10 group-hover:text-white/30'}`}>
                  <ChevronDown size={20} />
                </div>
              </button>

              <AnimatePresence>
                {active === cat.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="px-10 pb-12 pl-[104px] space-y-10">
                      <div className="h-px bg-white/5" />
                      <p className="text-xl text-white/60 leading-relaxed max-w-2xl italic font-light">
                        {cat.detail}
                      </p>
                      <div className="flex flex-wrap gap-4">
                        {cat.metrics.map(m => (
                          <div key={m} className="px-5 py-2.5 bg-black/40 border border-white/5 rounded-xl flex items-center gap-3 group/metric hover:border-white/10 transition-colors">
                            <div className="w-1 h-1 rounded-full bg-neon/30 group-hover/metric:bg-neon transition-colors"></div>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 group-hover/metric:text-white/60 transition-colors">
                              {m}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AnalysisDeepDive;
