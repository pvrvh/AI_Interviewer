import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { interviewAPI } from '../services/api';

function NewInterview() {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('technical');
  const [difficulty, setDifficulty] = useState('medium');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await interviewAPI.create({
        title,
        category,
        difficulty
      });
      navigate(`/interviews/${response.data.interview.id}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create interview');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div style={{maxWidth: '600px', margin: '0 auto'}}>
        <h1 style={{marginBottom: '0.5rem'}}>Create New Interview</h1>
        <p style={{color: '#7f8c8d', marginBottom: '2rem'}}>
          Set up a new mock interview session
        </p>

        {error && <div className="error">{error}</div>}

        <div className="card">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Interview Title</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g., Python Backend Developer Interview"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label>Category</label>
              <select
                className="form-control"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                disabled={loading}
              >
                <option value="technical">Technical</option>
                <option value="behavioral">Behavioral</option>
                <option value="system_design">System Design</option>
              </select>
              <small style={{color: '#7f8c8d', display: 'block', marginTop: '0.5rem'}}>
                {category === 'technical' && 'Programming concepts, algorithms, data structures'}
                {category === 'behavioral' && 'Situational questions, team dynamics, problem-solving'}
                {category === 'system_design' && 'Architecture, scalability, design patterns'}
              </small>
            </div>

            <div className="form-group">
              <label>Difficulty Level</label>
              <select
                className="form-control"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                disabled={loading}
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            <div style={{display: 'flex', gap: '1rem'}}>
              <button 
                type="submit" 
                className="btn btn-primary"
                style={{flex: 1}}
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create Interview'}
              </button>
              <button 
                type="button" 
                onClick={() => navigate('/interviews')}
                className="btn btn-secondary"
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

        <div className="card" style={{marginTop: '2rem', backgroundColor: '#e8f4f8'}}>
          <h3 style={{margin: '0 0 1rem 0', color: '#2c3e50'}}>What happens next?</h3>
          <ol style={{paddingLeft: '1.5rem', color: '#34495e'}}>
            <li style={{marginBottom: '0.5rem'}}>
              AI will generate relevant interview questions based on your selections
            </li>
            <li style={{marginBottom: '0.5rem'}}>
              Answer each question to the best of your ability
            </li>
            <li style={{marginBottom: '0.5rem'}}>
              Receive detailed feedback and scoring on your answers
            </li>
            <li>
              Track your progress and improve your interview skills
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}

export default NewInterview;
