import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { analyzeMedia, generateForensicCertificate } from '../services/geminiService';
import { AnalysisResult, Verdict } from '../types';
import ProcessingScreen from './ProcessingScreen';
import { Download, FileText, Table, ArrowLeft, Trash2, Play, CheckCircle2, AlertCircle, Scan } from 'lucide-react';

interface BatchTriageProps {
  onBack: () => void;
  onResultSelect: (res: AnalysisResult) => void;
  files: File[];
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
  results: AnalysisResult[];
  setResults: React.Dispatch<React.SetStateAction<AnalysisResult[]>>;
}

const BatchTriage: React.FC<BatchTriageProps> = ({ onBack, onResultSelect, files, setFiles, results, setResults }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentFileIndex, setCurrentFileIndex] = useState(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const handleStartTriage = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    setResults([]);

    const processedResults: AnalysisResult[] = [];

    for (let i = 0; i < files.length; i++) {
      setCurrentFileIndex(i);
      const file = files[i];
      try {
        const metadata = {
          name: file.name,
          size: (file.size / 1024 / 1024).toFixed(2) + 'MB',
          type: file.type,
          preview: URL.createObjectURL(file)
        };
        const res = await analyzeMedia(file, metadata);
        processedResults.push(res);
        setResults([...processedResults]); // Update UI incrementally
      } catch (e) {
        console.error(`Failed to analyze ${file.name}`, e);
      }
    }
    setIsProcessing(false);
  };

  const exportToExcel = () => {
    if (results.length === 0) return;

    const headers = ["ID", "Filename", "Verdict", "Probability", "Confidence", "Summary", "Date"];
    const rows = results.map(r => [
      r.id,
      r.fileMetadata.name,
      r.verdict,
      r.deepfakeProbability,
      r.confidence,
      `"${r.summary.replace(/"/g, '""')}"`,
      new Date(r.timestamp).toISOString()
    ]);

    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", `PROOFY_BATCH_EXPORT_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportIndividualLogs = async () => {
    if (results.length === 0) return;

    for (const res of results) {
      const log = await generateForensicCertificate(res);
      const blob = new Blob([log], { type: 'text/plain' });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.setAttribute("download", `PROOFY_LOG_${res.id}_${res.fileMetadata.name}.txt`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      await new Promise(r => setTimeout(r, 200));
    }
  };

  const clearQueue = () => {
    setFiles([]);
    setResults([]);
  };

  const progressPercentage = files.length > 0 ? (results.length / files.length) * 100 : 0;

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-32">
      {isProcessing && (
        <ProcessingScreen label={`Checking file ${currentFileIndex + 1} of ${files.length}...`} />
      )}
      
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-10">
        <div className="space-y-6">
          <button onClick={onBack} className="group flex items-center gap-3 text-white/20 hover:text-neon transition-all">
            <div className="w-8 h-8 rounded-full border border-white/5 flex items-center justify-center group-hover:border-neon/40">
              <ArrowLeft size={14} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Go Back</span>
          </button>
          <div className="space-y-2">
            <h2 className="text-6xl font-black tracking-tighter uppercase italic leading-[0.8] flex flex-col">
              <span className="text-white">Check Many</span>
              <span className="text-neon">Files</span>
            </h2>
            <p className="text-white/30 text-lg italic font-light tracking-tight max-w-md">
              Upload several items at once to see if they are real or fake.
            </p>
          </div>
        </div>

        <AnimatePresence>
          {results.length > 0 && !isProcessing && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex gap-4 p-2 bg-white/5 backdrop-blur-3xl rounded-3xl border border-white/5 shadow-2xl"
            >
              <button
                onClick={exportToExcel}
                className="flex items-center gap-3 px-8 py-5 bg-surfaceLight hover:bg-white/10 border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all group"
              >
                <Table size={16} className="text-emerald-500 group-hover:scale-110 transition-transform" />
                Download Spreadsheet
              </button>
              <button
                onClick={exportIndividualLogs}
                className="flex items-center gap-3 px-8 py-5 bg-surfaceLight hover:bg-white/10 border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all group"
              >
                <FileText size={16} className="text-neon group-hover:scale-110 transition-transform" />
                Download Reports
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {files.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => document.getElementById('batch-upload')?.click()}
          className="group relative glass border-2 border-dashed border-white/5 rounded-[4rem] p-32 text-center transition-all duration-700 hover:border-neon hover:shadow-[0_0_100px_rgba(0,255,156,0.1)] cursor-pointer overflow-hidden"
        >
          <input type="file" id="batch-upload" multiple className="hidden" onChange={handleFileChange} />
          <div className="absolute inset-0 bg-neon/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>

          <div className="relative z-10 space-y-10">
            <div className="w-24 h-24 bg-white/5 border border-white/5 rounded-3xl flex items-center justify-center mx-auto text-white/10 group-hover:text-neon group-hover:scale-110 transition-all duration-500 shadow-2xl">
              <Download size={40} />
            </div>
            <div className="space-y-4">
              <h3 className="text-4xl font-black uppercase italic tracking-tighter text-white">Upload Files</h3>
              <p className="text-white/30 text-xl font-light italic max-w-sm mx-auto leading-relaxed">
                Add several images or videos to check them all at the same time.
              </p>
            </div>
            <div className="pt-6">
              <span className="text-[10px] font-black uppercase text-neon tracking-[0.6em] border border-neon/20 px-6 py-2 rounded-full">Ready to start</span>
            </div>
          </div>
        </motion.div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between px-6">
              <span className="text-[11px] font-black uppercase text-white/20 tracking-[0.5em]">File List</span>
              <span className="text-[11px] font-mono text-white/40 uppercase tracking-widest">{files.length} FILES ADDED</span>
            </div>
            <div className="space-y-4">
              {files.map((file, i) => {
                const res = results.find(r => r.fileMetadata.name === file.name);
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => res && onResultSelect(res)}
                    className={`glass border p-8 rounded-[2rem] flex items-center justify-between transition-all duration-500 group relative overflow-hidden ${res ? 'hover:border-white/20 cursor-pointer hover:bg-white/[0.02]' : i === currentFileIndex && isProcessing ? 'border-neon/30 bg-neon/[0.02]' : 'border-white/5 opacity-40'}`}
                  >
                    <div className="flex items-center gap-10 relative z-10">
                      <div className="relative">
                        <div className={`w-12 h-12 rounded-2xl border transition-all duration-700 flex items-center justify-center ${res ? (res.verdict === 'REAL' ? 'bg-emerald-500/10 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.2)] text-emerald-500' : 'bg-danger/10 border-danger shadow-[0_0_20px_rgba(255,45,85,0.2)] text-danger') :
                          i === currentFileIndex && isProcessing ? 'bg-neon/10 border-neon animate-pulse text-neon' : 'bg-white/5 border-white/5 text-white/20'
                          }`}>
                          {res ? (res.verdict === 'REAL' ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />) : <Scan size={24} className={i === currentFileIndex && isProcessing ? 'animate-spin-slow' : ''} />}
                        </div>
                      </div>
                      <div className="space-y-1.5 pt-1">
                        <p className="text-xl font-black italic uppercase text-white/90 group-hover:text-white truncate max-w-xs md:max-w-md tracking-tighter">{file.name}</p>
                        <div className="flex items-center gap-4">
                          <span className={`text-[10px] font-mono font-bold uppercase tracking-widest ${res ? (res.verdict === 'REAL' ? 'text-emerald-500' : 'text-danger') : 'text-white/20'}`}>
                            {res ? `${res.verdict} // ${res.deepfakeProbability}% CHANCE OF AI` :
                              i === currentFileIndex && isProcessing ? 'Checking file...' : 'Waiting...'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-8 relative z-10">
                      {res && (
                        <div className="hidden md:flex flex-col text-right">
                          <span className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-0.5">Certainty</span>
                          <span className="text-sm font-mono font-black text-white">{res.confidence}%</span>
                        </div>
                      )}
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/10 group-hover:text-white/40 transition-all">
                        <ArrowLeft className="w-5 h-5 rotate-180 transition-transform" strokeWidth={3} />
                      </div>
                    </div>

                    {i === currentFileIndex && isProcessing && (
                      <motion.div
                        className="absolute inset-x-0 top-0 h-1 bg-neon/40 shadow-neon"
                        animate={{ top: ['0%', '100%'] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      />
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>

          <aside className="space-y-10">
            <div className="glass border border-white/5 p-12 rounded-[3rem] space-y-10 shadow-2xl sticky top-32">
              <div className="space-y-2">
                <span className="text-[11px] font-black uppercase text-neon tracking-[0.5em]">Progress</span>
                <h4 className="text-4xl font-black italic uppercase tracking-tighter underline decoration-neon/20 underline-offset-8">Status</h4>
              </div>

              <div className="space-y-8">
                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <span className="text-4xl font-black italic tracking-tighter">{Math.floor(progressPercentage)}%</span>
                    <div className="text-right">
                      <span className="text-[10px] font-black text-white/20 uppercase tracking-widest block">Completed</span>
                      <span className="text-xs font-mono text-white/60">{results.length} / {files.length} CHECKED</span>
                    </div>
                  </div>
                  <div className="h-4 bg-black/40 rounded-full border border-white/5 p-1 relative overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercentage}%` }}
                      className="h-full bg-neon rounded-full shadow-neon relative"
                    >
                      <div className="absolute inset-0 bg-white/20 animate-pulse transition-all"></div>
                    </motion.div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-6 bg-white/5 rounded-2xl border border-white/5">
                    <span className="text-[9px] font-black text-white/20 uppercase tracking-widest block mb-1">Likely Fake</span>
                    <span className="text-2xl font-black text-danger">{results.filter(r => r.verdict === Verdict.LIKELY_FAKE).length}</span>
                  </div>
                  <div className="p-6 bg-white/5 rounded-2xl border border-white/5">
                    <span className="text-[9px] font-black text-white/20 uppercase tracking-widest block mb-1">Likely Real</span>
                    <span className="text-2xl font-black text-emerald-500">{results.filter(r => r.verdict === Verdict.REAL).length}</span>
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-white/5 flex flex-col gap-4">
                {!isProcessing ? (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleStartTriage}
                      className="w-full py-6 bg-white text-charcoal font-black rounded-2xl text-[11px] uppercase tracking-[0.3em] hover:bg-neon transition-all shadow-xl flex items-center justify-center gap-4"
                    >
                      <Play size={16} fill="currentColor" />
                      Start Checking
                    </motion.button>
                    <button
                      onClick={clearQueue}
                      className="w-full py-5 bg-danger/10 text-danger border border-danger/20 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-danger hover:text-white transition-all flex items-center justify-center gap-3"
                    >
                      <Trash2 size={14} />
                      Clear All
                    </button>
                  </>
                ) : (
                  <div className="py-6 px-4 bg-neon/10 border border-neon/20 rounded-2xl flex items-center justify-center gap-4">
                    <div className="w-4 h-4 border-2 border-neon border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-[10px] font-black text-neon uppercase tracking-[0.4em]">Checking...</span>
                  </div>
                )}
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
};

export default BatchTriage;