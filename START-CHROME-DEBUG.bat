@echo off
echo Starting Chrome with Remote Debugging on port 9222...
echo.
echo You can now:
echo 1. Navigate to your site (http://localhost:3000)
echo 2. Claude Code can inspect elements and take screenshots
echo.
start chrome --remote-debugging-port=9222 --user-data-dir="%TEMP%\chrome-debug-profile" http://localhost:3000
echo.
echo Chrome started! Keep this window open.
echo Press any key to close Chrome debugging session...
pause > nul
