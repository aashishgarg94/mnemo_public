from fastapi import APIRouter
from pydantic import BaseModel
from fastapi.responses import PlainTextResponse


router = APIRouter()


class BaseHealthCheck(BaseModel):
    message: str
    status: int


@router.get("/healthcheck")
def healthcheck():
    msg = "I am good and how are you"
    return BaseHealthCheck(message=msg, status=200)

@router.get("/robots.txt", response_class=PlainTextResponse)
def robots_block():
    path = "/robots.txt"
    return """User-agent: * \nDisallow: / \n\nUser-agent: Googlebot\nUser-agent: AdsBot-Google\nUser-agent: Googlebot-news\nDisallow: /"""