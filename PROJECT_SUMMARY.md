# AI Interview Prep - Complete Software Product

## Overview
A full-stack AI-powered interview preparation platform that helps users practice technical, behavioral, and system design interviews with intelligent question generation and detailed feedback.

## Key Features
✅ User Authentication (Register/Login)
✅ AI-Generated Interview Questions
✅ Real-time Answer Evaluation
✅ Comprehensive Performance Analytics
✅ Progress Tracking
✅ Multiple Interview Categories
✅ Difficulty Levels (Easy/Medium/Hard)
✅ Hints and Tips System
✅ Detailed Feedback with Strengths & Improvements

## Tech Stack
- **Backend**: Python + Flask (REST API)
- **Frontend**: React (SPA with React Router)
- **Database**: SQLite (Relational Database)
- **AI**: OpenAI API (GPT-3.5) with fallback system
- **Authentication**: JWT
- **Styling**: Custom CSS

## Quick Start

### Windows
```bash
# Setup (run once)
setup.bat

# Start the application
start-app.bat
```

### macOS/Linux
```bash
# Setup (run once)
chmod +x setup.sh start-backend.sh start-frontend.sh
./setup.sh

# Start the application
# Terminal 1:
./start-backend.sh

# Terminal 2:
./start-frontend.sh
```

## Manual Setup

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
python app.py
```

### Frontend
```bash
cd frontend
npm install
npm start
```

## Application Flow

1. **Register/Login** → User creates account or logs in
2. **Dashboard** → View statistics and recent interviews
3. **Create Interview** → Select category and difficulty
4. **Generate Questions** → AI creates relevant questions
5. **Answer Questions** → Provide detailed answers
6. **Get Feedback** → AI evaluates and provides insights
7. **Track Progress** → Analytics dashboard shows improvement

## Project Structure

```
aiInterviewPrep/
├── backend/              # Flask API
│   ├── app.py           # Main application
│   ├── models.py        # Database models
│   ├── ai_service.py    # AI integration
│   └── routes/          # API endpoints
├── frontend/            # React SPA
│   ├── src/
│   │   ├── pages/      # Page components
│   │   ├── components/ # Reusable components
│   │   └── services/   # API client
│   └── public/
├── README.md            # Full documentation
├── SETUP.md            # Detailed setup guide
└── setup.bat/sh        # Automated setup scripts
```

## API Endpoints

- **Auth**: `/api/auth/register`, `/api/auth/login`
- **Interviews**: `/api/interviews` (CRUD)
- **Questions**: `/api/questions/generate`, `/api/questions/:id/answer`
- **Analytics**: `/api/analytics/dashboard`, `/api/analytics/progress`

## Database Schema

- **Users**: Authentication and profile
- **Interviews**: Interview sessions
- **Questions**: AI-generated questions
- **Answers**: User responses with scores

## AI Features

1. **Question Generation**: Context-aware interview questions
2. **Answer Evaluation**: Detailed scoring and feedback
3. **Tips Generation**: Category-specific advice
4. **Fallback System**: Works without API key

## Environment Variables

```env
SECRET_KEY=your-secret-key
OPENAI_API_KEY=your-openai-key  # Optional
```

## Features Demonstration

### For Users:
- Practice interviews in a realistic environment
- Get instant AI feedback on answers
- Track improvement over time
- Prepare for multiple interview types

### For Developers:
- Clean REST API architecture
- JWT authentication
- React best practices
- Reusable components
- Modular backend design

## Technologies Used

### Backend
- Flask (web framework)
- SQLAlchemy (ORM)
- JWT (authentication)
- OpenAI API (AI features)

### Frontend
- React 18
- React Router (routing)
- Axios (HTTP client)
- Modern CSS (responsive design)

## Screenshots & Usage

1. **Login/Register**: Secure authentication system
2. **Dashboard**: Overview of performance metrics
3. **Interviews**: List and manage interview sessions
4. **Questions**: Answer with AI evaluation
5. **Analytics**: Detailed performance insights

## Notes

- Works offline with fallback questions (no API key needed)
- Secure password hashing
- Responsive design
- RESTful API design
- Token-based authentication

## Future Enhancements

- Voice interview mode
- Video recording
- Timer for timed challenges
- Peer comparison
- PDF export
- Email notifications

## Support

See README.md and SETUP.md for detailed documentation.

## License

MIT License
