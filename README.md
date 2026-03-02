# AI Interview Prep

An AI-powered interview preparation platform built with Flask (Python) backend and React frontend. This application helps users practice for technical, behavioral, and system design interviews with AI-generated questions and intelligent feedback.

## Features

- **AI-Generated Questions**: Automatically generate relevant interview questions based on category and difficulty
- **Smart Evaluation**: Get detailed AI-powered feedback on your answers with scores, strengths, and areas for improvement
- **Multiple Categories**: Practice for technical, behavioral, and system design interviews
- **Progress Tracking**: Monitor your performance across different categories and difficulty levels
- **Comprehensive Analytics**: Visualize your improvement over time with detailed statistics
- **Personalized Tips**: Receive AI-generated interview tips tailored to specific categories

## Tech Stack

### Backend
- **Python 3.8+**
- **Flask**: Web framework and REST API
- **Flask-SQLAlchemy**: ORM for database operations
- **SQLite**: Relational database
- **OpenAI API**: AI-powered question generation and answer evaluation
- **JWT**: Authentication and authorization

### Frontend
- **React 18**: UI framework
- **React Router**: Client-side routing
- **Axios**: HTTP client
- **Recharts**: Data visualization (optional)

## Project Structure

```
aiInterviewPrep/
├── backend/
│   ├── app.py                 # Main Flask application
│   ├── models.py              # Database models
│   ├── ai_service.py          # AI integration (OpenAI)
│   ├── routes/
│   │   ├── auth.py           # Authentication endpoints
│   │   ├── interview.py      # Interview CRUD endpoints
│   │   ├── question.py       # Question and answer endpoints
│   │   └── analytics.py      # Analytics and stats endpoints
│   ├── requirements.txt       # Python dependencies
│   └── .env.example          # Environment variables template
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   └── Navigation.js  # Navigation bar
    │   ├── pages/
    │   │   ├── Login.js
    │   │   ├── Register.js
    │   │   ├── Dashboard.js
    │   │   ├── Interviews.js
    │   │   ├── NewInterview.js
    │   │   ├── InterviewDetail.js
    │   │   ├── Question.js
    │   │   └── Analytics.js
    │   ├── services/
    │   │   └── api.js         # API service layer
    │   ├── App.js
    │   ├── index.js
    │   └── index.css
    └── package.json
```

## Installation & Setup

### Prerequisites
- Python 3.8 or higher
- Node.js 14 or higher
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
```

3. Activate the virtual environment:
```bash
# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate
```

4. Install dependencies:
```bash
pip install -r requirements.txt
```

5. Create a `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

6. Edit `.env` and add your OpenAI API key (optional - fallback questions will be used if not provided):
```
SECRET_KEY=your-secret-key-here
OPENAI_API_KEY=your-openai-api-key-here
```

7. Run the Flask application:
```bash
python app.py
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## Usage

1. **Register/Login**: Create an account or login with existing credentials

2. **Create Interview**: 
   - Click "Create New Interview"
   - Select category (Technical, Behavioral, System Design)
   - Choose difficulty level (Easy, Medium, Hard)
   - Set a title for your interview session

3. **Generate Questions**: 
   - AI will automatically generate relevant questions
   - Questions are tailored to your selected category and difficulty

4. **Answer Questions**:
   - Click on each question to provide your answer
   - Use hints if you need guidance
   - Submit your answer for AI evaluation

5. **Review Feedback**:
   - Get detailed scores and feedback
   - Review strengths and areas for improvement
   - Compare with expected answers

6. **Track Progress**:
   - View your dashboard for overall statistics
   - Check analytics for detailed performance metrics
   - Get AI-generated tips for improvement

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Interviews
- `GET /api/interviews` - Get all user interviews
- `GET /api/interviews/:id` - Get interview details
- `POST /api/interviews` - Create new interview
- `PUT /api/interviews/:id` - Update interview
- `DELETE /api/interviews/:id` - Delete interview

### Questions
- `POST /api/questions/generate` - Generate AI questions
- `GET /api/questions/:id` - Get question details
- `POST /api/questions/:id/answer` - Submit answer
- `GET /api/questions/:id/hints` - Get hints

### Analytics
- `GET /api/analytics/dashboard` - Get dashboard statistics
- `GET /api/analytics/progress` - Get progress data
- `GET /api/analytics/tips/:category` - Get AI tips
- `GET /api/analytics/interview/:id/report` - Get interview report

## Database Schema

### User
- id, username, email, password_hash, created_at

### Interview
- id, user_id, title, category, difficulty, status, score, created_at, completed_at

### Question
- id, interview_id, question_text, question_type, difficulty, expected_answer, hints, created_at

### Answer
- id, question_id, answer_text, score, feedback, strengths, improvements, submitted_at

## AI Integration

The application uses OpenAI's GPT models for:
- **Question Generation**: Creates contextually relevant interview questions
- **Answer Evaluation**: Provides detailed feedback and scoring
- **Interview Tips**: Generates category-specific preparation advice

If OpenAI API key is not provided, the application falls back to a curated question bank.

## Features in Detail

### AI-Powered Question Generation
- Generates questions based on category and difficulty
- Includes expected answers and hints
- Supports technical, behavioral, and system design categories

### Intelligent Answer Evaluation
- Scores answers on a 0-100 scale
- Provides detailed feedback
- Highlights strengths and areas for improvement
- Compares with expected answers

### Comprehensive Analytics
- Overall performance metrics
- Category-wise performance breakdown
- Difficulty-wise statistics
- Progress over time visualization
- Recent interview history

## Contributing

Feel free to submit issues, create pull requests, or fork the repository to improve the project.

## License

MIT License

## Notes

- This is a demonstration project for educational purposes
- Ensure you have a valid OpenAI API key for full AI functionality
- The SQLite database will be created automatically on first run
- All user passwords are securely hashed using Werkzeug

## Future Enhancements

- Voice interview simulation
- Video recording and playback
- Mock interview with timer
- Peer comparison and leaderboards
- More interview categories
- Export interview reports as PDF
- Email notifications and reminders
- Mobile application

## Support

For issues, questions, or suggestions, please create an issue in the repository.
