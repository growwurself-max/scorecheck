import { useState } from 'react';
import { Download, Printer, Filter, Search, CheckCircle, XCircle, Circle } from 'lucide-react';
import SubjectAnalysis from './SubjectAnalysis.jsx';

function Scorecard({ data, isDemo, onReset }) {
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterSubject, setFilterSubject] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const { summary, subjects, questions, candidateInfo, examName, paper } = data;

  const filteredQuestions = questions.filter(q => {
    const statusMatch = filterStatus === 'all' || 
      (filterStatus === 'correct' && q.status === 'correct') ||
      (filterStatus === 'wrong' && q.status === 'wrong') ||
      (filterStatus === 'unattempted' && q.status === 'unattempted');
    const subjectMatch = filterSubject === 'all' || q.subject === filterSubject;
    const searchMatch = !searchQuery || 
      q.questionNumber.toString().includes(searchQuery) ||
      q.subject.toLowerCase().includes(searchQuery.toLowerCase());
    return statusMatch && subjectMatch && searchMatch;
  });

  const wrongQuestions = questions.filter(q => q.status === 'wrong');
  const uniqueSubjects = [...new Set(questions.map(q => q.subject))];

  const handleDownloadPDF = async () => {
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text(`${examName} Scorecard - ${paper}`, 20, 20);
    doc.setFontSize(12);
    doc.text(`Candidate: ${candidateInfo.candidateName || 'N/A'}`, 20, 35);
    doc.text(`Roll No: ${candidateInfo.rollNumber || 'N/A'}`, 20, 45);
    doc.text(`Date: ${candidateInfo.examDate || 'N/A'}`, 20, 55);
    doc.text(`Shift: ${candidateInfo.shift || 'N/A'}`, 20, 65);
    doc.setFontSize(14);
    doc.text('Summary', 20, 85);
    doc.setFontSize(10);
    doc.text(`Total Score: ${summary.totalScore} / ${summary.maxScore}`, 20, 95);
    doc.text(`Percentage: ${summary.percentage}%`, 20, 105);
    doc.text(`Accuracy: ${summary.accuracy}%`, 20, 115);
    doc.text(`Attempted: ${summary.attempted} / ${summary.totalQuestions}`, 20, 125);
    doc.setFontSize(14);
    doc.text('Subject-wise Performance', 20, 145);
    doc.setFontSize(10);
    let yPos = 155;
    subjects.forEach(sub => {
      doc.text(`${sub.name}: ${sub.score}/${sub.maxScore} (${sub.percentage}%)`, 20, yPos);
      yPos += 10;
    });
    if (isDemo) {
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.text('DEMO / SAMPLE SCORECARD', 20, 280);
    }
    doc.save(`${examName}_scorecard.pdf`);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {isDemo && (
        <div style={{ background: '#fef9c3', border: '1px solid #fde047', borderRadius: '0.5rem', padding: '1rem', textAlign: 'center' }}>
          <p style={{ color: '#854d0e', fontWeight: '500', margin: 0 }}>⚠️ Demo / Sample Scorecard - For Testing Purposes Only</p>
        </div>
      )}

      <div style={{ background: 'white', borderRadius: '1rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', padding: '1.5rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>{examName} Scorecard - {paper}</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '0.5rem', fontSize: '0.875rem', color: '#4b5563' }}>
              {candidateInfo.candidateName && <span><strong>Name:</strong> {candidateInfo.candidateName}</span>}
              {candidateInfo.rollNumber && <span><strong>Roll No:</strong> {candidateInfo.rollNumber}</span>}
              {candidateInfo.examDate && <span><strong>Date:</strong> {candidateInfo.examDate}</span>}
              {candidateInfo.shift && <span><strong>Shift:</strong> {candidateInfo.shift}</span>}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={handleDownloadPDF} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: '#2563eb', color: 'white', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', fontSize: '0.875rem' }}>
              <Download style={{ width: '16px', height: '16px' }} />
              Download PDF
            </button>
            <button onClick={handlePrint} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: '#4b5563', color: 'white', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', fontSize: '0.875rem' }}>
              <Printer style={{ width: '16px', height: '16px' }} />
              Print
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ background: 'linear-gradient(to bottom right, #3b82f6, #2563eb)', borderRadius: '0.75rem', padding: '1rem', color: 'white' }}>
            <p style={{ fontSize: '0.875rem', opacity: 0.8, margin: '0 0 0.5rem 0' }}>Total Score</p>
            <p style={{ fontSize: '1.875rem', fontWeight: 'bold', margin: 0 }}>{summary.totalScore} / {summary.maxScore}</p>
          </div>
          <div style={{ background: 'linear-gradient(to bottom right, #22c55e, #16a34a)', borderRadius: '0.75rem', padding: '1rem', color: 'white' }}>
            <p style={{ fontSize: '0.875rem', opacity: 0.8, margin: '0 0 0.5rem 0' }}>Percentage</p>
            <p style={{ fontSize: '1.875rem', fontWeight: 'bold', margin: 0 }}>{summary.percentage}%</p>
          </div>
          <div style={{ background: 'linear-gradient(to bottom right, #a855f7, #9333ea)', borderRadius: '0.75rem', padding: '1rem', color: 'white' }}>
            <p style={{ fontSize: '0.875rem', opacity: 0.8, margin: '0 0 0.5rem 0' }}>Accuracy</p>
            <p style={{ fontSize: '1.875rem', fontWeight: 'bold', margin: 0 }}>{summary.accuracy}%</p>
          </div>
          <div style={{ background: 'linear-gradient(to bottom right, #f97316, #ea580c)', borderRadius: '0.75rem', padding: '1rem', color: 'white' }}>
            <p style={{ fontSize: '0.875rem', opacity: 0.8, margin: '0 0 0.5rem 0' }}>Attempted</p>
            <p style={{ fontSize: '1.875rem', fontWeight: 'bold', margin: 0 }}>{summary.attempted} / {summary.totalQuestions}</p>
          </div>
        </div>

        <div style={{ background: '#f9fafb', borderRadius: '0.75rem', padding: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>Score Breakdown</span>
            <span style={{ fontSize: '0.875rem', fontWeight: 'bold', color: '#1f2937' }}>Net: {summary.totalScore}</span>
          </div>
          <div style={{ height: '1rem', background: '#e5e7eb', borderRadius: '9999px', overflow: 'hidden', display: 'flex' }}>
            <div style={{ background: '#22c55e', height: '100%', width: `${(summary.correct / summary.totalQuestions) * 100}%` }} />
            <div style={{ background: '#ef4444', height: '100%', width: `${(summary.wrong / summary.totalQuestions) * 100}%` }} />
            <div style={{ background: '#9ca3af', height: '100%', width: `${(summary.unattempted / summary.totalQuestions) * 100}%` }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.75rem', color: '#4b5563' }}>
            <span>✓ Correct (+{summary.positiveMarks})</span>
            <span>✗ Wrong (-{summary.negativeMarks})</span>
            <span>○ Unattempted ({summary.unattempted})</span>
          </div>
        </div>

        <div style={{ display: 'inline-block', padding: '0.5rem 1rem', borderRadius: '9999px', fontSize: '0.875rem', fontWeight: '500', background: '#dbeafe', color: '#1e40af' }}>
          Performance: {summary.performanceRating}
        </div>
      </div>

      <SubjectAnalysis subjects={subjects} />

      {wrongQuestions.length > 0 && (
        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '1rem', padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#991b1b', marginBottom: '1rem' }}>
            Questions You Got Wrong ({wrongQuestions.length})
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
            <button onClick={() => setFilterSubject('all')} style={{ padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.875rem', background: filterSubject === 'all' ? '#dc2626' : '#fecaca', color: filterSubject === 'all' ? 'white' : '#991b1b', border: 'none', cursor: 'pointer' }}>
              All ({wrongQuestions.length})
            </button>
            {uniqueSubjects.map(subject => {
              const count = wrongQuestions.filter(q => q.subject === subject).length;
              return count > 0 && (
                <button key={subject} onClick={() => setFilterSubject(subject)} style={{ padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.875rem', background: filterSubject === subject ? '#dc2626' : '#fecaca', color: filterSubject === subject ? 'white' : '#991b1b', border: 'none', cursor: 'pointer' }}>
                  {subject} ({count})
                </button>
              );
            })}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '0.75rem' }}>
            {wrongQuestions.filter(q => filterSubject === 'all' || q.subject === filterSubject).slice(0, 6).map((q, idx) => (
              <div key={idx} style={{ background: 'white', borderRadius: '0.5rem', padding: '0.75rem', border: '1px solid #fecaca' }}>
                <p style={{ fontWeight: '500', color: '#1f2937', margin: '0 0 0.5rem 0' }}>Q#{q.questionNumber} - {q.subject}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                  <span style={{ padding: '0.25rem 0.5rem', background: '#fecaca', color: '#991b1b', borderRadius: '0.25rem' }}>Your: {q.studentAnswer}</span>
                  <span style={{ padding: '0.25rem 0.5rem', background: '#dcfce7', color: '#166534', borderRadius: '0.25rem' }}>Correct: {q.correctAnswer}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ background: 'white', borderRadius: '1rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem' }}>Question-wise Diagnostic</h3>
        
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Filter style={{ width: '16px', height: '16px', color: '#6b7280' }} />
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={{ padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', fontSize: '0.875rem' }}>
              <option value="all">All Questions</option>
              <option value="correct">✓ Correct ({questions.filter(q => q.status === 'correct').length})</option>
              <option value="wrong">✗ Wrong ({questions.filter(q => q.status === 'wrong').length})</option>
              <option value="unattempted">○ Unattempted ({questions.filter(q => q.status === 'unattempted').length})</option>
            </select>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Filter style={{ width: '16px', height: '16px', color: '#6b7280' }} />
            <select value={filterSubject} onChange={(e) => setFilterSubject(e.target.value)} style={{ padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', fontSize: '0.875rem' }}>
              <option value="all">All Subjects</option>
              {uniqueSubjects.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1 }}>
            <Search style={{ width: '16px', height: '16px', color: '#6b7280' }} />
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search question number..." style={{ flex: 1, padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', fontSize: '0.875rem' }} />
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', fontSize: '0.875rem', borderCollapse: 'collapse' }}>
            <thead style={{ background: '#f9fafb' }}>
              <tr>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: '600', color: '#374151', borderBottom: '1px solid #e5e7eb' }}>Q.No</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: '600', color: '#374151', borderBottom: '1px solid #e5e7eb' }}>Subject</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: '600', color: '#374151', borderBottom: '1px solid #e5e7eb' }}>Your Answer</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: '600', color: '#374151', borderBottom: '1px solid #e5e7eb' }}>Correct Answer</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: '600', color: '#374151', borderBottom: '1px solid #e5e7eb' }}>Status</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: '600', color: '#374151', borderBottom: '1px solid #e5e7eb' }}>Marks</th>
              </tr>
            </thead>
            <tbody>
              {filteredQuestions.slice(0, 50).map((q, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '0.75rem 1rem', fontWeight: '500' }}>{q.questionNumber}</td>
                  <td style={{ padding: '0.75rem 1rem' }}>{q.subject}</td>
                  <td style={{ padding: '0.75rem 1rem' }}>{q.studentAnswer || '-'}</td>
                  <td style={{ padding: '0.75rem 1rem' }}>{q.correctAnswer}</td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    {q.status === 'correct' && <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#16a34a' }}><CheckCircle style={{ width: '16px', height: '16px' }} /> Correct</span>}
                    {q.status === 'wrong' && <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#dc2626' }}><XCircle style={{ width: '16px', height: '16px' }} /> Wrong</span>}
                    {q.status === 'unattempted' && <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#6b7280' }}><Circle style={{ width: '16px', height: '16px' }} /> Unattempted</span>}
                  </td>
                  <td style={{ padding: '0.75rem 1rem', fontWeight: '500' }}>{q.marks > 0 ? `+${q.marks}` : q.marks}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredQuestions.length > 50 && (
            <p style={{ textAlign: 'center', color: '#6b7280', fontSize: '0.875rem', padding: '1rem 0' }}>
              Showing 50 of {filteredQuestions.length} questions
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Scorecard;
