import logging
from typing import Optional, List, Dict, Any
from fastapi import APIRouter, Depends, Form, HTTPException, Security, Body

from ..crud.ai_impersonate import run_agent
from ..crud.db import add_pdf_to_db

router = APIRouter()

@router.post(
    "/ai_impersonate/respond"
)
async def respond(
    question: str,
    character: Optional[str] = "Harry Potter",
    game_history: Optional[List[dict]] = Body(default=[])

):
    try:
        print("Personation_Start")
        return await run_agent(question=question, character=character, game_history=game_history)
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail="Something went wrong")
    
@router.post(
    "/ai_impersonate/embed"
)
async def respond(
    pdf_link: str 
):
    try:
        print("Personation_Start")
        return await add_pdf_to_db(url=pdf_link)
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail="Something went wrong")