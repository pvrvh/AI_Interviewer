#!/bin/bash

echo "======================================"
echo "AI Interview Prep - Setup Script"
echo "======================================"
echo ""

echo "[1/4] Setting up Python virtual environment..."
cd backend
python3 -m venv venv

echo "[2/4] Activating virtual environment..."
source venv/bin/activate

echo "[3/4] Installing Python dependencies..."
pip install -r requirements.txt

echo "[4/4] Creating environment file..."
if [ ! -f .env ]; then
    cp .env.example .env
    echo "Created .env file. Please edit it to add your OpenAI API key if needed."
fi

cd ..

echo ""
echo "======================================"
echo "Backend setup complete!"
echo "======================================"
echo ""

echo "[5/6] Installing frontend dependencies..."
cd frontend
npm install

cd ..

echo ""
echo "======================================"
echo "Setup Complete!"
echo "======================================"
echo ""
echo "To start the application:"
echo "  1. Run './start-backend.sh' in one terminal"
echo "  2. Run './start-frontend.sh' in another terminal"
echo ""
echo "Or run './start-app.sh' to start both automatically"
echo ""
