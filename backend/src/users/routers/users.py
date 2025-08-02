import logging
from typing import Optional, List
from fastapi import APIRouter, Depends, Form, HTTPException, Security
from ..crud.users import UsersCollection

router = APIRouter()

@router.post("/users/add")
async def give_clue(
    username: str
):
    try:
        users_collection = UsersCollection()
        return await users_collection.add_user(username)
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=str(e))