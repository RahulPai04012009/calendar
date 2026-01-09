import React, { useState } from 'react';
import { Assignment, Priority, SubTask } from '../types';
import { breakDownAssignment, getMomWisdom, prioritizeAssignments } from '../services/geminiService';
import { v4 as uuidv4 } from 'uuid';

const MummyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
  </svg>
);

const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
  </svg>
);

const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
    </svg>
);

export const generateCalendarUrl = (assignment: Assignment) => {
  const title = encodeURIComponent(`[MummyTrack] ${assignment.subject}: ${assignment.title}`);
  const details = encodeURIComponent(`${assignment.description}\n\nBeta, don't forget! Sharmaji's son is already done.`);
  const datePart = assignment.dueDate.replace(/-/g, '');
  const timePart = (assignment.studyTime || "17:00").replace(/:/g, '');
  const start = `${datePart}T${timePart}00`;
  let endHour = parseInt(timePart.substring(0, 2)) + 1;
  const end = `${datePart}T${endHour.toString().padStart(2, '0')}${timePart.substring(2)}00`;
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&dates=${start}/${end}`;
};

interface AssignmentListProps {
  assignments: Assignment[];
  onUpdate: (assignments: Assignment[]) => void;
  onDelete: (id: string) => void;
}

export const AssignmentList: React.FC<AssignmentListProps> = ({ assignments, onUpdate, onDelete }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState<string | null>(null);
  const [orderingLoading, setOrderingLoading] = useState(false);

  const toggleComplete = (id: string) => {
    const updated = assignments.map(a => a.id === id ? { ...a, completed: !a.completed } : a);
    onUpdate(updated);
  };

  const toggleSubtask = (assignmentId: string, subtaskId: string) => {
    const updated = assignments.map(a => {
      if (a.id !== assignmentId) return a;
      return {
        ...a,
        subTasks: a.subTasks.map(st => st.id === subtaskId ? { ...st, completed: !st.completed } : st)
      };
    });
    onUpdate(updated);
  };

  const handleSmartBreakdown = async (e: React.MouseEvent, assignment: Assignment, crisis: boolean = false) => {
    e.stopPropagation();
    setLoadingAi(assignment.id);
    const steps = await breakDownAssignment(assignment, crisis);
    if (steps.length > 0) {
      const newSubTasks: SubTask[] = steps.map(step => ({ id: uuidv4(), text: step, completed: false }));
      const updated = assignments.map(a => a.id === assignment.id ? { ...a, subTasks: [...a.subTasks, ...newSubTasks] } : a);
      onUpdate(updated);
      setExpandedId(assignment.id);
    }
    setLoadingAi(null);
  };

  const handleGetTips = async (e: React.MouseEvent, assignment: Assignment) => {
    e.stopPropagation();
    setLoadingAi(assignment.id);
    const tips = await getMomWisdom(assignment);
    const updated = assignments.map(a => a.id === assignment.id ? { ...a, aiTips: tips } : a);
    onUpdate(updated);
    setExpandedId(assignment.id);
    setLoadingAi(null);
  };

  const handleSmartPrioritize = async () => {
    setOrderingLoading(true);
    const orderedIds = await prioritizeAssignments(assignments.filter(a => !a.completed));
    if (orderedIds.length > 0) {
      const orderMap = new Map(orderedIds.map((id, index) => [id, index]));
      const sorted = [...assignments].sort((a, b) => {
        if (a.completed && b.completed) return 0;
        if (a.completed) return 1;
        if (b.completed) return -1;
        const idxA = orderMap.get(a.id) ?? 999;
        const idxB = orderMap.get(b.id) ?? 999;
        return idxA - idxB;
      });
      onUpdate(sorted);
    }
    setOrderingLoading(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-slate-800 tracking-tight">Your Future Prospects</h2>
        <button 
          onClick={handleSmartPrioritize}
          disabled={orderingLoading || assignments.length < 2}
          className={`flex items-center gap-2 px-6 py-2 bg-rose-600 text-white rounded-full text-xs font-black shadow-lg shadow-rose-100 uppercase transition-all ${orderingLoading ? 'opacity-70 cursor-not-allowed' : 'hover:scale-105 active:scale-95'}`}
        >
          {orderingLoading ? "Mummy is Judging..." : "What to do first? (Mom Decides)"}
        </button>
      </div>

      {assignments.length === 0 ? (
        <div className="text-center py-20 text-slate-400 bg-white rounded-3xl border border-dashed border-slate-200">
            <p className="text-lg">"No work? You think I am a fool?"</p>
            <p className="text-sm mt-2 font-bold uppercase text-slate-300">Sharmaji's son is doing Extra-Curricular Physics.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
            {assignments.map((a) => (
                <div key={a.id} className={`bg-white rounded-2xl shadow-sm border transition-all ${a.completed ? 'opacity-50 bg-slate-50 border-slate-100' : 'hover:shadow-md border-slate-100'}`}>
                    <div className="p-5 cursor-pointer flex items-start gap-4" onClick={() => setExpandedId(expandedId === a.id ? null : a.id)}>
                        <div className={`mt-1 h-6 w-6 rounded-full border-2 flex items-center justify-center transition-colors ${a.completed ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300'}`} onClick={(e) => { e.stopPropagation(); toggleComplete(a.id); }}>
                            {a.completed && "✓"}
                        </div>
                        <div className="flex-grow">
                            <h3 className={`font-bold leading-tight ${a.completed ? 'text-slate-500 line-through' : 'text-slate-800'}`}>{a.title}</h3>
                            <div className="flex items-center gap-2 mt-1">
                                <p className={`text-[10px] font-black uppercase tracking-widest ${['math', 'physics', 'chem', 'bio'].some(s => a.subject.toLowerCase().includes(s)) ? 'text-emerald-500' : 'text-slate-400'}`}>
                                  {a.subject}
                                </p>
                                <span className="text-slate-300">•</span>
                                <p className="text-[10px] text-slate-400 font-bold uppercase">{new Date(a.dueDate).toLocaleDateString()}</p>
                                {a.studyTime && <span className="text-[10px] bg-amber-50 text-amber-600 px-1.5 py-0.5 rounded font-black tracking-tighter">⏰ {a.studyTime}</span>}
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                             <span className={`text-[10px] font-black px-2 py-0.5 rounded border uppercase tracking-widest ${a.priority === Priority.HIGH ? 'text-rose-600 border-rose-100 bg-rose-50' : 'text-slate-400 border-slate-100 bg-slate-50'}`}>
                                {a.priority === Priority.HIGH ? 'Life or Death' : a.priority === Priority.MEDIUM ? 'Normal' : 'Timepass'}
                             </span>
                             <div className="flex gap-2">
                                <a href={generateCalendarUrl(a)} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="p-1.5 bg-slate-50 text-slate-400 hover:text-emerald-600 rounded-lg transition-colors">
                                  <CalendarIcon />
                                </a>
                             </div>
                        </div>
                    </div>

                    {expandedId === a.id && (
                        <div className="px-5 pb-5 pt-0 border-t border-slate-50 animate-fade-in">
                            <div className="pt-4 space-y-4">
                                <p className="text-slate-600 text-sm italic border-l-2 border-slate-200 pl-3">"{a.description || "No description? So you'll just stare at the book?"}"</p>
                                
                                {!a.completed && (
                                    <div className="flex gap-2 flex-wrap">
                                        <button onClick={(e) => handleSmartBreakdown(e, a)} disabled={loadingAi === a.id} className="px-3 py-1.5 bg-indigo-50 text-indigo-700 text-[10px] font-black uppercase rounded-lg hover:bg-indigo-100">
                                            {loadingAi === a.id ? 'Thinking...' : 'Break it Down Beta'}
                                        </button>
                                        <button onClick={(e) => handleSmartBreakdown(e, a, true)} disabled={loadingAi === a.id} className="px-3 py-1.5 bg-rose-600 text-white text-[10px] font-black uppercase rounded-lg hover:bg-rose-700 shadow-lg shadow-rose-200">
                                            {loadingAi === a.id ? 'Emergency...' : '9 PM CRISIS MODE!'}
                                        </button>
                                        <button onClick={(e) => handleGetTips(e, a)} disabled={loadingAi === a.id} className="px-3 py-1.5 bg-amber-50 text-amber-700 text-[10px] font-black uppercase rounded-lg hover:bg-amber-100">
                                            {loadingAi === a.id ? 'Wise Words...' : "Mummy's Wisdom"}
                                        </button>
                                        <button onClick={(e) => { e.stopPropagation(); onDelete(a.id); }} className="ml-auto p-1.5 text-slate-300 hover:text-rose-600 transition-colors" title="Give Up (Failure)">
                                           <span className="text-xs font-black uppercase mr-1">Give Up?</span>
                                           <TrashIcon />
                                        </button>
                                    </div>
                                )}

                                {a.aiTips && (
                                    <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-2 opacity-5 scale-150"><MummyIcon /></div>
                                        <h4 className="text-[10px] font-black text-orange-800 uppercase mb-2 flex items-center gap-1">Judgment of Mom:</h4>
                                        <p className="text-sm text-orange-900 whitespace-pre-line leading-relaxed italic">{a.aiTips}</p>
                                    </div>
                                )}

                                {a.subTasks.length > 0 && (
                                    <div className="space-y-2 mt-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
                                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mandatory Steps</h4>
                                        {a.subTasks.map(st => (
                                            <div key={st.id} className="flex items-center gap-3 py-1 group">
                                                <input type="checkbox" checked={st.completed} onChange={() => toggleSubtask(a.id, st.id)} className="w-4 h-4 rounded text-rose-600 border-slate-300 focus:ring-rose-500" />
                                                <span className={`text-xs font-medium ${st.completed ? 'text-slate-300 line-through' : 'text-slate-600 group-hover:text-slate-900'}`}>{st.text}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
      )}
    </div>
  );
};
