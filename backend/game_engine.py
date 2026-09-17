import random
import math
from typing import List, Tuple, Dict, Any

# Screen is 600x600, coordinate range from -300 to 300 (or -280 to 280 playable grid)
WIDTH = 600
HEIGHT = 600
GRID_SIZE = 20
PLAYABLE_MIN_X = -280
PLAYABLE_MAX_X = 280
PLAYABLE_MIN_Y = -280
PLAYABLE_MAX_Y = 280

class SnakeEngine:
    def __init__(self):
        self.reset()

    def reset(self) -> Dict[str, Any]:
        """Resets the game state matching original turtle starting positions [(0,0), (-20,0), (-40,0)]"""
        self.segments: List[Tuple[int, int]] = [(0, 0), (-20, 0), (-40, 0)]
        self.direction = "Right"  # 0 deg = Right, 90 = Up, 180 = Left, 270 = Down
        self.score = 0
        self.game_over = False
        self.food = self.spawn_food()
        return self.get_state()

    def spawn_food(self) -> Tuple[int, int]:
        """Spawns food at a random grid-aligned position between -280 and 280, not overlapping the snake"""
        possible_x = list(range(PLAYABLE_MIN_X, PLAYABLE_MAX_X + 1, GRID_SIZE))
        possible_y = list(range(PLAYABLE_MIN_Y, PLAYABLE_MAX_Y + 1, GRID_SIZE))
        
        while True:
            fx = random.choice(possible_x)
            fy = random.choice(possible_y)
            if (fx, fy) not in self.segments:
                return (fx, fy)

    def change_direction(self, new_direction: str) -> bool:
        opposites = {
            "Up": "Down",
            "Down": "Up",
            "Left": "Right",
            "Right": "Left"
        }
        if new_direction in opposites and opposites[new_direction] != self.direction:
            self.direction = new_direction
            return True
        return False

    def step(self) -> Dict[str, Any]:
        """Advances the game by one tick (20px movement), checks collisions with food, walls, and tail"""
        if self.game_over:
            return self.get_state()

        head_x, head_y = self.segments[0]

        if self.direction == "Up":
            new_head = (head_x, head_y + GRID_SIZE)
        elif self.direction == "Down":
            new_head = (head_x, head_y - GRID_SIZE)
        elif self.direction == "Left":
            new_head = (head_x - GRID_SIZE, head_y)
        elif self.direction == "Right":
            new_head = (head_x + GRID_SIZE, head_y)
        else:
            new_head = (head_x, head_y)

        # Check Wall Collision (outside -280 to 280)
        nx, ny = new_head
        if nx > PLAYABLE_MAX_X or nx < PLAYABLE_MIN_X or ny > PLAYABLE_MAX_Y or ny < PLAYABLE_MIN_Y:
            self.game_over = True
            return self.get_state()

        # Check Tail Collision
        if new_head in self.segments[:-1]:
            self.game_over = True
            return self.get_state()

        # Insert new head
        self.segments.insert(0, new_head)

        # Check Food Collision (distance < 15)
        dist_to_food = math.hypot(new_head[0] - self.food[0], new_head[1] - self.food[1])
        if dist_to_food < 15:
            self.score += 1
            self.food = self.spawn_food()
            # snake extends -> keep tail
        else:
            self.segments.pop()

        return self.get_state()

    def get_state(self) -> Dict[str, Any]:
        return {
            "width": WIDTH,
            "height": HEIGHT,
            "grid_size": GRID_SIZE,
            "segments": self.segments,
            "food": self.food,
            "score": self.score,
            "game_over": self.game_over,
            "direction": self.direction
        }
