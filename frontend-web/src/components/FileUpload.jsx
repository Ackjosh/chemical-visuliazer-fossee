import React, { useState } from 'react';
import axios from 'axios';

const FileUpload = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/upload/', formData);
      setMessage('✅ Uploaded!');
      onUploadSuccess(response.data.id);
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('❌ Failed');
    }
  };

  return (
    <div style={{ color: 'white' }}>
      <label style={{ display: 'block', marginBottom: '10px', fontSize: '0.85rem', color: '#a0aec0' }}>
        UPLOAD NEW DATASET
      </label>
      
      <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
        <input 
            type="file" 
            onChange={handleFileChange} 
            accept=".csv"
            style={{ fontSize: '12px', color: '#cbd5e0' }} 
        />
        
        <button 
            onClick={handleUpload} 
            style={{
                padding: '8px',
                background: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: '600',
                width: '100%'
            }}
        >
            Upload CSV
        </button>
      </div>
      {message && <p style={{ fontSize: '12px', marginTop: '10px', color: '#4ade80' }}>{message}</p>}
    </div>
  );
};

export default FileUpload;