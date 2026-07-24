
import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Eye, ShieldCheck, Lock, Activity, Cpu } from 'lucide-react';

const TrustStrip: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (containerRef.current) observer.unobserve(containerRef.current);
        }
      },
      { threshold: 0.2, rootMargin: '0px 0px -50px 0px' }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const signals = [
    {
      label: "AI Analysis",
      desc: "Multi-layer AI detection core.",
      icon: Zap,
      color: "text-neon"
    },
    {
      label: "Pixel Integrity",
      desc: "Source-level visual audit.",
      icon: Eye,
      color: "text-cyber"
    },
    {
      label: "Verified Proof",
      desc: "Evidence-driven verdicts.",
      icon: ShieldCheck,
      color: "text-neon"
    },
    {
      label: "AI Guard",
      desc: "Quantum-safe interrogation.",
      icon: Lock,
      color: "text-white"
    }
  ];

  return (
    <div
      ref={containerRef}
      className="w-full py-16 relative z-10"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {signals.map((sig, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1, duration: 0.8 }}
              className={`flex flex-col items-center text-center lg:items-start lg:text-left p-10 glass border border-white/5 rounded-[2.5rem] group cursor-default transition-all duration-700 hover:border-white/20 bg-black/40 hover:bg-[#111] shadow-2xl relative overflow-hidden`}
            >
              <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-white/5 rounded-tl-[2.5rem] group-hover:border-neon/40 transition-colors"></div>

              <div className={`w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-white/20 group-hover:bg-white/10 border border-white/10 transition-all duration-500 mb-8 ${sig.color} group-hover:scale-110`}>
                <sig.icon size={24} />
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-black uppercase tracking-[0.4em] text-white group-hover:text-neon transition-colors">
                    {sig.label}
                  </span>
                </div>
                <p className="text-[12px] font-light text-white/40 italic leading-relaxed group-hover:text-white/60 transition-colors">
                  {sig.desc}
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between w-full opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                <div className="flex gap-1">
                  <div className="w-1 h-1 bg-neon rounded-full"></div>
                  <div className="w-1 h-1 bg-neon/40 rounded-full"></div>
                </div>
                <Activity size={12} className="text-white/10" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrustStrip;
