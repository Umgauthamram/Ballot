import React, { useEffect, useRef } from 'react';
import { ExternalLink, Activity } from 'lucide-react';

const AuditLog = ({ transactions }) => {
  const scrollRef = useRef(null);

  return (
    <div className="border border-white/30 h-full flex flex-col bg-black">
      <div className="p-3 border-b border-white/30 flex justify-between items-center bg-gray-900">
        <h3 className="text-xs font-bold uppercase tracking-widest flex items-center gap-2">
          <Activity size={14} className="animate-pulse text-green-500" /> Live Audit Log
        </h3>
        <div className="flex gap-1">
          <div className="w-2 h-2 bg-white rounded-none animate-ping"></div>
        </div>
      </div>
      
      <div className="flex-grow overflow-hidden relative" ref={scrollRef}>
        <div className="absolute inset-0 overflow-y-auto p-4 space-y-3 font-mono text-xs">
          {transactions.map((tx, idx) => (
            <div 
              key={tx.hash + idx} 
              className="border-l-2 border-gray-700 pl-3 py-1 hover:border-white transition-colors group"
            >
              <div className="flex justify-between text-gray-500 mb-1">
                <span>{tx.timestamp}</span>
                <span className="flex items-center gap-1 group-hover:text-white cursor-pointer transition-colors">
                  Tx: {tx.hash} <ExternalLink size={10} />
                </span>
              </div>
              <div className="text-white uppercase truncate">
                VOTE CAST → {tx.candidateName}
              </div>
            </div>
          ))}
          
          {transactions.length === 0 && (
            <div className="text-gray-600 text-center py-8 italic">
              No transactions recorded yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuditLog;