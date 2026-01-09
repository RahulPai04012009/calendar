import React, { useMemo } from 'react';
import { Assignment } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface DashboardProps {
  assignments: Assignment[];
}

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export const Dashboard: React.FC<DashboardProps> = ({ assignments }) => {
  const completionRate = useMemo(() => {
    if (assignments.length === 0) return 100;
    return Math.round((assignments.filter(a => a.completed).length / assignments.length) * 100);
  }, [assignments]);

  const momMood = useMemo(() => {
    if (assignments.length === 0) return { label: "Radiant", emoji: "😊", subtext: "Good Beta. Have some fruit." };
    if (completionRate === 100) return { label: "Proud Mother", emoji: "🌟", subtext: "My child is the best in the colony." };
    if (completionRate > 70) return { label: "Mildly Satisfied", emoji: "🙂", subtext: "Okay, but Shaurya is already done." };
    if (completionRate > 40) return { label: "Visible Disappointment", emoji: "😟", subtext: "I do everything for you, and this is the result?" };
    return { label: "9 PM CRISIS MODE", emoji: "🛑", subtext: "ARRE! DO YOU WANT TO BE A CHAI-WALA?!" };
  }, [completionRate, assignments]);

  const subjectData = useMemo(() => {
    const counts: Record<string, number> = {};
    assignments.forEach(a => {
      if (!a.completed) {
        counts[a.subject] = (counts[a.subject] || 0) + 1;
      }
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [assignments]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Mummy's Mood Meter */}
      <div className="bg-gradient-to-r from-rose-50 to-orange-50 p-6 rounded-2xl shadow-sm border border-rose-100 flex items-center gap-6">
        <div className="text-5xl">{momMood.emoji}</div>
        <div className="flex-grow">
          <h2 className="text-xl font-bold text-rose-900">Mummy's Mood: {momMood.label}</h2>
          <p className="text-rose-700 italic">"{momMood.subtext}"</p>
        </div>
        <div className="text-right">
          <div className="text-xs font-bold text-rose-400 uppercase tracking-widest">Your Effort</div>
          <div className="text-3xl font-black text-rose-600">{completionRate}%</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sharmaji's Son - The Relative Failure Widget */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 lg:col-span-2">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <span className="text-amber-500">🏅</span> Colony Rank (Comparison is necessary)
          </h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-3 bg-emerald-50 rounded-xl border border-emerald-100">
               <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold">1</div>
               <div className="flex-grow">
                  <div className="font-bold text-emerald-900">Sharmaji's Son</div>
                  <div className="text-[10px] text-emerald-600 uppercase font-black">100% Complete • 18 hrs study today</div>
               </div>
               <div className="text-emerald-700 font-black">🥇</div>
            </div>
            <div className="flex items-center gap-4 p-3 bg-emerald-50/50 rounded-xl border border-emerald-100">
               <div className="w-8 h-8 rounded-full bg-emerald-300 text-white flex items-center justify-center font-bold">2</div>
               <div className="flex-grow">
                  <div className="font-bold text-emerald-800">Vermaji's Daughter</div>
                  <div className="text-[10px] text-emerald-500 uppercase font-black">99% Complete • Finished Math 2 times</div>
               </div>
               <div className="text-emerald-600 font-black">🥈</div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-rose-50 rounded-xl border-2 border-dashed border-rose-200 animate-pulse">
               <div className="w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center font-bold">152</div>
               <div className="flex-grow">
                  <div className="font-bold text-rose-900">You (Beta)</div>
                  <div className="text-[10px] text-rose-600 uppercase font-black">{completionRate}% Complete • Still wasting time</div>
               </div>
               <div className="text-rose-700 text-xs italic">"Why can't you be like him?"</div>
            </div>
          </div>
        </div>

        {/* Subjects Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Pending Work</h3>
          {subjectData.length > 0 ? (
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={subjectData} cx="50%" cy="50%" innerRadius={40} outerRadius={60} dataKey="value">
                    {subjectData.map((_, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-1">
                {subjectData.map((d, i) => (
                   <div key={d.name} className="flex justify-between text-xs">
                     <span className="text-slate-500 flex items-center gap-1">
                       <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></span>
                       {d.name}
                     </span>
                     <span className="font-bold">{d.value}</span>
                   </div>
                ))}
              </div>
            </div>
          ) : (
             <div className="h-full flex items-center justify-center text-slate-400 italic text-sm text-center">
               "No work? Don't lie to me Beta. Re-check the syllabus."
             </div>
          )}
        </div>
      </div>
    </div>
  );
};
