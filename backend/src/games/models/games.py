from pydantic import BaseModel
from typing import List

# Game state
class GameState(BaseModel):
    shared_words: List[str]
    user_words: List[str]

class GameModelOut(BaseModel):
    game_type: str
    game_id: str
    shared_words: List[str]
    user_words: List[str]
    instructions: str
    rating: float

# Schemas
class Clue(BaseModel):
    word: str

class GuessResponse(BaseModel):
    guesses: List[str]