import { useState } from 'react';
import Header from './components/Header';
import Analyzer from './components/Analyzer';
import ScorecardDashboard from './components/ScorecardDashboard';

function App() {
  const [scorecardData, setScorecardData] = useState(null);
  const [isDemo, setIsDemo] = useState(false);

  const handleAnalyze = (data, demo = false) => {
    setScorecardData(data);
    setIsDemo(demo);
  };

  const handleReset = () => {
    setScorecardData(null);
    setIsDemo(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #eff6ff, #ffffff, #faf5ff)' }}>
      <Header onReset={handleReset} hasData={!!scorecardData} />
      
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
        {!scorecardData ? (
          <Analyzer onAnalyze={handleAnalyze} />
        ) : (
          <ScorecardDashboard data={scorecardData} onReset={handleReset} />
        )}
      </main>
      
      <footer style={{ textAlign: 'center', padding: '1.5rem', color: '#6b7280', fontSize: '0.875rem' }}>
        <p>ScoreCheck - Turn Your Answer Key Into a Complete Scorecard</p>
      </footer>
    </div>
  );
}

export default App;
