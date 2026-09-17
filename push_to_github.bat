@echo off
echo =======================================================
echo   🐍 Pushing Python Snake Game to GitHub @janvi25me
echo =======================================================
echo.

git init
git add .
git commit -m "feat: Full-stack Python Snake Game with FastAPI backend, Web UI, Leaderboard and Multi-platform deployment"
git branch -M main

echo.
echo Step 1: Make sure you created an empty repository on GitHub named 'snake-game-web':
echo         https://github.com/new
echo.
echo Step 2: Linking remote to https://github.com/janvi25me/snake-game-web.git ...
git remote remove origin 2>nul
git remote add origin https://github.com/janvi25me/snake-game-web.git

echo.
echo Step 3: Pushing code to GitHub...
git push -u origin main

echo.
echo =======================================================
echo   ✅ Done! Your code is live on GitHub!
echo   Repository: https://github.com/janvi25me/snake-game-web
echo =======================================================
pause
