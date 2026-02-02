import React, { useState } from 'react';
import axios from 'axios';

const FileUpload = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleUpload = async () => {
    if (!file) return;
    const token = localStorage.getItem('access_token'); 

    if (!token) {
      setMessage('You are not logged in!');
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(
        'https://chemical-visuliazer-fossee-backend.onrender.com/api/upload/', 
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      setMessage('Uploaded!');
      onUploadSuccess(response.data.id);
      setIsLoading(false);
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error("Upload Error:", error);
      setIsLoading(false);
      if (error.response && error.response.status === 401) {
          setMessage('Session expired. Please login again.');
      } else {
          setMessage('Failed to upload');
      }
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
            disabled={isLoading}
        />
        
        <button 
            onClick={handleUpload}
            disabled={isLoading}
            style={{
                padding: '8px',
                background: isLoading ? '#667eea' : '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                fontWeight: '600',
                width: '100%',
                opacity: isLoading ? 0.7 : 1,
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
            }}
        >
            {isLoading ? (
                <>
                  <span style={uploadStyles.spinner}></span>
                  Uploading...
                </>
            ) : (
                'Upload CSV'
            )}
        </button>
      </div>
      {message && <p style={{ fontSize: '12px', marginTop: '10px', color: '#4ade80' }}>{message}</p>}
    </div>
  );
};

export default FileUpload;

const uploadStyles = {
  spinner: {
    display: 'inline-block',
    width: '14px',
    height: '14px',
    border: '2px solid rgba(255,255,255,0.3)',
    borderTop: '2px solid white',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite'
  }
};