# 🐍 Cyber Snake Game - Python Full-Stack Edition

[![Python Version](https://img.shields.io/badge/Python-3.10%2B-blue?logo=python&logoColor=white)](https://python.org)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![Render](https://img.shields.io/badge/Deploy-Render-46E3B7?logo=render&logoColor=white)](https://render.com)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-000000?logo=vercel&logoColor=white)](https://vercel.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A modern, cross-browser full-stack web recreation of the classic **Python Turtle 600x600 Snake Game**. Features a high-performance **Python (FastAPI) backend**, responsive HTML5 Canvas UI with glowing cyber-retro neon aesthetics, global persistent leaderboard, Web Audio 8-bit sound synthesizer, and touch/D-pad controls for mobile devices.

---

## ✨ Features

- 🐍 **Exact Python Turtle Mechanics**: 600x600 coordinate grid, 20px segments, precise wall & tail collision physics.
- ⚡ **Python FastAPI Backend**: REST API endpoints for session validation, stats, and health checks.
- 🏆 **Global Leaderboard**: Persistent high scores saved to Python backend with player rankings.
- 🔊 **8-Bit Web Audio Synthesizer**: Procedural retro sound effects without external audio file bloat.
- ✨ **Cyberpunk Aesthetics**: Neon particle burst animations, pulsing food, glowing snake head with directional eyes.
- 📱 **Universal Cross-Browser Support**: Desktop (Arrow keys / WASD), Mobile/Tablet (Virtual D-pad & Swipe gestures).
- 🌐 **Deploy Anywhere**: Pre-configured for **Render**, **Vercel**, **Railway**, or any standard Python server.

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────────────┐
│                   Frontend (Web Browser)                 │
│  - Responsive 600x600 Canvas UI & Cyber Neon Aesthetic   │
│  - Keyboard (Arrows/WASD) & Mobile Touch D-Pad Controls  │
│  - Web Audio Sound FX & Particle Animations              │
│  - Communicates with Python Backend via REST             │
└────────────────────────────┬─────────────────────────────┘
                             │  HTTP REST API
┌────────────────────────────▼─────────────────────────────┐
│                 Python Backend (FastAPI / Uvicorn)       │
│  - Preserves core Python game logic & coordinate math    │
│  - Global Leaderboard & Player Score API                 │
│  - Interactive API documentation (/docs)                 │
└──────────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start (Local Run)

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Start the Python Game Server
```bash
python app.py
```

### 3. Open in Browser
- **Game UI**: [http://localhost:8000](http://localhost:8000)
- **Interactive Python API Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)

---

## 🐙 Push to GitHub (`https://github.com/janvi25me`)

1. Create a new empty repository named `snake-game-web` on your GitHub:
   👉 **[Create new GitHub repo](https://github.com/new)**

2. Push your project using git:
   ```bash
   git init
   git add .
   git commit -m "feat: Initial commit of Python Full-Stack Snake Game"
   git branch -M main
   git remote add origin https://github.com/janvi25me/snake-game-web.git
   git push -u origin main
   ```
   *(Or simply double-click `push_to_github.bat` on Windows)*

---

## 🌐 Deploying to Get a Live Public URL

### Method 1: Deploy on Render (Recommended for Python Web Services) - 100% Free
1. Go to **[Render.com](https://render.com)** and sign in with your GitHub account.
2. Click **New +** ➔ **Web Service**.
3. Select your repository: `janvi25me/snake-game-web`.
4. Render will auto-detect the configuration:
   - **Environment**: `Python`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn backend.app:app --host 0.0.0.0 --port $PORT`
5. Click **Create Web Service**.
6. Render will build and give you a live working URL: `https://snake-game-web-xxxx.onrender.com`! 🎉

---

### Method 2: Deploy on Vercel
1. Go to **[Vercel.com](https://vercel.com)** and sign in with GitHub.
2. Click **Add New...** ➔ **Project**.
3. Import `janvi25me/snake-game-web`.
4. Keep default settings and click **Deploy**.
5. Vercel automatically deploys the frontend and serverless Python API at `https://snake-game-web-xxxx.vercel.app`! 🎉

---

## 📂 Project Structure

```
.
├── backend/
│   ├── app.py              # FastAPI server & routes
│   ├── game_engine.py      # Python Snake game rules & 600x600 math
│   ├── leaderboard.py      # Thread-safe persistent leaderboard
│   └── requirements.txt    # Python dependencies
├── static/
│   ├── index.html          # Modern Cyberpunk/Retro UI
│   ├── style.css           # Glassmorphic responsive styling
│   └── js/
│       ├── game.js         # Canvas engine & touch controls
│       ├── api.js          # REST API bridge to Python
│       └── audio.js        # 8-bit sound synthesizer
├── api/
│   └── index.py            # Vercel serverless entrypoint
├── app.py                  # Root entrypoint
├── render.yaml             # Render blueprint config
├── vercel.json             # Vercel deployment config
├── Procfile                # Heroku/Render process declaration
├── push_to_github.bat      # 1-click GitHub push helper
└── README.md               # Documentation
```

---

## 🎮 Controls

| Action | Desktop Keys | Mobile / Tablet |
|---|---|---|
| **Turn Up** | `↑` / `W` | `▲` D-Pad / Swipe Up |
| **Turn Down** | `↓` / `S` | `▼` D-Pad / Swipe Down |
| **Turn Left** | `←` / `A` | `◀` D-Pad / Swipe Left |
| **Turn Right** | `→` / `D` | `▶` D-Pad / Swipe Right |
| **Pause / Resume** | `Spacebar` | Pause Button |
| **Restart Game** | `R` | Restart Button |

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
