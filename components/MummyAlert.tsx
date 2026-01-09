import React, { useEffect } from 'react';
import { screamAtBeta } from '../services/soundService';

interface MummyAlertProps {
  onDismiss: () => void;
  taskTitle: string;
}

export const MummyAlert: React.FC<MummyAlertProps> = ({ onDismiss, taskTitle }) => {
  useEffect(() => {
    // Scream as soon as the alert mounts
    screamAtBeta();
    
    // Repeat scream every 10 seconds if not dismissed
    const interval = setInterval(() => {
      screamAtBeta();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-rose-600/90 backdrop-blur-sm animate-pulse">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border-4 border-rose-500 text-center space-y-6">
        <div className="text-8xl animate-bounce">🤬</div>
        <h2 className="text-4xl font-black text-rose-600 leading-tight uppercase tracking-tighter">
          BETA!!!
        </h2>
        <p className="text-xl font-bold text-slate-800">
          Have you finished your <span className="underline decoration-rose-500 decoration-4">{taskTitle}</span> homework?!
        </p>
        <p className="text-slate-500 italic">
          "Shaurya next door finished this 2 hours ago! Why are you still on that phone?!"
        </p>
        
        <button
          onClick={onDismiss}
          className="w-full py-4 bg-rose-600 text-white font-black rounded-2xl text-xl hover:bg-rose-700 transition-all transform hover:scale-105 active:scale-95 shadow-xl shadow-rose-200"
        >
          YES MUMMY, FINISHED!
        </button>
        
        <p className="text-[10px] text-rose-300 font-bold uppercase">Mummy is watching you. Always.</p>
      </div>
    </div>
  );
};
