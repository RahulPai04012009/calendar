import React, { useState, useEffect, useRef } from 'react';

const MESSAGES = [
  "Don't touch the phone!",
  "Shaurya is studying right now. You?",
  "Instagram won't pay your bills.",
  "I am watching you from the door.",
  "Your concentration is like a broken mirror.",
  "Did you finish the 10th sum yet?"
];

export const FocusMode: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [msgIdx, setMsgIdx] = useState(0);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft(t => t - 1);
        if (timeLeft % 30 === 0) setMsgIdx(prev => (prev + 1) % MESSAGES.length);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      alert("Beta, break is only 2 minutes. Start next session.");
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startFocus = () => {
    setIsActive(true);
  };

  const stopFocus = () => {
    if (confirm("GIVING UP? REALLY? YOU WANT TO BE A CHAIVALA?")) {
      setIsActive(false);
      setTimeLeft(25 * 60);
    }
  };

  return (
    <div className="max-w-md mx-auto text-center space-y-8 animate-fade-in py-12">
      <div className="relative">
        <div className={`w-64 h-64 rounded-full border-8 mx-auto flex flex-col items-center justify-center transition-all duration-500 ${isActive ? 'border-rose-500 bg-rose-50 animate-pulse' : 'border-slate-200 bg-white'}`}>
          <div className="text-5xl font-black text-slate-800 font-mono">{formatTime(timeLeft)}</div>
          <div className="text-[10px] font-black text-slate-400 uppercase mt-2">{isActive ? 'NO TIMEPASS' : 'IDLE BRAIN'}</div>
        </div>
        {isActive && (
           <div className="absolute -top-4 -right-4 bg-rose-600 text-white p-3 rounded-full shadow-xl animate-bounce">
             😠
           </div>
        )}
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-black text-rose-900 italic">"{MESSAGES[msgIdx]}"</h3>
        
        <div className="flex justify-center gap-4">
          {!isActive ? (
            <button onClick={startFocus} className="px-10 py-4 bg-emerald-600 text-white font-black rounded-full shadow-xl shadow-emerald-100 hover:scale-105 transition-all uppercase tracking-widest text-sm">
              Hand Over The Phone
            </button>
          ) : (
            <button onClick={stopFocus} className="px-10 py-4 bg-rose-100 text-rose-600 font-black rounded-full hover:bg-rose-200 transition-all uppercase tracking-widest text-sm">
              I Want To Waste Life (Quit)
            </button>
          )}
        </div>
      </div>
      
      <p className="text-[10px] text-slate-400 font-bold uppercase">
        *If you switch tabs, Mummy will know.
      </p>
    </div>
  );
};
