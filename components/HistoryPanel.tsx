import React from 'react';
import { motion } from 'framer-motion';
import { AnalysisResult, Verdict } from '../types';
import { Clock, History, ChevronRight } from 'lucide-react';

interface HistoryPanelProps {
  history: AnalysisResult[];
  onSelect: (result: AnalysisResult) => void;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, onSelect }) => {
  if (history.length === 0) return null;

  return (
    <div className="space-y-6 py-12">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-neon/10 flex items-center justify-center text-neon">
            <History size={16} />
          </div>
          <h3 className="text-[11px] font-black uppercase tracking-[0.5em] text-white/40">
            Intelligence Archives
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <Clock size={12} className="text-white/20" />
          <span className="text-[10px] font-mono text-white/20 uppercase tracking-widest">{history.length} RECORDS LOADED</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {history.map((item, idx) => (
          <motion.button
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            onClick={() => onSelect(item)}
            className="group relative p-8 glass border border-white/5 rounded-[2.5rem] text-left hover:border-white/20 transition-all duration-500 overflow-hidden bg-surface/20"
          >
            <div className={`absolute top-0 inset-x-0 h-1.5 ${item.verdict === Verdict.REAL ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]' :
                item.verdict === Verdict.LIKELY_FAKE ? 'bg-danger shadow-[0_0_15px_rgba(255,45,85,0.5)]' : 'bg-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.5)]'
              }`}></div>

            <div className="space-y-4 pt-2">
              <div className="flex justify-between items-start">
                <span className="text-[10px] text-white/20 font-mono font-bold uppercase tracking-widest">
                  {new Date(item.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: '2-digit' })}
                </span>
                <div className={`w-2 h-2 rounded-full ${item.verdict === Verdict.REAL ? 'bg-emerald-500' :
                    item.verdict === Verdict.LIKELY_FAKE ? 'bg-danger' : 'bg-yellow-500'
                  } opacity-20 group-hover:opacity-100 transition-opacity`}></div>
              </div>

              <div className="space-y-1">
                <h4 className="font-black text-lg italic uppercase tracking-tighter text-white/80 group-hover:text-white truncate transition-colors">
                  {item.fileMetadata.name}
                </h4>
                <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em]">
                  ID: 0x{item.id.substring(0, 8).toUpperCase()}
                </span>
              </div>

              <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">Confidence</span>
                  <span className="text-sm font-mono font-black text-white group-hover:text-neon transition-colors">{item.confidence}%</span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/10 group-hover:text-white group-hover:bg-white/10 transition-all">
                  <ChevronRight size={18} />
                </div>
              </div>
            </div>

            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default HistoryPanel;
