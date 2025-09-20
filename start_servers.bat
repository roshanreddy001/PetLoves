@echo off
echo Starting PetLove Application...

echo.
echo Starting Backend Server...
start cmd /k "cd backend_python && python main.py"

echo.
echo Starting Frontend Server...
start cmd /k "npm run dev"

echo.
echo Both servers are starting...
echo Frontend: http://localhost:5173
echo Backend: http://localhost:5000
echo Backend API Docs: http://localhost:5000/docs
pause
