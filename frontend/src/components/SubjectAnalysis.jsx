import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export default function SubjectAnalysis({ subjects = [] }) {
  if (!subjects.length) return null;

  return (
    <div className="space-y-6">
      {/* Editorial Subject Performance Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {subjects.map((sub, i) => (
          <div key={i} className="bg-white rounded-xl border border-slate-200/90 shadow-sm p-5 hover:border-slate-300 transition-colors">
            <div className="flex items-start justify-between">
              <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-400">
                Section 0{i + 1}
              </span>
              <span className="text-[11px] font-semibold font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                {sub.accuracy}% Accuracy
              </span>
            </div>

            <h3 className="mt-2 text-sm font-bold text-slate-800 truncate" title={sub.name}>
              {sub.name}
            </h3>

            <div className="mt-4 flex items-baseline justify-between">
              <div>
                <span className="text-2xl font-extrabold text-slate-900 tabular-nums tracking-tight">
                  {sub.score}
                </span>
                <span className="text-xs text-slate-400 font-medium"> / {sub.maxScore} marks</span>
              </div>
              <span className="text-xs font-semibold text-slate-500">
                {sub.percentage}%
              </span>
            </div>

            {/* Micro Progress Track */}
            <div className="mt-3 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-slate-900 h-full rounded-full" 
                style={{ width: `${Math.min(100, sub.percentage)}%` }}
              />
            </div>

            {/* Dense Metadata Metrics */}
            <div className="mt-4 grid grid-cols-4 gap-1 text-center border-t border-slate-100 pt-3 text-xs">
              <div>
                <div className="text-[10px] text-slate-400 font-medium uppercase">Total</div>
                <div className="font-semibold text-slate-700 tabular-nums">{sub.totalQuestions}</div>
              </div>
              <div>
                <div className="text-[10px] text-emerald-600 font-medium uppercase">Right</div>
                <div className="font-semibold text-emerald-600 tabular-nums">{sub.correct}</div>
              </div>
              <div>
                <div className="text-[10px] text-rose-600 font-medium uppercase">Wrong</div>
                <div className="font-semibold text-rose-600 tabular-nums">{sub.wrong}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400 font-medium uppercase">Left</div>
                <div className="font-semibold text-slate-500 tabular-nums">{sub.unattempted}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Comparative Score vs Target Bar Chart */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-sm font-bold text-slate-900">Comparative Subject Mastery</h4>
            <p className="text-xs text-slate-500">Scored marks relative to maximum section weightage (30 Marks)</p>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={subjects.map(s => ({
                name: s.name.length > 18 ? s.name.substring(0, 18) + '…' : s.name,
                Score: s.score,
                Max: s.maxScore
              }))}
              margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis dataKey="name" tick={{ fill: '#64748B', fontSize: 11 }} />
              <YAxis tick={{ fill: '#64748B', fontSize: 11 }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0F172A', border: 'none', borderRadius: '6px', color: '#fff', fontSize: '12px' }}
              />
              <Bar dataKey="Score" fill="#0F172A" radius={[3, 3, 0, 0]} name="Score Obtained" />
              <Bar dataKey="Max" fill="#E2E8F0" radius={[3, 3, 0, 0]} name="Max Possible" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
