import React, { useState, useEffect } from 'react';
import { getGlobalStandards, GlobalCompetitor } from '../services/geminiService';

interface GlobalLeaderboardProps {
  completionRate: number;
}

export const GlobalLeaderboard: React.FC<GlobalLeaderboardProps> = ({ completionRate }) => {
  const [competitors, setCompetitors] = useState<GlobalCompetitor[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchStandards = async () => {
    setLoading(true);
    const data = await getGlobalStandards(completionRate);
    setCompetitors(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchStandards();
  }, [completionRate]);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-2xl relative overflow-hidden border-4 border-rose-500/30">
        <div className="absolute top-0 right-0 p-4 opacity-10 text-8xl">🌏</div>
        <div className="relative z-10">
          <h2 className="text-3xl font-black italic tracking-tighter uppercase mb-2">The Hall of Real Standards</h2>
          <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">
            Mummy is checking the news. See where you stand in the "Real World."
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {loading ? (
          <div className="py-20 text-center space-y-4">
             <div className="animate-spin text-5xl inline-block">🧿</div>
             <p className="text-rose-600 font-black animate-pulse uppercase tracking-widest">Mummy is searching the newspapers for your shame...</p>
          </div>
        ) : (
          <>
            {/* The Real World Standards */}
            {competitors.map((c, idx) => (
              <div key={idx} className="bg-white border-2 border-slate-100 p-6 rounded-2xl shadow-sm hover:border-rose-200 transition-all flex flex-col md:flex-row gap-6 items-center">
                 <div className="flex-shrink-0 w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-2xl font-black">
                   {idx + 1}
                 </div>
                 <div className="flex-grow space-y-2">
                   <div className="flex items-center gap-2">
                     <h3 className="text-xl font-black text-slate-800">{c.name}</h3>
                     <span className="bg-emerald-50 text-emerald-700 text-[10px] font-black px-2 py-0.5 rounded uppercase">Verified Topper</span>
                   </div>
                   <p className="text-sm font-bold text-slate-500 italic">"{c.achievement}"</p>
                   <div className="bg-rose-50 p-4 rounded-xl border border-rose-100">
                     <p className="text-rose-900 text-sm font-medium italic">"Mummy: {c.momComment}"</p>
                   </div>
                   <a 
                    href={c.sourceUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-block text-[10px] font-black text-indigo-600 hover:text-indigo-800 uppercase tracking-widest underline"
                   >
                     View Official Record →
                   </a>
                 </div>
                 <div className="text-right min-w-[120px]">
                    <div className="text-xs font-black text-slate-300 uppercase">Academic Status</div>
                    <div className="text-lg font-black text-emerald-500 uppercase">Ideal Beta</div>
                 </div>
              </div>
            ))}

            {/* User Row */}
            <div className="bg-rose-500 text-white p-8 rounded-3xl shadow-xl transform scale-105 border-4 border-white flex flex-col md:flex-row gap-6 items-center">
               <div className="flex-shrink-0 w-16 h-16 bg-white text-rose-500 rounded-full flex items-center justify-center text-2xl font-black">
                 {competitors.length + 1}
               </div>
               <div className="flex-grow">
                 <h3 className="text-2xl font-black uppercase">You (Beta)</h3>
                 <p className="text-rose-100 font-bold italic">"Still struggling with {completionRate}% completion."</p>
                 <div className="mt-4 h-2 w-full bg-rose-900/30 rounded-full overflow-hidden">
                   <div className="h-full bg-white transition-all duration-1000" style={{ width: `${completionRate}%` }}></div>
                 </div>
               </div>
               <div className="text-right">
                  <button onClick={fetchStandards} className="bg-white text-rose-600 px-6 py-2 rounded-full font-black text-xs uppercase hover:bg-rose-50 transition-all">Refresh Real World Stats</button>
               </div>
            </div>
          </>
        )}
      </div>

      <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100 text-center">
        <p className="text-amber-800 text-xs font-bold uppercase tracking-widest">
          "Don't look at the links. Look at the book. Studying will fix your rank."
        </p>
      </div>
    </div>
  );
};
