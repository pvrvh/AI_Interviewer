# 🚀 Getting Started - Step by Step

## 📋 Prerequisites Checklist

Before starting, make sure you have:

- [ ] Python 3.8 or higher installed
- [ ] Node.js 14 or higher installed  
- [ ] npm installed (comes with Node.js)
- [ ] A code editor (VS Code recommended)
- [ ] Terminal/Command Prompt access

**Check your installations:**
```bash
python --version     # Should be 3.8+
node --version       # Should be 14+
npm --version        # Any recent version
```

## 🎯 Quick Start (3 Steps)

### Step 1️⃣: Run Setup

**On Windows (Command Prompt):**
```bash
cd C:\Users\91992\Desktop\aiInterviewPrep
setup.bat
```

**On macOS/Linux (Terminal):**
```bash
cd ~/Desktop/aiInterviewPrep
chmod +x *.sh
./setup.sh
```

**What this does:**
- ✅ Creates Python virtual environment
- ✅ Installs backend dependencies
- ✅ Creates .env file
- ✅ Installs frontend dependencies

**Expected time:** 2-5 minutes

### Step 2️⃣: Start the Application

**Easy Way - Windows:**
```bash
start-app.bat
```
This opens TWO windows automatically!

**Easy Way - macOS/Linux:**
```bash
# Terminal 1
./start-backend.sh

# Terminal 2 (open new terminal)
./start-frontend.sh
```

**Manual Way:**
```bash
# Terminal 1 - Backend
cd backend
venv\Scripts\activate        # Windows
source venv/bin/activate     # macOS/Linux
python app.py

# Terminal 2 - Frontend
cd frontend
npm start
```

**What to expect:**
- Backend starts on: http://localhost:5000
- Frontend opens browser: http://localhost:3000

### Step 3️⃣: Use the Application

1. **Register Account**
   - Click "Register here"
   - Fill: username, email, password
   - Click "Register"

2. **Create Interview**
   - Click "Create New Interview"
   - Choose category: Technical/Behavioral/System Design
   - Select difficulty: Easy/Medium/Hard
   - Enter title
   - Click "Create Interview"

3. **Generate Questions**
   - Click "Generate Questions with AI"
   - Wait 5-10 seconds
   - Questions appear

4. **Answer Questions**
   - Click on a question
   - Type your answer
   - Click "Submit Answer"
   - Get instant feedback!

5. **View Progress**
   - Go to Dashboard
   - Check Analytics
   - Track improvement

## 📸 Visual Walkthrough

### After Starting Application:

```
Browser automatically opens to:
┌─────────────────────────────────┐
│   🔐 Login to AI Interview Prep │
│                                 │
│   Email:    [____________]      │
│   Password: [____________]      │
│                                 │
│   [      Login      ]           │
│                                 │
│   Don't have account?           │
│   Register here                 │
└─────────────────────────────────┘
```

### Dashboard View:

```
┌──────────────────────────────────────────┐
│  Dashboard                               │
├──────────────────────────────────────────┤
│  ┌────────┐  ┌────────┐  ┌────────┐    │
│  │   5    │  │   3    │  │  78%   │    │
│  │ Total  │  │Compltd │  │  Avg   │    │
│  └────────┘  └────────┘  └────────┘    │
│                                          │
│  Recent Interviews     Performance      │
│  ┌──────────────┐     ┌──────────────┐ │
│  │ Python       │     │ Technical    │ │
│  │ Interview    │     │ 85%  ████░   │ │
│  │ Score: 85%   │     │ Behavioral   │ │
│  └──────────────┘     │ 75%  ███░    │ │
│                       └──────────────┘ │
│  [Create New Interview]  [View All]    │
└──────────────────────────────────────────┘
```

### Question Answering:

```
┌──────────────────────────────────────────┐
│  ← Back to Interview                     │
├──────────────────────────────────────────┤
│  [Medium] [Technical]                    │
│                                          │
│  What is the difference between          │
│  == and === in JavaScript?               │
│                                          │
│  [Show Hints 💡]                        │
│                                          │
│  Your Answer:                            │
│  ┌──────────────────────────────────┐   │
│  │ == compares values with type     │   │
│  │ coercion, while === compares     │   │
│  │ both value and type...           │   │
│  └──────────────────────────────────┘   │
│                                          │
│  [Submit Answer]                         │
└──────────────────────────────────────────┘
```

### Feedback View:

```
┌──────────────────────────────────────────┐
│  Your Score: 85                          │
├──────────────────────────────────────────┤
│  Feedback:                               │
│  Great explanation! You clearly          │
│  understand the concept...               │
│                                          │
│  ✓ Strengths:         ⚡ Improvements:  │
│  • Clear definition   • Add examples    │
│  • Good structure     • Mention edge    │
│  • Relevant points      cases           │
│                                          │
│  Expected Answer:                        │
│  (AI-generated expected answer shown)    │
│                                          │
│  [Back to Interview]                     │
└──────────────────────────────────────────┘
```

## 🎓 First Time User Flow

```
Register → Login → Dashboard
    ↓
Create Interview (Choose Category/Difficulty)
    ↓
Generate Questions (AI Creates 5 Questions)
    ↓
Answer First Question
    ↓
Get Feedback & Score
    ↓
Answer More Questions
    ↓
Complete Interview
    ↓
View Dashboard Statistics
    ↓
Check Analytics for Progress
```

## ⚙️ Optional: Add OpenAI API Key

**Not required** - app works with fallback questions!

If you want full AI features:

1. Get API key from: https://platform.openai.com/api-keys
2. Open: `backend/.env`
3. Change line:
   ```
   OPENAI_API_KEY=
   ```
   to:
   ```
   OPENAI_API_KEY=sk-your-actual-key-here
   ```
4. Restart backend (Ctrl+C, then `python app.py`)

**Benefits of API key:**
- More diverse questions
- Better answer evaluation
- More detailed feedback

**Without API key:**
- Still get 60+ curated questions
- Still get feedback and scores
- All features work!

## 🎯 Testing the Application

### Quick Test Checklist:

1. **Backend Health:**
   ```bash
   curl http://localhost:5000/api/health
   # Should return: {"status": "healthy", "timestamp": "..."}
   ```

2. **Frontend Loading:**
   - Open http://localhost:3000
   - Should see login page
   - No white screen

3. **Registration:**
   - Create test account
   - Should redirect to dashboard

4. **Create Interview:**
   - Click "Create New Interview"
   - Fill form and submit
   - Should see interview detail page

5. **Generate Questions:**
   - Click "Generate Questions"
   - Wait 5-10 seconds
   - Should see 5 questions

6. **Answer Question:**
   - Click on a question
   - Type answer
   - Submit
   - Should see score and feedback

## 🔍 What to Expect

### Timeline:

| Action | Time | What Happens |
|--------|------|--------------|
| Setup | 3-5 min | Installs all dependencies |
| Start Backend | 5 sec | Flask server starts |
| Start Frontend | 10-20 sec | React dev server starts |
| Register | 2 sec | Account created |
| Create Interview | 1 sec | Interview session created |
| Generate Questions | 5-10 sec | AI generates questions |
| Submit Answer | 3-5 sec | AI evaluates and scores |

### File Sizes:

- Backend venv: ~50-100 MB
- Frontend node_modules: ~200-300 MB
- Database: <1 MB (grows with usage)

## 🚨 Common First-Time Issues

### Issue: "Module not found"
**Fix:** Run setup.bat/setup.sh again

### Issue: "Port already in use"
**Fix:** Close other apps using port 5000/3000

### Issue: "Python/Node not found"
**Fix:** Install from official websites, restart terminal

### Issue: Backend starts but frontend can't connect
**Fix:** Make sure backend is on port 5000

## 📚 Next Steps After Setup

1. **Explore Features:**
   - Try different interview categories
   - Answer multiple questions
   - Check analytics dashboard

2. **Read Documentation:**
   - README.md - Full documentation
   - APPLICATION_OVERVIEW.md - Architecture
   - TROUBLESHOOTING.md - If issues occur

3. **Customize:**
   - Add your OpenAI key for better AI
   - Modify difficulty levels
   - Track your progress

## 🎉 Success Indicators

You'll know it's working when:

✅ Backend terminal shows: "Running on http://127.0.0.1:5000"
✅ Frontend opens browser automatically
✅ You can register and login
✅ Dashboard shows statistics
✅ Questions generate successfully
✅ You get feedback on answers

## 🆘 Need Help?

1. Check TROUBLESHOOTING.md
2. Verify both servers running
3. Check browser console (F12)
4. Check backend terminal output
5. Try restarting both servers

## 🎊 You're Ready!

Your AI Interview Prep platform is ready to use. Start practicing and improve your interview skills!

---

**Remember:**
- Keep both terminals running
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- Enjoy practicing! 🚀
