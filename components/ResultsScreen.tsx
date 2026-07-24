import React, { useState, useRef, useEffect } from 'react';
import { AnalysisResult, Verdict, AnalysisExplanation } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  AlertTriangle,
  Play,
  Pause,
  Download,
  ChevronRight,
  Activity,
  Scan,
  FileText,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  Eye,
  FileBox,
  Image as ImageIcon,
  Clock,
  Unlock,
  Lock,
  Share2,
  Maximize2,
  ArrowLeft,
  Volume2,
  Mic2
} from 'lucide-react';

interface ResultsScreenProps {
  result: AnalysisResult;
  onReupload: () => void;
  onOpenReport: () => void;
  onOpenTimeline: () => void;
  onBack?: () => void;
}

const ResultsScreen: React.FC<ResultsScreenProps> = ({ result, onReupload, onOpenReport, onBack }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showOverlay, setShowOverlay] = useState(false);
  const [activeAnomaly, setActiveAnomaly] = useState<AnalysisExplanation | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  const isVideo = result.fileMetadata.type.includes('video');
  const isAudio = result.fileMetadata.type.includes('audio');
  const isReal = result.verdict === Verdict.REAL;
  const score = result.deepfakeProbability;

  const parseTime = (timeStr?: string) => {
    if (!timeStr) return 0;
    const match = timeStr.match(/(?:(\d{1,2}):)?(\d{1,2}):(\d{2})/);
    if (!match) return 0;
    const parts = match[0].split(':').map(Number);
    if (parts.length === 2) return parts[0] * 60 + parts[1];
    if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
    return 0;
  };

  const formatTime = (time: number) => {
    if (!time || isNaN(time)) return "00:00";
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    const media = isAudio ? audioRef.current : videoRef.current;
    if (!media) return;

    const updateTime = () => {
      const curr = media.currentTime;
      setCurrentTime(curr);
      const currentExp = result.explanations.find(exp => {
        if (!exp.timestamp) return false;
        const t = parseTime(exp.timestamp);
        return Math.abs(curr - t) < 2.5; 
      });
      setActiveAnomaly(currentExp || null);
    };

    const updateDuration = () => setDuration(media.duration);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    media.addEventListener('timeupdate', updateTime);
    media.addEventListener('loadedmetadata', updateDuration);
    media.addEventListener('play', onPlay);
    media.addEventListener('pause', onPause);

    return () => {
      media.removeEventListener('timeupdate', updateTime);
      media.removeEventListener('loadedmetadata', updateDuration);
      media.removeEventListener('play', onPlay);
      media.removeEventListener('pause', onPause);
    };
  }, [isVideo, isAudio, result.explanations]);

  const togglePlay = () => {
    const media = isAudio ? audioRef.current : videoRef.current;
    if (media) {
      if (isPlaying) media.pause();
      else media.play();
    }
  };

  const seekTo = (timeStr?: string) => {
    const media = isAudio ? audioRef.current : videoRef.current;
    if (!media || !timeStr) return;
    const time = parseTime(timeStr);
    media.scrollIntoView({ behavior: 'smooth', block: 'center' });
    media.currentTime = time;
    media.play().catch(e => console.log("Autoplay blocked", e));
  };

  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const media = isAudio ? audioRef.current : videoRef.current;
    if (!timelineRef.current || !media) return;
    const rect = timelineRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    media.currentTime = percentage * duration;
  };

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(result, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `PROOFY_CASE_${result.id}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const getRiskLevel = (prob: number) => {
    if (prob < 20) return { label: 'LOW RISK', color: 'text-emerald-500', bg: 'bg-emerald-500' };
    if (prob < 60) return { label: 'SUSPICIOUS', color: 'text-yellow-500', bg: 'bg-yellow-500' };
    return { label: 'HIGH RISK', color: 'text-danger', bg: 'bg-danger' };
  };

  const risk = getRiskLevel(score);

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans pt-12 pb-24 selection:bg-neon selection:text-charcoal relative">
      
      {/* Action Bar - Improved for Full Screen */}
      <div className="flex flex-wrap items-center justify-between gap-6 mb-10 px-4">
        <div className="flex items-center gap-4">
          {onBack && (
            <button 
              onClick={onBack}
              className="flex items-center gap-3 px-5 py-2.5 rounded-xl bg-black/40 backdrop-blur-md border border-white/10 hover:border-white/30 text-white/60 hover:text-white transition-all group"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Back</span>
            </button>
          )}
          <div className="flex items-center gap-2 px-4 py-2.5 bg-black/40 rounded-full border border-white/5 backdrop-blur-md">
             <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${isReal ? 'bg-emerald-500' : 'bg-danger'}`}></div>
             <span className="text-[9px] font-mono text-white/30 tracking-widest uppercase">CASE: {result.id.slice(0, 8)}</span>
          </div>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={handleExport} 
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 hover:border-white/20 text-[10px] font-bold uppercase tracking-widest text-white/80 hover:text-white transition-all shadow-xl"
          >
            <Download size={14} /> Export
          </button>
          <button 
            onClick={onReupload} 
            className="px-5 py-2.5 rounded-xl bg-white text-black text-[10px] font-black uppercase tracking-widest hover:bg-neon transition-all shadow-xl shadow-white/10 hover:shadow-neon/20"
          >
            New Scan
          </button>
        </div>
      </div>

      <main className="max-w-[1800px] mx-auto px-6 md:px-12 space-y-10">
        
        {/* Main Verdict Block - Sized for stability */}
        <div className={`relative overflow-hidden rounded-[2.5rem] p-10 border transition-all duration-500 ${isReal ? 'bg-emerald-950/10 border-emerald-500/30 shadow-[0_0_50px_rgba(16,185,129,0.1)]' : 'bg-red-950/10 border-danger/30 shadow-[0_0_50px_rgba(255,45,85,0.1)]'}`}>
          <div className="flex flex-col lg:flex-row gap-8 items-start lg:items-center justify-between relative z-10">
            <div className="space-y-3 max-w-4xl">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Conclusion</span>
              <h1 className={`text-6xl md:text-8xl font-black italic uppercase tracking-tighter leading-none ${isReal ? 'text-emerald-500' : 'text-danger'}`}>
                {isReal ? 'Authentic' : 'Fake'}
              </h1>
              <p className="text-white/60 text-base md:text-lg font-medium max-w-2xl leading-relaxed">
                {isReal 
                  ? "Systems found no evidence of AI manipulation." 
                  : "Multiple signs suggest this media was generated or altered by AI."}
              </p>
            </div>

            {/* Gauge */}
            <div className="space-y-4 w-full lg:w-80 shrink-0">
              <div className="flex justify-between items-end">
                <span className="text-[9px] font-bold text-white/50 uppercase tracking-widest">AI Probability</span>
                <span className={`text-4xl font-black italic tabular-nums ${risk.color}`}>{Math.round(score)}%</span>
              </div>
              <div className="h-3 w-full bg-black/40 rounded-full p-1 flex gap-0.5">
                {Array.from({ length: 20 }).map((_, i) => {
                  const segmentValue = (i + 1) * 5; 
                  const isActive = score >= segmentValue;
                  let segColor = 'bg-emerald-900'; 
                  if (isActive) {
                    if (i < 8) segColor = 'bg-emerald-500'; 
                    else if (i < 14) segColor = 'bg-yellow-500'; 
                    else segColor = 'bg-danger'; 
                  }
                  return <div key={i} className={`flex-1 rounded-sm transition-all duration-500 ${isActive ? segColor : 'bg-white/5'}`}></div>;
                })}
              </div>
              <div className="flex justify-between text-[8px] font-mono text-white/20 uppercase font-bold px-1">
                <span>Human</span>
                <span>AI</span>
              </div>
            </div>
          </div>
          <div className="absolute inset-0 bg-grid-forensic opacity-[0.05] pointer-events-none" />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
          
          {/* Left: Metrics */}
          <div className="xl:col-span-4 space-y-6 xl:sticky xl:top-6">
            <div className="p-8 rounded-[2rem] bg-[#0A0A0A] border border-white/5 space-y-6">
              <div className="space-y-1">
                <h3 className="text-xs font-bold uppercase tracking-widest text-white/90">Detailed Analysis</h3>
                <p className="text-[10px] text-white/30">Layered signal verification.</p>
              </div>
              <div className="space-y-5">
                {!isAudio && (
                  <BreakdownItem 
                    icon={<FileBox size={16} />} 
                    label="File Structure" 
                    score={result.analysisSteps.integrity.score} 
                    description="Hidden data integrity scan."
                  />
                )}
                <BreakdownItem 
                  icon={isAudio ? <Mic2 size={16} /> : <Eye size={16} />} 
                  label={isAudio ? "Spectral Logic" : "Visual Reality"} 
                  score={result.analysisSteps.consistency.score} 
                  description={isAudio ? "Tone naturalness." : "Shadow/light physics."}
                />
                <BreakdownItem 
                  icon={<Scan size={16} />} 
                  label="AI Artifacts" 
                  score={result.analysisSteps.aiPatterns.score} 
                  description="Digital fingerprint check."
                />
                {(isVideo || isAudio) && (
                  <BreakdownItem 
                    icon={<Activity size={16} />} 
                    label="Temporal Flow" 
                    score={result.analysisSteps.temporal.score} 
                    description="Motion vector consistency."
                  />
                )}
              </div>
            </div>

            <div className="p-7 rounded-[1.5rem] bg-white/5 border border-white/5 space-y-3">
               <div className="flex items-center gap-3">
                  <ShieldCheck size={16} className="text-white/30" />
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-white">Advice</h4>
               </div>
               <p className="text-xs text-white/60 leading-relaxed font-light">
                 {isReal 
                   ? "File appears safe. No immediate synthetic flags."
                   : "Manipulation suspected. Do not treat as evidence."}
               </p>
               <button onClick={onOpenReport} className="w-full py-3 mt-1 bg-white text-black font-bold rounded-lg hover:bg-neon transition-colors text-[10px] uppercase tracking-widest">
                  View Full Report
               </button>
            </div>
          </div>

          {/* Right: Media & Feed */}
          <div className="xl:col-span-8 flex flex-col gap-8">
            <div className="rounded-[2rem] border border-white/10 bg-[#080808] overflow-hidden relative shadow-2xl flex flex-col min-h-[450px]">
              <div className="relative flex-grow flex items-center justify-center w-full bg-black/50 p-6">
                {isAudio ? (
                  <div className="flex flex-col items-center gap-6 w-full max-w-lg">
                    <audio ref={audioRef} src={result.fileMetadata.preview} className="hidden" />
                    <div className="w-full h-24 bg-black/40 rounded-2xl border border-white/5 flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 flex items-center gap-1 justify-center opacity-30">
                        {Array.from({length: 30}).map((_, i) => (
                          <motion.div key={i} animate={{ height: isPlaying ? [10, Math.random() * 60 + 10, 10] : 10 }} transition={{ duration: 0.5, repeat: Infinity }} className="w-1 bg-neon rounded-full" />
                        ))}
                      </div>
                      <Volume2 size={32} className="text-white relative z-10" />
                    </div>
                  </div>
                ) : isVideo ? (
                  <video ref={videoRef} src={result.fileMetadata.preview} className="max-w-full max-h-[600px] object-contain rounded-lg" playsInline onClick={togglePlay} />
                ) : (
                  <img src={result.fileMetadata.preview} className="max-w-full max-h-[600px] object-contain rounded-lg" alt="Analysis Subject" />
                )}

                {activeAnomaly && (
                  <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute bottom-10 inset-x-6 z-30 pointer-events-none flex justify-center">
                    <div className="bg-black/90 backdrop-blur-xl border border-red-500/40 p-5 rounded-2xl shadow-2xl flex items-start gap-4 max-w-xl">
                      <div className="bg-red-500/20 p-2 rounded-full text-red-500 shrink-0 border border-red-500/20"><AlertCircle size={20} /></div>
                      <div>
                        <span className="text-[9px] font-black uppercase text-red-400">At {activeAnomaly.timestamp}</span>
                        <h4 className="text-white font-bold text-base leading-tight mb-1">{activeAnomaly.point}</h4>
                        <p className="text-white/60 text-xs font-light">{activeAnomaly.detail}</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {(isVideo || isAudio) && !isPlaying && !activeAnomaly && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[2px] cursor-pointer z-10 group/play" onClick={togglePlay}>
                    <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white group-hover/play:scale-110 transition-transform shadow-2xl">
                      <Play size={32} fill="currentColor" className="translate-x-1" />
                    </div>
                  </div>
                )}
              </div>

              {(isVideo || isAudio) && (
                <div className="p-6 bg-[#080808] border-t border-white/5">
                  <div className="space-y-4">
                    <div ref={timelineRef} onClick={handleTimelineClick} className="h-2 bg-white/10 rounded-full cursor-pointer relative w-full hover:h-3 transition-all group/timeline">
                      <div className="h-full bg-white rounded-full" style={{ width: `${(currentTime / duration) * 100}%` }} />
                      {result.explanations.filter(e => e.timestamp).map((exp, i) => (
                        <div key={i} onClick={(e) => { e.stopPropagation(); seekTo(exp.timestamp); }} className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-danger rounded-full cursor-pointer hover:scale-150 transition-transform border-2 border-[#080808] z-10 shadow-[0_0_8px_red]" style={{ left: `${(parseTime(exp.timestamp) / duration) * 100}%` }} />
                      ))}
                    </div>
                    <div className="flex justify-between text-[10px] text-white/30 font-mono font-bold">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(duration)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-[#0A0A0A] rounded-[2rem] border border-white/5 p-8 md:p-10 space-y-8">
              <div className="space-y-3">
                 <h3 className="text-2xl font-black text-white">Contextual Findings</h3>
                 <p className="text-base text-white/50 font-light leading-relaxed">{result.summary}</p>
              </div>
              <div className="space-y-4">
                {result.explanations.length > 0 ? (
                  result.explanations.map((exp, idx) => (
                    <button key={idx} onClick={() => (isVideo || isAudio) && seekTo(exp.timestamp)} className={`w-full text-left p-5 rounded-[1.5rem] bg-white/5 hover:bg-white/10 transition-colors flex items-start gap-5 group border border-transparent hover:border-white/5 ${(!isVideo && !isAudio) ? 'cursor-default' : ''}`}>
                      <div className={`mt-0.5 p-2.5 rounded-xl shrink-0 ${exp.category === 'visual' ? 'bg-neon/10 text-neon' : 'bg-cyber/10 text-cyber'}`}><Eye size={18} /></div>
                      <div className="space-y-1 flex-grow">
                        <div className="flex justify-between">
                          <h4 className="font-bold text-white text-base">{exp.point}</h4>
                          {(isVideo || isAudio) && exp.timestamp && <span className="text-[9px] bg-black/40 px-2 py-1 rounded text-white/40">{exp.timestamp}</span>}
                        </div>
                        <p className="text-sm text-white/50 leading-relaxed">{exp.detail}</p>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="py-12 text-center text-white/20 border border-dashed border-white/5 rounded-2xl"><p>No specific anomalies tagged.</p></div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const BreakdownItem = ({ icon, label, score, description }: { icon: React.ReactNode, label: string, score: number, description: string }) => {
  const isSafe = score < 30;
  const isWarn = score >= 30 && score < 70;
  return (
    <div className="space-y-2">
      <div className="flex items-start gap-3">
        <div className={`p-1.5 rounded-lg shrink-0 ${isSafe ? 'bg-emerald-500/10 text-emerald-500' : isWarn ? 'bg-yellow-500/10 text-yellow-500' : 'bg-red-500/10 text-red-500'}`}>{icon}</div>
        <div>
          <h4 className="text-[11px] font-bold text-white leading-none mb-1">{label}</h4>
          <p className="text-[9px] text-white/40 leading-tight">{description}</p>
        </div>
      </div>
      <div className="pl-9">
        <div className="h-1 bg-white/5 rounded-full overflow-hidden w-full">
          <motion.div initial={{ width: 0 }} animate={{ width: `${score}%` }} className={`h-full rounded-full ${isSafe ? 'bg-emerald-500' : isWarn ? 'bg-yellow-500' : 'bg-red-500'}`} />
        </div>
        <div className="flex justify-between mt-1"><span className="text-[7px] font-black uppercase text-white/10">{isSafe ? 'Normal' : isWarn ? 'Warn' : 'Anomaly'}</span><span className="text-[7px] font-mono text-white/20">{score}/100</span></div>
      </div>
    </div>
  );
};

export default ResultsScreen;