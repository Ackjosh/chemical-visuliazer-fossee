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

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, [token]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://127.0.0.1:8000/api/token/', { username, password });
      const newToken = res.data.access;
      setToken(newToken);
      localStorage.setItem('access_token', newToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
    } catch (err) {
      alert('Login Failed.');
    }
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('access_token');
    delete axios.defaults.headers.common['Authorization'];
    setCurrentFileId(null);
  };

  if (!token) {
    return (
      <div style={styles.loginPage}>
        <div style={styles.loginCard}>
          <h2 style={{ textAlign: 'center', color: '#2c3e50', marginBottom: '20px' }}>Chemical Visualizer</h2>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <input style={styles.input} placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
            <input style={styles.input} type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
            <button type="submit" style={styles.primaryButton}>Login</button>
          </form>
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
          <FileUpload onUploadSuccess={setCurrentFileId} />
          
          <div style={{ marginTop: '30px' }}>
             <p style={styles.sectionTitle}>HISTORY</p>
             <HistoryList onSelectFile={setCurrentFileId} />
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
              <h3>Welcome to ChemViz</h3>
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
  loginPage: { height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#f0f2f5' },
  loginCard: { width: '350px', padding: '40px', background: 'white', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' },
  input: { padding: '12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '16px' },
  
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
  primaryButton: { padding: '12px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' },
  logoutButton: { marginTop: 'auto', padding: '15px', background: '#111424', color: '#ff6b6b', border: 'none', cursor: 'pointer', textAlign: 'left', fontWeight: 'bold' },
  badge: { padding: '5px 12px', background: '#e0f2fe', color: '#0284c7', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '600' },
  
  // Empty State
  emptyState: { textAlign: 'center', marginTop: '100px', color: '#64748b' }
};

export default App;