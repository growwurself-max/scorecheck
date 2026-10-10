import { useState } from 'react';
import { Download, Printer, Filter, Search, CheckCircle, XCircle, Circle } from 'lucide-react';

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

  const chartData = subjects.map(sub => ({
    subject: sub.name.substring(0, 15),
    score: sub.score,
    maxScore: sub.maxScore,
    accuracy: sub.accuracy
  }));

  const radarData = subjects.map(sub => ({
    subject: sub.name.substring(0, 10),
    accuracy: sub.accuracy
  }));

  return (
    <div className="space-y-6">
      {isDemo && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
          <p className="text-yellow-800 font-medium">⚠️ Demo / Sample Scorecard - For Testing Purposes Only</p>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{examName} Scorecard - {paper}</h2>
            <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
              {candidateInfo.candidateName && <span><strong>Name:</strong> {candidateInfo.candidateName}</span>}
              {candidateInfo.rollNumber && <span><strong>Roll No:</strong> {candidateInfo.rollNumber}</span>}
              {candidateInfo.examDate && <span><strong>Date:</strong> {candidateInfo.examDate}</span>}
              {candidateInfo.shift && <span><strong>Shift:</strong> {candidateInfo.shift}</span>}
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleDownloadPDF}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              <Download className="w-4 h-4" />
              Download PDF
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
            >
              <Printer className="w-4 h-4" />
              Print
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white">
            <p className="text-sm opacity-80">Total Score</p>
            <p className="text-3xl font-bold">{summary.totalScore} / {summary.maxScore}</p>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 text-white">
            <p className="text-sm opacity-80">Percentage</p>
            <p className="text-3xl font-bold">{summary.percentage}%</p>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white">
            <p className="text-sm opacity-80">Accuracy</p>
            <p className="text-3xl font-bold">{summary.accuracy}%</p>
          </div>
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-4 text-white">
            <p className="text-sm opacity-80">Attempted</p>
            <p className="text-3xl font-bold">{summary.attempted} / {summary.totalQuestions}</p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Score Breakdown</span>
            <span className="text-sm font-bold text-gray-800">Net: {summary.totalScore}</span>
          </div>
          <div className="h-4 bg-gray-200 rounded-full overflow-hidden flex">
            <div 
              className="bg-green-500 h-full transition-all"
              style={{ width: `${(summary.correct / summary.totalQuestions) * 100}%` }}
              title={`Correct: +${summary.positiveMarks}`}
            />
            <div 
              className="bg-red-500 h-full transition-all"
              style={{ width: `${(summary.wrong / summary.totalQuestions) * 100}%` }}
              title={`Wrong: -${summary.negativeMarks}`}
            />
            <div 
              className="bg-gray-400 h-full transition-all"
              style={{ width: `${(summary.unattempted / summary.totalQuestions) * 100}%` }}
              title={`Unattempted: ${summary.unattempted}`}
            />
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-600">
            <span>✓ Correct (+{summary.positiveMarks})</span>
            <span>✗ Wrong (-{summary.negativeMarks})</span>
            <span>○ Unattempted ({summary.unattempted})</span>
          </div>
        </div>

        <div className="inline-block px-4 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
          Performance: {summary.performanceRating}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Subject-wise Analysis</h3>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {subjects.map((subject, idx) => (
            <div key={idx} className="border border-gray-200 rounded-xl p-4">
              <h4 className="font-semibold text-gray-800 mb-2">{subject.name}</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Qs:</span>
                  <span className="font-medium">{subject.totalQuestions}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Attempted:</span>
                  <span className="font-medium">{subject.attempted}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Correct:</span>
                  <span className="font-medium text-green-600">{subject.correct}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Wrong:</span>
                  <span className="font-medium text-red-600">{subject.wrong}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Score:</span>
                  <span className="font-medium">{subject.score} / {subject.maxScore}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Accuracy:</span>
                  <span className="font-medium">{subject.accuracy}%</span>
                </div>
              </div>
              <div className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all"
                  style={{ width: `${subject.percentage}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">{subject.percentage}%</p>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-gray-800 mb-3">Score by Subject</h4>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="subject" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="score" fill="#3b82f6" name="Score" />
                <Bar dataKey="maxScore" fill="#e5e7eb" name="Max Score" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 mb-3">Accuracy by Subject</h4>
            <ResponsiveContainer width="100%" height={250}>
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} />
                <Radar name="Accuracy" dataKey="accuracy" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {wrongQuestions.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-red-800 mb-4">
            Questions You Got Wrong ({wrongQuestions.length})
          </h3>
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              onClick={() => setFilterSubject('all')}
              className={`px-3 py-1 rounded-full text-sm ${filterSubject === 'all' ? 'bg-red-600 text-white' : 'bg-red-100 text-red-700'}`}
            >
              All ({wrongQuestions.length})
            </button>
            {uniqueSubjects.map(subject => {
              const count = wrongQuestions.filter(q => q.subject === subject).length;
              return count > 0 && (
                <button
                  key={subject}
                  onClick={() => setFilterSubject(subject)}
                  className={`px-3 py-1 rounded-full text-sm ${filterSubject === subject ? 'bg-red-600 text-white' : 'bg-red-100 text-red-700'}`}
                >
                  {subject} ({count})
                </button>
              );
            })}
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {wrongQuestions.filter(q => filterSubject === 'all' || q.subject === filterSubject).slice(0, 6).map((q, idx) => (
              <div key={idx} className="bg-white rounded-lg p-3 border border-red-200">
                <p className="font-medium text-gray-800">Q#{q.questionNumber} - {q.subject}</p>
                <div className="flex items-center gap-2 mt-2 text-sm">
                  <span className="px-2 py-1 bg-red-100 text-red-700 rounded">Your: {q.studentAnswer}</span>
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded">Correct: {q.correctAnswer}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Question-wise Diagnostic</h3>
        
        <div className="flex flex-wrap gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="all">All Questions</option>
              <option value="correct">✓ Correct ({questions.filter(q => q.status === 'correct').length})</option>
              <option value="wrong">✗ Wrong ({questions.filter(q => q.status === 'wrong').length})</option>
              <option value="unattempted">○ Unattempted ({questions.filter(q => q.status === 'unattempted').length})</option>
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="all">All Subjects</option>
              {uniqueSubjects.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center gap-2 flex-1">
            <Search className="w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search question number..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Q.No</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Subject</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Your Answer</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Correct Answer</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Status</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Marks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredQuestions.slice(0, 50).map((q, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{q.questionNumber}</td>
                  <td className="px-4 py-3">{q.subject}</td>
                  <td className="px-4 py-3">{q.studentAnswer || '-'}</td>
                  <td className="px-4 py-3">{q.correctAnswer}</td>
                  <td className="px-4 py-3">
                    {q.status === 'correct' && <span className="flex items-center gap-1 text-green-600"><CheckCircle className="w-4 h-4" /> Correct</span>}
                    {q.status === 'wrong' && <span className="flex items-center gap-1 text-red-600"><XCircle className="w-4 h-4" /> Wrong</span>}
                    {q.status === 'unattempted' && <span className="flex items-center gap-1 text-gray-500"><Circle className="w-4 h-4" /> Unattempted</span>}
                  </td>
                  <td className="px-4 py-3 font-medium">{q.marks > 0 ? `+${q.marks}` : q.marks}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredQuestions.length > 50 && (
            <p className="text-center text-gray-500 text-sm py-4">
              Showing 50 of {filteredQuestions.length} questions
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Scorecard;
