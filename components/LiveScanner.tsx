import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AnalysisResult } from '../types';
import { analyzeMedia } from '../services/geminiService';
import ProcessingScreen from './ProcessingScreen';
import { ArrowLeft, Scan, Camera, ShieldAlert, Cpu, Activity, Zap } from 'lucide-react';

interface LiveScannerProps {
  onBack: () => void;
  onResult: (result: AnalysisResult) => void;
}

const LiveScanner: React.FC<LiveScannerProps> = ({ onBack, onResult }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [status, setStatus] = useState("Calibrating Lens...");
  const [streamActive, setStreamActive] = useState(false);

  useEffect(() => {
    async function setupCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setStreamActive(true);
        }
      } catch (err) {
        console.error("Camera access denied", err);
        setStatus("ACCESS_DENIED_BY_PROTOCOL");
      }
    }
    setupCamera();
    return () => {
      const stream = videoRef.current?.srcObject as MediaStream;
      stream?.getTracks().forEach(track => track.stop());
    };
  }, []);

  const handleCapture = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    setIsCapturing(true);
    setStatus("Establishing Link...");

    const context = canvasRef.current.getContext('2d');
    if (context) {
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      context.drawImage(videoRef.current, 0, 0);

      const blob = await new Promise<Blob | null>(resolve => canvasRef.current?.toBlob(resolve, 'image/jpeg', 0.95));
      if (blob) {
        const file = new File([blob], "forensic_capture.jpg", { type: "image/jpeg" });
        setStatus("Interrogating Neural Layers...");
        try {
          const result = await analyzeMedia(file, {
            name: `LIVE_STREAM_${Date.now()}`,
            size: "Live Snapshot",
            type: "image/jpeg",
            preview: canvasRef.current.toDataURL('image/jpeg')
          });
          onResult(result);
        } catch (e) {
          setStatus("SCAN_FAILURE_PROTOCOL_RESET");
          setIsCapturing(false);
        }
      }
    }
  };

  return (
    <div className="min-h-[calc(100vh-10rem)] flex flex-col items-center justify-center p-6 relative">
      <AnimatePresence>
        {isCapturing && <ProcessingScreen label={status} />}
      </AnimatePresence>

      <div className="absolute top-0 left-0">
        <button onClick={onBack} className="group flex items-center gap-4 text-white/20 hover:text-neon transition-all">
          <div className="w-10 h-10 rounded-full border border-white/5 flex items-center justify-center group-hover:border-neon/40">
            <ArrowLeft size={16} />
          </div>
          <span className="text-[11px] font-black uppercase tracking-[0.4em]">Disconnect Node</span>
        </button>
      </div>

      <div className="relative w-full max-w-5xl aspect-video rounded-[4rem] overflow-hidden border border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.8)] bg-black group">
        <video
          ref={videoRef} autoPlay playsInline
          className={`w-full h-full object-cover transition-all duration-1000 grayscale brightness-50 contrast-125 ${isCapturing ? 'opacity-20 blur-xl scale-110' : 'opacity-70 group-hover:opacity-100 group-hover:grayscale-0 group-hover:brightness-100'}`}
        />
        <canvas ref={canvasRef} className="hidden" />

        {/* HUD UI OVERLAY */}
        <div className="absolute inset-0 pointer-events-none p-12">
          {!isCapturing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full w-full relative"
            >
              {/* Grid Overlay */}
              <div className="absolute inset-0 grid grid-cols-12 grid-rows-8 opacity-10">
                {Array.from({ length: 96 }).map((_, i) => (
                  <div key={i} className="border-[0.5px] border-white/20"></div>
                ))}
              </div>

              {/* Corners */}
              <div className="absolute top-0 left-0 w-24 h-24 border-t border-l border-neon/40 rounded-tl-3xl"></div>
              <div className="absolute top-0 right-0 w-24 h-24 border-t border-r border-neon/40 rounded-tr-3xl"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 border-b border-l border-neon/40 rounded-bl-3xl"></div>
              <div className="absolute bottom-0 right-0 w-24 h-24 border-b border-r border-neon/40 rounded-br-3xl"></div>

              {/* Scanning Bracket */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px]">
                <div className="absolute inset-0 border border-white/10 rounded-full animate-spin-slow"></div>
                <div className="absolute inset-8 border border-neon/20 border-t-neon rounded-full animate-reverse-spin-slow"></div>

                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-1 h-1 bg-neon rounded-full shadow-neon"></div>
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-8 bg-neon/40"></div>
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-px h-8 bg-neon/40"></div>
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 h-px w-8 bg-neon/40"></div>
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 h-px w-8 bg-neon/40"></div>
                </div>
              </div>

              {/* Data Telemetry */}
              <div className="absolute left-0 top-1/4 space-y-10 group-hover:translate-x-2 transition-transform duration-700">
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] block">Signal_Lock</span>
                  <div className="flex items-center gap-3">
                    <Activity size={12} className="text-neon" />
                    <span className="text-neon font-mono text-sm font-black tracking-tighter">0xFX_ACTIVE_SYNC</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] block">Latency_Delta</span>
                  <div className="flex items-center gap-3">
                    <Zap size={12} className="text-cyber" />
                    <span className="text-white font-mono text-sm">0.024ms</span>
                  </div>
                </div>
              </div>

              <div className="absolute right-0 bottom-1/4 text-right space-y-10 group-hover:-translate-x-2 transition-transform duration-700">
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-white/20 uppercase tracking-plain block">Camera_Speed</span>
                  <span className="text-white font-mono text-sm">4.2 TBPS</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] block">Calibration</span>
                  <span className="text-neon font-mono text-sm uppercase">Optimized</span>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {!isCapturing && streamActive && (
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-8 group">
            <div className="flex items-center gap-4 glass bg-charcoal/40 px-8 py-3 rounded-2xl border border-white/10 group-hover:border-neon/40 transition-colors">
              <div className="relative">
                <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.5)]"></div>
              </div>
              <p className="text-[10px] font-mono font-black text-white/60 tracking-[0.4em] uppercase">{status}</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCapture}
              className="px-24 py-7 bg-white text-charcoal font-black rounded-[2.5rem] hover:bg-neon transition-all shadow-[0_20px_60px_rgba(0,0,0,0.5)] uppercase tracking-[0.4em] text-xs flex items-center gap-4"
            >
              <Scan size={20} />
              Start Camera Scan
            </motion.button>
          </div>
        )}
      </div>

      <div className="mt-16 text-center space-y-4 max-w-lg">
        <div className="flex items-center justify-center gap-4 text-white/10">
          <ShieldAlert size={16} />
          <Cpu size={16} />
          <Camera size={16} />
        </div>
        <div className="space-y-2">
          <p className="text-white/40 text-lg font-light italic tracking-tight leading-relaxed">Ensure the biometric subject is centered within the lens array for precision artifact extraction.</p>
          <p className="text-[10px] font-mono text-white/10 uppercase tracking-[0.6em]">System Integrity Check: 0x93_PASSED</p>
        </div>
      </div>

      <style>{`
        @keyframes reverse-spin-slow {
          from { rotate: 360deg; }
          to { rotate: 0deg; }
        }
        .animate-reverse-spin-slow {
          animation: reverse-spin-slow 15s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default LiveScanner;