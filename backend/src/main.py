import uvicorn
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
import gensim.downloader as api
from fastapi.middleware.cors import CORSMiddleware

# from games.routers import (
#     games
# )

from ai_game.routers import (
    ai_game
)

# from users.routers import (
#     users
# )
from ai_impersonate.routers import (
    ai_impersonate
)

# from mongo.mongo_adaptor import (
#     close_mongo_connection,
#     connect_to_mongo
# )

from master.routers import (
    app_info,
    healthcheck,
    rootcheck,
)

app = FastAPI()

origins = [
    "http://localhost:*",
    "http://localhost:3000",
    "http://localhost:4173",
    "https://www.mnemokids.com",
    "https://mnemokids.com",
    "http://mnemokids.com",
    "http://www.mnemokids.com"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["POST", "GET", "OPTIONS", "DELETE", "PUT"],
    allow_headers=[
        "x-requested-with",
        "Content-Type",
        "origin",
        "authorization",
        "accept",
        "client-security-token",
        "x-retry-count"
    ],
)

# app.add_event_handler("startup", connect_to_mongo)
# app.add_event_handler("shutdown", close_mongo_connection)

app.include_router(rootcheck.router, tags=["RootCheck"])
app.include_router(healthcheck.router, tags=["HealthCheck"])
app.include_router(app_info.router, tags=["AppInfo"])

# app.include_router(games.router, tags=["Games"])

# app.include_router(users.router, tags=["Users"])

app.include_router(ai_game.router, tags=["AIGame"])
app.include_router(ai_impersonate.router, tags=["AI Impersonation"])

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)