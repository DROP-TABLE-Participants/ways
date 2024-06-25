import os
from contextlib import asynccontextmanager

from fastapi import FastAPI

from tortoise.contrib.fastapi import RegisterTortoise

from api.routers.api import apiRouter
from seed import Seeder
from ws.routes.ws import wsRouter


def create_application(lifespan) -> FastAPI:
    application = FastAPI(lifespan=lifespan)
    application.include_router(apiRouter)
    application.include_router(wsRouter)
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