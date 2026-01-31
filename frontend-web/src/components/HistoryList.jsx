import React, { useEffect, useState } from 'react';
import axios from 'axios';

const HistoryList = ({ onSelectFile }) => {
    const [files, setFiles] = useState([]);

    useEffect(() => { fetchHistory(); }, []);

    const fetchHistory = async () => {
        try {
            const res = await axios.get('https://chemical-visuliazer-fossee-backend.onrender.com/api/history/');
            setFiles(res.data);
        } catch (err) { console.error(err); }
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <label style={{ fontSize: '0.85rem', color: '#a0aec0' }}>RECENT UPLOADS</label>
                <button onClick={fetchHistory} style={{ background: 'transparent', border: 'none', color: '#3b82f6', cursor: 'pointer', fontSize: '10px' }}>↻</button>
            </div>

            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {files.map(file => (
                    <li key={file.id} 
                        onClick={() => onSelectFile(file.id)}
                        style={{ 
                            padding: '10px', 
                            marginBottom: '8px', 
                            background: 'rgba(255,255,255,0.05)', 
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '13px',
                            color: '#e2e8f0',
                            transition: 'background 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                    >
                        <div style={{ fontWeight: '500' }}>{new Date(file.uploaded_at).toLocaleDateString()}</div>
                        <div style={{ fontSize: '11px', color: '#94a3b8' }}>{new Date(file.uploaded_at).toLocaleTimeString()}</div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default HistoryList;