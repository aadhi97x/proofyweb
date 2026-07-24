
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface UploadZoneProps {
  onUpload: (file: File) => void;
}

const UploadZone: React.FC<UploadZoneProps> = ({ onUpload }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setIsDragging(true);
    else if (e.type === 'dragleave') setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files?.[0]) onUpload(files[0]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files?.[0]) onUpload(files[0]);
  };

  return (
    <div
      id="upload-zone"
      className="relative group w-full max-w-5xl mx-auto"
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <motion.div
        onClick={() => fileInputRef.current?.click()}
        whileHover={{ scale: 1.005 }}
        whileTap={{ scale: 0.995 }}
        className={`relative glass border-2 ${isDragging ? 'border-neon neon-glow' : 'border-white/5 hover:border-white/10'} rounded-[3.5rem] p-32 flex flex-col items-center justify-center text-center gap-16 cursor-pointer transition-all duration-700 shadow-3xl overflow-hidden`}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*,video/*,audio/*"
          onChange={handleFileChange}
        />

        {/* Orbital Scanning Animation */}
        <div className="relative w-48 h-48 flex items-center justify-center">
          <motion.div
            className="absolute inset-0 border-[0.5px] border-neon/20 rounded-full"
            animate={{ rotate: 360, scale: [1, 1.05, 1] }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute inset-8 border border-cyber/20 rounded-full border-t-cyber"
            animate={{ rotate: -360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute inset-12 border border-neon/30 rounded-full border-b-neon"
            animate={{ rotate: 720 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          />

          <div className="relative z-10 w-24 h-24 rounded-3xl bg-charcoal/50 border border-white/10 flex items-center justify-center text-white/20 group-hover:text-neon group-hover:border-neon/40 group-hover:shadow-[0_0_30px_rgba(0,255,156,0.1)] transition-all duration-700">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-10 h-10">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
            </svg>
          </div>
        </div>

        <div className="space-y-6 relative z-10">
          <div className="flex items-center justify-center gap-3">
            <div className="h-[1px] w-6 bg-white/10"></div>
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20">Ingestion Port</span>
            <div className="h-[1px] w-6 bg-white/10"></div>
          </div>
          <h2 className="text-5xl md:text-6xl font-black italic uppercase tracking-tighter text-white">Full AI Scan</h2>
          <p className="text-white/40 text-xl max-w-md mx-auto leading-relaxed italic font-light">
            Securely check any file for AI patterns with a full scan.
          </p>
        </div>

        <div className="flex flex-col items-center gap-8 relative z-10">
          <button className="px-20 py-6 bg-white text-charcoal font-black rounded-[2rem] hover:bg-neon transition-all duration-700 shadow-2xl group-hover:shadow-[0_0_50px_rgba(0,255,156,0.2)] uppercase tracking-[0.4em] text-[12px] active:scale-95">
            Access Local Terminal
          </button>

          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-8 text-[9px] font-bold text-white/10 uppercase tracking-[0.6em]">
              <span>Secure Scan Protocol</span>
              <div className="w-1.5 h-1.5 rounded-full bg-neon/20 animate-pulse"></div>
              <span>Secured</span>
            </div>
            <div className="flex gap-2">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-1 h-1 bg-neon/10 rounded-full"
                  animate={{ opacity: [0.1, 0.5, 0.1] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Decorative Corner Accents */}
        <div className="absolute top-8 left-8 w-6 h-6 border-t font-data border-l border-white/20 rounded-tl-xl transition-all duration-700 group-hover:border-neon group-hover:w-10 group-hover:h-10"></div>
        <div className="absolute top-8 right-8 w-6 h-6 border-t border-r border-white/20 rounded-tr-xl transition-all duration-700 group-hover:border-neon group-hover:w-10 group-hover:h-10"></div>
        <div className="absolute bottom-8 left-8 w-6 h-6 border-b border-l border-white/20 rounded-bl-xl transition-all duration-700 group-hover:border-neon group-hover:w-10 group-hover:h-10"></div>
        <div className="absolute bottom-8 right-8 w-6 h-6 border-b border-r border-white/20 rounded-br-xl transition-all duration-700 group-hover:border-neon group-hover:w-10 group-hover:h-10"></div>

        <AnimatePresence>
          {isDragging && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-neon/5 backdrop-blur-md flex items-center justify-center z-20 pointer-events-none"
            >
              <div className="p-10 border border-neon/50 rounded-[2.5rem] bg-charcoal/90 shadow-[0_0_50px_rgba(0,255,156,0.2)]">
                <span className="text-neon font-black uppercase tracking-[0.8em] text-sm animate-pulse">Release Signal</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default UploadZone;
