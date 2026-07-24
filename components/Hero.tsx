import React from 'react';
import { motion } from 'framer-motion';
import InteractiveNeuralVortex from './ui/interactive-neural-vortex-background';

const Hero: React.FC = () => {
  const line1 = "Real media needs";
  const line2 = "REAL PROOF.";

  return (
    <div className="text-center space-y-16 max-w-7xl mx-auto relative min-h-[85vh] flex flex-col justify-start items-center pt-12 md:pt-20">
      {/* Neural Vortex Background */}
      <InteractiveNeuralVortex />

      {/* Content Layer */}
      <div className="space-y-10 pointer-events-none -mt-8 md:-mt-12">

        <h1 className="text-6xl md:text-[8rem] font-black tracking-tighter leading-[0.85] flex flex-col items-center select-none">
          <span className="flex overflow-hidden">
            {line1.split("").map((char, i) => (
              <motion.span
                key={i}
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 + i * 0.02, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="inline-block text-white drop-shadow-[0_4px_15px_rgba(255,255,255,0.4)]"
                style={{ whiteSpace: char === " " ? "pre" : "normal" }}
              >
                {char}
              </motion.span>
            ))}
          </span>
          <span className="flex overflow-hidden mt-6 group cursor-default relative pb-4" style={{ mixBlendMode: 'difference' }}>
            {line2.split("").map((char, i) => (
              <motion.span
                key={i}
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8 + i * 0.04, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className="inline-block text-white italic transition-all duration-700"
                style={{ whiteSpace: char === " " ? "pre" : "normal" }}
              >
                {char}
              </motion.span>
            ))}
          </span>
        </h1>

        <div className="space-y-10 max-w-5xl mx-auto">
          <motion.p
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="text-2xl md:text-5xl text-white/90 font-light tracking-tight italic leading-relaxed drop-shadow-md"
          >
            A simple way to find out <span className="text-white font-medium not-italic">what is real</span> and what is fake.
          </motion.p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 3, duration: 1.2, ease: "circOut" }}
        className="flex flex-col items-center gap-10 mt-16 relative z-20 pointer-events-auto"
      >
        <button
          onClick={() => document.getElementById('upload-zone')?.scrollIntoView({ behavior: 'smooth' })}
          className="group relative px-24 py-8 bg-black/70 backdrop-blur-xl border border-neon/20 text-neon font-black rounded-3xl text-[11px] uppercase tracking-[0.8em] hover:border-neon transition-all duration-1000 active:scale-[0.98] overflow-hidden"
        >
          <span className="relative z-10 group-hover:text-charcoal transition-colors duration-500">Start Scanning</span>
          <motion.div
            className="absolute inset-0 bg-neon -translate-x-full group-hover:translate-x-0 transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]"
          />
        </button>
      </motion.div>
    </div>
  );
};

export default Hero;