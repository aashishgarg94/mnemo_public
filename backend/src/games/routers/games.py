import logging
from typing import Optional, List
from fastapi import APIRouter, Depends, Form, HTTPException, Security
from ..models.games import (
    Clue,
    GuessResponse,
    GameState
)
from ..crud.games import GamesCollection

router = APIRouter()

@router.get(
    "/game/start"
)
async def start_game(
):
    try:
        print("start game")
        games_collection = GamesCollection()
        print("games_collection")

        return await games_collection.start_game()
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail="Something went wrong")

@router.post("/game/clue", response_model=GuessResponse)
async def give_clue(
    clue: Clue,
    game_type: str,
    game_id: str
):
    """
    Take a clue word and return the 3 closest words from the shared word pool.
    Game type and game ID are used to find the specific game instance.
    """
    try:
        games_collection = GamesCollection()
        return await games_collection.generate_clue_guesses(clue.word, game_type, game_id)
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=str(e))

# @router.post("/game/add-iterations")
# async def add_game_iterations():
#     """
#     Add predefined game iterations to the wordgame1 document
#     """
#     try:
#         games_collection = GamesCollection()
#         success = await games_collection.add_game_iterations()
#         if success:
#             return {"message": "Game iterations added successfully"}
#         return {"message": "No document was updated"}
#     except Exception as e:
#         if isinstance(e, HTTPException):
#             raise e
#         raise HTTPException(status_code=500, detail=str(e))