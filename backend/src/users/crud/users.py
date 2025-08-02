from datetime import datetime
from typing import List, Optional
from fastapi import HTTPException
from mongo.collections import USERS
from mongo.mongo_base import MongoBase
import os
import random

class UsersCollection:

    def __init__(self):
        self.collection = MongoBase()
        self.collection(USERS)

    async def add_user(
        self,
        username: str
    ) -> bool:
        try:
            user_doc = {
                "username": username,
                "created_at": datetime.now()
            }
            result = await self.collection.insert_one(
                document=user_doc
            )
        except Exception as e:
            print(e)
            raise HTTPException(status_code=500, detail="Error adding game iterations")