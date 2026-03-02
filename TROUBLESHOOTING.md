# 🔧 Troubleshooting Guide

## Common Issues and Solutions

### Backend Issues

#### 1. Import Errors (openai, flask, etc.)

**Problem:**
```
Import "flask" could not be resolved
Import "openai" could not be resolved
```

**Solution:**
```bash
cd backend
pip install -r requirements.txt --force-reinstall
```

If still failing, try:
```bash
python -m pip install --upgrade pip
pip install -r requirements.txt
```

#### 2. Virtual Environment Not Activating

**Windows:**
```bash
# If activation fails due to execution policy
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
venv\Scripts\activate
```

**macOS/Linux:**
```bash
# Make sure script is executable
chmod +x venv/bin/activate
source venv/bin/activate
```

#### 3. Port 5000 Already in Use

**Solution 1 - Kill the process:**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:5000 | xargs kill -9
```

**Solution 2 - Change port:**
Edit `backend/app.py`, change:
```python
app.run(debug=True, port=5001)  # Use different port
```

#### 4. Database Errors

**Problem:**
```
sqlite3.OperationalError: table users already exists
```

**Solution:**
```bash
cd backend
rm interview_prep.db  # Delete database
python app.py  # Will recreate
```

#### 5. OpenAI API Errors

**Problem:**
```
openai.error.AuthenticationError: Invalid API key
```

**Solution:**
- Check `.env` file has correct API key
- Or leave `OPENAI_API_KEY=` empty to use fallback questions
- Restart backend after changing .env

### Frontend Issues

#### 1. npm install Fails

**Solution:**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

#### 2. Port 3000 Already in Use

**Solution:**
The app will automatically offer port 3001. Type 'Y' to accept.

Or manually change port:
```bash
# Windows
set PORT=3001 && npm start

# macOS/Linux
PORT=3001 npm start
```

#### 3. Cannot Connect to Backend (CORS Error)

**Problem:**
```
Access to XMLHttpRequest blocked by CORS policy
```

**Solution:**
- Make sure backend is running on port 5000
- Check `package.json` has: `"proxy": "http://localhost:5000"`
- Restart both frontend and backend

#### 4. White Screen / Blank Page

**Solution:**
```bash
# Check browser console for errors
# Usually caused by import errors

cd frontend
npm install react-router-dom axios --save
npm start
```

#### 5. Module Not Found Errors

**Problem:**
```
Module not found: Can't resolve 'react-router-dom'
```

**Solution:**
```bash
cd frontend
npm install react-router-dom axios
```

### Authentication Issues

#### 1. Login Not Working

**Checklist:**
- Backend running on port 5000?
- Check browser console for errors
- Try registering new account first
- Check backend terminal for errors

**Debug:**
```bash
# Test API directly
curl http://localhost:5000/api/health
```

#### 2. Token Expired / Unauthorized

**Solution:**
- Logout and login again
- Clear browser localStorage:
```javascript
// In browser console
localStorage.clear()
```

#### 3. Can't Register - Email/Username Exists

**Solution:**
- Use different email/username
- Or reset database (see Database Errors above)

### AI Features Issues

#### 1. Questions Not Generating

**Problem:**
"Failed to generate questions"

**Solution:**
1. Check if OPENAI_API_KEY is set (optional)
2. If using API key, check it's valid
3. If no API key, fallback questions should work automatically
4. Check backend terminal for errors

#### 2. Answer Evaluation Not Working

**Solution:**
Similar to above - fallback evaluation will work without API key.

#### 3. Tips Not Loading

**Solution:**
- Fallback tips should always work
- Check backend terminal for errors
- Try different category

### Installation Issues

#### 1. Python Not Found

**Solution:**
- Install Python 3.8+ from python.org
- Add to PATH during installation
- Or use `python3` instead of `python`

#### 2. npm Not Found

**Solution:**
- Install Node.js from nodejs.org
- npm comes with Node.js
- Restart terminal after installation

#### 3. Git Bash vs Command Prompt (Windows)

**Recommendation:**
- Use Command Prompt or PowerShell for .bat files
- Git Bash may not execute .bat files correctly

### Data Issues

#### 1. No Data Showing in Dashboard

**Solution:**
1. Create a new interview
2. Generate questions
3. Answer at least one question
4. Complete the interview
5. Check dashboard again

#### 2. Analytics Empty

**Solution:**
- Complete at least one interview
- Make sure interview status is "completed"
- Answer some questions before completing

#### 3. Scores Not Updating

**Solution:**
- Make sure you click "Submit Answer"
- Check for success message
- Reload the page
- Check backend terminal for errors

### Performance Issues

#### 1. Slow Question Generation

**Reason:**
- OpenAI API can take 3-10 seconds
- This is normal

**Solution:**
- Be patient
- Loading indicator shows progress

#### 2. Large Database File

**Solution:**
```bash
# If database gets too large
cd backend
rm interview_prep.db
# Will recreate fresh database
```

### Development Issues

#### 1. Changes Not Reflecting

**Frontend:**
- Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
- Clear browser cache
- Check if dev server auto-reloaded

**Backend:**
- Restart Flask server
- Check debug=True in app.py (auto-reload enabled)

#### 2. Hot Reload Not Working

**Frontend:**
```bash
# Restart dev server
Ctrl+C to stop
npm start
```

**Backend:**
Flask has auto-reload with debug=True, but restart if needed.

## Getting Help

### Check Logs

**Backend:**
Look at terminal running Flask for error messages

**Frontend:**
- Browser Developer Console (F12)
- Network tab for API errors
- Console tab for JavaScript errors

### Quick Health Checks

```bash
# 1. Check if backend is running
curl http://localhost:5000/api/health

# 2. Check if frontend is running
# Open: http://localhost:3000 in browser

# 3. Check if database exists
ls backend/interview_prep.db  # or dir on Windows
```

### Debug Mode

**Backend already has debug mode enabled:**
```python
# In app.py
app.run(debug=True, port=5000)
```

**Frontend:**
React dev server includes hot reload automatically.

### Common Error Messages

| Error | Likely Cause | Solution |
|-------|--------------|----------|
| "Connection refused" | Backend not running | Start backend |
| "404 Not Found" | Wrong API endpoint | Check URL in api.js |
| "401 Unauthorized" | Token invalid/expired | Login again |
| "500 Internal Server Error" | Backend error | Check backend logs |
| "Network Error" | Backend not reachable | Check backend running |

### Reset Everything

If all else fails:

```bash
# Windows
rd /s /q backend\venv
rd /s /q frontend\node_modules
del backend\interview_prep.db
del backend\.env
setup.bat

# macOS/Linux
rm -rf backend/venv
rm -rf frontend/node_modules
rm backend/interview_prep.db
rm backend/.env
./setup.sh
```

## Prevention Tips

1. **Always activate virtual environment** before running backend
2. **Install dependencies** after pulling changes
3. **Check both terminals** for errors
4. **Use correct ports**: Backend 5000, Frontend 3000
5. **Keep both servers running** while using the app

## Still Having Issues?

1. Read error message carefully
2. Check backend terminal output
3. Check browser console
4. Verify all dependencies installed
5. Try restarting both servers
6. Reset database if needed

## Environment-Specific Issues

### Windows-Specific

- Use Command Prompt or PowerShell, not Git Bash for .bat files
- If execution policy error: Run PowerShell as Administrator
- Antivirus might block: Add project folder to exclusions

### macOS-Specific

- May need `python3` and `pip3` instead of `python`/`pip`
- Make scripts executable: `chmod +x *.sh`
- May need to install Command Line Tools: `xcode-select --install`

### Linux-Specific

- May need to install: `sudo apt-get install python3-venv`
- May need to install: `sudo apt-get install nodejs npm`
- Check Python version: `python3 --version` (need 3.8+)

---

**Most issues can be solved by:**
1. Reinstalling dependencies
2. Restarting servers
3. Checking if both servers are running
4. Clearing browser cache/localStorage
