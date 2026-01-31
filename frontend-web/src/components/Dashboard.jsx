import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar, Pie } from 'react-chartjs-2';

const Dashboard = ({ fileId }) => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (fileId) fetchStats();
  }, [fileId]);

  const fetchStats = async () => {
    try {
      const res = await axios.get(`https://chemical-visuliazer-fossee-backend.onrender.com/api/stats/${fileId}/`);
      setStats(res.data);
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  const handleDownload = async () => {
    try {
      const response = await axios.get(`https://chemical-visuliazer-fossee-backend.onrender.com/api/report/${fileId}/`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      
      const contentDisposition = response.headers['content-disposition'];
      let fileName = `report_${fileId}.pdf`;
      if (contentDisposition) {
        const fileNameMatch = contentDisposition.match(/filename="?(.+)"?/);
        if (fileNameMatch.length === 2) fileName = fileNameMatch[1];
      }

      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error("Download failed:", error);
      alert("Failed to download report. Ensure you are logged in.");
    }
  };

  if (!stats) return <div style={{ padding: '20px', color: '#64748b' }}>Loading analysis...</div>;

  const pieData = {
    labels: Object.keys(stats.type_distribution),
    datasets: [{
      data: Object.values(stats.type_distribution),
      backgroundColor: ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'],
      borderWidth: 0
    }],
  };

  const barData = {
    labels: ['Temp (°C)', 'Pressure (Bar)', 'Flow (L/m)'],
    datasets: [{
      label: 'Avg Value',
      data: [stats.average_metrics.temperature, stats.average_metrics.pressure, stats.average_metrics.flowrate],
      backgroundColor: ['#6366f1', '#ec4899', '#10b981'],
      borderRadius: 6,
    }],
  };

  return (
    <div>
        <div style={{ marginBottom: '25px', display: 'flex', justifyContent: 'space-between', alignItems: 'end' }}>
            <div>
                <p style={{ margin: 0, fontSize: '12px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    CURRENTLY ANALYZING
                </p>
                <h2 style={{ margin: '5px 0 0 0', color: '#1e293b', fontSize: '24px' }}>
                    {stats.filename}
                </h2>
                <p style={{ margin: '5px 0 0 0', fontSize: '13px', color: '#94a3b8' }}>
                    Uploaded: {new Date(stats.uploaded_at).toLocaleString()}
                </p>
            </div>
            
             <button 
                onClick={handleDownload}
                style={cardStyles.downloadBtn}
             >
                Download Report
             </button>
        </div>

        <div style={cardStyles.metricsRow}>
            <MetricCard title="Total Equipment" value={stats.total_count} color="#6366f1" />
            <MetricCard title="Avg Temperature" value={`${stats.average_metrics.temperature}°C`} color="#ec4899" />
            <MetricCard title="Avg Flowrate" value={stats.average_metrics.flowrate} color="#10b981" />
        </div>

        <div style={cardStyles.chartContainer}>
            <div style={cardStyles.card}>
                <h4 style={cardStyles.cardTitle}>Equipment Types</h4>
                <div style={{ height: '250px', display: 'flex', justifyContent: 'center' }}>
                    <Pie data={pieData} options={{ maintainAspectRatio: false }} />
                </div>
            </div>

            <div style={cardStyles.card}>
                <h4 style={cardStyles.cardTitle}>Parameter Analysis</h4>
                <div style={{ height: '250px' }}>
                    <Bar data={barData} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
                </div>
            </div>
        </div>
    </div>
  );
};

const MetricCard = ({ title, value, color }) => (
    <div style={{ ...cardStyles.metricCard, borderLeft: `4px solid ${color}` }}>
        <p style={{ margin: 0, fontSize: '14px', color: '#64748b' }}>{title}</p>
        <p style={{ margin: '5px 0 0 0', fontSize: '24px', fontWeight: 'bold', color: '#1e293b' }}>{value}</p>
    </div>
);

const cardStyles = {
    metricsRow: { display: 'flex', gap: '20px', marginBottom: '20px', flexWrap: 'wrap' },
    metricCard: { flex: 1, minWidth: '200px', background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' },
    chartContainer: { display: 'flex', gap: '20px', flexWrap: 'wrap' },
    card: { flex: 1, minWidth: '300px', background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' },
    cardTitle: { margin: '0 0 20px 0', color: '#334155' },
    downloadBtn: { background: '#1e293b', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }
};

export default Dashboard;