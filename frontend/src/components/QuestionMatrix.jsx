import React, { useState } from 'react';
import { Search, CheckCircle2, XCircle, MinusCircle } from 'lucide-react';

export default function QuestionMatrix({ questions = [], subjects = [] }) {
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [selectedSub, setSelectedSub] = useState('ALL');
  const [search, setSearch] = useState('');

  const filtered = questions.filter(q => {
    if (filterStatus !== 'ALL' && q.status !== filterStatus) return false;
    if (selectedSub !== 'ALL' && q.subject !== selectedSub) return false;
    if (search.trim() && !String(q.questionNumber).includes(search.trim()) && !q.questionId.includes(search.trim())) return false;
    return true;
  });

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm overflow-hidden">
      {/* Table Toolbar */}
      <div className="p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50">
        <div className="flex items-center gap-2 flex-1 min-w-[200px] max-w-xs">
          <div className="relative w-full">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search Q.No or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-2">
          <select
            value={selectedSub}
            onChange={(e) => setSelectedSub(e.target.value)}
            className="text-xs bg-white border border-slate-200 rounded-md px-2.5 py-1.5 text-slate-700 focus:outline-none"
          >
            <option value="ALL">All Subjects</option>
            {subjects.map((s, idx) => (
              <option key={idx} value={s.name}>{s.name}</option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="text-xs bg-white border border-slate-200 rounded-md px-2.5 py-1.5 text-slate-700 focus:outline-none"
          >
            <option value="ALL">All Status</option>
            <option value="correct">Correct (🟢)</option>
            <option value="wrong">Wrong (🔴)</option>
            <option value="unanswered">Unanswered (⚪)</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-700">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold text-[10px]">
            <tr>
              <th className="px-4 py-3">Q.No</th>
              <th className="px-4 py-3">Subject</th>
              <th className="px-4 py-3">Question ID</th>
              <th className="px-4 py-3 text-center">Your Answer</th>
              <th className="px-4 py-3 text-center">Correct Key</th>
              <th className="px-4 py-3 text-center">Status</th>
              <th className="px-4 py-3 text-right">Marks</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((q) => (
              <tr key={q.questionNumber} className="hover:bg-slate-50/70 transition-colors">
                <td className="px-4 py-2.5 font-mono font-bold text-slate-900">{q.questionNumber}</td>
                <td className="px-4 py-2.5 font-medium text-slate-800">{q.subject}</td>
                <td className="px-4 py-2.5 font-mono text-slate-400">{q.questionId}</td>
                <td className="px-4 py-2.5 text-center font-mono font-bold">
                  {q.studentAnswer ? (
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800">{q.studentAnswer}</span>
                  ) : (
                    <span className="text-slate-300">—</span>
                  )}
                </td>
                <td className="px-4 py-2.5 text-center font-mono font-bold">
                  <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {q.correctAnswer}
                  </span>
                </td>
                <td className="px-4 py-2.5 text-center">
                  {q.status === 'correct' && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Correct
                    </span>
                  )}
                  {q.status === 'wrong' && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700">
                      <XCircle className="w-3.5 h-3.5 text-rose-600" /> Wrong
                    </span>
                  )}
                  {q.status === 'unanswered' && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400">
                      <MinusCircle className="w-3.5 h-3.5 text-slate-300" /> Left
                    </span>
                  )}
                </td>
                <td className="px-4 py-2.5 text-right font-mono font-bold">
                  {q.status === 'correct' ? (
                    <span className="text-emerald-700">+{q.marks}</span>
                  ) : q.status === 'wrong' ? (
                    <span className="text-rose-600">{q.marks}</span>
                  ) : (
                    <span className="text-slate-400">0</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
