
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShaderAnimation } from './ui/shader-lines';

interface ProcessingScreenProps {
  label?: string;
}

const ProcessingScreen: React.FC<ProcessingScreenProps> = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Psychological loading effect:
    // 1. Initial burst: Fast load to ~75% (simulating local read/upload)
    // 2. Processing phase: Decelerate significantly to ~90%
    // 3. Anticipation phase: Crawl slowly towards 99%
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        let increment = 0;
        
        // Phase 1: Rapid ramp up (0-75%)
        if (prev < 75) {
          increment = Math.random() * 3 + 1; // Aggressive fill
        } 
        // Phase 2: Deceleration (75-88%)
        else if (prev < 88) {
          increment = Math.random() * 0.4 + 0.1; // Slowing down
        } 
        // Phase 3: Crawl/Anticipation (88-99%)
        else if (prev < 99) {
          increment = Math.random() * 0.05; // Very slow crawl
        }
        
        // Occasional micro-stutter for realism (processing "hiccup")
        if (Math.random() > 0.9) {
          increment = 0;
        }

        const nextProgress = prev + increment;
        
        // Cap at 99.9% - let the parent component unmount us when real data arrives
        return nextProgress >= 99.9 ? 99.9 : nextProgress;
      });
    }, 50);

    return () => clearInterval(progressInterval);
  }, []);

  // Circular Progress Config
  const radius = 90; 
  const strokeWidth = 8; 
  const circumference = 2 * Math.PI * radius;
  
  const safeStrokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center overflow-hidden font-sans">
      <div className="absolute inset-0 z-0">
        <ShaderAnimation />
      </div>

      {/* Radial Gradient overlay to centralize focus */}
      <div className="absolute inset-0 z-[1] pointer-events-none bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.85)_0%,rgba(0,0,0,0.5)_100%)]" />

      <div className="relative z-10 flex flex-col items-center justify-center">
        
        {/* Circular Progress Container */}
        <div className="relative w-[320px] h-[320px] flex items-center justify-center">
            
            {/* Dark Backdrop for the ring area */}
            <div className="absolute inset-0 m-auto w-[220px] h-[220px] rounded-full bg-black z-0 shadow-[0_0_80px_rgba(0,0,0,0.9)]"></div>

            {/* SVG Ring */}
            <svg className="absolute inset-0 w-full h-full -rotate-90 transform z-20" viewBox="0 0 300 300">
                <defs>
                    <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
                        <stop offset="50%" stopColor="#ffffff" stopOpacity="1" />
                        <stop offset="100%" stopColor="#00FF9C" stopOpacity="1" />
                    </linearGradient>
                </defs>
                {/* Track */}
                <circle
                    cx="150"
                    cy="150"
                    r={radius}
                    stroke="rgba(255,255,255,0.05)"
                    strokeWidth={strokeWidth}
                    fill="transparent"
                />
                {/* Progress */}
                <motion.circle
                    cx="150"
                    cy="150"
                    r={radius}
                    stroke="url(#progressGradient)"
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeLinecap="round"
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: safeStrokeDashoffset }}
                    transition={{ duration: 0.1, ease: "linear" }}
                    className="drop-shadow-[0_0_10px_rgba(0,255,156,0.5)]"
                />
            </svg>

            {/* Central Analysis Portal */}
            <div className="absolute inset-0 m-auto w-[150px] h-[150px] rounded-full bg-black z-10 flex items-center justify-center overflow-hidden border border-white/10 relative">
                
                {/* Rotating Technical Rings */}
                <motion.div 
                    className="absolute inset-0 border border-dashed border-white/10 rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                />
                <motion.div 
                    className="absolute inset-3 border border-dotted border-neon/20 rounded-full"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                />

                {/* Glowing Proofy 'P' Logo */}
                <motion.div
                    animate={{ 
                        opacity: [0.4, 1, 0.4],
                        textShadow: [
                            "0 0 10px rgba(0,255,156,0.1)",
                            "0 0 40px rgba(0,255,156,0.6)", 
                            "0 0 10px rgba(0,255,156,0.1)"
                        ],
                        scale: [0.95, 1.05, 0.95]
                    }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="relative z-10 text-white font-black text-8xl italic select-none pr-2"
                >
                    P
                </motion.div>
                
                {/* Subtle Glitch/Noise Overlay */}
                <div className="absolute inset-0 bg-neon/5 mix-blend-overlay"></div>
            </div>
            
            {/* Background Pulse Glow */}
            <div className="absolute inset-0 bg-neon/10 blur-3xl rounded-full z-0 transform scale-75 animate-pulse"></div>
        </div>
      </div>

      <div className="absolute top-12 right-12 opacity-20 select-none">
        <span className="text-[9px] font-bold uppercase tracking-[0.8em]">v2.0.4</span>
      </div>
    </div>
  );
};

export default ProcessingScreen;
