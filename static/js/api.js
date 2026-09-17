// API Bridge to Python Backend (FastAPI / PythonAnywhere)
const API = {
    // Default Python Backend URL for decoupled deployment (Vercel Frontend -> PythonAnywhere Backend)
    // Replace with your actual PythonAnywhere username if different
    DEFAULT_PYTHONANYWHERE_URL: "https://janvi25me.pythonanywhere.com",

    getBaseUrl() {
        // 1. Check if user configured a custom backend URL in localStorage
        const customUrl = localStorage.getItem("snake_backend_url");
        if (customUrl) return customUrl.replace(/\/$/, "");

        // 2. If running on Vercel, connect to PythonAnywhere backend
        if (window.location.hostname.includes("vercel.app")) {
            return this.DEFAULT_PYTHONANYWHERE_URL;
        }

        // 3. Otherwise (Localhost or PythonAnywhere unified hosting), use origin
        return window.location.origin;
    },

    setCustomBackendUrl(url) {
        if (!url || url.trim() === "") {
            localStorage.removeItem("snake_backend_url");
        } else {
            localStorage.setItem("snake_backend_url", url.trim().replace(/\/$/, ""));
        }
    },

    async checkHealth() {
        try {
            const baseUrl = this.getBaseUrl();
            const res = await fetch(`${baseUrl}/api/health`, {
                method: "GET",
                headers: { "Accept": "application/json" }
            });
            if (!res.ok) throw new Error(`Status: ${res.status}`);
            return await res.json();
        } catch (e) {
            console.warn("Python backend health check warning:", e.message);
            return null;
        }
    },

    async fetchLeaderboard() {
        try {
            const baseUrl = this.getBaseUrl();
            const res = await fetch(`${baseUrl}/api/leaderboard?limit=10`);
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
            const baseUrl = this.getBaseUrl();
            const res = await fetch(`${baseUrl}/api/leaderboard/submit`, {
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
            console.warn("Saved score locally fallback:", e.message);
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
