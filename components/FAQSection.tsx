import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, ChevronDown, ShieldQuestion, Cpu, Activity, Database } from 'lucide-react';

const faqs = [
  {
    q: "How accurate is the interrogation sequence?",
    a: "Our AI scanner is 98.4% accurate in our tests. However, we always show you a score because AI detection is about math and probability, not 100% certainty."
  },
  {
    q: "Can the interrogation protocol fail?",
    a: "Yes. Technical noise such as extreme low resolution, high-frequency compression, or deviant light physics can introduce interference. Always cross-reference with our 'Ground Truth' archival engine."
  },
  {
    q: "What is the procedure for uncertain signals?",
    a: "Indeterminate results often occur in high-fidelity fabrications or degraded legacy media. We recommend activating the 'Archival Probe' or verifying the asset's cryptographic provenance."
  }
];

const FAQSection: React.FC = () => {
  const [active, setActive] = useState<number | null>(0);

  return (
    <section className="py-40 relative px-6">
      <div className="max-w-4xl mx-auto space-y-20">
        <header className="text-center space-y-8 relative">
          <div className="flex items-center justify-center gap-4 text-white/5">
            <Database size={20} />
            <div className="h-px w-16 bg-white/5"></div>
            <h3 className="text-[11px] font-black text-white/20 uppercase tracking-[1em] italic">Knowledge Base</h3>
            <div className="h-px w-16 bg-white/5"></div>
            <Database size={20} />
          </div>
          <div className="space-y-4">
            <h2 className="text-6xl font-black tracking-tighter uppercase italic text-white leading-none">
              Common <span className="text-neon">Inquiries</span>
            </h2>
            <p className="text-xl text-white/30 font-light italic tracking-tight">Technical protocol specifications and system methodology FAQ.</p>
          </div>
        </header>

        <div className="space-y-6">
          {faqs.map((faq, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className={`glass border rounded-[3rem] transition-all duration-700 overflow-hidden relative group ${active === idx ? 'bg-surface/40 border-neon/40 shadow-neon-low ring-1 ring-neon/10' : 'bg-surface/20 border-white/5 hover:border-white/20'}`}
            >
              <button
                onClick={() => setActive(active === idx ? null : idx)}
                className="w-full flex items-center justify-between p-10 text-left relative z-10"
              >
                <div className="flex items-center gap-6">
                  <div className={`w-12 h-12 rounded-2xl border transition-all duration-700 flex items-center justify-center ${active === idx ? 'bg-neon border-neon text-charcoal' : 'bg-white/5 border-white/5 text-white/20'}`}>
                    {active === idx ? <HelpCircle size={20} /> : <ShieldQuestion size={20} />}
                  </div>
                  <span className={`text-2xl font-black italic uppercase tracking-tighter transition-all duration-500 ${active === idx ? 'text-white translate-x-1' : 'text-white/40 group-hover:text-white/60'}`}>
                    {faq.q}
                  </span>
                </div>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-700 ${active === idx ? 'bg-white/10 text-white rotate-180' : 'text-white/10 group-hover:text-white/40'}`}>
                  <ChevronDown size={20} />
                </div>
              </button>

              <AnimatePresence>
                {active === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="px-28 pb-12 pt-0 space-y-6">
                      <div className="h-px w-full bg-white/5"></div>
                      <p className="text-xl text-white/60 leading-relaxed italic font-light font-sans pr-10">
                        {faq.a}
                      </p>
                      <div className="flex items-center gap-4 opacity-20">
                        <Activity size={14} />
                        <span className="text-[10px] font-mono uppercase tracking-widest text-white">Ref_Protocol_FAQ_{idx + 1}</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Subtle hover accent */}
              <div className="absolute top-0 left-0 w-2 h-full bg-neon transition-all duration-700 opacity-0 group-hover:opacity-100" style={{ transform: active === idx ? 'scaleY(1)' : 'scaleY(0)' }}></div>
            </motion.div>
          ))}
        </div>

        <div className="pt-10 flex justify-center items-center gap-10 opacity-10 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-1000">
          <Cpu size={24} />
          <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
          <Activity size={24} />
          <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
          <Database size={24} />
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
