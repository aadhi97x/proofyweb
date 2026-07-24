import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { analyzeMedia } from '../services/geminiService';
import ProcessingScreen from './ProcessingScreen';
import { ArrowLeft, Mic, Square, Volume2, Activity, Zap, Headphones, Cpu, Database, Ghost, ShieldCheck, Play, Radio, Upload } from 'lucide-react';
import { AnalysisResult } from '../types';

const AudioLab: React.FC<{ onBack: () => void, onAnalyze: (result: AnalysisResult) => void }> = ({ onBack, onAnalyze }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [volume, setVolume] = useState(0);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const timerRef = useRef<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (audioContextRef.current) audioContextRef.current.close();
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const startRecording = async () => {
    try {
      setAudioBlob(null);
      setPreviewUrl(null);
      setRecordingDuration(0);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Setup Analyser for Visuals
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      analyserRef.current.fftSize = 256;

      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
      const updateVolume = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
        setVolume(average);
        animationFrameRef.current = requestAnimationFrame(updateVolume);
      };
      updateVolume();

      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (e) => chunksRef.current.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' }); 
        setAudioBlob(blob);
        setPreviewUrl(URL.createObjectURL(blob));
        stopVisualization();
      };

      recorder.start();
      setIsRecording(true);
      
      timerRef.current = window.setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);

    } catch (e) {
      console.error("Mic access denied", e);
      alert("Microphone access is required for audio analysis.");
    }
  };

  const stopVisualization = () => {
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    if (timerRef.current) clearInterval(timerRef.current);
    if (audioContextRef.current) audioContextRef.current.close();
    setVolume(0);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
    setIsRecording(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('audio/')) {
      setAudioBlob(file);
      setPreviewUrl(URL.createObjectURL(file));
      setRecordingDuration(0);
    } else if (file) {
      alert("Please select a valid audio file.");
    }
  };

  const handleAnalyze = async () => {
    if (!audioBlob) return;
    setIsProcessing(true);
    
    try {
      const file = audioBlob instanceof File 
        ? audioBlob 
        : new File([audioBlob], `audio_capture_${Date.now()}.webm`, { type: audioBlob.type });
      
      const metadata = {
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
        type: file.type,
        preview: previewUrl || URL.createObjectURL(file)
      };

      const result = await analyzeMedia(file, metadata);
      onAnalyze(result);
    } catch (e) {
      console.error("Analysis Failed", e);
      alert("Analysis failed. Please try again.");
      setIsProcessing(false);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-16 pb-32 min-h-[80vh] flex flex-col">
      {isProcessing && <ProcessingScreen label="Checking audio signal..." />}
      
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
              <span className="text-white">Audio</span>
              <span className="text-neon">Check</span>
            </h2>
            <p className="text-white/30 text-lg italic font-light tracking-tight max-w-md">
              Record or upload audio to check for clones and synthetic patterns.
            </p>
          </div>
        </div>

        <div className="hidden xl:flex items-center gap-10 py-6 px-10 glass border border-white/5 rounded-[2.5rem] bg-surface/20">
          <div className="flex flex-col text-right">
            <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mb-1">Status</span>
            <span className="text-neon font-mono text-sm font-black italic tracking-tighter uppercase leading-none">Ready</span>
          </div>
          <div className="w-px h-10 bg-white/10"></div>
          <div className="flex items-center gap-4">
            <Radio size={20} className={isRecording ? "text-danger animate-pulse" : "text-white/20"} />
            <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em]">
              {isRecording ? "Recording" : "Idle"}
            </span>
          </div>
        </div>
      </header>

      <div className="flex-grow flex items-center justify-center">
        <div className="w-full max-w-2xl relative">
          
          <div className="glass border border-white/10 p-16 rounded-[4rem] flex flex-col items-center gap-12 text-center shadow-2xl relative overflow-hidden bg-surface/40 group">
            
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.01] to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
            
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="audio/*" 
              onChange={handleFileSelect} 
            />

            <div className="flex items-center gap-8 relative z-10">
              {/* Record Button */}
              <div className="relative">
                {isRecording && (
                  <>
                    <motion.div 
                      initial={{ scale: 1, opacity: 0.5 }}
                      animate={{ scale: 2, opacity: 0 }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="absolute inset-0 bg-danger/20 rounded-full z-0"
                    />
                    <motion.div 
                      initial={{ scale: 1, opacity: 0.3 }}
                      animate={{ scale: 1.5, opacity: 0 }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
                      className="absolute inset-0 bg-danger/20 rounded-full z-0"
                    />
                  </>
                )}

                <button
                  onClick={isRecording ? stopRecording : startRecording}
                  disabled={!isRecording && audioBlob !== null}
                  className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-500 relative z-10 shadow-2xl disabled:opacity-20 disabled:cursor-not-allowed ${isRecording 
                    ? 'bg-danger text-white scale-110 shadow-[0_0_50px_rgba(255,45,85,0.4)]' 
                    : 'bg-white text-charcoal hover:bg-neon hover:scale-105'}`}
                >
                  {isRecording ? <Square size={32} fill="currentColor" /> : <Mic size={32} />}
                </button>
              </div>

              {/* Upload Button */}
              {!isRecording && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center border transition-all duration-500 hover:scale-110 ${audioBlob 
                    ? 'border-white/10 text-white/20 cursor-not-allowed' 
                    : 'bg-white/5 border-white/10 text-white hover:border-neon hover:text-neon hover:bg-white/10'}`}
                  disabled={audioBlob !== null}
                >
                  <Upload size={24} />
                </button>
              )}
            </div>

            {/* Status & Timer */}
            <div className="space-y-4">
              <h3 className="text-3xl font-black italic uppercase tracking-tighter text-white">
                {isRecording ? 'Capturing Signal' : audioBlob ? (audioBlob instanceof File ? 'Audio Loaded' : 'Audio Captured') : 'Select Source'}
              </h3>
              
              {audioBlob && audioBlob instanceof File && (
                <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest max-w-[250px] truncate mx-auto">
                  {audioBlob.name}
                </p>
              )}

              {isRecording && (
                <p className="font-mono text-neon text-xl font-bold tracking-widest">
                  {formatTime(recordingDuration)}
                </p>
              )}
              
              {!isRecording && audioBlob && (
                <div className="flex flex-col items-center gap-6 pt-4">
                  {previewUrl && (
                    <div className="w-full max-w-xs p-4 bg-black/40 rounded-2xl border border-white/5 flex items-center gap-4 group/audio">
                      <Volume2 size={16} className="text-neon animate-pulse" />
                      <div className="h-1 flex-grow bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-neon/40"
                          animate={{ x: ["-100%", "100%"] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        />
                      </div>
                    </div>
                  )}
                  
                  <div className="flex gap-4">
                    <button 
                      onClick={() => { setAudioBlob(null); setPreviewUrl(null); setRecordingDuration(0); }}
                      className="px-8 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white text-xs font-bold uppercase tracking-widest transition-all"
                    >
                      Reset
                    </button>
                    <button 
                      onClick={handleAnalyze}
                      className="px-12 py-3 rounded-xl bg-white text-charcoal hover:bg-neon font-black text-xs uppercase tracking-widest transition-all shadow-xl flex items-center gap-2"
                    >
                      <Activity size={16} /> Interrogate
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Visualizer Bar */}
            {isRecording && (
               <div className="w-full max-w-xs h-2 bg-black/50 rounded-full overflow-hidden flex items-center gap-0.5">
                 {Array.from({length: 20}).map((_, i) => (
                   <motion.div 
                     key={i}
                     animate={{ height: Math.random() * (volume) + "%", opacity: Math.random() * 0.5 + 0.5 }}
                     transition={{ duration: 0.1 }}
                     className="flex-1 bg-neon h-full rounded-sm"
                   />
                 ))}
                 <motion.div 
                    className="h-full bg-gradient-to-r from-neon to-danger w-full"
                    animate={{ width: `${Math.min(100, volume / 1.5)}%` }}
                 />
               </div>
            )}

          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-6 opacity-[0.05] pointer-events-none">
        <Ghost size={24} />
        <p className="text-[10px] font-mono uppercase tracking-[1em]">Forensic Spectrum Core</p>
        <Ghost size={24} />
      </div>
    </div>
  );
};

export default AudioLab;