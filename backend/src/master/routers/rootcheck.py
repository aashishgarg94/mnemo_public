from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()


class RootCheck(BaseModel):
    message: str
    status: int


@router.get("/")
def healthcheck():
    msg = "I am Up"
    return RootCheck(message=msg, status=200)