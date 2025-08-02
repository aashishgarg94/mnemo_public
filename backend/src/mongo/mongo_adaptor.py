import os
import logging
import urllib.parse
from motor.motor_asyncio import AsyncIOMotorClient

from .mongodb import db


async def connect_to_mongo():
    prod_db = "mongodb+srv://mnemo:WDI5E86MtWICrGkt@mnemo.b4dj3.mongodb.net/staging?retryWrites=true&w=majority"
    # prod_db = "mongodb+srv://" + os.environ.get("MNEMODBUSER") + ":" + urllib.parse.quote(os.environ.get("MNEMODBPASSWORD")) + "@" + os.environ.get("MNEMODBURL") + "?retryWrites=true&w=majority"

    db.client = AsyncIOMotorClient(
        str(
            prod_db
        ),
        maxPoolSize=10,
        minPoolSize=10,
    )

async def close_mongo_connection():
    db.client.close()
