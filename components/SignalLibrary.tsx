import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Fingerprint, Waves, FileCheck, Search, Cpu, Database, Activity, Terminal } from 'lucide-react';

const analysisModules = [
  {
    title: "Pixel Analysis Core",
    desc: "Breaks visuals down to raw pixel structure to detect manipulation at its origin. Deep scan accuracy for digital files.",
    tag: "Visual",
    code: "PX SCAN",
    icon: Fingerprint,
    color: "text-neon"
  },
  {
    title: "Structural Check",
    desc: "Analyzes technical signatures inside the file container, from codecs to latent metadata timestamps.",
    tag: "Technical",
    code: "INTEGRITY",
    icon: Database,
    color: "text-cyber"
  },
  {
    title: "Vocal Spectrum",
    desc: "Checks audio levels to find signs of AI voices and clones.",
    tag: "Audio",
    code: "VOICE SIG",
    icon: Waves,
    color: "text-danger"
  },
  {
    title: "Detailed Reports",
    desc: "Delivers an auditable record of every analysis performed. Built to be a clear record of what we found.",
    tag: "Documentation",
    code: "LAW CERT",
    icon: FileCheck,
    color: "text-white"
  },
  {
    title: "Intelligence Briefs",
    desc: "Detailed reports with confidence scores and visual indicators to explain why content was flagged.",
    tag: "Findings",
    code: "ANALYSIS",
    icon: Search,
    color: "text-neon"
  },
  {
    title: "AI Synergy",
    desc: "Layered approach analyzing visuals, file structure, and audio to defeat evolving synthetic threats.",
    tag: "Security",
    code: "AUTO AI",
    icon: Cpu,
    color: "text-cyber"
  }
];

const SignalLibrary: React.FC = () => {
  return (
    <div className="space-y-20 pb-40">
      <header className="flex flex-col md:flex-row items-end justify-between gap-10">
        <div className="space-y-6">
          <div className="flex items-center gap-4 text-white/20">
            <Terminal size={16} />
            <span className="text-[11px] font-black uppercase tracking-[0.5em]">Protocol Library</span>
          </div>
          <div className="space-y-2">
            <h2 className="text-6xl font-black tracking-tighter uppercase italic leading-[0.8] flex flex-col">
              <span className="text-white">Analysis</span>
              <span className="text-neon">Verification Methods</span>
            </h2>
            <p className="text-white/30 text-lg italic font-light tracking-tight max-w-lg">
              A list of the smart systems and tools that power our analysis.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-6 py-6 px-10 glass border border-white/5 rounded-[2.5rem] bg-surface/20">
          <div className="flex flex-col text-right">
            <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mb-1">Standard ISO</span>
            <span className="text-neon font-mono text-sm font-black italic tracking-tighter uppercase leading-none">v4.0.2 SECURE</span>
          </div>
          <div className="w-px h-10 bg-white/10"></div>
          <Activity size={20} className="text-neon animate-pulse" />
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {analysisModules.map((sig, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05 }}
            className="group relative p-12 glass border border-white/5 rounded-[3.5rem] hover:border-neon/30 transition-all duration-700 bg-surface/20 overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:opacity-[0.08] transition-all duration-700 group-hover:rotate-12 group-hover:scale-110 pointer-events-none">
              <sig.icon size={120} />
            </div>

            <div className="flex items-center justify-between mb-12 relative z-10">
              <div className={`w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center ${sig.color} group-hover:bg-white/10 group-hover:scale-110 transition-all duration-500`}>
                <sig.icon size={24} />
              </div>
              <div className="text-right">
                <span className="text-[9px] font-mono text-white/20 group-hover:text-white/40 transition-colors uppercase block mb-1">
                  Module {sig.code}
                </span>
                <span className={`text-[9px] font-black uppercase tracking-[0.4em] px-3 py-1 bg-white/5 rounded-lg border border-white/10 ${sig.color}`}>
                  {sig.tag}
                </span>
              </div>
            </div>

            <div className="space-y-4 relative z-10">
              <h4 className="text-3xl font-black text-white italic uppercase tracking-tighter group-hover:text-neon transition-colors duration-500">
                {sig.title}
              </h4>
              <p className="text-lg text-white/40 leading-relaxed font-light italic group-hover:text-white/60 transition-colors duration-500">
                {sig.desc}
              </p>
            </div>

            <div className="mt-12 pt-10 border-t border-white/5 flex items-center justify-between relative z-10">
              <div className="flex gap-2">
                <div className="w-2 h-2 rounded-full bg-white/5 group-hover:bg-neon transition-colors duration-300"></div>
                <div className="w-2 h-2 rounded-full bg-white/5 group-hover:bg-neon/60 transition-colors duration-500"></div>
                <div className="w-2 h-2 rounded-full bg-white/5 group-hover:bg-neon/30 transition-colors duration-700"></div>
              </div>
              <span className="text-[10px] font-black text-white/10 uppercase tracking-widest group-hover:text-neon/40 transition-colors">AI Level Scan</span>
            </div>

            {/* Corner Accent */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-white/5 rounded-tl-[3.5rem] group-hover:border-neon/40 transition-colors"></div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="p-16 glass border border-white/5 rounded-[4rem] text-center space-y-10 shadow-2xl relative overflow-hidden group bg-surface/30"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-neon/5 via-transparent to-cyber/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>

        <div className="flex items-center justify-center gap-6 text-white/20">
          <Shield size={24} />
          <div className="h-px w-20 bg-white/10"></div>
          <Activity size={24} />
          <div className="h-px w-20 bg-white/10"></div>
          <Shield size={24} />
        </div>

        <div className="space-y-4 relative z-10">
          <h3 className="text-[11px] font-black uppercase tracking-[0.8em] text-white/40">Statement of Integrity</h3>
          <p className="text-3xl text-white/60 max-w-4xl mx-auto italic font-light leading-snug">
            "Our solution goes beyond surface-level detection, using a layered approach that analyzes visuals, file structure, metadata, and audio signals to deliver clear, auditable insights."
          </p>
        </div>

        <div className="flex justify-center gap-12 relative z-10">
          <div className="flex flex-col gap-1">
            <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">Confidence Floor</span>
            <span className="font-mono text-neon text-xl font-black">99.8%</span>
          </div>
          <div className="w-px h-10 bg-white/10 self-center"></div>
          <div className="flex flex-col gap-1">
            <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">False Positive</span>
            <span className="font-mono text-cyber text-xl font-black">&lt;0.01%</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SignalLibrary;
