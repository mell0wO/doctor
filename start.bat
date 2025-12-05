@echo off
setlocal

REM Detect project root automatically (folder where this .bat file is)
set PROJECT_ROOT=%~dp0

echo Starting Django backend...
start "Django" cmd /k "cd /d %PROJECT_ROOT%\backdoc && python manage.py runserver"

echo Starting Angular frontend...
start "Angular" cmd /k "cd /d %PROJECT_ROOT%\doctor && ng serve --open"

echo Both servers started in separate windows.
pause
