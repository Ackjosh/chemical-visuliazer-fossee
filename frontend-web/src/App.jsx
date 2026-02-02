import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FileUpload from './components/FileUpload';
import Dashboard from './components/Dashboard';
import HistoryList from './components/HistoryList';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

function App() {
  const [token, setToken] = useState(localStorage.getItem('access_token'));
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [currentFileId, setCurrentFileId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, [token]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axios.post('https://chemical-visuliazer-fossee-backend.onrender.com/api/token/', { username, password });
      const newToken = res.data.access;
      setToken(newToken);
      localStorage.setItem('access_token', newToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
    } catch (err) {
      alert('Login Failed.');
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('access_token');
    delete axios.defaults.headers.common['Authorization'];
    setCurrentFileId(null);
  };

  const handleUploadSuccess = (newId) => {
      setCurrentFileId(newId);
      setRefreshTrigger(prev => prev + 1);
  };

  if (!token) {
    return (
      <div style={styles.loginPage}>
        <div style={styles.loginCard}>
          <div style={styles.loginHeader}>
            <h1 style={styles.appTitle}>⚗️</h1>
            <h2 style={styles.appName}>Chemical Visualizer</h2>
            <p style={styles.appSubtitle}>Analyze and Visualize Chemical Data</p>
          </div>
          <form onSubmit={handleLogin} style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Username</label>
              <input 
                style={styles.input} 
                placeholder="Enter your username" 
                value={username} 
                onChange={e => setUsername(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Password</label>
              <input 
                style={styles.input} 
                type="password" 
                placeholder="Enter your password" 
                value={password} 
                onChange={e => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <button 
              type="submit" 
              style={{...styles.primaryButton, opacity: isLoading ? 0.7 : 1, cursor: isLoading ? 'not-allowed' : 'pointer'}}
              disabled={isLoading}
            >
              {isLoading ? (
                <span style={styles.loadingContainer}>
                  <span style={styles.spinner}></span>
                  Logging in...
                </span>
              ) : (
                'Login'
              )}
            </button>
          </form>
          <p style={styles.footer}>Secure access to chemical analysis tools</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.dashboardContainer}>
      
      <div style={styles.sidebar}>
        <div style={styles.brand}>
          <h3>Chemical Visulaizer</h3>
        </div>
        
        <div style={{ padding: '20px' }}>
          <p style={styles.sectionTitle}>ACTIONS</p>
          <FileUpload onUploadSuccess={handleUploadSuccess} />
          
          <div style={{ marginTop: '30px' }}>
             <p style={styles.sectionTitle}>HISTORY</p>
             <HistoryList key={refreshTrigger} onSelectFile={setCurrentFileId} />
          </div>
        </div>

        <button onClick={handleLogout} style={styles.logoutButton}>Logout</button>
      </div>

      <div style={styles.mainContent}>
        <div style={styles.topBar}>
          <h2>Dashboard Overview</h2>
          <span style={styles.badge}>User: Admin</span>
        </div>

        <div style={styles.contentWrapper}>
          {currentFileId ? (
            <Dashboard fileId={currentFileId} />
          ) : (
            <div style={styles.emptyState}>
              <h3>Welcome to Chemical Visualizer</h3>
              <p>Select a file from the sidebar or upload a new CSV to begin analysis.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  // Login Styles
  loginPage: { 
    height: '100vh', 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '20px'
  },
  loginCard: { 
    width: '100%',
    maxWidth: '400px', 
    padding: '50px 40px', 
    background: 'white', 
    borderRadius: '16px', 
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
    animation: 'slideInUp 0.6s ease-out'
  },
  loginHeader: {
    textAlign: 'center',
    marginBottom: '35px'
  },
  appTitle: {
    fontSize: '3rem',
    marginBottom: '10px'
  },
  appName: {
    color: '#1a202c',
    marginBottom: '8px',
    fontSize: '28px',
    fontWeight: '700',
    letterSpacing: '-0.5px'
  },
  appSubtitle: {
    color: '#718096',
    fontSize: '14px',
    marginTop: '5px'
  },
  form: { 
    display: 'flex', 
    flexDirection: 'column', 
    gap: '20px'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#2d3748',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  input: { 
    padding: '12px 16px', 
    border: '2px solid #e2e8f0', 
    borderRadius: '8px', 
    fontSize: '15px',
    transition: 'all 0.3s ease',
    fontFamily: 'inherit',
    backgroundColor: '#f7fafc'
  },
  spinner: {
    display: 'inline-block',
    width: '16px',
    height: '16px',
    border: '3px solid rgba(255,255,255,0.3)',
    borderTop: '3px solid white',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
    marginRight: '8px',
    verticalAlign: 'middle'
  },
  loadingContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px'
  },
  primaryButton: { 
    padding: '13px 16px', 
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white', 
    border: 'none', 
    borderRadius: '8px', 
    cursor: 'pointer', 
    fontWeight: '600',
    fontSize: '16px',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
    marginTop: '10px'
  },
  footer: {
    textAlign: 'center',
    color: '#a0aec0',
    fontSize: '13px',
    marginTop: '20px',
    fontStyle: 'italic'
  },
  
  // Layout Styles
  dashboardContainer: { display: 'flex', height: '100vh', fontFamily: "'Inter', sans-serif", overflow: 'hidden' },
  
  sidebar: { 
      width: '320px',
      background: '#1a1f36', 
      color: 'white', 
      display: 'flex', 
      flexDirection: 'column', 
      flexShrink: 0 
  },

  brand: { height: '60px', display: 'flex', alignItems: 'center', paddingLeft: '20px', borderBottom: '1px solid #2d3654', fontSize: '1.2rem', fontWeight: 'bold' },
  sectionTitle: { fontSize: '0.75rem', color: '#6978a0', fontWeight: 'bold', marginBottom: '10px', letterSpacing: '1px' },
  
  // Main Content Styles
  mainContent: { flex: 1, background: '#f7f9fc', display: 'flex', flexDirection: 'column', overflowY: 'auto' },
  topBar: { height: '60px', background: 'white', borderBottom: '1px solid #eaeaea', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 30px' },
  contentWrapper: { padding: '30px' },
  
  // Components
  logoutButton: { marginTop: 'auto', padding: '15px', background: '#111424', color: '#ff6b6b', border: 'none', cursor: 'pointer', textAlign: 'left', fontWeight: 'bold' },
  badge: { padding: '5px 12px', background: '#e0f2fe', color: '#0284c7', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '600' },
  
  // Empty State
  emptyState: { textAlign: 'center', marginTop: '100px', color: '#64748b' }
};

export default App;