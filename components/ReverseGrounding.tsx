
import React, { useState, useRef } from 'react';
import { reverseSignalGrounding } from '../services/geminiService';
import ProcessingScreen from './ProcessingScreen';
import {
  ArrowLeft,
  Search,
  Globe,
  ShieldCheck,
  ExternalLink,
  RefreshCcw,
  Scan,
  AlertTriangle,
  FileSearch,
  CheckCircle2,
  XCircle,
  Copy,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ReverseGrounding: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      setPreview(URL.createObjectURL(f));
      setResult(null);
    }
  };

  const handleRunSearch = async () => {
    if (!file) return;
    setIsLoading(true);
    try {
      const data = await reverseSignalGrounding(file);
      setResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const resetTrace = () => {
    setResult(null);
    setFile(null);
    setPreview(null);
  };

  // UI Logic for Verdict
  const isManipulated = result?.manipulationDetected;
  const hasSources = result?.sources && result?.sources.length > 0;
  const score = result?.confidence || 0;

  // Verdict Configuration
  let verdictConfig = {
    title: "SOURCE VERIFIED",
    icon: CheckCircle2,
    color: "text-emerald-500",
    borderColor: "border-emerald-500/30",
    bg: "bg-emerald-500/5",
    description: "Matches found. Content appears consistent with known sources."
  };

  if (isManipulated) {
    verdictConfig = {
      title: "MANIPULATION DETECTED",
      icon: AlertTriangle,
      color: "text-danger",
      borderColor: "border-danger/30",
      bg: "bg-danger/5",
      description: "Visual discrepancies found compared to online sources."
    };
  } else if (!hasSources) {
    verdictConfig = {
      title: "ORIGIN UNKNOWN",
      icon: XCircle,
      color: "text-yellow-500",
      borderColor: "border-yellow-500/30",
      bg: "bg-yellow-500/5",
      description: "No direct visual matches found in the global index."
    };
  }

  const getHostname = (url: string) => {
    try {
      return new URL(url).hostname.replace('www.', '');
    } catch (e) {
      return 'Unknown Source';
    }
  };

  return (
    <div className="min-h-[calc(100vh-10rem)] flex flex-col relative font-sans">
      <AnimatePresence mode="wait">
        {isLoading && <ProcessingScreen label="Conducting Global Signal Trace..." />}
        
        {!result && !isLoading ? (
          // UPLOAD VIEW
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
            transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
            className="flex-grow flex flex-col max-w-5xl mx-auto w-full justify-center py-20"
          >
            <div className="mb-16 text-center space-y-4">
              <div className="flex items-center justify-center gap-3">
                <div className="h-px w-10 bg-neon/30"></div>
                <span className="text-[11px] font-black text-neon uppercase tracking-[0.6em]">Finding the source</span>
                <div className="h-px w-10 bg-neon/30"></div>
              </div>
              <h2 className="text-7xl md:text-8xl font-black tracking-tighter uppercase italic leading-[0.8] transition-all">
                <span className="text-white">Find</span><br />
                <span className="text-neon">Original Source</span>
              </h2>
              <p className="text-white/30 text-xl font-light italic max-w-lg mx-auto leading-relaxed pt-2">
                Find out where an image actually came from on the internet.
              </p>
            </div>

            <motion.div
              whileHover={{ scale: 1.005 }}
              whileTap={{ scale: 0.995 }}
              onClick={() => fileInputRef.current?.click()}
              className="group relative glass border-2 border-dashed border-white/5 rounded-[4rem] transition-all duration-700 hover:border-neon hover:shadow-[0_0_100px_rgba(0,255,156,0.1)] cursor-pointer overflow-hidden"
            >
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
              <div className="absolute inset-0 bg-neon/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>

              <div className="p-24 flex flex-col items-center gap-12 relative z-10">
                {preview ? (
                  <div className="relative w-80 aspect-video rounded-3xl overflow-hidden border border-white/10 shadow-3xl bg-black">
                    <img src={preview} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-100" alt="Preview" />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors duration-700"></div>
                    <div className="absolute top-0 inset-x-0 h-1 bg-neon/50 animate-scan-sweep-fast shadow-neon"></div>
                  </div>
                ) : (
                  <div className="w-28 h-28 rounded-[2rem] bg-white/5 border border-white/5 flex items-center justify-center text-white/10 group-hover:text-neon group-hover:scale-110 transition-all duration-500 shadow-2xl">
                    <Search size={48} />
                  </div>
                )}

                <div className="space-y-4 text-center">
                  <h3 className="text-3xl font-black uppercase italic tracking-tighter text-white">Choose an image</h3>
                  <p className="text-white/40 text-lg font-light italic max-w-md mx-auto leading-relaxed">
                    Searching global websites to find where this image first appeared.
                  </p>
                </div>

                {file && (
                  <motion.button
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    onClick={(e) => { e.stopPropagation(); handleRunSearch(); }}
                    className="px-16 py-6 bg-white text-charcoal font-black rounded-2xl hover:bg-neon transition-all hover:scale-105 active:scale-95 uppercase tracking-[0.3em] text-[11px] shadow-[0_30px_60px_rgba(0,255,156,0.3)] flex items-center gap-4"
                  >
                    <Globe size={18} />
                    Find Source
                  </motion.button>
                )}
              </div>
            </motion.div>

            <button onClick={onBack} className="mt-12 mx-auto group flex items-center gap-4 text-white/20 hover:text-white transition-all">
              <div className="w-10 h-10 rounded-full border border-white/5 flex items-center justify-center group-hover:border-white/20">
                <ArrowLeft size={16} />
              </div>
              <span className="text-[11px] font-black uppercase tracking-[0.4em]">Go Back</span>
            </button>
          </motion.div>
        ) : (
          // RESULT DASHBOARD VIEW
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full pt-4 pb-20 max-w-7xl mx-auto px-6 lg:px-8 space-y-8"
          >
            {/* Header */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 py-6 border-b border-white/5">
              <div className="flex items-center gap-4">
                <button onClick={resetTrace} className="p-3 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors">
                  <ArrowLeft size={18} />
                </button>
                <div>
                  <h1 className="text-xl font-black uppercase tracking-widest text-white flex items-center gap-3">
                    Intelligence Dossier
                    <span className="text-[10px] font-mono text-neon bg-neon/10 px-2 py-0.5 rounded border border-neon/20">LIVE</span>
                  </h1>
                  <p className="text-[10px] font-mono text-white/30 tracking-widest mt-1">ID: 0x{result?.id?.slice(0,8) || 'UNKNOWN'}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={resetTrace} className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-charcoal text-[10px] font-black uppercase tracking-[0.2em] hover:bg-neon transition-all">
                  <RefreshCcw size={14} /> New Trace
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Visual Evidence (5 cols) */}
              <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-8">
                <div className="relative rounded-[2.5rem] overflow-hidden border border-white/10 bg-[#080808] group shadow-2xl">
                  {/* Image */}
                  <div className="relative aspect-square md:aspect-[4/3] w-full bg-black/50 flex items-center justify-center p-8">
                    <img 
                      src={preview!} 
                      className="max-w-full max-h-full object-contain rounded-lg shadow-lg relative z-10"
                      alt="Trace Subject"
                    />
                    {/* Scanning Grid Overlay */}
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
                    <div className="absolute inset-0 bg-grid-forensic opacity-[0.1] pointer-events-none"></div>
                    
                    {/* Animated Corners */}
                    <div className="absolute top-6 left-6 w-8 h-8 border-t-2 border-l-2 border-white/20 rounded-tl-xl"></div>
                    <div className="absolute top-6 right-6 w-8 h-8 border-t-2 border-r-2 border-white/20 rounded-tr-xl"></div>
                    <div className="absolute bottom-6 left-6 w-8 h-8 border-b-2 border-l-2 border-white/20 rounded-bl-xl"></div>
                    <div className="absolute bottom-6 right-6 w-8 h-8 border-b-2 border-r-2 border-white/20 rounded-br-xl"></div>
                  </div>

                  {/* Visual Footer */}
                  <div className="p-6 bg-[#0A0A0A] border-t border-white/5 flex justify-between items-center">
                    <div>
                      <span className="text-[9px] font-black uppercase text-white/30 tracking-[0.3em] block mb-1">Fingerprint</span>
                      <span className="text-xs font-mono text-white/60">SHA-256 Verified</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5">
                      <Scan size={14} className="text-neon" />
                      <span className="text-[10px] font-black text-neon tracking-widest">VISUAL_LOCK</span>
                    </div>
                  </div>
                </div>

                {/* Technical Signals */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-5 rounded-2xl bg-white/5 border border-white/5">
                    <div className="flex items-center gap-2 mb-2 text-white/40">
                      <ShieldCheck size={16} />
                      <span className="text-[9px] font-black uppercase tracking-widest">Confidence</span>
                    </div>
                    <span className={`text-3xl font-black italic tracking-tighter ${score > 80 ? 'text-neon' : score > 50 ? 'text-yellow-500' : 'text-white/60'}`}>
                      {score}%
                    </span>
                  </div>
                  <div className="p-5 rounded-2xl bg-white/5 border border-white/5">
                    <div className="flex items-center gap-2 mb-2 text-white/40">
                      <Globe size={16} />
                      <span className="text-[9px] font-black uppercase tracking-widest">Matches</span>
                    </div>
                    <span className="text-3xl font-black italic tracking-tighter text-white">
                      {result?.sources?.length || 0}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column: Intelligence Dossier (7 cols) */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* Verdict Card */}
                <div className={`p-8 rounded-[2.5rem] border ${verdictConfig.borderColor} ${verdictConfig.bg} relative overflow-hidden`}>
                  <div className="relative z-10 flex items-start gap-6">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-black/20 backdrop-blur-md border border-white/10 ${verdictConfig.color}`}>
                      <verdictConfig.icon size={28} />
                    </div>
                    <div className="space-y-2">
                      <h2 className={`text-3xl font-black italic uppercase tracking-tighter ${verdictConfig.color}`}>
                        {verdictConfig.title}
                      </h2>
                      <p className="text-white/70 text-sm font-light leading-relaxed max-w-md">
                        {verdictConfig.description}
                      </p>
                    </div>
                  </div>
                  {/* Decorative Scan Line */}
                  <div className={`absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-${verdictConfig.color.split('-')[1]}-500/10 to-transparent pointer-events-none`}></div>
                </div>

                {/* Intelligence Summary */}
                <div className="p-8 rounded-[2.5rem] bg-[#0A0A0A] border border-white/5 space-y-6">
                  <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                    <FileSearch size={18} className="text-white/40" />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Executive Summary</span>
                  </div>
                  <p className="text-base text-white/80 font-light leading-loose">
                    {result?.summary || "Analysis complete. Review the source list below for details."}
                  </p>
                </div>

                {/* Sources List - Removed max-h-[600px] and overflow to allow full page scroll */}
                <div className="bg-[#0A0A0A] border border-white/5 rounded-[2.5rem] overflow-hidden flex flex-col">
                  <div className="p-8 pb-4 flex items-center justify-between border-b border-white/5 bg-white/[0.02]">
                    <div className="flex items-center gap-3">
                      <Globe size={18} className="text-white/40" />
                      <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Detected Origins</span>
                    </div>
                    <span className="text-[10px] font-mono text-white/20">{result?.sources?.length || 0} LINKS FOUND</span>
                  </div>

                  <div className="p-4 space-y-2">
                    {result?.sources?.length > 0 ? (
                      result.sources.map((source: any, idx: number) => (
                        <div 
                          key={idx}
                          className="group flex items-center gap-4 p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all"
                        >
                          <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center text-white/30 group-hover:text-neon transition-colors shrink-0">
                            <span className="font-mono text-xs font-bold">{idx + 1}</span>
                          </div>
                          
                          <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                            <a 
                              href={source.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-sm font-bold text-white truncate hover:text-neon transition-colors block"
                            >
                              {source.title}
                            </a>
                            <div className="flex items-center gap-2 text-xs text-white/30 font-mono truncate">
                              <span className="truncate">{getHostname(source.url)}</span>
                            </div>
                          </div>

                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => navigator.clipboard.writeText(source.url)}
                              className="p-2 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors"
                              title="Copy Link"
                            >
                              <Copy size={14} />
                            </button>
                            <a 
                              href={source.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="p-2 rounded-lg bg-white/10 hover:bg-neon hover:text-black text-white transition-all"
                              title="Open Source"
                            >
                              <ExternalLink size={14} />
                            </a>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="py-16 text-center">
                        <p className="text-white/30 text-sm italic">No direct public sources found in this sweep.</p>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes scan-sweep-fast {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        .animate-scan-sweep-fast {
          animation: scan-sweep-fast 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default ReverseGrounding;
