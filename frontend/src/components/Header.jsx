import { BarChart3 } from 'lucide-react';

function Header({ onReset, hasData }) {
  return (
    <header style={{ background: 'white', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', borderBottom: '1px solid #e5e7eb' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ background: 'linear-gradient(to right, #2563eb, #9333ea)', padding: '0.5rem', borderRadius: '0.5rem' }}>
            <BarChart3 style={{ width: '24px', height: '24px', color: 'white' }} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>ScoreCheck</h1>
            <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0 }}>Exam Analysis Platform</p>
          </div>
        </div>
        
        {hasData && (
          <button
            onClick={onReset}
            style={{ padding: '0.5rem 1rem', background: '#2563eb', color: 'white', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', fontSize: '0.875rem', fontWeight: '500' }}
            onMouseOver={(e) => e.target.style.background = '#1d4ed8'}
            onMouseOut={(e) => e.target.style.background = '#2563eb'}
          >
            Analyze Another
          </button>
        )}
      </div>
    </header>
  );
}

export default Header;
