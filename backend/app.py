import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

from backend.game_engine import SnakeEngine
from backend.leaderboard import LeaderboardManager

app = FastAPI(
    title="Python Snake Game API",
    description="Full-stack Python backend for 600x600 Snake Game, Leaderboard & Session Management",
    version="1.0.0"
)

# Enable CORS for cross-origin hosting (e.g., frontend on Vercel, backend on Render)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory session store for server-validated game simulations
active_games: Dict[str, SnakeEngine] = {}

class ScoreSubmission(BaseModel):
    player_name: str = Field(default="Player", max_length=20)
    score: int = Field(ge=0, le=10000)
    difficulty: Optional[str] = "Classic"

class DirectionChange(BaseModel):
    direction: str = Field(pattern="^(Up|Down|Left|Right)$")

# API Routes
@app.get("/api/health")
def health_check():
    return {
        "status": "online",
        "service": "Python Snake Game Engine",
        "version": "1.0.0",
        "dimensions": "600x600"
    }

@app.get("/api/leaderboard")
def get_leaderboard(limit: int = 10):
    """Retrieve top global high scores"""
    return LeaderboardManager.get_top_scores(limit=limit)

@app.post("/api/leaderboard/submit")
def submit_score(submission: ScoreSubmission):
    """Record player high score"""
    result = LeaderboardManager.record_score(
        player_name=submission.player_name,
        score=submission.score,
        difficulty=submission.difficulty or "Classic"
    )
    return result

@app.post("/api/game/new")
def new_game(session_id: Optional[str] = "default"):
    """Initializes a new 600x600 Python game engine session"""
    engine = SnakeEngine()
    active_games[session_id] = engine
    return engine.get_state()

@app.post("/api/game/{session_id}/step")
def step_game(session_id: str):
    """Steps the Python game engine forward one 20px tick"""
    if session_id not in active_games:
        active_games[session_id] = SnakeEngine()
    engine = active_games[session_id]
    state = engine.step()
    return state

@app.post("/api/game/{session_id}/direction")
def change_direction(session_id: str, payload: DirectionChange):
    """Changes direction in Python game engine"""
    if session_id not in active_games:
        raise HTTPException(status_code=404, detail="Game session not found")
    engine = active_games[session_id]
    success = engine.change_direction(payload.direction)
    return {"success": success, "current_direction": engine.direction}

# Mount static frontend files for unified single-server deployment
STATIC_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "static"))
if os.path.exists(STATIC_DIR):
    app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")

    @app.get("/")
    def serve_frontend():
        index_path = os.path.join(STATIC_DIR, "index.html")
        if os.path.exists(index_path):
            return FileResponse(index_path)
        return {"message": "Python Snake Game Backend is running. Frontend static directory not found."}
