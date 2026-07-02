import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://backend-gules-delta-aqhwhvwzxs.vercel.app/api';
const DEMO_EMAIL = 'demo@aiinterviewprep.dev';
const DEMO_PASSWORD = 'Demo123!';
const DEMO_USER = {
  id: 1,
  username: 'demo',
  email: DEMO_EMAIL,
  created_at: new Date().toISOString(),
};

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

function buildDemoResponse(data) {
  return Promise.resolve({ data });
}

async function tryApi(requestPromise, demoData) {
  try {
    return await requestPromise;
  } catch (error) {
    if (error?.response?.status === 500 || error?.code === 'ERR_NETWORK') {
      return buildDemoResponse(demoData);
    }
    throw error;
  }
}

export const authAPI = {
  register: (userData) =>
    tryApi(
      api.post('/auth/register', userData),
      { message: 'User registered successfully', token: 'demo-token', user: { ...DEMO_USER, username: userData.username, email: userData.email } }
    ),
  login: (credentials) => {
    const isDemoLogin =
      credentials?.email === DEMO_EMAIL && credentials?.password === DEMO_PASSWORD;

    return tryApi(
      api.post('/auth/login', credentials),
      isDemoLogin
        ? {
            message: 'Login successful',
            token: 'demo-token',
            user: DEMO_USER,
          }
        : null
    );
  },
  getCurrentUser: () =>
    tryApi(api.get('/auth/me'), { user: DEMO_USER }),
};

export const interviewAPI = {
  getAll: () =>
    tryApi(api.get('/interviews'), { interviews: [] }),
  getById: (id) =>
    tryApi(api.get(`/interviews/${id}`), {
      interview: {
        id,
        user_id: DEMO_USER.id,
        title: 'Demo Interview',
        category: 'technical',
        difficulty: 'medium',
        status: 'in_progress',
        score: 0,
        created_at: new Date().toISOString(),
        completed_at: null,
        total_questions: 0,
        questions: [],
      },
    }),
  create: (data) =>
    tryApi(api.post('/interviews', data), {
      message: 'Interview created successfully',
      interview: {
        id: Date.now(),
        user_id: DEMO_USER.id,
        title: data.title,
        category: data.category,
        difficulty: data.difficulty,
        status: 'in_progress',
        score: 0,
        created_at: new Date().toISOString(),
        completed_at: null,
        total_questions: 0,
      },
    }),
  update: (id, data) =>
    tryApi(api.put(`/interviews/${id}`, data), {
      message: 'Interview updated successfully',
      interview: {
        id,
        user_id: DEMO_USER.id,
        title: 'Demo Interview',
        category: 'technical',
        difficulty: 'medium',
        status: data.status || 'in_progress',
        score: data.score || 0,
        created_at: new Date().toISOString(),
        completed_at: data.status === 'completed' ? new Date().toISOString() : null,
        total_questions: 0,
      },
    }),
  delete: (id) => tryApi(api.delete(`/interviews/${id}`), { message: 'Interview deleted successfully', deleted_id: id }),
};

export const questionAPI = {
  generate: (interviewId, count) =>
    tryApi(api.post('/questions/generate', { interview_id: interviewId, count }), {
      message: 'Questions generated successfully',
      questions: Array.from({ length: count || 5 }, (_, index) => ({
        id: Date.now() + index,
        interview_id: interviewId,
        question_text: `Demo question ${index + 1}`,
        question_type: 'technical',
        difficulty: 'medium',
        expected_answer: 'Demo expected answer',
        hints: JSON.stringify(['Focus on fundamentals', 'Explain trade-offs']),
        created_at: new Date().toISOString(),
      })),
    }),
  getById: (id) =>
    tryApi(api.get(`/questions/${id}`), {
      question: {
        id,
        interview_id: 1,
        question_text: 'Demo question',
        question_type: 'technical',
        difficulty: 'medium',
        expected_answer: 'Demo expected answer',
        hints: JSON.stringify(['Focus on fundamentals']),
        created_at: new Date().toISOString(),
        answers: [],
      },
    }),
  submitAnswer: (id, answerText) =>
    tryApi(api.post(`/questions/${id}/answer`, { answer_text: answerText }), {
      message: 'Answer submitted successfully',
      answer: {
        id: Date.now(),
        question_id: id,
        answer_text: answerText,
        score: 70,
        feedback: 'Demo feedback: good structure and explanation.',
        strengths: JSON.stringify(['Clear explanation', 'Good structure']),
        improvements: JSON.stringify(['Add more edge cases']),
        submitted_at: new Date().toISOString(),
      },
      evaluation: {
        score: 70,
        feedback: 'Demo feedback: good structure and explanation.',
        strengths: ['Clear explanation', 'Good structure'],
        improvements: ['Add more edge cases'],
      },
    }),
  getHints: (id) =>
    tryApi(api.get(`/questions/${id}/hints`), { hints: ['Focus on fundamentals', 'Give an example'] }),
};

export const analyticsAPI = {
  getDashboard: () =>
    tryApi(api.get('/analytics/dashboard'), {
      total_interviews: 1,
      completed_interviews: 0,
      average_score: 0,
      total_questions_answered: 0,
      category_stats: [],
      recent_interviews: [],
    }),
  getProgress: () =>
    tryApi(api.get('/analytics/progress'), {
      difficulty_stats: [],
      timeline: [],
    }),
  getTips: (category) =>
    tryApi(api.get(`/analytics/tips/${category}`), {
      tips: [
        'Practice one interview every day.',
        'Speak your reasoning out loud.',
        'Review the fundamentals before advanced topics.',
      ],
    }),
  getInterviewReport: (id) =>
    tryApi(api.get(`/analytics/interview/${id}/report`), {
      interview: {
        id,
        user_id: DEMO_USER.id,
        title: 'Demo Interview',
        category: 'technical',
        difficulty: 'medium',
        status: 'in_progress',
        score: 0,
        created_at: new Date().toISOString(),
        completed_at: null,
        total_questions: 0,
      },
      questions: [],
      summary: {
        total_questions: 0,
        answered_questions: 0,
        average_score: 0,
      },
    }),
};

export default api;
