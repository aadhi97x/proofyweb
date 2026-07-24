
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Scan, Search, FileText, ChevronRight, Activity, Cpu, ShieldCheck } from 'lucide-react';

const steps = [
  {
    id: 1,
    title: "SIGNAL_INGESTION",
    short: "Secure sandboxing & telemetry strip.",
    full: "Media is isolated in an encrypted environment where sensitive metadata is stripped to prevent bias, isolating the raw forensic signal for interrogation.",
    icon: Scan,
    color: "text-neon"
  },
  {
    id: 2,
    title: "AI SCANNING",
    short: "Spectral Domain & Artifact Scan.",
    full: "Our smart scanner checks for hidden patterns and signs of AI in the pixels and audio of your files.",
    icon: Search,
    color: "text-cyber"
  },
  {
    id: 3,
    title: "PHYSICAL_VERIFICATION",
    short: "Biometric & Light-Physics Audit.",
    full: "We verify subsurface scattering and biometric symmetry. Every frame is cross-checked against high-fidelity physical world light-consistency models.",
    icon: Activity,
    color: "text-danger"
  },
  {
    id: 4,
    title: "PROTOCOL_REPORTING",
    short: "Generating Audiable Briefs.",
    full: "Final results are compiled into a comprehensive forensic report with confidence scores, anomaly heatmaps, and judicial-ready proof timestamps.",
    icon: FileText,
    color: "text-white"
  }
];

const HowItWorks: React.FC = () => {
  const [expanded, setExpanded] = useState<number | null>(1);

  return (
    <section className="space-y-32 py-32 relative">
      <div className="space-y-8 text-center relative z-10">
        <div className="flex items-center justify-center gap-4 text-neon/40">
          <Cpu size={16} />
          <div className="h-px w-10 bg-neon/20"></div>
          <h3 className="text-[11px] font-black uppercase tracking-[0.8em] italic">Forensic Architecture</h3>
          <div className="h-px w-10 bg-neon/20"></div>
          <Cpu size={16} />
        </div>
        <div className="space-y-4">
          <h2 className="text-7xl font-black tracking-tighter uppercase italic leading-[0.8]">The <span className="text-white">Interrogation</span> <span className="text-neon">Pipeline</span></h2>
          <p className="text-white/20 text-xl max-w-2xl mx-auto italic font-light leading-relaxed">
            A smart automated process designed to find and show AI-generated parts.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 relative">
        {/* Decorative Pipeline Element */}
        <div className="hidden xl:block absolute left-1/2 top-10 bottom-10 w-px bg-gradient-to-b from-transparent via-white/5 to-transparent -translate-x-1/2 pointer-events-none" />

        {steps.map((step, idx) => (
          <motion.div
            key={step.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: idx * 0.1 }}
            onClick={() => setExpanded(expanded === step.id ? null : step.id)}
            className={`group p-12 glass border ${expanded === step.id ? 'border-neon/40 bg-black/40' : 'border-white/5 bg-black/40'} rounded-[4rem] transition-all duration-700 cursor-pointer relative overflow-hidden shadow-2xl hover:border-white/20`}
          >
            <div className="flex items-start justify-between relative z-10">
              <div className="space-y-8 flex-grow">
                <div className={`w-16 h-16 rounded-3xl bg-charcoal border border-white/10 flex items-center justify-center transition-all duration-700 ${expanded === step.id ? 'border-neon/40 text-neon shadow-neon bg-white/5' : 'text-white/20 group-hover:text-white group-hover:border-white/20'}`}>
                  <step.icon size={28} />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-mono font-black text-white/10 uppercase tracking-widest">Protocol_{step.id.toString().padStart(2, '0')}</span>
                    <div className="h-px w-8 bg-white/5"></div>
                  </div>
                  <h4 className="text-4xl font-black italic uppercase tracking-tighter text-white/90 group-hover:text-white transition-colors leading-none">
                    {step.title.split('_')[0]}<span className="text-white/20 group-hover:text-white/40 transition-colors">_{step.title.split('_')[1]}</span>
                  </h4>
                  <p className="text-white/30 text-sm font-light uppercase tracking-[0.3em] italic">{step.short}</p>
                </div>
              </div>

              <div className={`w-12 h-12 rounded-2xl border transition-all duration-700 mt-2 flex items-center justify-center ${expanded === step.id ? 'bg-neon border-neon text-charcoal shadow-neon' : 'border-white/5 text-white/10 group-hover:text-white group-hover:border-white/20'}`}>
                <motion.div animate={{ rotate: expanded === step.id ? 180 : 0 }} transition={{ type: "spring", stiffness: 200, damping: 20 }}>
                  <ChevronRight size={20} />
                </motion.div>
              </div>
            </div>

            <AnimatePresence>
              {expanded === step.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                  className="overflow-hidden"
                >
                  <div className="pt-10 mt-10 border-t border-white/5 space-y-8">
                    <p className="text-white/50 text-xl leading-relaxed italic font-light max-w-md">
                      {step.full}
                    </p>
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2">
                        <ShieldCheck size={14} className="text-neon" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/20">Verified Protocol</span>
                      </div>
                      <div className="w-1 h-1 bg-white/10 rounded-full"></div>
                      <span className="text-[10px] font-mono text-white/10">SHA256: 0xFX_{step.id}FF</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Background Grain/Grid */}
            <div className="absolute inset-0 bg-grid-forensic opacity-[0.03] pointer-events-none" />
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;
