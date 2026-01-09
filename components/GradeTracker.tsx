import React, { useState } from 'react';
import { Grade } from '../types';
import { judgeGrade } from '../services/geminiService';
import { v4 as uuidv4 } from 'uuid';

interface GradeTrackerProps {
  grades: Grade[];
  onAdd: (grade: Grade) => void;
}

export const GradeTracker: React.FC<GradeTrackerProps> = ({ grades, onAdd }) => {
  const [subject, setSubject] = useState('');
  const [score, setScore] = useState('');
  const [total, setTotal] = useState('100');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !score || !total) return;

    setLoading(true);
    const numScore = Number(score);
    const numTotal = Number(total);
    const comment = await judgeGrade(subject, numScore, numTotal);

    const newGrade: Grade = {
      id: uuidv4(),
      subject,
      score: numScore,
      total: numTotal,
      momComment: comment
    };

    onAdd(newGrade);
    setSubject('');
    setScore('');
    setLoading(false);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <h2 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
           <span>📊</span> "Where are the 2 marks?" Tracker
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
           <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Subject</label>
              <input type="text" value={subject} onChange={e => setSubject(e.target.value)} required className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-rose-500" placeholder="e.g. Maths" />
           </div>
           <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Your Marks</label>
              <input type="number" value={score} onChange={e => setScore(e.target.value)} required className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-rose-500" placeholder="e.g. 98" />
           </div>
           <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Marks</label>
              <input type="number" value={total} onChange={e => setTotal(e.target.value)} required className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-rose-500" placeholder="e.g. 100" />
           </div>
           <button type="submit" disabled={loading} className="w-full bg-rose-600 text-white font-black py-2 rounded-xl hover:bg-rose-700 transition-all shadow-lg shadow-rose-100 uppercase text-xs">
              {loading ? "Judging..." : "Submit to Mom"}
           </button>
        </form>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {grades.length === 0 ? (
          <div className="text-center py-12 text-slate-300 italic">"No marks yet? Are you hiding your report card?"</div>
        ) : (
          [...grades].reverse().map(g => (
            <div key={g.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-6 items-center">
              <div className="text-center md:text-left min-w-[80px]">
                <div className="text-3xl font-black text-rose-600">{g.score}<span className="text-slate-300 text-lg">/{g.total}</span></div>
                <div className="text-[10px] font-black text-slate-400 uppercase">{g.subject}</div>
              </div>
              <div className="flex-grow bg-rose-50 p-4 rounded-xl border border-rose-100 relative">
                 <div className="absolute top-0 right-0 p-2 opacity-10 text-2xl">👵🏾</div>
                 <h4 className="text-[10px] font-black text-rose-800 uppercase mb-1">Mummy's Reaction:</h4>
                 <p className="text-sm text-rose-900 font-medium italic">"{g.momComment}"</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
