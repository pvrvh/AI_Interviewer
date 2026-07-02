import React, { useState, useEffect, useCallback } from 'react';
import { analyticsAPI } from '../services/api';

function Analytics() {
  const [stats, setStats] = useState(null);
  const [progress, setProgress] = useState(null);
  const [tips, setTips] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('technical');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadAnalytics = useCallback(async () => {
    try {
      const [statsRes, progressRes] = await Promise.all([
        analyticsAPI.getDashboard(),
        analyticsAPI.getProgress()
      ]);
      
      setStats(statsRes.data);
      setProgress(progressRes.data);
    } catch (err) {
      setError('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadTips = useCallback(async () => {
    try {
      const response = await analyticsAPI.getTips(selectedCategory);
      setTips(response.data.tips);
    } catch (err) {
      console.error('Failed to load tips');
    }
  }, [selectedCategory]);

  useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics]);

  useEffect(() => {
    loadTips();
  }, [loadTips]);

  if (loading) return <div className="container"><div className="loading">Loading...</div></div>;
  if (error) return <div className="container"><div className="error">{error}</div></div>;
  if (!stats || !progress) return null;

  return (
    <div className="container">
      <div style={{marginBottom: '2rem'}}>
        <h1>Analytics & Progress</h1>
        <p style={{color: '#7f8c8d'}}>Track your interview preparation journey</p>
      </div>

      <div className="grid grid-3" style={{marginBottom: '2rem'}}>
        <div className="stat-card">
          <h3>{stats.total_interviews}</h3>
          <p>Total Interviews</p>
        </div>
        <div className="stat-card" style={{background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'}}>
          <h3>{stats.completed_interviews}</h3>
          <p>Completed</p>
        </div>
        <div className="stat-card" style={{background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'}}>
          <h3>{stats.total_questions_answered}</h3>
          <p>Questions Answered</p>
        </div>
      </div>

      <div className="grid grid-2">
        <div className="card">
          <h2 className="card-title" style={{marginBottom: '2rem'}}>Performance by Category</h2>
          
          {stats.category_stats.length === 0 ? (
            <p style={{textAlign: 'center', color: '#7f8c8d', padding: '2rem'}}>
              Complete some interviews to see your category performance
            </p>
          ) : (
            <div>
              {stats.category_stats.map((cat) => (
                <div key={cat.category} style={{marginBottom: '2rem'}}>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem'}}>
                    <div>
                      <div style={{fontWeight: '600', textTransform: 'capitalize', fontSize: '1.1rem'}}>
                        {cat.category.replace('_', ' ')}
                      </div>
                      <div style={{fontSize: '0.875rem', color: '#7f8c8d'}}>
                        {cat.count} interview{cat.count !== 1 ? 's' : ''}
                      </div>
                    </div>
                    <div style={{
                      fontSize: '2rem',
                      fontWeight: 'bold',
                      color: cat.average_score >= 70 ? '#27ae60' : cat.average_score >= 50 ? '#f39c12' : '#e74c3c'
                    }}>
                      {cat.average_score}%
                    </div>
                  </div>
                  <div style={{
                    height: '12px',
                    backgroundColor: '#ecf0f1',
                    borderRadius: '6px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      height: '100%',
                      width: `${cat.average_score}%`,
                      backgroundColor: cat.average_score >= 70 ? '#27ae60' : cat.average_score >= 50 ? '#f39c12' : '#e74c3c',
                      transition: 'width 0.5s ease'
                    }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <h2 className="card-title" style={{marginBottom: '2rem'}}>Performance by Difficulty</h2>
          
          {progress.difficulty_stats.length === 0 ? (
            <p style={{textAlign: 'center', color: '#7f8c8d', padding: '2rem'}}>
              Complete some interviews to see difficulty breakdown
            </p>
          ) : (
            <div>
              {progress.difficulty_stats.map((diff) => (
                <div key={diff.difficulty} style={{marginBottom: '2rem'}}>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem'}}>
                    <div>
                      <span className={`badge badge-${diff.difficulty}`} style={{fontSize: '1rem', padding: '0.5rem 1rem'}}>
                        {diff.difficulty}
                      </span>
                      <span style={{marginLeft: '0.5rem', fontSize: '0.875rem', color: '#7f8c8d'}}>
                        {diff.count} interview{diff.count !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <div style={{
                      fontSize: '2rem',
                      fontWeight: 'bold',
                      color: diff.average_score >= 70 ? '#27ae60' : diff.average_score >= 50 ? '#f39c12' : '#e74c3c'
                    }}>
                      {diff.average_score}%
                    </div>
                  </div>
                  <div style={{
                    height: '12px',
                    backgroundColor: '#ecf0f1',
                    borderRadius: '6px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      height: '100%',
                      width: `${diff.average_score}%`,
                      backgroundColor: diff.average_score >= 70 ? '#27ae60' : diff.average_score >= 50 ? '#f39c12' : '#e74c3c',
                      transition: 'width 0.5s ease'
                    }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {progress.timeline.length > 0 && (
        <div className="card" style={{marginTop: '2rem'}}>
          <h2 className="card-title" style={{marginBottom: '2rem'}}>Recent Progress</h2>
          
          <div style={{overflowX: 'auto'}}>
            <div style={{display: 'flex', gap: '1rem', minWidth: '600px'}}>
              {progress.timeline.map((item, index) => (
                <div 
                  key={index}
                  style={{
                    flex: '1',
                    padding: '1rem',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '8px',
                    textAlign: 'center'
                  }}
                >
                  <div style={{
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    color: item.score >= 70 ? '#27ae60' : item.score >= 50 ? '#f39c12' : '#e74c3c',
                    marginBottom: '0.5rem'
                  }}>
                    {item.score}%
                  </div>
                  <div style={{fontSize: '0.875rem', color: '#7f8c8d', marginBottom: '0.5rem'}}>
                    {new Date(item.date).toLocaleDateString()}
                  </div>
                  <span className="badge" style={{backgroundColor: '#e8f4f8', color: '#2980b9'}}>
                    {item.category.replace('_', ' ')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="card" style={{marginTop: '2rem'}}>
        <h2 className="card-title" style={{marginBottom: '1rem'}}>AI-Powered Interview Tips</h2>
        
        <div style={{marginBottom: '1.5rem'}}>
          <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: '500'}}>
            Select Category:
          </label>
          <select
            className="form-control"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{maxWidth: '300px'}}
          >
            <option value="technical">Technical</option>
            <option value="behavioral">Behavioral</option>
            <option value="system_design">System Design</option>
          </select>
        </div>

        {tips.length > 0 && (
          <div style={{
            backgroundColor: '#e8f4f8',
            padding: '1.5rem',
            borderRadius: '8px'
          }}>
            <ul style={{margin: 0, paddingLeft: '1.5rem'}}>
              {tips.map((tip, index) => (
                <li key={index} style={{marginBottom: '1rem', lineHeight: '1.6', color: '#2c3e50'}}>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default Analytics;
