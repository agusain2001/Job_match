import React, { useState, useEffect } from 'react';
import UploadView from './components/UploadView';
import ResultsView from './components/ResultsView';
import Login from './components/Login';

function App() {
  const [jobId, setJobId] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) setToken(storedToken);
  }, []);

  const handleLogin = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setJobId(null);
  };

  const handleUploadSuccess = (id) => {
    setJobId(id);
  };

  if (!token) {
    return (
      <div>
        <header className="glass" style={{ position: 'sticky', top: 0, zIndex: 100, borderBottom: '1px solid var(--border)' }}>
          <div className="container" style={{ padding: '1rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>JM</div>
              <h1 style={{ fontSize: '1.25rem', margin: 0, fontWeight: 700 }}>Job <span style={{ color: 'var(--primary)' }}>Match</span> AI</h1>
            </div>
          </div>
        </header>
        <main>
          <Login onLogin={handleLogin} />
        </main>
      </div>
    );
  }

  return (
    <div>
      <header className="glass" style={{ position: 'sticky', top: 0, zIndex: 100, borderBottom: '1px solid var(--border)' }}>
        <div className="container" style={{ padding: '1rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>JM</div>
            <h1 style={{ fontSize: '1.25rem', margin: 0, fontWeight: 700 }}>Job <span style={{ color: 'var(--primary)' }}>Match</span> AI</h1>
          </div>
          <button onClick={handleLogout} className="btn" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', background: '#f1f5f9' }}>Logout</button>
        </div>
      </header>

      <main style={{ paddingTop: '2rem' }}>
        {!jobId ? (
          <UploadView onUploadSuccess={handleUploadSuccess} />
        ) : (
          <ResultsView jobId={jobId} />
        )}
      </main>
    </div>
  );
}

export default App;
