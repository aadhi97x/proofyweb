
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { analyzeText } from '../services/geminiService';
import ProcessingScreen from './ProcessingScreen';
import { ArrowLeft, Search, ShieldCheck, AlertTriangle, ExternalLink, Ghost, Brain, FileSearch, Sparkles, Copy, Globe } from 'lucide-react';

interface TextInterrogatorProps {
  onBack: () => void;
}

const TextInterrogator: React.FC<TextInterrogatorProps> = ({ onBack }) => {
  const [text, setText] = useState('');
  const [mode, setMode] = useState<'AI_DETECT' | 'FACT_CHECK'>('AI_DETECT');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);

  const handleInterrogate = async () => {
    if (!text.trim()) return;
    setIsLoading(true);
    setResult(null);
    try {
      const res = await analyzeText(text, mode);
      setResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const getVerdictStyles = (label: any = "") => {
    const l = (label || "").toString().toLowerCase();
    if (l.includes('human') || l.includes('real') || l.includes('supported')) return 'text-emerald-500 border-emerald-500/20 bg-emerald-500/5 shadow-[0_0_30px_rgba(16,185,129,0.1)]';
    if (l.includes('ai') || l.includes('fake') || l.includes('disputed')) return 'text-danger border-danger/20 bg-danger/5 shadow-[0_0_30px_rgba(255,45,85,0.1)]';
    return 'text-yellow-500 border-yellow-500/20 bg-yellow-500/5 shadow-[0_0_30px_rgba(234,179,8,0.1)]';
  };

  const getHostname = (url: string) => {
    try {
      return new URL(url).hostname.replace('www.', '');
    } catch (e) {
      return 'Unknown';
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-16 pb-32">
      {isLoading && (
        <ProcessingScreen label={mode === 'AI_DETECT' ? 'Analyzing Linguistic Patterns...' : 'Cross-Referencing Global Facts...'} />
      )}
      
      <header className="flex flex-col xl:flex-row xl:items-end justify-between gap-12">
        <div className="space-y-6">
          <button onClick={onBack} className="group flex items-center gap-4 text-white/20 hover:text-neon transition-all">
            <div className="w-10 h-10 rounded-full border border-white/5 flex items-center justify-center group-hover:border-neon/40">
              <ArrowLeft size={16} />
            </div>
            <span className="text-[11px] font-black uppercase tracking-[0.4em]">Go Back</span>
          </button>
          <div className="space-y-2">
            <h2 className="text-6xl font-black tracking-tighter uppercase italic leading-[0.8] flex flex-col">
              <span className="text-white">AI Text</span>
              <span className="text-neon">Checker</span>
            </h2>
            <p className="text-white/30 text-lg italic font-light tracking-tight max-w-md">
              Checking for AI patterns and verifying if the facts are true.
            </p>
          </div>
        </div>

        <div className="flex bg-white/5 p-2 rounded-3xl border border-white/5 shadow-2xl backdrop-blur-3xl">
          <button
            onClick={() => { setMode('AI_DETECT'); setResult(null); }}
            className={`px-10 py-4 rounded-2xl text-[10px] font-black transition-all tracking-[0.3em] uppercase ${mode === 'AI_DETECT' ? 'bg-white text-charcoal shadow-xl scale-105' : 'text-white/40 hover:text-white'}`}
          >
            Check for AI
          </button>
          <button
            onClick={() => { setMode('FACT_CHECK'); setResult(null); }}
            className={`px-10 py-4 rounded-2xl text-[10px] font-black transition-all tracking-[0.3em] uppercase ${mode === 'FACT_CHECK' ? 'bg-white text-charcoal shadow-xl scale-105' : 'text-white/40 hover:text-white'}`}
          >
            Check Facts
          </button>
        </div>
      </header>

      <section className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative group lg:max-w-5xl mx-auto"
        >
          <div className="absolute -inset-4 bg-neon/10 rounded-[4rem] blur-3xl opacity-0 group-focus-within:opacity-100 transition-all duration-1000 pointer-events-none"></div>
          <div className="relative">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              disabled={isLoading}
              placeholder={mode === 'AI_DETECT' ? "Paste text here to check if it was written by AI..." : "Paste text here to see if the information is true..."}
              className="w-full h-[500px] bg-surface/40 glass border border-white/5 rounded-[3.5rem] p-16 text-white placeholder:text-white/10 focus:border-neon focus:ring-1 focus:ring-neon/20 outline-none transition-all font-sans text-2xl font-light italic leading-relaxed resize-none shadow-[0_40px_80px_rgba(0,0,0,0.5)] disabled:opacity-50 no-scrollbar"
            />
            <div className="absolute top-10 right-10 flex gap-4 opacity-20 pointer-events-none">
              <Ghost size={24} />
              <Brain size={24} />
            </div>
          </div>
        </motion.div>

        <div className="lg:max-w-5xl mx-auto">
          {!isLoading && (
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={handleInterrogate}
              disabled={!text.trim()}
              className="w-full py-8 bg-white text-charcoal font-black rounded-[2.5rem] hover:bg-neon transition-all shadow-[0_30px_60px_rgba(0,255,156,0.5)] disabled:opacity-10 uppercase tracking-[0.4em] text-xs flex items-center justify-center gap-4 group"
            >
              {mode === 'AI_DETECT' ? 'Check Text' : 'Search for Proof'}
              <Sparkles size={20} className="group-hover:rotate-12 transition-transform" />
            </motion.button>
          )}
        </div>
      </section>

      <AnimatePresence>
        {result && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-10"
          >
            <div className="lg:col-span-4 space-y-8">
              <div className="p-12 glass border border-white/5 rounded-[3.5rem] space-y-12 shadow-2xl sticky top-32">
                <div className="text-center space-y-6">
                  <span className="text-[10px] text-white/20 font-black uppercase tracking-[0.5em] block">AI Analysis Results</span>
                  <div className="relative inline-flex flex-col items-center justify-center">
                    <span className={`text-8xl font-black tracking-tighter italic leading-none ${getVerdictStyles(result.verdictLabel || 'UNCERTAIN').split(' ')[0]}`}>
                      {result.aiProbability ?? result.confidence ?? '??'}<span className="text-white/20">%</span>
                    </span>
                    {result.isSafeMode && (
                      <div className="mt-4 bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 px-4 py-1.5 rounded-xl font-black italic text-[9px] tracking-widest animate-pulse flex items-center gap-2 shadow-2xl">
                        <Sparkles size={12} /> Safe Mode Stable
                      </div>
                    )}
                  </div>
                  <div className={`py-6 rounded-[2rem] border font-black text-[11px] tracking-[0.4em] uppercase shadow-2xl ${getVerdictStyles(result.verdictLabel || 'UNCERTAIN')}`}>
                    {(result.verdictLabel || 'AI PROBABILITY').replace(/_/g, ' ')}
                  </div>
                </div>

                {mode === 'AI_DETECT' && result.aiSignals && result.aiSignals.length > 0 && (
                  <div className="space-y-6 pt-10 border-t border-white/5">
                    <div className="space-y-4">
                      <p className="text-[11px] font-black text-white/20 uppercase tracking-[0.5em]">AI Clues Found</p>
                      <div className="flex flex-wrap gap-3">
                        {(result.aiSignals || []).map((s: string, i: number) => (
                          <span key={i} className="px-5 py-2.5 bg-danger/5 border border-danger/10 rounded-2xl text-[10px] text-danger font-black uppercase tracking-widest">{s}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-8 space-y-10">
              <div className="p-16 glass border border-white/5 rounded-[4rem] space-y-12 shadow-2xl bg-surface/20">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-neon/10 border border-neon/20 flex items-center justify-center text-neon">
                      <FileSearch size={22} />
                    </div>
                    <h3 className="text-[11px] font-black tracking-[0.6em] uppercase text-white/40">Our Summary</h3>
                  </div>
                  <p className="text-3xl font-light italic leading-relaxed text-white/90 underline decoration-white/5 underline-offset-[12px] decoration-8 hover:decoration-neon/20 transition-all">"{result.summary}"</p>
                </div>

                {result.claims && Array.isArray(result.claims) && result.claims.length > 0 && (
                  <div className="space-y-8 pt-12 border-t border-white/5">
                    <h4 className="text-[11px] font-black text-white/20 uppercase tracking-[0.6em]">Checking individual things said</h4>
                    <div className="grid gap-6">
                      {result.claims.map((c: any, i: number) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="p-8 glass border border-white/5 rounded-[2.5rem] flex flex-col md:flex-row gap-10 justify-between items-center group hover:bg-white/[0.02] transition-all"
                        >
                          <div className="space-y-4 flex-grow">
                            <div className="flex items-center gap-4">
                              <span className={`text-[9px] font-black px-5 py-2 rounded-full border uppercase tracking-widest leading-none ${getVerdictStyles(c.status)}`}>
                                {(c.status || 'unknown').replace(/_/g, ' ')}
                              </span>
                              <div className="h-px flex-grow bg-white/5"></div>
                            </div>
                            <p className="text-xl font-bold text-white/90 italic tracking-tight">{c.claim}</p>
                          </div>
                          {c.sourceUrl && (
                            <a href={c.sourceUrl} target="_blank" className="w-16 h-16 rounded-[1.5rem] bg-white/5 flex items-center justify-center text-white/20 hover:text-neon hover:bg-neon/10 transition-all shrink-0">
                              <ExternalLink size={24} />
                            </a>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {result.sources && Array.isArray(result.sources) && result.sources.length > 0 && (
                  <div className="space-y-8 pt-12 border-t border-white/5">
                    <h4 className="text-[11px] font-black text-white/20 uppercase tracking-[0.6em]">Trusted Sources Found</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {result.sources.map((s: any, i: number) => (
                        <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all group">
                          <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center text-white/30 group-hover:text-neon transition-colors shrink-0">
                            <Globe size={16} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <a 
                              href={s.url}
                              target="_blank"
                              rel="noopener noreferrer" 
                              className="text-sm font-bold text-white truncate block hover:text-neon transition-colors"
                            >
                              {s.title}
                            </a>
                            <div className="text-[10px] text-white/30 truncate font-mono mt-0.5">{getHostname(s.url)}</div>
                          </div>
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => navigator.clipboard.writeText(s.url)} className="p-2 hover:text-white text-white/30 transition-colors">
                              <Copy size={14} />
                            </button>
                            <a href={s.url} target="_blank" rel="noopener noreferrer" className="p-2 hover:text-neon text-white/30 transition-colors">
                              <ExternalLink size={14} />
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TextInterrogator;
