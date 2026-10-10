import { useState } from 'react';
import { Link, Clipboard, Loader2, AlertCircle } from 'lucide-react';

const EXAMS = [
  { id: 'tg-tet', name: 'TG TET' },
  { id: 'neet', name: 'NEET (UG)' },
  { id: 'jee-main', name: 'JEE Main' },
  { id: 'eamcet', name: 'EAMCET / TG EAPCET' },
  { id: 'ssc', name: 'SSC' },
  { id: 'rrb', name: 'RRB' },
  { id: 'custom', name: 'Custom Exam' },
  { id: 'auto', name: 'Auto Detect' }
];

const PAPERS = {
  'tg-tet': [
    { id: 'paper1', name: 'Paper 1 (Classes I–V)' },
    { id: 'paper2-math-science', name: 'Paper 2 (Maths & Science)' },
    { id: 'paper2-social', name: 'Paper 2 (Social Studies)' }
  ],
  'eamcet': [
    { id: 'engineering', name: 'Engineering' },
    { id: 'agri-medical', name: 'Agriculture & Medical' }
  ],
  'ssc': [
    { id: 'cgl', name: 'SSC CGL' },
    { id: 'chsl', name: 'SSC CHSL' }
  ],
  'rrb': [
    { id: 'ntpc', name: 'RRB NTPC' },
    { id: 'group-d', name: 'RRB Group D' }
  ]
};

function Analyzer({ onAnalyze }) {
  const [url, setUrl] = useState('');
  const [exam, setExam] = useState('tg-tet');
  const [paper, setPaper] = useState('paper1');
  const [marksPerCorrect, setMarksPerCorrect] = useState(1);
  const [negativeMarksPerWrong, setNegativeMarksPerWrong] = useState(0);
  const [marksPerUnanswered, setMarksPerUnanswered] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setUrl(text);
    } catch (err) {
      console.error('Failed to read clipboard');
    }
  };

  const loadDemo = async (examId) => {
    setLoading(true);
    setError('');
    setStep('Loading demo data...');
    
    try {
      const response = await fetch(`http://localhost:5000/api/demo/${examId}`);
      const result = await response.json();
      
      if (result.success) {
        onAnalyze(result.data, true);
      } else {
        setError(result.error || 'Failed to load demo data');
      }
    } catch (err) {
      setError('Failed to connect to server. Make sure the backend is running.');
    } finally {
      setLoading(false);
      setStep('');
    }
  };

  const handleAnalyze = async () => {
    if (!url) {
      setError('Please enter a response sheet URL');
      return;
    }

    setLoading(true);
    setError('');
    setStep('Validating URL...');
    
    try {
      setStep('Connecting to response sheet...');
      const response = await fetch('http://localhost:5000/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url,
          exam: exam === 'auto' ? null : exam,
          paper: exam === 'auto' ? null : paper,
          marksPerCorrect,
          negativeMarksPerWrong,
          marksPerUnanswered
        })
      });

      setStep('Parsing question data...');
      const result = await response.json();

      if (result.success) {
        setStep('Calculating scores...');
        onAnalyze(result.data, false);
      } else {
        setError(result.error || 'Failed to analyze response sheet');
      }
    } catch (err) {
      setError('Failed to connect to server. Make sure the backend is running.');
    } finally {
      setLoading(false);
      setStep('');
    }
  };

  const currentPapers = PAPERS[exam] || [];

  return (
    <div style={{ maxWidth: '56rem', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2.25rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.75rem' }}>
          Turn Your Answer Key Into a Complete Scorecard
        </h2>
        <p style={{ color: '#4b5563', fontSize: '1.125rem' }}>
          Paste your official response-sheet link to instantly analyze marks, subject-wise breakdown, accuracy, and question mistakes.
        </p>
      </div>

      <div style={{ background: 'white', borderRadius: '1rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', padding: '2rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste your response sheet URL here..."
            style={{ flex: 1, padding: '0.75rem 1rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', fontSize: '1.125rem' }}
            disabled={loading}
          />
          <button
            onClick={handlePaste}
            style={{ padding: '0.75rem 1rem', background: '#f3f4f6', color: '#374151', borderRadius: '0.5rem', border: 'none', cursor: loading ? 'not-allowed' : 'pointer' }}
            disabled={loading}
            title="Paste from clipboard"
          >
            <Clipboard style={{ width: '20px', height: '20px' }} />
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>Select Exam</label>
            <select
              value={exam}
              onChange={(e) => {
                setExam(e.target.value);
                setPaper(currentPapers[0]?.id || '');
              }}
              style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid #d1d5db', borderRadius: '0.5rem' }}
              disabled={loading}
            >
              {EXAMS.map(e => (
                <option key={e.id} value={e.id}>{e.name}</option>
              ))}
            </select>
          </div>

          {currentPapers.length > 0 && (
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>Select Paper</label>
              <select
                value={paper}
                onChange={(e) => setPaper(e.target.value)}
                style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid #d1d5db', borderRadius: '0.5rem' }}
                disabled={loading}
              >
                {currentPapers.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          style={{ color: '#2563eb', fontSize: '0.875rem', fontWeight: '500', marginBottom: '1rem', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
        >
          {showAdvanced ? 'Hide' : 'Show'} Advanced Marking Options
        </button>

        {showAdvanced && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem', padding: '1rem', background: '#f9fafb', borderRadius: '0.5rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>Marks per Correct</label>
              <input
                type="number"
                value={marksPerCorrect}
                onChange={(e) => setMarksPerCorrect(parseFloat(e.target.value) || 0)}
                style={{ width: '100%', padding: '0.5rem 1rem', border: '1px solid #d1d5db', borderRadius: '0.5rem' }}
                disabled={loading}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>Negative Marks per Wrong</label>
              <input
                type="number"
                value={negativeMarksPerWrong}
                onChange={(e) => setNegativeMarksPerWrong(parseFloat(e.target.value) || 0)}
                style={{ width: '100%', padding: '0.5rem 1rem', border: '1px solid #d1d5db', borderRadius: '0.5rem' }}
                disabled={loading}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>Marks for Unanswered</label>
              <input
                type="number"
                value={marksPerUnanswered}
                onChange={(e) => setMarksPerUnanswered(parseFloat(e.target.value) || 0)}
                style={{ width: '100%', padding: '0.5rem 1rem', border: '1px solid #d1d5db', borderRadius: '0.5rem' }}
                disabled={loading}
              />
            </div>
          </div>
        )}

        <button
          onClick={handleAnalyze}
          disabled={loading}
          style={{ width: '100%', padding: '1rem', background: 'linear-gradient(to right, #2563eb, #9333ea)', color: 'white', borderRadius: '0.5rem', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', fontSize: '1.125rem', fontWeight: '600', opacity: loading ? 0.5 : 1 }}
        >
          {loading ? (
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              <Loader2 style={{ width: '20px', height: '20px', animation: 'spin 1s linear infinite' }} />
              {step || 'Analyzing...'}
            </span>
          ) : (
            'Analyze Score'
          )}
        </button>

        {error && (
          <div style={{ marginTop: '1rem', padding: '1rem', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '0.5rem', display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
            <AlertCircle style={{ width: '20px', height: '20px', color: '#ef4444', flexShrink: 0, marginTop: '2px' }} />
            <p style={{ color: '#b91c1c', fontSize: '0.875rem' }}>{error}</p>
          </div>
        )}
      </div>

      <div style={{ background: 'white', borderRadius: '1rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem' }}>Try Demo Mode</h3>
        <p style={{ color: '#4b5563', marginBottom: '1rem', fontSize: '0.875rem' }}>
          Test the application with pre-loaded sample response sheets:
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          <button
            onClick={() => loadDemo('tg-tet')}
            disabled={loading}
            style={{ padding: '0.5rem 1rem', background: '#dcfce7', color: '#15803d', borderRadius: '0.5rem', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', fontSize: '0.875rem', fontWeight: '500' }}
          >
            TG TET Paper 1 Demo
          </button>
          <button
            onClick={() => loadDemo('neet')}
            disabled={loading}
            style={{ padding: '0.5rem 1rem', background: '#dcfce7', color: '#15803d', borderRadius: '0.5rem', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', fontSize: '0.875rem', fontWeight: '500' }}
          >
            NEET Demo
          </button>
          <button
            onClick={() => loadDemo('jee-main')}
            disabled={loading}
            style={{ padding: '0.5rem 1rem', background: '#dcfce7', color: '#15803d', borderRadius: '0.5rem', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', fontSize: '0.875rem', fontWeight: '500' }}
          >
            JEE Main Demo
          </button>
        </div>
      </div>
    </div>
  );
}

export default Analyzer;
