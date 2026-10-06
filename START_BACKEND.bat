@echo off
cd /d "%~dp0backend"
if not exist venv (
  echo Creating Python environment...
  python -m venv venv
)
call venv\Scripts\activate
python -m pip install -r requirements.txt
python main.py
pause
