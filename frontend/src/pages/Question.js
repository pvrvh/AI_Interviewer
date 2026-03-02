import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { questionAPI } from '../services/api';

function Question() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [question, setQuestion] = useState(null);
  const [answer, setAnswer] = useState('');
  const [hints, setHints] = useState([]);
  const [showHints, setShowHints] = useState(false);
  const [evaluation, setEvaluation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadQuestion();
    loadHints();
  }, [id]);

  const loadQuestion = async () => {
    try {
      const response = await questionAPI.getById(id);
      setQuestion(response.data.question);
      
      // If already answered, show the answer and evaluation
      if (response.data.question.answers && response.data.question.answers.length > 0) {
        const latestAnswer = response.data.question.answers[0];
        setAnswer(latestAnswer.answer_text);
        setEvaluation({
          score: latestAnswer.score,
          feedback: latestAnswer.feedback,
          strengths: JSON.parse(latestAnswer.strengths),
          improvements: JSON.parse(latestAnswer.improvements)
        });
      }
    } catch (err) {
      setError('Failed to load question');
    } finally {
      setLoading(false);
    }
  };

  const loadHints = async () => {
    try {
      const response = await questionAPI.getHints(id);
      setHints(response.data.hints);
    } catch (err) {
      console.error('Failed to load hints');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!answer.trim()) {
      alert('Please provide an answer');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const response = await questionAPI.submitAnswer(id, answer);
      setEvaluation(response.data.evaluation);
      await loadQuestion();
    } catch (err) {
      setError('Failed to submit answer');
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    if (question) {
      navigate(`/interviews/${question.interview_id}`);
    } else {
      navigate('/interviews');
    }
  };

  if (loading) return <div className="container"><div className="loading">Loading...</div></div>;
  if (error && !question) return <div className="container"><div className="error">{error}</div></div>;
  if (!question) return null;

  const hasExistingAnswer = question.answers && question.answers.length > 0;

  return (
    <div className="container">
      <button onClick={handleBack} className="btn btn-secondary" style={{marginBottom: '1rem'}}>
        ← Back to Interview
      </button>

      {error && <div className="error">{error}</div>}

      <div className="card">
        <div style={{marginBottom: '2rem'}}>
          <div style={{display: 'flex', gap: '0.5rem', marginBottom: '1rem'}}>
            <span className={`badge badge-${question.difficulty}`}>
              {question.difficulty}
            </span>
            <span className="badge" style={{backgroundColor: '#e8f4f8', color: '#2980b9'}}>
              {question.question_type}
            </span>
          </div>
          <h1 style={{margin: '0', lineHeight: '1.4'}}>
            {question.question_text}
          </h1>
        </div>

        {!hasExistingAnswer && hints.length > 0 && (
          <div style={{marginBottom: '2rem'}}>
            <button 
              onClick={() => setShowHints(!showHints)}
              className="btn btn-secondary"
              style={{marginBottom: '1rem'}}
            >
              {showHints ? 'Hide Hints' : 'Show Hints 💡'}
            </button>
            
            {showHints && (
              <div style={{
                padding: '1rem',
                backgroundColor: '#fff3cd',
                border: '1px solid #ffeaa7',
                borderRadius: '5px'
              }}>
                <h3 style={{margin: '0 0 1rem 0', color: '#856404'}}>Hints:</h3>
                <ul style={{margin: 0, paddingLeft: '1.5rem'}}>
                  {hints.map((hint, index) => (
                    <li key={index} style={{marginBottom: '0.5rem', color: '#856404'}}>
                      {hint}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {!hasExistingAnswer ? (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Your Answer</label>
              <textarea
                className="form-control"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Type your answer here... Be detailed and thorough."
                rows="10"
                disabled={submitting}
                required
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={submitting}
              style={{width: '100%', padding: '1rem'}}
            >
              {submitting ? 'Submitting & Evaluating with AI...' : 'Submit Answer'}
            </button>
          </form>
        ) : (
          <div>
            <h3 style={{marginBottom: '1rem'}}>Your Answer:</h3>
            <div style={{
              padding: '1.5rem',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
              marginBottom: '2rem',
              whiteSpace: 'pre-wrap'
            }}>
              {answer}
            </div>
          </div>
        )}

        {evaluation && (
          <div style={{marginTop: '2rem'}}>
            <div className="score-display">
              <h2>{evaluation.score}</h2>
              <p>Your Score</p>
            </div>

            <div className="feedback-section">
              <h3>Feedback</h3>
              <p style={{lineHeight: '1.6', color: '#34495e'}}>{evaluation.feedback}</p>
            </div>

            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '1.5rem'}}>
              <div className="feedback-section" style={{backgroundColor: '#d5f4e6'}}>
                <h3 style={{color: '#229954'}}>Strengths ✓</h3>
                <ul className="feedback-list">
                  {evaluation.strengths.map((strength, index) => (
                    <li key={index} style={{color: '#229954'}}>{strength}</li>
                  ))}
                </ul>
              </div>

              <div className="feedback-section" style={{backgroundColor: '#fff3cd'}}>
                <h3 style={{color: '#856404'}}>Areas for Improvement</h3>
                <ul className="feedback-list">
                  {evaluation.improvements.map((improvement, index) => (
                    <li key={index} style={{color: '#856404'}}>{improvement}</li>
                  ))}
                </ul>
              </div>
            </div>

            {question.expected_answer && (
              <div className="feedback-section" style={{marginTop: '1.5rem', backgroundColor: '#e8f4f8'}}>
                <h3 style={{color: '#2980b9'}}>Expected Answer / Approach</h3>
                <p style={{lineHeight: '1.6', color: '#34495e', whiteSpace: 'pre-wrap'}}>
                  {question.expected_answer}
                </p>
              </div>
            )}

            <div style={{marginTop: '2rem', textAlign: 'center'}}>
              <button onClick={handleBack} className="btn btn-primary">
                Back to Interview
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Question;
