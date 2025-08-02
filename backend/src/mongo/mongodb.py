from .collections import DB_NAME
from motor.motor_asyncio import AsyncIOMotorClient


class DataBase:
    client: AsyncIOMotorClient = None


db = DataBase()

def get_collection(collection_name: str):
    return db.client[DB_NAME][collection_name]