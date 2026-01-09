import React, { useState, useEffect, useMemo } from 'react';
import { Dashboard } from './components/Dashboard';
import { AssignmentForm } from './components/AssignmentForm';
import { AssignmentList, generateCalendarUrl } from './components/AssignmentList';
import { GradeTracker } from './components/GradeTracker';
import { FocusMode } from './components/FocusMode';
import { MummyAlert } from './components/MummyAlert';
import { GlobalLeaderboard } from './components/GlobalLeaderboard';
import { DynamicBackground } from './components/DynamicBackground';
import { Assignment, ViewState, Grade } from './types';

function App() {
  const [view, setView] = useState<ViewState>('inspection');
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [activeAlert, setActiveAlert] = useState<Assignment | null>(null);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);

  useEffect(() => {
    const storedAss = localStorage.getItem('mummytrack_assignments');
    const storedGrades = localStorage.getItem('mummytrack_grades');
    if (storedAss) try { setAssignments(JSON.parse(storedAss)); } catch (e) { console.error(e); }
    if (storedGrades) try { setGrades(JSON.parse(storedGrades)); } catch (e) { console.error(e); }
  }, []);

  useEffect(() => {
    localStorage.setItem('mummytrack_assignments', JSON.stringify(assignments));
    localStorage.setItem('mummytrack_grades', JSON.stringify(grades));
  }, [assignments, grades]);

  const completionRate = useMemo(() => {
    if (assignments.length === 0) return 0;
    return Math.round((assignments.filter(a => a.completed).length / assignments.length) * 100);
  }, [assignments]);

  useEffect(() => {
    const checkDeadlines = () => {
      if (!hasUserInteracted) return; 
      const now = new Date();
      const overdue = assignments.find(a => {
        if (a.completed) return false;
        const [hours, minutes] = (a.studyTime || "17:00").split(':').map(Number);
        const studyDateTime = new Date(a.dueDate);
        studyDateTime.setHours(hours, minutes, 0, 0);
        return now > studyDateTime;
      });
      if (overdue && !activeAlert) {
        setActiveAlert(overdue);
      }
    };
    const interval = setInterval(checkDeadlines, 5000);
    return () => clearInterval(interval);
  }, [assignments, activeAlert, hasUserInteracted]);

  const handleAddAssignment = (newAssignment: Assignment, autoSync: boolean) => {
    setAssignments(prev => [...prev, newAssignment]);
    if (autoSync) {
      const url = generateCalendarUrl(newAssignment);
      window.open(url, '_blank');
    }
    setView('future');
    setHasUserInteracted(true);
  };

  const handleAddGrade = (grade: Grade) => {
    setGrades(prev => [...prev, grade]);
    setHasUserInteracted(true);
  };

  const handleDeleteAssignment = (id: string) => {
      setAssignments(prev => prev.filter(a => a.id !== id));
  };

  const handleDismissAlert = () => {
    if (activeAlert) {
      const updated = assignments.map(a => a.id === activeAlert.id ? { ...a, completed: true } : a);
      setAssignments(updated);
      setActiveAlert(null);
    }
  };

  return (
    <div className="min-h-screen text-slate-900 pb-20 md:pb-0 relative" onClick={() => setHasUserInteracted(true)}>
      <DynamicBackground />
      
      {activeAlert && <MummyAlert taskTitle={activeAlert.title} onDismiss={handleDismissAlert} />}

      <nav className="bg-white/70 backdrop-blur-xl border-b border-rose-100/30 sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('inspection')}>
              <div className="bg-rose-600 p-2 rounded-xl shadow-lg shadow-rose-200">
                <span className="text-white font-black text-xl">MT</span>
              </div>
              <span className="font-black text-2xl tracking-tighter text-slate-800">MummyTrack</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-4">
              <button onClick={() => setView('inspection')} className={`px-3 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${view === 'inspection' ? 'text-rose-600 border-b-2 border-rose-600' : 'text-slate-500 hover:text-rose-600'}`}>The Inspection</button>
              <button onClick={() => setView('future')} className={`px-3 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${view === 'future' ? 'text-rose-600 border-b-2 border-rose-600' : 'text-slate-500 hover:text-rose-600'}`}>Your Future</button>
              <button onClick={() => setView('leaderboard')} className={`px-3 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${view === 'leaderboard' ? 'text-rose-600 border-b-2 border-rose-600' : 'text-slate-500 hover:text-rose-600'}`}>Global Shame</button>
              <button onClick={() => setView('grades')} className={`px-3 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${view === 'grades' ? 'text-rose-600 border-b-2 border-rose-600' : 'text-slate-500 hover:text-rose-600'}`}>Report Card</button>
              <button onClick={() => setView('focus')} className={`px-3 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${view === 'focus' ? 'text-rose-600 border-b-2 border-rose-600' : 'text-slate-500 hover:text-rose-600'}`}>Lockdown</button>
              <button onClick={() => setView('add')} className="px-6 py-3 rounded-full text-[10px] font-black bg-rose-600 text-white shadow-xl shadow-rose-200 hover:bg-rose-700 transition-all uppercase tracking-widest">+ WORK</button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-0">
        <div className="bg-white/60 backdrop-blur-md p-6 md:p-10 rounded-[2.5rem] shadow-2xl border border-white/40 min-h-[70vh]">
          {view === 'inspection' && <Dashboard assignments={assignments} />}
          {view === 'future' && <AssignmentList assignments={assignments} onUpdate={setAssignments} onDelete={handleDeleteAssignment} />}
          {view === 'add' && <AssignmentForm onAdd={handleAddAssignment} onCancel={() => setView('future')} />}
          {view === 'grades' && <GradeTracker grades={grades} onAdd={handleAddGrade} />}
          {view === 'focus' && <FocusMode />}
          {view === 'leaderboard' && <GlobalLeaderboard completionRate={completionRate} />}
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-slate-100 md:hidden h-20 flex justify-around items-center px-2 z-10">
           <button onClick={() => setView('inspection')} className={`flex flex-col items-center gap-1 ${view === 'inspection' ? 'text-rose-600' : 'text-slate-400'}`}>
              <div className="text-xl">📊</div>
              <span className="text-[9px] font-black uppercase">Inspect</span>
           </button>
           <button onClick={() => setView('future')} className={`flex flex-col items-center gap-1 ${view === 'future' ? 'text-rose-600' : 'text-slate-400'}`}>
              <div className="text-xl">📚</div>
              <span className="text-[9px] font-black uppercase">Work</span>
           </button>
           <button onClick={() => setView('add')} className="bg-rose-600 p-4 rounded-full -mt-12 shadow-2xl shadow-rose-200 text-white text-2xl">➕</button>
           <button onClick={() => setView('leaderboard')} className={`flex flex-col items-center gap-1 ${view === 'leaderboard' ? 'text-rose-600' : 'text-slate-400'}`}>
              <div className="text-xl">🌏</div>
              <span className="text-[9px] font-black uppercase">World</span>
           </button>
           <button onClick={() => setView('focus')} className={`flex flex-col items-center gap-1 ${view === 'focus' ? 'text-rose-600' : 'text-slate-400'}`}>
              <div className="text-xl">📵</div>
              <span className="text-[9px] font-black uppercase">Lock</span>
           </button>
      </div>
    </div>
  );
}

export default App;
