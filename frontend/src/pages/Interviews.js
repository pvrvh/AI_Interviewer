import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { interviewAPI } from '../services/api';

function Interviews() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadInterviews();
  }, []);

  const loadInterviews = async () => {
    try {
      const response = await interviewAPI.getAll();
      setInterviews(response.data.interviews);
    } catch (err) {
      setError('Failed to load interviews');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }

    try {
      await interviewAPI.delete(id);
      setInterviews(interviews.filter(i => i.id !== id));
    } catch (err) {
      alert('Failed to delete interview');
    }
  };

  if (loading) return <div className="container"><div className="loading">Loading...</div></div>;

  return (
    <div className="container">
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem'}}>
        <div>
          <h1>My Interviews</h1>
          <p style={{color: '#7f8c8d'}}>Manage and track your interview practice sessions</p>
        </div>
        <Link to="/interviews/new" className="btn btn-primary">
          Create New Interview
        </Link>
      </div>

      {error && <div className="error">{error}</div>}

      {interviews.length === 0 ? (
        <div className="card" style={{textAlign: 'center', padding: '3rem'}}>
          <h3>No interviews yet</h3>
          <p style={{color: '#7f8c8d', marginBottom: '2rem'}}>
            Start your interview preparation journey by creating your first mock interview!
          </p>
          <Link to="/interviews/new" className="btn btn-primary">
            Create Your First Interview
          </Link>
        </div>
      ) : (
        <div className="grid grid-2">
          {interviews.map((interview) => (
            <div key={interview.id} className="card">
              <div style={{marginBottom: '1rem'}}>
                <h3 style={{margin: '0 0 0.5rem 0'}}>{interview.title}</h3>
                <div style={{display: 'flex', gap: '0.5rem', marginBottom: '1rem'}}>
                  <span className={`badge badge-${interview.difficulty}`}>
                    {interview.difficulty}
                  </span>
                  <span className="badge" style={{backgroundColor: '#e8f4f8', color: '#2980b9'}}>
                    {interview.category.replace('_', ' ')}
                  </span>
                  <span className={`badge badge-${interview.status.replace('_', '-')}`}>
                    {interview.status.replace('_', ' ')}
                  </span>
                </div>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1rem',
                padding: '1rem',
                backgroundColor: '#f8f9fa',
                borderRadius: '5px',
                marginBottom: '1rem'
              }}>
                <div>
                  <div style={{fontSize: '0.875rem', color: '#7f8c8d'}}>Score</div>
                  <div style={{fontSize: '1.5rem', fontWeight: 'bold', color: '#3498db'}}>
                    {interview.score}%
                  </div>
                </div>
                <div>
                  <div style={{fontSize: '0.875rem', color: '#7f8c8d'}}>Questions</div>
                  <div style={{fontSize: '1.5rem', fontWeight: 'bold', color: '#3498db'}}>
                    {interview.total_questions}
                  </div>
                </div>
              </div>

              <div style={{fontSize: '0.875rem', color: '#7f8c8d', marginBottom: '1rem'}}>
                Created: {new Date(interview.created_at).toLocaleDateString()}
              </div>

              <div style={{display: 'flex', gap: '0.5rem'}}>
                <Link 
                  to={`/interviews/${interview.id}`} 
                  className="btn btn-primary"
                  style={{flex: 1}}
                >
                  View Details
                </Link>
                <button 
                  onClick={() => handleDelete(interview.id, interview.title)}
                  className="btn btn-danger"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Interviews;
