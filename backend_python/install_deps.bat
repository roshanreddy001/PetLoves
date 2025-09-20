@echo off
echo Installing Python dependencies for PetLove backend...
echo Current directory: %CD%

echo.
echo Creating virtual environment...
python -m venv venv_deploy

echo.
echo Activating virtual environment...
call venv_deploy\Scripts\activate.bat

echo.
echo Installing requirements...
pip install --upgrade pip
pip install -r requirements.txt

echo.
echo Testing imports...
python test_deployment.py

echo.
echo Installation complete!
pause
