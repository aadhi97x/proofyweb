import React, { useState, useCallback, useEffect } from 'react';
import { View, AnalysisResult } from './types.ts';
import Hero from './components/Hero.tsx';
import TrustStrip from './components/TrustStrip.tsx';
import UploadZone from './components/UploadZone.tsx';
import HowItWorks from './components/HowItWorks.tsx';
import AnalysisDeepDive from './components/AnalysisDeepDive.tsx';
import ResultsPreview from './components/ResultsPreview.tsx';
import ProcessingScreen from './components/ProcessingScreen.tsx';
import ResultsScreen from './components/ResultsScreen.tsx';
import AudioLab from './components/AudioLab.tsx';
import SignalLibrary from './components/SignalLibrary.tsx';
import BackgroundGraphics from './components/BackgroundGraphics.tsx';
import HistoryPanel from './components/HistoryPanel.tsx';
import TextInterrogator from './components/TextInterrogator.tsx';
import ReverseGrounding from './components/ReverseGrounding.tsx';
import JudicialReport from './components/JudicialReport.tsx';
import BatchTriage from './components/BatchTriage.tsx';
import AnalysisTimeline from './components/AnalysisTimeline.tsx';
import Sidebar from './components/Sidebar.tsx';
import Logo from './components/Logo.tsx';
import FloatingAssistant from './components/FloatingAssistant.tsx';
import { analyzeMedia } from './services/geminiService.ts';
import { motion, AnimatePresence } from 'framer-motion';
import { ZapOff, RefreshCw } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.HOME);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [history, setHistory] = useState<AnalysisResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [privacyMode, setPrivacyMode] = useState(true);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  // Lifted state for Batch Triage persistence
  const [batchFiles, setBatchFiles] = useState<File[]>([]);
  const [batchResults, setBatchResults] = useState<AnalysisResult[]>([]);
  const [isBatchMode, setIsBatchMode] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('proofy_history');
    if (saved) {
      try { setHistory(JSON.parse(saved)); } catch (e) { console.error(e); }
    }
  }, []);

  const saveToHistory = (result: AnalysisResult) => {
    setHistory(prev => {
      const newHistory = [result, ...prev].slice(0, 15);
      localStorage.setItem('proofy_history', JSON.stringify(newHistory));
      return newHistory;
    });
  };

  const handleUpload = useCallback(async (file: File) => {
    setCurrentView(View.PROCESSING);
    setError(null);
    const metadata = {
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
      type: file.type,
      preview: URL.createObjectURL(file)
    };

    try {
      const result = await analyzeMedia(file, metadata);
      setAnalysisResult(result);
      saveToHistory(result);
      setCurrentView(View.RESULTS);
    } catch (err: any) {
      console.error("Analysis Error:", err);
      if (err.message === "API_KEY_MISSING") {
        setError("AI Key Required for Analysis");
        if ((window as any).aistudio) {
          (window as any).aistudio.openSelectKey();
        }
      } else if (err.message?.includes("Safety")) {
        setError("Security Violation: Target content breached local safety protocols.");
      } else if (err.message?.includes("429") || err.message?.includes("quota") || err.message?.includes("exhausted")) {
        let delay = "";
        try {
          const match = err.message.match(/retry in ([\d\.]+s)/);
          if (match) delay = ` Please wait for ${match[1]}.`;
        } catch (e) { }
        setError(`System Busy: Limit reached.${delay} Try again a bit later.`);
      } else {
        setError(err.message || "Error: The system ran into a problem.");
      }
      setCurrentView(View.HOME);
    }
  }, [history]);

  const reset = () => {
    setCurrentView(View.HOME);
    setAnalysisResult(null);
    setError(null);
    // Clear batch state on full reset
    setBatchFiles([]);
    setBatchResults([]);
    setIsBatchMode(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openKeySelection = () => {
    if ((window as any).aistudio) {
      (window as any).aistudio.openSelectKey();
    }
  };

  return (
    <div className="min-h-screen bg-charcoal text-white flex flex-col selection:bg-neon selection:text-charcoal font-sans relative">
      <BackgroundGraphics />

      {/* Only show global header on Home view to prevent double-header overlap */}
      {currentView === View.HOME && (
        <header className="fixed top-0 inset-x-0 h-24 z-[50] px-10 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-8">
            <button
              onClick={() => setSidebarExpanded(true)}
              className="pointer-events-auto flex items-center justify-center group bg-white/10 backdrop-blur-3xl w-14 h-14 rounded-[1.25rem] border border-white/5 hover:border-neon transition-all shadow-[0_20px_40px_rgba(0,0,0,0.3)]"
            >
              <div className="flex flex-col items-center justify-center gap-1.5">
                <div className="w-6 h-[2.5px] bg-white group-hover:bg-neon transition-colors rounded-full"></div>
                <div className="w-6 h-[2.5px] bg-white group-hover:bg-neon transition-colors rounded-full"></div>
                <div className="w-3 h-[2.5px] bg-white group-hover:bg-neon transition-colors self-start rounded-full"></div>
              </div>
            </button>
          </div>

          <div className="flex items-center gap-8">
            <Logo size="md" onClick={reset} className="pointer-events-auto hover:scale-105 transition-transform" />
          </div>
        </header>
      )}

      <Sidebar
        currentView={currentView}
        onNavigate={(v) => {
          setCurrentView(v);
        }}
        onReset={reset}
        expanded={sidebarExpanded}
        onToggle={() => setSidebarExpanded(!sidebarExpanded)}
        privacyMode={privacyMode}
        setPrivacyMode={setPrivacyMode}
      />

      <div className="flex-grow flex flex-col relative z-10 pt-0">
        <main className={`flex-grow container mx-auto px-6 md:px-12 ${currentView === View.HOME ? 'pt-16' : ''} pb-24 max-w-7xl`}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
              className="w-full"
            >
              {currentView === View.HOME && (
                <div className="space-y-32">
                  <section id="hero-flow" className="pt-0">
                    <Hero />
                    <TrustStrip />
                  </section>

                  <div className="max-w-6xl mx-auto space-y-32">
                    <UploadZone onUpload={handleUpload} />

                    {error && (
                      <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="p-10 glass border border-white/5 rounded-[2.5rem] flex flex-col md:flex-row items-center gap-8 relative overflow-hidden backdrop-blur-3xl shadow-[0_40px_100px_rgba(0,0,0,0.4)] bg-black/40"
                      >
                        <div className={`absolute inset-0 opacity-[0.03] ${error.includes("Overloaded") ? 'bg-neon' : 'bg-danger'} animate-pulse`}></div>

                        <div className={`w-20 h-20 rounded-3xl flex items-center justify-center border ${error.includes("Overloaded") ? 'border-neon/20 bg-neon/5 text-neon' : 'border-danger/20 bg-danger/5 text-danger'} shrink-0 relative z-10 shadow-2xl`}>
                          {error.includes("Overloaded") ? <RefreshCw size={32} className="animate-spin-slow" /> : <ZapOff size={32} />}
                        </div>

                        <div className="flex-grow text-center md:text-left relative z-10 space-y-1">
                          <h4 className={`font-black italic uppercase tracking-[0.4em] text-sm ${error.includes("Busy") ? 'text-neon' : 'text-danger'} mb-1`}>
                            {error.includes("Busy") ? "System Cooling Down" : "Something went wrong"}
                          </h4>
                          <p className="text-white/60 text-lg md:text-xl font-light italic leading-snug max-w-2xl">{error}</p>

                          {error.includes("API Key") && (
                            <button
                              onClick={openKeySelection}
                              className="mt-6 px-10 py-4 bg-white/10 hover:bg-white/20 text-white font-black rounded-2xl text-[10px] uppercase tracking-widest transition-all border border-white/10"
                            >
                              Connect AI Key
                            </button>
                          )}
                        </div>
                      </motion.div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                      <QuickToolCard
                        title="Check Many"
                        description="Upload several items at once to see if they are real or fake."
                        icon="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25"
                        color="text-neon"
                        onClick={() => setCurrentView(View.BATCH_TRIAGE)}
                      />
                      <QuickToolCard
                        title="Source Finder"
                        description="Find out where an image actually came from on the internet."
                        icon="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        color="text-cyber"
                        onClick={() => setCurrentView(View.REVERSE_GROUNDING)}
                      />
                    </div>

                    <HowItWorks />
                    <AnalysisDeepDive />
                    <ResultsPreview />
                  </div>
                </div>
              )}

              {currentView === View.PROCESSING && <ProcessingScreen />}
              {currentView === View.RESULTS && analysisResult && (
                <ResultsScreen 
                  result={analysisResult} 
                  onReupload={reset} 
                  onOpenReport={() => setCurrentView(View.JUDICIAL_REPORT)} 
                  onOpenTimeline={() => setCurrentView(View.FORENSIC_TIMELINE)}
                  onBack={isBatchMode ? () => setCurrentView(View.BATCH_TRIAGE) : undefined}
                />
              )}
              {currentView === View.JUDICIAL_REPORT && analysisResult && <JudicialReport result={analysisResult} onBack={() => setCurrentView(View.RESULTS)} />}
              {currentView === View.FORENSIC_TIMELINE && analysisResult && (
                <div>
                  <button onClick={() => setCurrentView(View.RESULTS)} className="mb-8 text-[10px] font-black uppercase tracking-[0.4em] text-white/30 hover:text-neon transition-colors flex items-center gap-3">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                    Back to Results
                  </button>
                  <AnalysisTimeline result={analysisResult} />
                </div>
              )}
              {currentView === View.BATCH_TRIAGE && (
                <BatchTriage 
                  onBack={reset} 
                  onResultSelect={(res) => { 
                    setAnalysisResult(res); 
                    setIsBatchMode(true);
                    setCurrentView(View.RESULTS); 
                  }} 
                  files={batchFiles}
                  setFiles={setBatchFiles}
                  results={batchResults}
                  setResults={setBatchResults}
                />
              )}
              {currentView === View.REVERSE_GROUNDING && <ReverseGrounding onBack={reset} />}
              {currentView === View.TEXT_LAB && <TextInterrogator onBack={reset} />}
              {currentView === View.AUDIO_LAB && (
                <AudioLab 
                  onBack={reset} 
                  onAnalyze={(result) => {
                    setAnalysisResult(result);
                    saveToHistory(result);
                    setCurrentView(View.RESULTS);
                  }}
                />
              )}
              {currentView === View.HISTORY && <HistoryPanel history={history} onSelect={(res) => { setAnalysisResult(res); setCurrentView(View.RESULTS); }} />}
              {currentView === View.SIGNAL_LIBRARY && <SignalLibrary />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <FloatingAssistant currentView={currentView} analysisResult={analysisResult} />
    </div>
  );
};

const QuickToolCard: React.FC<{ title: string, description: string, icon: string, color: string, onClick: () => void }> = ({ title, description, icon, color, onClick }) => (
  <button
    onClick={onClick}
    className="glass p-14 text-left overflow-hidden relative border border-white/5 rounded-[3.5rem] bg-black/40 w-full group transition-all duration-700 hover:shadow-[0_30px_80px_rgba(0,0,0,0.6)] hover:-translate-y-2 hover:border-white/10"
  >
    <div className={`w-18 h-18 rounded-[1.75rem] bg-white/5 backdrop-blur-xl border border-white/5 flex items-center justify-center mb-10 group-hover:scale-110 transition-all duration-700 ${color} group-hover:shadow-[0_0_40px_currentColor] group-hover:bg-white/10`}>
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d={icon} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
    </div>
    <div className="space-y-4">
      <h3 className="font-black text-4xl tracking-tighter italic uppercase text-white leading-none">
        {title.split(' ')[0]} <span className="text-white/10 group-hover:text-white/40 transition-colors">{title.split(' ')[1] || ''}</span>
      </h3>
      <p className="text-white/40 text-lg leading-relaxed italic font-light group-hover:text-white/60 transition-colors duration-500 max-w-[280px]">{description}</p>
    </div>

    <div className="mt-12 flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.6em] text-white/10 group-hover:text-neon transition-colors duration-500">
      Open Tool
      <div className="h-px flex-grow bg-white/5 group-hover:bg-neon/20 transition-colors"></div>
    </div>

    {/* Decorative Accents */}
    <div className="absolute top-8 right-8 text-white/5 font-mono text-[8px] tracking-widest hidden group-hover:block transition-all italic">0x{Math.random().toString(16).slice(2, 6).toUpperCase()}</div>
  </button>
);

export default App;