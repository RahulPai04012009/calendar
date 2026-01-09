import React, { useState, useEffect } from 'react';
import { Assignment, Priority } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface AssignmentFormProps {
  onAdd: (assignment: Assignment, autoSync: boolean) => void;
  onCancel: () => void;
}

const STEM_SUBJECTS = ['math', 'physics', 'chemistry', 'biology', 'science', 'coding', 'computer'];

export const AssignmentForm: React.FC<AssignmentFormProps> = ({ onAdd, onCancel }) => {
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [studyTime, setStudyTime] = useState('04:00');
  const [priority, setPriority] = useState<Priority>(Priority.MEDIUM);
  const [autoSync, setAutoSync] = useState(true);
  const [isBrahmaMuhurta, setIsBrahmaMuhurta] = useState(true);

  const isStem = STEM_SUBJECTS.some(s => subject.toLowerCase().includes(s));

  useEffect(() => {
    if (isBrahmaMuhurta) setStudyTime('04:00');
  }, [isBrahmaMuhurta]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !subject || !dueDate) return;

    const newAssignment: Assignment = {
      id: uuidv4(),
      title,
      subject,
      description,
      dueDate,
      studyTime,
      priority,
      completed: false,
      subTasks: [],
      isBrahmaMuhurta
    };

    onAdd(newAssignment, autoSync);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-3xl shadow-sm border border-slate-100 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-rose-100 p-2 rounded-full text-rose-600">
           <span className="text-xl">👩🏾‍🏫</span>
        </div>
        <h2 className="text-2xl font-black text-slate-800 tracking-tight">Add to "Your Future" Beta</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative">
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Subject Type</label>
            <input
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-rose-500 outline-none transition-all ${subject && !isStem ? 'bg-slate-50 border-slate-200' : 'border-emerald-100 bg-emerald-50/20'}`}
              placeholder="e.g. Math (Doctor!)"
            />
            {subject && !isStem && (
              <p className="absolute -bottom-5 left-0 text-[10px] text-rose-500 font-bold uppercase">
                ⚠️ Are you sure? History won't get you a job.
              </p>
            )}
          </div>
          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Task Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none transition-all"
              placeholder="e.g. Exercise 4.2"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Details (Why is it pending?)</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none transition-all"
            placeholder="Tell me every step. Don't be lazy."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Submission Date</label>
            <input
              type="date"
              required
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Study Time</label>
            <div className="flex flex-col gap-2">
              <input
                type="time"
                required
                disabled={isBrahmaMuhurta}
                value={studyTime}
                onChange={(e) => setStudyTime(e.target.value)}
                className={`w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none transition-all ${isBrahmaMuhurta ? 'bg-amber-50 text-amber-700 font-bold' : ''}`}
              />
              <div className="flex items-center gap-1">
                <input 
                  type="checkbox" 
                  id="brahma" 
                  checked={isBrahmaMuhurta} 
                  onChange={(e) => setIsBrahmaMuhurta(e.target.checked)}
                />
                <label htmlFor="brahma" className="text-[10px] font-black text-amber-600 uppercase">Brahma Muhurta (4AM)</label>
              </div>
            </div>
          </div>
          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Priority Level</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none transition-all bg-white"
            >
              <option value={Priority.LOW}>Timepass (Lazy)</option>
              <option value={Priority.MEDIUM}>Normal (Important)</option>
              <option value={Priority.HIGH}>LIFE OR DEATH (DO IT!)</option>
            </select>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 bg-emerald-50 p-4 rounded-xl border border-emerald-100">
            <input
              type="checkbox"
              id="autoSync"
              checked={autoSync}
              onChange={(e) => setAutoSync(e.target.checked)}
              className="w-5 h-5 rounded text-emerald-600 border-emerald-300"
            />
            <label htmlFor="autoSync" className="text-sm font-bold text-emerald-800 cursor-pointer">
              Lock into Mummy's Google Calendar?
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 text-slate-400 font-bold hover:text-rose-500 transition-colors"
          >
            I'm a failure (Cancel)
          </button>
          <button
            type="submit"
            className="px-10 py-3 bg-rose-600 text-white font-black rounded-full hover:bg-rose-700 shadow-2xl shadow-rose-200 transition-all active:scale-95"
          >
            SAVE AND STUDY
          </button>
        </div>
      </form>
    </div>
  );
};
