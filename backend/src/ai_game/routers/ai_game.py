import logging
from typing import Optional, List, Dict, Any
from fastapi import APIRouter, Depends, Form, HTTPException, Security, Body

from ..crud.ai_game import AIGameCollection

router = APIRouter()

@router.post(
    "/ai_game/respond"
)
async def respond(
    user_message: str,
    player_id: Optional[int] = 1,
    current_step: Optional[int] = 0,
    background_image: Optional[str] = "",
    game_history: Optional[List[dict]] = Body(default=[])
):
    try:
        ai_game_collection = AIGameCollection()
        # hardcode = [[{
        #     "nextMessage": "This is what the backend has sent",
        #     "step": 1,
        #     "background_image": "https://mnemo-assets.s3.ap-south-1.amazonaws.com/game_background2.jpeg",
        #     "avatar_images": [{ "src": 'https://mnemo-assets.s3.ap-south-1.amazonaws.com/Mathias.png', "x": 100, "y": 200 },
        #                       { "src": 'https://mnemo-assets.s3.ap-south-1.amazonaws.com/Mathias.png', "x": 500, "y": 200 }],
        #     "prompt_suggestions": ["This is a suggestion 1", "This is a suggestion 2"]
        # }, [{"check history": "correct"}]],
        # [{
        #     "nextMessage": "This is what the backend has sent now",
        #     "step": 2,
        #     "background_image": "https://mnemo-assets.s3.ap-south-1.amazonaws.com/game_background5.jpeg",
        #     "avatar_images": [{ "src": 'https://mnemo-assets.s3.ap-south-1.amazonaws.com/Mathias.png', "x": 100, "y": 200 }],
        #     "prompt_suggestions": ["This is a suggestion 1", "This is a suggestion 2"]
        # }, [{"check history": "correct"}]]
        # ]
        
        # return hardcode[current_step]
        response = await ai_game_collection.respond(user_message=user_message, current_step=current_step, player_id=player_id, background_image=background_image, game_history=game_history, response_type="respond")
        return response
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail="Something went wrong")


@router.post(
    "/ai_game/companion"
)
async def companion(
    user_message: str,
    player_id: Optional[int] = 1,
    current_step: Optional[int] = 0,
    background_image: Optional[str] = "",
    game_history: Optional[List[dict]] = Body(default=[])
):
    try:
        ai_game_collection = AIGameCollection()
        response = await ai_game_collection.respond(user_message=user_message, current_step=current_step, player_id=player_id, background_image=background_image, game_history=game_history, response_type="companion")
        return response
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail="Something went wrong")


@router.post(
    "/ai_game/assets"
)
async def assets(
    user_message: str,
    player_id: Optional[int] = 1,
    current_step: Optional[int] = 0,
    background_image: Optional[str] = "",
    game_history: Optional[List[dict]] = Body(default=[])
):
    try:
        ai_game_collection = AIGameCollection()
        response = await ai_game_collection.respond(user_message=user_message, current_step=current_step, player_id=player_id, background_image=background_image, game_history=game_history, response_type="assets")
        return response
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail="Something went wrong")


@router.post(
    "/ai_game/puzzle"
)
async def puzzle(
    user_message: str,
    player_id: Optional[int] = 1,
    current_step: Optional[int] = 0,
    background_image: Optional[str] = "",
    game_history: Optional[List[dict]] = Body(default=[]),
    current_puzzle: Optional[str] = "hieroglyphic_01"
):
    try:
        ai_game_collection = AIGameCollection()
        response = await ai_game_collection.respond(user_message=user_message, current_step=current_step, player_id=player_id, background_image=background_image, game_history=game_history, response_type="puzzle", current_puzzle=current_puzzle)
        return response
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail="Something went wrong")


@router.post(
    "/ai_game/summarize"
)
async def summarize(
    user_message: str,
    player_id: Optional[int] = 1,
    current_step: Optional[int] = 0,
    background_image: Optional[str] = "",
    game_history: Optional[List[dict]] = Body(default=[])
):
    try:
        ai_game_collection = AIGameCollection()
        response = await ai_game_collection.respond(user_message=user_message, current_step=current_step, player_id=player_id, background_image=background_image, game_history=game_history, response_type="summary")
        return response
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail="Something went wrong")