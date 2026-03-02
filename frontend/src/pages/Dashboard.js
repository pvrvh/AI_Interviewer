import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { analyticsAPI } from '../services/api';

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const response = await analyticsAPI.getDashboard();
      setStats(response.data);
    } catch (err) {
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="container"><div className="loading">Loading...</div></div>;
  if (error) return <div className="container"><div className="error">{error}</div></div>;
  if (!stats) return null;

  return (
    <div className="container">
      <div style={{marginBottom: '2rem'}}>
        <h1>Dashboard</h1>
        <p style={{color: '#7f8c8d'}}>Welcome back! Here's your interview prep progress.</p>
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
          <h3>{stats.average_score}%</h3>
          <p>Average Score</p>
        </div>
      </div>

      <div className="grid grid-2">
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Recent Interviews</h2>
            <Link to="/interviews/new" className="btn btn-primary">New Interview</Link>
          </div>
          
          {stats.recent_interviews.length === 0 ? (
            <p style={{color: '#7f8c8d', textAlign: 'center', padding: '2rem'}}>
              No interviews yet. Start your first interview!
            </p>
          ) : (
            <div>
              {stats.recent_interviews.map((interview) => (
                <Link 
                  key={interview.id} 
                  to={`/interviews/${interview.id}`}
                  style={{textDecoration: 'none', color: 'inherit'}}
                >
                  <div style={{
                    padding: '1rem',
                    marginBottom: '0.5rem',
                    border: '1px solid #ecf0f1',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    transition: 'all 0.3s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
                  >
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                      <div>
                        <h3 style={{margin: '0 0 0.5rem 0'}}>{interview.title}</h3>
                        <div style={{display: 'flex', gap: '0.5rem'}}>
                          <span className={`badge badge-${interview.difficulty}`}>
                            {interview.difficulty}
                          </span>
                          <span className={`badge badge-${interview.status.replace('_', '-')}`}>
                            {interview.status.replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                      <div style={{textAlign: 'right'}}>
                        <div style={{fontSize: '1.5rem', fontWeight: 'bold', color: '#3498db'}}>
                          {interview.score}%
                        </div>
                        <div style={{fontSize: '0.875rem', color: '#7f8c8d'}}>
                          {interview.total_questions} questions
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Performance by Category</h2>
          </div>
          
          {stats.category_stats.length === 0 ? (
            <p style={{color: '#7f8c8d', textAlign: 'center', padding: '2rem'}}>
              Complete some interviews to see your performance!
            </p>
          ) : (
            <div>
              {stats.category_stats.map((cat) => (
                <div key={cat.category} style={{marginBottom: '1.5rem'}}>
                  <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem'}}>
                    <span style={{fontWeight: '500', textTransform: 'capitalize'}}>
                      {cat.category.replace('_', ' ')}
                    </span>
                    <span style={{color: '#3498db', fontWeight: 'bold'}}>
                      {cat.average_score}%
                    </span>
                  </div>
                  <div style={{
                    height: '8px',
                    backgroundColor: '#ecf0f1',
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      height: '100%',
                      width: `${cat.average_score}%`,
                      backgroundColor: '#3498db',
                      transition: 'width 0.3s'
                    }} />
                  </div>
                  <div style={{fontSize: '0.875rem', color: '#7f8c8d', marginTop: '0.25rem'}}>
                    {cat.count} interview{cat.count !== 1 ? 's' : ''}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div style={{marginTop: '2rem', textAlign: 'center'}}>
        <Link to="/interviews" className="btn btn-primary" style={{marginRight: '1rem'}}>
          View All Interviews
        </Link>
        <Link to="/analytics" className="btn btn-secondary">
          Detailed Analytics
        </Link>
      </div>
    </div>
  );
}

export default Dashboard;
