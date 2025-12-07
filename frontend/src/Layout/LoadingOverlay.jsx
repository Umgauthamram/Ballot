import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingOverlay = ({ message = "WRITING TO BLOCKCHAIN" }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center backdrop-blur-sm">
      <div className="border border-white p-8 max-w-sm w-full text-center">
        <Loader2 className="w-12 h-12 text-white animate-spin mx-auto mb-4" />
        <h2 className="text-xl font-bold tracking-widest text-white mb-2 animate-pulse">
          {message}
        </h2>
        <p className="text-xs text-gray-500 font-mono">
          DO NOT CLOSE THIS WINDOW
        </p>
        <div className="mt-4 w-full bg-gray-900 h-1 overflow-hidden">
          <div 
            className="bg-white h-full animate-[width_3s_ease-in-out_infinite]"
            style={{ width: 0 }}
          />
        </div>
      </div>
    </div>
  );
};

export default LoadingOverlay;