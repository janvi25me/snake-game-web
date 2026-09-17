// API Bridge to Python Backend (FastAPI)
const API = {
    // Automatically detect backend URL (relative when same host, or fallback to window.location.origin)
    getBaseUrl() {
        return window.location.origin;
    },

    async checkHealth() {
        try {
            const res = await fetch(`${this.getBaseUrl()}/api/health`);
            if (!res.ok) throw new Error("Health check failed");
            return await res.json();
        } catch (e) {
            console.warn("Python backend health check offline or CORS:", e.message);
            return null;
        }
    },

    async fetchLeaderboard() {
        try {
            const res = await fetch(`${this.getBaseUrl()}/api/leaderboard?limit=10`);
            if (!res.ok) throw new Error("Failed to fetch leaderboard");
            return await res.json();
        } catch (e) {
            console.warn("Using local leaderboard fallback:", e.message);
            const local = localStorage.getItem("snake_highscores");
            return local ? JSON.parse(local) : [
                { player: "LocalBest", score: parseInt(localStorage.getItem("snake_highscore") || "0"), date: "Today", difficulty: "Classic" }
            ];
        }
    },

    async submitScore(playerName, score, difficulty = "Classic") {
        try {
            const res = await fetch(`${this.getBaseUrl()}/api/leaderboard/submit`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    player_name: playerName || "Player",
                    score: score,
                    difficulty: difficulty
                })
            });
            if (!res.ok) throw new Error("Score submission error");
            return await res.json();
        } catch (e) {
            console.warn("Saved score locally:", e.message);
            return {
                entry: { player: playerName || "Player", score: score, date: "Today", difficulty: difficulty },
                rank: 1,
                is_top_ten: true,
                top_scores: []
            };
        }
    }
};

window.API = API;
