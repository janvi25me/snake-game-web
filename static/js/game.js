// Modern 600x600 Snake Game Engine matching Python Turtle logic
document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");

    // UI Elements
    const scoreElement = document.getElementById("scoreDisplay");
    const highScoreElement = document.getElementById("highScoreDisplay");
    const statusPill = document.getElementById("statusPill");
    const muteBtn = document.getElementById("muteBtn");
    const pauseBtn = document.getElementById("pauseBtn");
    const restartBtn = document.getElementById("restartBtn");
    const speedSelect = document.getElementById("speedSelect");
    const gameOverModal = document.getElementById("gameOverModal");
    const finalScore = document.getElementById("finalScore");
    const finalRank = document.getElementById("finalRank");
    const playerNameInput = document.getElementById("playerNameInput");
    const submitScoreBtn = document.getElementById("submitScoreBtn");
    const playAgainBtn = document.getElementById("playAgainBtn");
    const leaderboardList = document.getElementById("leaderboardList");
    const backendStatus = document.getElementById("backendStatus");

    // Constants matching Python Turtle 600x600 setup
    const CANVAS_WIDTH = 600;
    const CANVAS_HEIGHT = 600;
    const GRID_SIZE = 20;
    const MIN_COORD = 20;
    const MAX_COORD = 580;

    // Difficulty Speeds (ms per tick)
    const SPEEDS = {
        "easy": 140,
        "classic": 100, // 0.1s from python time.sleep(0.1)
        "hard": 70,
        "cyber": 45
    };

    // Game State
    let snake = [];
    let food = { x: 300, y: 300 };
    let direction = "Right";
    let nextDirection = "Right";
    let score = 0;
    let highScore = parseInt(localStorage.getItem("snake_highscore") || "0");
    let isGameOver = false;
    let isPaused = false;
    let gameLoopTimeout = null;
    let currentSpeed = SPEEDS["classic"];
    let particles = [];
    let foodPulse = 0;

    highScoreElement.textContent = highScore;

    // 20 Short & Sweet Game Over Tips
    const GAME_OVER_TIPS = [
        "⚡ Shake it off! Try again.",
        "🐍 Watch that sneaky tail!",
        "🎯 Keep calm & steer on.",
        "🔥 Almost had it! Next run?",
        "💡 Pro tip: Hug the walls!",
        "🕹️ Warm-up over. Time to win!",
        "🚀 Reflexes are leveling up!",
        "💥 Watch the corners!",
        "🏆 You've got this, champion!",
        "✨ One more round for glory!",
        "⚡ Smooth turns win runs.",
        "🧠 Think two turns ahead.",
        "🎮 Press Space to bounce back!",
        "🌟 Practice makes legend.",
        "🐍 Strike with precision!",
        "🍕 Don't get greedy for food!",
        "🔥 Great rhythm, go again!",
        "👑 The leaderboard is calling!",
        "🎪 Leave room to escape.",
        "🚀 Best run loading next..."
    ];

    function getRandomTip() {
        return GAME_OVER_TIPS[Math.floor(Math.random() * GAME_OVER_TIPS.length)];
    }


    function getRandomTip() {
        return GAME_OVER_TIPS[Math.floor(Math.random() * GAME_OVER_TIPS.length)];
    }


    // Initialize Game
    function initGame() {
        // Python Turtle starting positions: [(0, 0), (-20, 0), (-40, 0)] mapped to canvas coords
        snake = [
            { x: 300, y: 300 },
            { x: 280, y: 300 },
            { x: 260, y: 300 }
        ];
        direction = "Right";
        nextDirection = "Right";
        score = 0;
        isGameOver = false;
        isPaused = false;
        particles = [];
        scoreElement.textContent = "0";
        statusPill.textContent = "PLAYING";
        statusPill.className = "status-pill live";
        gameOverModal.classList.add("hidden");

        spawnFood();
        refreshLeaderboard();
        checkBackend();

        if (gameLoopTimeout) clearTimeout(gameLoopTimeout);
        gameLoop();
    }

    // Spawn Food matching food.py (-280 to 280)
    function spawnFood() {
        const possibleCoords = [];
        for (let i = MIN_COORD; i <= MAX_COORD - GRID_SIZE; i += GRID_SIZE) {
            possibleCoords.push(i);
        }

        let valid = false;
        let newX, newY;

        while (!valid) {
            newX = possibleCoords[Math.floor(Math.random() * possibleCoords.length)];
            newY = possibleCoords[Math.floor(Math.random() * possibleCoords.length)];

            valid = !snake.some(segment => segment.x === newX && segment.y === newY);
        }

        food = { x: newX, y: newY };
    }

    // Particle Burst on eating food
    function createFoodParticles(x, y) {
        const colors = ["#00ffcc", "#ff007f", "#ffe600", "#00ff66"];
        for (let i = 0; i < 16; i++) {
            const angle = (Math.PI * 2 * i) / 16;
            const speed = 2 + Math.random() * 4;
            particles.push({
                x: x + GRID_SIZE / 2,
                y: y + GRID_SIZE / 2,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                radius: Math.random() * 3 + 2,
                color: colors[Math.floor(Math.random() * colors.length)],
                alpha: 1,
                decay: 0.04 + Math.random() * 0.03
            });
        }
    }

    // Main Game Step Logic
    function step() {
        if (isGameOver || isPaused) return;

        direction = nextDirection;
        const head = { ...snake[0] };

        if (direction === "Up") head.y -= GRID_SIZE;
        else if (direction === "Down") head.y += GRID_SIZE;
        else if (direction === "Left") head.x -= GRID_SIZE;
        else if (direction === "Right") head.x += GRID_SIZE;

        // Detect collision with wall (matching snake.head.xcor() > 280 etc.)
        if (head.x < 0 || head.x >= CANVAS_WIDTH || head.y < 0 || head.y >= CANVAS_HEIGHT) {
            triggerGameOver();
            return;
        }

        // Detect collision with tail (matching for segment in snake.segments[1:])
        for (let i = 1; i < snake.length; i++) {
            if (head.x === snake[i].x && head.y === snake[i].y) {
                triggerGameOver();
                return;
            }
        }

        snake.unshift(head);

        // Detect collision with food (matching snake.head.distance(food) < 15)
        const dist = Math.hypot(head.x - food.x, head.y - food.y);
        if (dist < GRID_SIZE) {
            score++;
            scoreElement.textContent = score;
            createFoodParticles(food.x, food.y);
            window.soundFX.playEat();

            if (score > highScore) {
                highScore = score;
                highScoreElement.textContent = highScore;
                localStorage.setItem("snake_highscore", highScore.toString());
            }

            spawnFood();
        } else {
            snake.pop();
        }
    }

    function triggerGameOver() {
        isGameOver = true;
        statusPill.textContent = "GAME OVER";
        statusPill.className = "status-pill over";
        window.soundFX.playGameOver();

        finalScore.textContent = score;

        // Show celebration for new high score, otherwise pick a random tip
        if (score >= highScore && score > 0) {
            finalRank.textContent = "🎉 NEW HIGH SCORE! Outstanding run!";
        } else {
            finalRank.textContent = getRandomTip();
        }

        gameOverModal.classList.remove("hidden");
        if (playerNameInput) playerNameInput.blur();
    }


    // Render Canvas
    function draw() {
        // Clear & Draw Cyber Background Grid
        ctx.fillStyle = "#070b19";
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // Grid lines
        ctx.strokeStyle = "rgba(0, 255, 204, 0.04)";
        ctx.lineWidth = 1;
        for (let x = 0; x <= CANVAS_WIDTH; x += GRID_SIZE) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, CANVAS_HEIGHT);
            ctx.stroke();
        }
        for (let y = 0; y <= CANVAS_HEIGHT; y += GRID_SIZE) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(CANVAS_WIDTH, y);
            ctx.stroke();
        }

        // Playable Border Boundary
        ctx.strokeStyle = "rgba(0, 255, 204, 0.35)";
        ctx.lineWidth = 2;
        ctx.strokeRect(1, 1, CANVAS_WIDTH - 2, CANVAS_HEIGHT - 2);

        // Draw Food (Animated Pulsing Neon Circle matching Turtle shape="circle" color="red")
        foodPulse += 0.08;
        const pulseScale = Math.sin(foodPulse) * 2;
        const foodCenterX = food.x + GRID_SIZE / 2;
        const foodCenterY = food.y + GRID_SIZE / 2;

        ctx.save();
        ctx.shadowColor = "#ff0055";
        ctx.shadowBlur = 15;
        ctx.fillStyle = "#ff0055";
        ctx.beginPath();
        ctx.arc(foodCenterX, foodCenterY, (GRID_SIZE / 2 - 2) + pulseScale, 0, Math.PI * 2);
        ctx.fill();

        // Inner glowing core
        ctx.fillStyle = "#ff77aa";
        ctx.beginPath();
        ctx.arc(foodCenterX - 2, foodCenterY - 2, (GRID_SIZE / 4), 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Draw Snake Segments
        snake.forEach((segment, index) => {
            ctx.save();
            if (index === 0) {
                // Head - Glowing Neon Cyan/Green
                ctx.shadowColor = "#00ffcc";
                ctx.shadowBlur = 12;
                ctx.fillStyle = "#00ffcc";
                ctx.beginPath();
                ctx.roundRect(segment.x + 1, segment.y + 1, GRID_SIZE - 2, GRID_SIZE - 2, 6);
                ctx.fill();

                // Eyes on head
                ctx.fillStyle = "#000";
                const eyeOffset = 4;
                const eyeSize = 3;
                if (direction === "Right") {
                    ctx.fillRect(segment.x + GRID_SIZE - 6, segment.y + 4, eyeSize, eyeSize);
                    ctx.fillRect(segment.x + GRID_SIZE - 6, segment.y + GRID_SIZE - 7, eyeSize, eyeSize);
                } else if (direction === "Left") {
                    ctx.fillRect(segment.x + 3, segment.y + 4, eyeSize, eyeSize);
                    ctx.fillRect(segment.x + 3, segment.y + GRID_SIZE - 7, eyeSize, eyeSize);
                } else if (direction === "Up") {
                    ctx.fillRect(segment.x + 4, segment.y + 3, eyeSize, eyeSize);
                    ctx.fillRect(segment.x + GRID_SIZE - 7, segment.y + 3, eyeSize, eyeSize);
                } else if (direction === "Down") {
                    ctx.fillRect(segment.x + 4, segment.y + GRID_SIZE - 6, eyeSize, eyeSize);
                    ctx.fillRect(segment.x + GRID_SIZE - 7, segment.y + GRID_SIZE - 6, eyeSize, eyeSize);
                }
            } else {
                // Body Segments - Gradient Fade
                const ratio = 1 - (index / snake.length) * 0.6;
                ctx.fillStyle = `rgba(0, 220, 180, ${ratio})`;
                ctx.beginPath();
                ctx.roundRect(segment.x + 2, segment.y + 2, GRID_SIZE - 4, GRID_SIZE - 4, 4);
                ctx.fill();
            }
            ctx.restore();
        });

        // Draw Particles
        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.alpha -= p.decay;

            if (p.alpha <= 0) {
                particles.splice(i, 1);
                continue;
            }

            ctx.save();
            ctx.globalAlpha = p.alpha;
            ctx.fillStyle = p.color;
            ctx.shadowColor = p.color;
            ctx.shadowBlur = 6;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }

        // Paused Overlay
        if (isPaused) {
            ctx.fillStyle = "rgba(7, 11, 25, 0.75)";
            ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            ctx.font = "bold 32px 'Outfit', sans-serif";
            ctx.fillStyle = "#00ffcc";
            ctx.textAlign = "center";
            ctx.fillText("PAUSED", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
            ctx.font = "16px 'Outfit', sans-serif";
            ctx.fillStyle = "#8ba3c7";
            ctx.fillText("Press SPACE to resume", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 40);
        }
    }

    // Game Loop
    function gameLoop() {
        step();
        draw();
        if (!isGameOver) {
            gameLoopTimeout = setTimeout(gameLoop, currentSpeed);
        }
    }

    // Input Handlers
    function setDirection(newDir) {
        const opposites = {
            "Up": "Down",
            "Down": "Up",
            "Left": "Right",
            "Right": "Left"
        };
        if (opposites[newDir] !== direction && opposites[newDir] !== nextDirection) {
            nextDirection = newDir;
            window.soundFX.playMove();
        }
    }

    // Keyboard Listeners
    window.addEventListener("keydown", (e) => {
        if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space"].includes(e.code)) {
            e.preventDefault();
        }

        switch (e.code) {
            case "ArrowUp":
            case "KeyW":
                setDirection("Up");
                break;
            case "ArrowDown":
            case "KeyS":
                setDirection("Down");
                break;
            case "ArrowLeft":
            case "KeyA":
                setDirection("Left");
                break;
            case "ArrowRight":
            case "KeyD":
                setDirection("Right");
                break;
            case "Space":
                if (isGameOver) {
                    initGame();
                } else {
                    togglePause();
                }
                break;
            case "KeyR":
                initGame();
                break;
        }
    });

    // Mobile Virtual D-Pad
    document.querySelectorAll(".dpad-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            const dir = btn.getAttribute("data-dir");
            if (dir) setDirection(dir);
        });
        btn.addEventListener("touchstart", (e) => {
            e.preventDefault();
            const dir = btn.getAttribute("data-dir");
            if (dir) setDirection(dir);
        });
    });

    // Touch Swipe Gestures for Mobile
    let touchStartX = 0;
    let touchStartY = 0;

    canvas.addEventListener("touchstart", (e) => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    }, { passive: true });

    canvas.addEventListener("touchend", (e) => {
        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;
        const dx = touchEndX - touchStartX;
        const dy = touchEndY - touchStartY;

        if (Math.hypot(dx, dy) > 25) {
            if (Math.abs(dx) > Math.abs(dy)) {
                setDirection(dx > 0 ? "Right" : "Left");
            } else {
                setDirection(dy > 0 ? "Down" : "Up");
            }
        }
    }, { passive: true });

    // Buttons
    function togglePause() {
        if (isGameOver) return;
        isPaused = !isPaused;
        statusPill.textContent = isPaused ? "PAUSED" : "PLAYING";
        statusPill.className = isPaused ? "status-pill paused" : "status-pill live";
        pauseBtn.innerHTML = isPaused ? "▶ Resume" : "⏸ Pause";
        if (!isPaused) {
            gameLoop();
        }
    }

    pauseBtn.addEventListener("click", togglePause);
    restartBtn.addEventListener("click", initGame);
    playAgainBtn.addEventListener("click", initGame);

    muteBtn.addEventListener("click", () => {
        const muted = window.soundFX.toggleMute();
        muteBtn.textContent = muted ? "🔇 Unmute" : "🔊 Sound ON";
    });

    speedSelect.addEventListener("change", (e) => {
        currentSpeed = SPEEDS[e.target.value] || SPEEDS["classic"];
    });

    // Submit High Score
    submitScoreBtn.addEventListener("click", async () => {
        const name = playerNameInput.value.trim() || "Player1";
        submitScoreBtn.disabled = true;
        submitScoreBtn.textContent = "Saving...";

        const result = await window.API.submitScore(name, score, speedSelect.value);
        submitScoreBtn.textContent = "Saved! ✓";

        if (result && result.top_scores) {
            renderLeaderboard(result.top_scores);
        } else {
            await refreshLeaderboard();
        }

        setTimeout(() => {
            initGame();
            submitScoreBtn.disabled = false;
            submitScoreBtn.textContent = "Submit Score";
        }, 800);
    });

    // Leaderboard
    async function refreshLeaderboard() {
        const scores = await window.API.fetchLeaderboard();
        renderLeaderboard(scores);
    }

    function renderLeaderboard(scores) {
        leaderboardList.innerHTML = "";
        if (!scores || scores.length === 0) {
            leaderboardList.innerHTML = `<li class="empty-entry">No scores yet. Play to be #1!</li>`;
            return;
        }

        scores.slice(0, 10).forEach((entry, idx) => {
            const li = document.createElement("li");
            li.className = "leaderboard-item";
            const medal = idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : `#${idx + 1}`;
            li.innerHTML = `
                <div class="rank-name">
                    <span class="rank-badge">${medal}</span>
                    <span class="player-name">${escapeHtml(entry.player)}</span>
                </div>
                <div class="score-meta">
                    <span class="score-val">${entry.score} pts</span>
                    <span class="diff-tag">${entry.difficulty || "Classic"}</span>
                </div>
            `;
            leaderboardList.appendChild(li);
        });
    }

    const onlineCount = document.getElementById("onlineCount");

    async function updatePresence() {
        const res = await window.API.pingPresence();
        if (res && res.online_count !== undefined && onlineCount) {
            onlineCount.textContent = res.online_count;
        }
    }

    async function checkBackend() {
        const health = await window.API.checkHealth();
        if (health && health.status === "online") {
            backendStatus.innerHTML = `<span class="dot online"></span> Server Online`;
            if (health.online_count && onlineCount) {
                onlineCount.textContent = health.online_count;
            }
        } else {
            backendStatus.innerHTML = `<span class="dot offline"></span> Local Mode`;
        }
    }

    function escapeHtml(text) {
        const div = document.createElement("div");
        div.textContent = text;
        return div.innerHTML;
    }

    // Live Presence Heartbeat & Auto-Polling
    updatePresence();
    setInterval(updatePresence, 12000);
    setInterval(refreshLeaderboard, 20000);

    // Start
    initGame();
});
