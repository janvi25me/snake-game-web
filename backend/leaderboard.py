import json
import os
import threading
from datetime import datetime
from typing import List, Dict, Any

DATA_FILE = os.path.join(os.path.dirname(__file__), "leaderboard.json")
_lock = threading.Lock()

def _load_data() -> List[Dict[str, Any]]:
    if not os.path.exists(DATA_FILE):
        default_data = [
            {"player": "ShadowViper", "score": 25, "date": "2026-09-17", "difficulty": "Classic"},
            {"player": "CyberViper", "score": 18, "date": "2026-09-17", "difficulty": "Hard"},
            {"player": "RetroGamer", "score": 14, "date": "2026-09-17", "difficulty": "Classic"},
            {"player": "NeonSnake", "score": 10, "date": "2026-09-17", "difficulty": "Easy"},
            {"player": "ApexHunter", "score": 8, "date": "2026-09-17", "difficulty": "Classic"}
        ]
        _save_data(default_data)
        return default_data
    try:
        with open(DATA_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return []

def _save_data(data: List[Dict[str, Any]]) -> None:
    try:
        with open(DATA_FILE, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2)
    except Exception as e:
        print(f"Error saving leaderboard: {e}")

class LeaderboardManager:
    @staticmethod
    def get_top_scores(limit: int = 10) -> List[Dict[str, Any]]:
        with _lock:
            scores = _load_data()
            scores.sort(key=lambda x: x["score"], reverse=True)
            return scores[:limit]

    @staticmethod
    def record_score(player_name: str, score: int, difficulty: str = "Classic") -> Dict[str, Any]:
        with _lock:
            scores = _load_data()
            clean_name = (player_name.strip()[:15]) if player_name.strip() else "Anonymous"
            new_entry = {
                "player": clean_name,
                "score": max(0, int(score)),
                "date": datetime.now().strftime("%Y-%m-%d"),
                "difficulty": difficulty
            }
            scores.append(new_entry)
            scores.sort(key=lambda x: x["score"], reverse=True)
            # Keep top 100 entries
            scores = scores[:100]
            _save_data(scores)
            
            # Find rank of new entry
            rank = scores.index(new_entry) + 1 if new_entry in scores else -1
            return {
                "entry": new_entry,
                "rank": rank,
                "is_top_ten": rank <= 10 and rank != -1,
                "top_scores": scores[:10]
            }
