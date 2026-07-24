import React, { useEffect, useState } from 'react';
import { AnalysisResult } from '../types';
import { generateForensicCertificate } from '../services/geminiService';
import ProcessingScreen from './ProcessingScreen';
import { FileText, Download, ArrowLeft, ShieldCheck, Printer, FileSearch } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const JudicialReport: React.FC<{ result: AnalysisResult; onBack: () => void }> = ({ result, onBack }) => {
  const [reportText, setReportText] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const content = await generateForensicCertificate(result);
        setReportText(content);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReport();
  }, [result]);

  const handleDownloadTxt = () => {
    if (!reportText) return;
    const element = document.createElement("a");
    const file = new Blob([reportText], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `PROOFY_ANALYSIS_${result.id}_${result.fileMetadata.name}.txt`;
    document.body.appendChild(element);
    element.click();
    element.remove();
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-32">
      {isLoading && <ProcessingScreen label="Generating Forensic Manifest..." />}
      
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-10">
        <div className="space-y-6">
          <button onClick={onBack} className="group flex items-center gap-4 text-white/20 hover:text-neon transition-all">
            <div className="w-10 h-10 rounded-full border border-white/5 flex items-center justify-center group-hover:border-neon/40">
              <ArrowLeft size={16} />
            </div>
            <span className="text-[11px] font-black uppercase tracking-[0.4em]">Return to Core</span>
          </button>
          <div className="space-y-2">
            <h2 className="text-6xl font-black tracking-tighter uppercase italic leading-[0.8] flex flex-col">
              <span className="text-white">Full</span>
              <span className="text-neon">Analysis Log</span>
            </h2>
            <div className="flex items-center gap-4">
              <div className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-lg flex items-center gap-2">
                <ShieldCheck size={12} className="text-emerald-500" />
                <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Digital_Sovereignty_Verified</span>
              </div>
              <p className="text-white/20 text-sm italic font-light tracking-tight max-sm">
                Final proof of whether the file is AI-generated or real.
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => window.print()}
            className="w-14 h-14 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl flex items-center justify-center text-white/40 hover:text-white transition-all shadow-xl group"
          >
            <Printer size={20} className="group-hover:scale-110 transition-transform" />
          </button>
          <button
            onClick={handleDownloadTxt}
            className="px-10 py-5 bg-white text-charcoal font-black rounded-2xl text-[11px] uppercase tracking-[0.3em] hover:bg-neon transition-all shadow-[0_20px_40px_rgba(0,0,0,0.5)] flex items-center gap-4"
          >
            <Download size={16} />
            Export Protocol
          </button>
        </div>
      </header>

      {!isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="group relative"
        >
          <div className="absolute -inset-4 bg-neon/5 rounded-[4.5rem] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none"></div>

          <div className="relative glass border border-white/10 p-16 md:p-24 rounded-[4rem] shadow-2xl bg-[#080808]/80 backdrop-blur-3xl overflow-hidden font-mono text-[13px] md:text-sm leading-relaxed text-white/70 print:bg-white print:text-black print:p-10 print:rounded-none">
            <div className="absolute top-0 right-0 p-20 opacity-[0.03] pointer-events-none rotate-12 scale-150 group-hover:opacity-[0.08] group-hover:rotate-0 transition-all duration-1000">
              <FileSearch size={300} />
            </div>

            <div className="relative z-10">
              <div className="mb-16 pb-16 border-b border-white/5 flex flex-col md:flex-row justify-between items-start gap-10 print:border-black/10">
                <div className="space-y-4">
                  <span className="px-6 py-2 bg-neon/10 border border-neon/20 rounded-full text-neon text-[10px] font-black uppercase tracking-[0.4em]">Official_Analysis_Export</span>
                  <div className="space-y-1 pt-4">
                    <h4 className="text-white print:text-black font-black uppercase text-xl tracking-tighter italic">Source: 0x{result.id.substring(0, 12).toUpperCase()}</h4>
                    <p className="text-white/30 print:text-black/40 text-[10px] font-mono tracking-widest">TIMESTAMP: {new Date(result.timestamp).toISOString()}</p>
                  </div>
                </div>
                <div className="text-right space-y-2">
                  <div className="flex items-center justify-end gap-3">
                    <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Sovereignty_Hash</span>
                    <div className="w-12 h-1 bg-neon/40"></div>
                  </div>
                  <p className="text-[11px] font-mono text-white/40">SHA256: 9F8E...{result.id.slice(-4).toUpperCase()}</p>
                </div>
              </div>

              <pre className="whitespace-pre-wrap break-words leading-[1.8] tracking-tight selection:bg-neon selection:text-charcoal transition-all">
                {reportText}
              </pre>

              <div className="mt-24 pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-10 opacity-30 print:border-black/10 print:text-black">
                <div className="flex items-center gap-6">
                  <FileText size={20} />
                  <span className="text-[9px] font-black uppercase tracking-[0.6em]">End_Of_Intelligence_Transmission</span>
                </div>
                <div className="w-40 h-px bg-white/10 hidden md:block"></div>
                <span className="text-[9px] font-mono font-bold uppercase tracking-widest">PROOFY AI ENGINE V2.0.4</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      <footer className="pt-20 text-center space-y-6">
        <div className="flex items-center justify-center gap-4 opacity-10">
          <div className="h-px w-20 bg-white"></div>
          <div className="w-2 h-2 rounded-full bg-white"></div>
          <div className="h-px w-20 bg-white"></div>
        </div>
        <p className="text-white/10 text-[9px] font-mono uppercase tracking-[0.8em]">Analysis complete.</p>
      </footer>
    </div>
  );
};

export default JudicialReport;