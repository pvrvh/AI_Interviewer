# 🚀 Quick Start Guide - AI Interview Prep

## What You've Got
A complete AI-powered interview preparation platform with:
- ✅ Flask Backend (Python)
- ✅ React Frontend
- ✅ SQLite Database
- ✅ AI Integration (OpenAI)
- ✅ Full Authentication
- ✅ Analytics Dashboard

## 🏃 Get Started in 3 Steps

### Step 1: Install Dependencies (Run Once)

**On Windows:**
```bash
setup.bat
```

**On macOS/Linux:**
```bash
chmod +x *.sh
./setup.sh
```

### Step 2: Start the Application

**Easy Way (Windows):**
```bash
start-app.bat
```

**Manual Way:**
```bash
# Terminal 1 - Backend
cd backend
venv\Scripts\activate  # Windows
source venv/bin/activate  # macOS/Linux
python app.py

# Terminal 2 - Frontend
cd frontend
npm start
```

### Step 3: Use the Application

1. Open browser to `http://localhost:3000`
2. Click "Register" to create an account
3. Login with your credentials
4. Click "Create New Interview"
5. Generate AI questions and start practicing!

## 🔑 Optional: Add OpenAI API Key

For full AI features (not required - fallback questions work without it):

1. Get API key from https://platform.openai.com/
2. Open `backend/.env`
3. Add: `OPENAI_API_KEY=sk-your-key-here`
4. Restart backend

## 📱 Main Features

### Dashboard
- View your interview statistics
- Track progress over time
- See recent interviews

### Create Interview
- Choose category: Technical, Behavioral, System Design
- Select difficulty: Easy, Medium, Hard
- AI generates relevant questions

### Answer Questions
- Get hints when stuck
- Submit detailed answers
- Receive AI-powered feedback with scores

### Analytics
- Performance by category
- Difficulty breakdown
- Progress timeline
- AI-generated tips

## 🌐 Access Points

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health**: http://localhost:5000/api/health

## 🐛 Troubleshooting

**Backend won't start:**
```bash
cd backend
pip install -r requirements.txt --force-reinstall
```

**Frontend won't start:**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

**Port already in use:**
- Backend: Change port in `app.py`
- Frontend: Accept port 3001 when prompted

**Database errors:**
- Delete `backend/interview_prep.db` and restart

## 📚 Tech Stack Summary

| Component | Technology |
|-----------|-----------|
| Backend Framework | Flask |
| Frontend Framework | React |
| Database | SQLite |
| AI Engine | OpenAI GPT-3.5 |
| Authentication | JWT |
| API Client | Axios |
| Routing | React Router |

## 🎯 API Endpoints Quick Reference

```
POST   /api/auth/register          # Create account
POST   /api/auth/login             # Login
GET    /api/interviews             # List interviews
POST   /api/interviews             # Create interview
GET    /api/interviews/:id         # Interview details
POST   /api/questions/generate     # Generate questions
POST   /api/questions/:id/answer   # Submit answer
GET    /api/analytics/dashboard    # Get dashboard stats
```

## 📁 File Structure

```
aiInterviewPrep/
├── backend/
│   ├── app.py              # Main Flask app
│   ├── models.py           # Database models
│   ├── ai_service.py       # AI integration
│   └── routes/             # API endpoints
├── frontend/
│   └── src/
│       ├── pages/          # React pages
│       ├── components/     # React components
│       └── services/       # API client
└── *.bat/*.sh             # Start scripts
```

## 🎓 How to Use

1. **First Time:**
   - Register account
   - Create interview
   - Generate questions
   - Answer & get feedback

2. **Regular Practice:**
   - Login
   - View dashboard
   - Continue existing interviews
   - Track progress in analytics

3. **Tips:**
   - Use hints if stuck
   - Read feedback carefully
   - Review expected answers
   - Track improvement in analytics

## 💡 Without OpenAI Key

The app works perfectly without an OpenAI API key using:
- Pre-built question bank
- Rule-based evaluation
- Manual tips library

AI features are a bonus, not required!

## 📖 More Information

- Full docs: `README.md`
- Setup guide: `SETUP.md`
- Project overview: `PROJECT_SUMMARY.md`

---

**Made with Python Flask + React**
