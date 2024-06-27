import os
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.responses import Response
from starlette.middleware.cors import CORSMiddleware

from tortoise.contrib.fastapi import RegisterTortoise


from seed import Seeder
from redis_client import redis_client

from api.routers.api import apiRouter
from ws.routes.ws import wsRouter


def create_application(lifespan) -> FastAPI:
    application = FastAPI(lifespan=lifespan)
    application.include_router(apiRouter)
    application.include_router(wsRouter)
    origins = ["https://localhost:5173", "https://icy-island-00ed8aa03.5.azurestaticapps.net", "https://172.20.10.2:5173"]
    application.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    return application


@asynccontextmanager
async def lifespan(app: FastAPI):
    async with RegisterTortoise(
            app,
            db_url=f"postgres://{os.getenv('DB_USER')}:"
                   f"{os.getenv('DB_PASSWORD')}@"
                   f"{os.getenv('DB_HOST')}:"
                   f"{os.getenv('DB_PORT')}/"
                   f"{os.getenv('DB_NAME')}",
            modules={"models": ["models.product", "models.tile", "models.session", "aerich.models"]},
            generate_schemas=True,
            add_exception_handlers=True,
    ):
        print("Starting up...")
        await Seeder.seed()
        yield


app = create_application(lifespan=lifespan)

@app.get("/")
def hello():
    print(redis_client.time())
    return Response("Hello, world!", status_code=200)