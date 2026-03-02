import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { interviewAPI, questionAPI } from '../services/api';

function InterviewDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadInterview();
  }, [id]);

  const loadInterview = async () => {
    try {
      const response = await interviewAPI.getById(id);
      setInterview(response.data.interview);
    } catch (err) {
      setError('Failed to load interview');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateQuestions = async () => {
    setGenerating(true);
    setError('');

    try {
      await questionAPI.generate(id, 5);
      await loadInterview();
    } catch (err) {
      setError('Failed to generate questions');
    } finally {
      setGenerating(false);
    }
  };

  const handleCompleteInterview = async () => {
    if (!window.confirm('Are you sure you want to mark this interview as completed?')) {
      return;
    }

    try {
      // Calculate average score from answered questions
      const answeredQuestions = interview.questions.filter(q => q.answers && q.answers.length > 0);
      const totalScore = answeredQuestions.reduce((sum, q) => sum + q.answers[0].score, 0);
      const avgScore = answeredQuestions.length > 0 ? totalScore / answeredQuestions.length : 0;

      await interviewAPI.update(id, {
        status: 'completed',
        score: avgScore
      });
      
      await loadInterview();
    } catch (err) {
      setError('Failed to complete interview');
    }
  };

  if (loading) return <div className="container"><div className="loading">Loading...</div></div>;
  if (error && !interview) return <div className="container"><div className="error">{error}</div></div>;
  if (!interview) return null;

  return (
    <div className="container">
      <button onClick={() => navigate('/interviews')} className="btn btn-secondary" style={{marginBottom: '1rem'}}>
        ← Back to Interviews
      </button>

      {error && <div className="error">{error}</div>}

      <div className="card">
        <div style={{marginBottom: '2rem'}}>
          <h1 style={{margin: '0 0 0.5rem 0'}}>{interview.title}</h1>
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
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          padding: '1.5rem',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          marginBottom: '2rem'
        }}>
          <div>
            <div style={{fontSize: '0.875rem', color: '#7f8c8d'}}>Total Questions</div>
            <div style={{fontSize: '2rem', fontWeight: 'bold', color: '#3498db'}}>
              {interview.total_questions}
            </div>
          </div>
          <div>
            <div style={{fontSize: '0.875rem', color: '#7f8c8d'}}>Score</div>
            <div style={{fontSize: '2rem', fontWeight: 'bold', color: '#27ae60'}}>
              {interview.score}%
            </div>
          </div>
          <div>
            <div style={{fontSize: '0.875rem', color: '#7f8c8d'}}>Created</div>
            <div style={{fontSize: '1rem', fontWeight: '500', color: '#34495e', marginTop: '0.5rem'}}>
              {new Date(interview.created_at).toLocaleDateString()}
            </div>
          </div>
        </div>

        {interview.questions.length === 0 ? (
          <div style={{textAlign: 'center', padding: '2rem'}}>
            <p style={{color: '#7f8c8d', marginBottom: '2rem'}}>
              No questions generated yet. Click below to generate AI-powered interview questions.
            </p>
            <button 
              onClick={handleGenerateQuestions}
              className="btn btn-primary"
              disabled={generating}
            >
              {generating ? 'Generating Questions...' : 'Generate Questions with AI'}
            </button>
          </div>
        ) : (
          <>
            <h2 style={{marginBottom: '1rem'}}>Questions</h2>
            <div>
              {interview.questions.map((question, index) => {
                const hasAnswer = question.answers && question.answers.length > 0;
                const answer = hasAnswer ? question.answers[0] : null;

                return (
                  <div 
                    key={question.id}
                    style={{
                      padding: '1.5rem',
                      marginBottom: '1rem',
                      border: '1px solid #ecf0f1',
                      borderRadius: '8px',
                      backgroundColor: hasAnswer ? '#f0f9ff' : 'white'
                    }}
                  >
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem'}}>
                      <div style={{flex: 1}}>
                        <h3 style={{margin: '0 0 0.5rem 0'}}>
                          Question {index + 1}
                        </h3>
                        <p style={{color: '#34495e', lineHeight: '1.6'}}>
                          {question.question_text}
                        </p>
                      </div>
                      {hasAnswer && (
                        <div style={{
                          marginLeft: '1rem',
                          padding: '0.5rem 1rem',
                          backgroundColor: answer.score >= 70 ? '#d5f4e6' : '#fff3cd',
                          color: answer.score >= 70 ? '#229954' : '#856404',
                          borderRadius: '20px',
                          fontWeight: 'bold'
                        }}>
                          {answer.score}%
                        </div>
                      )}
                    </div>

                    <div style={{display: 'flex', gap: '0.5rem'}}>
                      <Link 
                        to={`/questions/${question.id}`}
                        className={`btn ${hasAnswer ? 'btn-secondary' : 'btn-primary'}`}
                      >
                        {hasAnswer ? 'View Answer' : 'Answer Question'}
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>

            {interview.status === 'in_progress' && (
              <div style={{marginTop: '2rem', textAlign: 'center'}}>
                <button 
                  onClick={handleCompleteInterview}
                  className="btn btn-success"
                  style={{padding: '1rem 2rem'}}
                >
                  Complete Interview
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default InterviewDetail;
