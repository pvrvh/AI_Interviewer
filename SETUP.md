# Setup Instructions

Follow these steps to set up and run the AI Interview Prep application.

## Prerequisites

- Python 3.8 or higher
- Node.js 14 or higher
- npm (comes with Node.js)
- Git (optional, for cloning)

## Quick Start

### 1. Backend Setup

Open a terminal and navigate to the backend directory:

```bash
cd backend
```

Create and activate a virtual environment:

**Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```

**macOS/Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

Install Python dependencies:
```bash
pip install -r requirements.txt
```

Create environment file:
```bash
# Windows
copy .env.example .env

# macOS/Linux
cp .env.example .env
```

**Optional:** Edit `.env` and add your OpenAI API key for AI features:
```
OPENAI_API_KEY=sk-your-key-here
```

**Note:** If you don't have an OpenAI API key, the application will work with fallback questions.

Start the Flask server:
```bash
python app.py
```

The backend should now be running at `http://localhost:5000`

### 2. Frontend Setup

Open a **new terminal** and navigate to the frontend directory:

```bash
cd frontend
```

Install Node.js dependencies:
```bash
npm install
```

Start the React development server:
```bash
npm start
```

The frontend should automatically open in your browser at `http://localhost:3000`

## Verification

1. Backend is running when you see:
   ```
   * Running on http://127.0.0.1:5000
   ```

2. Frontend is running when you see:
   ```
   webpack compiled successfully
   ```

3. Navigate to `http://localhost:3000` in your browser

## First Time Usage

1. Click "Register here" to create a new account
2. Fill in username, email, and password
3. You'll be automatically logged in and redirected to the dashboard
4. Click "Create New Interview" to start your first interview session

## Troubleshooting

### Backend Issues

**Port already in use:**
```bash
# Kill the process using port 5000
# Windows: Check Task Manager
# macOS/Linux: 
lsof -ti:5000 | xargs kill -9
```

**Module not found errors:**
```bash
pip install -r requirements.txt --force-reinstall
```

**Database errors:**
Delete the `interview_prep.db` file and restart the backend.

### Frontend Issues

**Port 3000 already in use:**
The app will offer to use port 3001. Type 'Y' to accept.

**Module not found errors:**
```bash
rm -rf node_modules package-lock.json
npm install
```

**CORS errors:**
Make sure the backend is running on port 5000.

## Getting an OpenAI API Key (Optional)

1. Go to https://platform.openai.com/
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key and add it to your `.env` file

**Note:** OpenAI API usage may incur costs. The application works without it using fallback questions.

## Stopping the Application

### Backend
Press `Ctrl + C` in the terminal running Flask

### Frontend
Press `Ctrl + C` in the terminal running React

## Next Steps

- Explore the Dashboard
- Create your first interview
- Generate AI-powered questions
- Answer questions and get feedback
- View your analytics

## Need Help?

Check the main README.md for detailed documentation and feature descriptions.
