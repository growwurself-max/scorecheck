import React, { useState } from 'react';
import { AlertCircle, Filter } from 'lucide-react';

export default function WrongQuestionsList({ questions = [], subjects = [] }) {
  const [selectedSubject, setSelectedSubject] = useState('ALL');
  
  const wrongQuestions = questions.filter(q => q.status === 'wrong');
  const filtered = selectedSubject === 'ALL' 
    ? wrongQuestions 
    : wrongQuestions.filter(q => q.subject === selectedSubject);

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm overflow-hidden">
      {/* Header & Filter Pill Bar */}
      <div className="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 text-rose-600" />
            <span>Questions Marked Incorrect</span>
          </h3>
          <p className="text-xs text-slate-500">Audit your answers against the official examination answer key</p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <button
            onClick={() => setSelectedSubject('ALL')}
            className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
              selectedSubject === 'ALL' 
                ? 'bg-slate-900 text-white' 
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            All ({wrongQuestions.length})
          </button>
          {subjects.map((sub, idx) => {
            const count = wrongQuestions.filter(q => q.subject === sub.name).length;
            if (count === 0) return null;
            return (
              <button
                key={idx}
                onClick={() => setSelectedSubject(sub.name)}
                className={`px-2.5 py-1 rounded text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedSubject === sub.name 
                    ? 'bg-slate-900 text-white' 
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {sub.name} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="p-12 text-center text-slate-500 text-xs">
          No incorrect questions recorded for this selection.
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {filtered.map((q) => (
            <div key={q.questionNumber} className="p-4 flex items-center justify-between hover:bg-slate-50/60 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 flex flex-col items-center justify-center font-mono">
                  <span className="text-[9px] uppercase text-slate-400 font-bold">Q</span>
                  <span className="text-xs font-bold text-slate-800">{q.questionNumber}</span>
                </div>
                <div>
                  <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    {q.subject}
                  </div>
                  <div className="text-xs text-slate-400 font-mono">ID: {q.questionId}</div>
                </div>
              </div>

              {/* Answers Comparison */}
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Chosen Answer</div>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold font-mono bg-rose-50 text-rose-700 border border-rose-200">
                    Option {q.studentAnswer || '--'}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Official Key</div>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold font-mono bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Option {q.correctAnswer}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
