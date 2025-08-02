from datetime import datetime
from typing import List, Optional
from fastapi import HTTPException
from mongo.collections import GAMES
from mongo.mongo_base import MongoBase
from ..models.games import (
    GameModelOut,
    GuessResponse
)
from ..utils.game_iterations import WORD_GAME_ITERATIONS
import os
import random
from ai.Word2Vec import Word2VecModel

class GamesCollection:
    _word2vec = None

    def __init__(self):
        self.collection = MongoBase()
        self.collection(GAMES)
    
    @property
    def word2vec(self):
        if GamesCollection._word2vec is None:
            print("Initializing Word2Vec model")
            GamesCollection._word2vec = Word2VecModel()
        return GamesCollection._word2vec
    
    async def start_game(
        self
    ) -> any:
        try:
            print("start game 2")
            finder = {}

            game = await self.collection.find_one(
                finder=finder
            )

            print("start game 3")
            if not game or not game["games"]:
                return None

            print("start game 4")
            random_index = random.randint(0, len(game['games']) - 1) if len(game['games']) < 100 else random.randint(0, 100)
            game_info = GameModelOut(
                game_type=game["game_type"],
                game_id=game["games"][random_index]["game_id"],
                shared_words=[word.strip() for word in game["games"][random_index]["shared_words"].split(',')],
                user_words=[word.strip() for word in game["games"][random_index]["user_words"].split(',')],
                instructions=game["instructions"],
                rating=game["games"][random_index]["rating"]
            )

            print("start game 5")
            return game_info if game_info else None
            
        except Exception as e:
            print(e)
            raise HTTPException(status_code=500, detail="Something went wrong")
            
    async def generate_clue_guesses(
        self,
        clue: str,
        game_type: str,
        game_id: str
    ) -> GuessResponse:
        """
        Generate guesses for a given clue using Word2Vec model
        """
        try:
            # Get the game data using game type
            finder = {"game_type": game_type}
            game_data = await self.collection.find_one(finder=finder)
            
            if not game_data:
                raise HTTPException(status_code=404, detail=f"Game type {game_type} not found")
            
            # Find the specific game in the games array
            game = next(
                (g for g in game_data["games"] if g["game_id"] == game_id),
                None
            )
            
            if not game:
                raise HTTPException(
                    status_code=404,
                    detail=f"Game with ID {game_id} not found in {game_type}"
                )
                
            # Get shared words for this game
            shared_words = [word.strip() for word in game["shared_words"].split(',')]
            
            # Get closest words using Word2Vec
            guesses = self.word2vec.closest_words(clue, shared_words)
            
            # Check if guesses match user words
            user_words = set([word.strip() for word in game["user_words"].split(',')])
            correct = set(guesses) == user_words
            
            feedback = (
                "Correct! The AI guessed the 3 words." if correct
                else f"Incorrect. The AI guessed {guesses}. The correct words are {list(user_words)}."
            )
            
            return GuessResponse(
                guesses=guesses,
                correct=correct,
                feedback=feedback
            )
            
        except Exception as e:
            print(e)
            if isinstance(e, HTTPException):
                raise e
            raise HTTPException(status_code=500, detail="Error generating clue guesses")

    async def add_game_iterations(
        self
    ) -> bool:
        """
        Add predefined game iterations to the wordgame1 document
        """
        try:
            finder = {"game_type": "wordgame1"}
            
            update = {
                "$push": {
                    "games": {
                        "$each": WORD_GAME_ITERATIONS
                    }
                }
            }
            
            result = await self.collection.find_one_and_modify(
                find=finder,
                update=update,
                return_updated_document=True
            )
            
            return result is not None
            
        except Exception as e:
            print(e)
            raise HTTPException(status_code=500, detail="Error adding game iterations")