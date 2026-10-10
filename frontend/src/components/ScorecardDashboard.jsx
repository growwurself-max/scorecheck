import React, { useState, useRef } from 'react';
import { 
  Download, Printer, Share2, CheckCircle, XCircle, 
  HelpCircle, ChevronRight, BarChart3, ListFilter, 
  Search, ArrowUpRight, ShieldCheck, FileSpreadsheet
} from 'lucide-react';
import SubjectAnalysis from './SubjectAnalysis';
import QuestionMatrix from './QuestionMatrix';
import WrongQuestionsList from './WrongQuestionsList';

export default function ScorecardDashboard({ data, onReset }) {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'questions' | 'mistakes'
  const { candidateInfo, summary, subjects, questions, paper, examName } = data;
  const printableRef = useRef(null);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans antialiased pb-20">
      {/* Top Utility Command Bar */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-slate-900 flex items-center justify-center text-white font-bold text-sm tracking-wider">
              SC
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-semibold text-slate-900 tracking-tight">{examName}</h1>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <ShieldCheck className="w-3 h-3 mr-1 text-emerald-600" /> Verified Sheet
                </span>
              </div>
              <p className="text-[11px] text-slate-500">{paper || 'Official Response Key'}</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={onReset}
              className="hidden sm:inline-flex px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
            >
              Analyze Another
            </button>
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 rounded-md shadow-sm transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium bg-slate-900 text-white hover:bg-slate-800 rounded-md shadow-sm transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6" ref={printableRef}>
        {/* Candidate & Exam Metadata Card */}
        <section className="bg-white rounded-xl border border-slate-200/90 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-2 bg-slate-50/50">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Examination Record
            </div>
            <div className="text-xs text-slate-500">
              Exam: <span className="font-semibold text-slate-800">{examName} 2024</span>
            </div>
          </div>
          
          <div className="p-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 text-sm">
            <div>
              <div className="text-[11px] font-medium uppercase tracking-wider text-slate-400">Candidate Name</div>
              <div className="mt-1 font-semibold text-slate-800 truncate">
                {candidateInfo.candidateName || 'Not Provided'}
              </div>
            </div>
            <div>
              <div className="text-[11px] font-medium uppercase tracking-wider text-slate-400">Hall Ticket / Roll No</div>
              <div className="mt-1 font-mono font-semibold text-slate-800">
                {candidateInfo.rollNumber || 'N/A'}
              </div>
            </div>
            <div>
              <div className="text-[11px] font-medium uppercase tracking-wider text-slate-400">Exam Date & Shift</div>
              <div className="mt-1 font-semibold text-slate-800">
                {candidateInfo.examDate || 'Session 2024'} {candidateInfo.shift ? `• ${candidateInfo.shift}` : ''}
              </div>
            </div>
            <div>
              <div className="text-[11px] font-medium uppercase tracking-wider text-slate-400">Paper Level</div>
              <div className="mt-1 font-semibold text-slate-800 truncate">
                {candidateInfo.paper || paper}
              </div>
            </div>
            <div>
              <div className="text-[11px] font-medium uppercase tracking-wider text-slate-400">Performance Status</div>
              <div className="mt-1">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                  summary.percentage >= 60 
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                    : summary.percentage >= 50
                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}>
                  {summary.percentage >= 60 ? 'Qualified (General/BC)' : summary.percentage >= 50 ? 'Qualified (BC/SC/ST)' : 'Did Not Meet Cutoff'}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Executive KPI Summary Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Score */}
          <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-sm">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-semibold uppercase tracking-wider">Final Score</span>
              <span className="text-[11px] font-medium px-1.5 py-0.5 bg-slate-100 rounded text-slate-600">Net Marks</span>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold tracking-tight text-slate-900 tabular-nums">
                {summary.totalScore}
              </span>
              <span className="text-xs font-medium text-slate-400">/ {summary.maxScore}</span>
            </div>
            <div className="mt-3 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-slate-900 h-full rounded-full transition-all duration-700"
                style={{ width: `${Math.min(100, summary.percentage)}%` }}
              />
            </div>
          </div>

          {/* Accuracy */}
          <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-sm">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-semibold uppercase tracking-wider">Accuracy</span>
              <span className="text-[11px] font-medium px-1.5 py-0.5 bg-emerald-50 text-emerald-700 rounded">Correct / Attempted</span>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold tracking-tight text-slate-900 tabular-nums">
                {summary.accuracy}%
              </span>
            </div>
            <p className="mt-3 text-[11px] text-slate-500 font-medium">
              {summary.correct} correct out of {summary.attempted} attempted questions
            </p>
          </div>

          {/* Correct vs Wrong Breakdown */}
          <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-sm">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-semibold uppercase tracking-wider">Attempt Diagnostic</span>
              <span className="text-[11px] font-medium text-slate-400">{summary.attempted}/{summary.totalQuestions} Attempted</span>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-center">
              <div className="bg-emerald-50/70 border border-emerald-100 p-2 rounded-lg">
                <div className="text-[10px] uppercase font-bold text-emerald-700">Correct</div>
                <div className="text-lg font-bold text-emerald-800 tabular-nums">+{summary.correct}</div>
              </div>
              <div className="bg-rose-50/70 border border-rose-100 p-2 rounded-lg">
                <div className="text-[10px] uppercase font-bold text-rose-700">Incorrect</div>
                <div className="text-lg font-bold text-rose-800 tabular-nums">-{summary.wrong}</div>
              </div>
            </div>
          </div>

          {/* Qualifying Score & Percentage */}
          <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-sm">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-semibold uppercase tracking-wider">Percentage</span>
              <span className="text-[11px] font-medium px-1.5 py-0.5 bg-indigo-50 text-indigo-700 rounded">TG TET Cutoff (60%)</span>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold tracking-tight text-slate-900 tabular-nums">
                {summary.percentage}%
              </span>
            </div>
            <p className="mt-3 text-[11px] text-slate-500 font-medium">
              Passing: OC 90 (60%) • BC 75 (50%) • SC/ST 60 (40%)
            </p>
          </div>
        </section>

        {/* Tabbed Navigation Filter */}
        <section className="flex items-center gap-1 border-b border-slate-200 pb-px">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2.5 text-xs font-semibold rounded-t-lg transition-colors border-b-2 -mb-px ${
              activeTab === 'overview'
                ? 'border-slate-900 text-slate-900 bg-white shadow-sm'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100/60'
            }`}
          >
            Subject Performance Matrix
          </button>
          <button
            onClick={() => setActiveTab('mistakes')}
            className={`px-4 py-2.5 text-xs font-semibold rounded-t-lg transition-colors border-b-2 -mb-px flex items-center gap-1.5 ${
              activeTab === 'mistakes'
                ? 'border-rose-600 text-rose-700 bg-white shadow-sm'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100/60'
            }`}
          >
            <span>Mistake Audit</span>
            <span className="px-1.5 py-0.2 bg-rose-100 text-rose-700 text-[10px] rounded-full font-bold">
              {summary.wrong}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('questions')}
            className={`px-4 py-2.5 text-xs font-semibold rounded-t-lg transition-colors border-b-2 -mb-px ${
              activeTab === 'questions'
                ? 'border-slate-900 text-slate-900 bg-white shadow-sm'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100/60'
            }`}
          >
            All Questions Matrix ({questions.length})
          </button>
        </section>

        {/* Active View Container */}
        {activeTab === 'overview' && (
          <SubjectAnalysis subjects={subjects} />
        )}

        {activeTab === 'mistakes' && (
          <WrongQuestionsList questions={questions} subjects={subjects} />
        )}

        {activeTab === 'questions' && (
          <QuestionMatrix questions={questions} subjects={subjects} />
        )}
      </main>
    </div>
  );
}
