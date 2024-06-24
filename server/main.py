import os

from tortoise.contrib.fastapi import RegisterTortoise
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.responses import Response

from models.product import Product


@asynccontextmanager
async def lifespan(app: FastAPI):
    print(os.getenv("DB_PORT"))
    async with RegisterTortoise(
            app,
            db_url= f"postgres://{os.getenv('DB_USER')}:"
                    f"{os.getenv('DB_PASSWORD')}@"
                    f"{os.getenv('DB_HOST')}:"
                    f"{os.getenv('DB_PORT')}/"
                    f"{os.getenv('DB_NAME')}",
            modules={"models": ["models.product"]},
            generate_schemas=True,
            add_exception_handlers=True,
    ):
        yield

app = FastAPI(lifespan=lifespan)

@app.get("/")
async def main():
    items = await Product.all()
    print(items)
    return Response("Hello World")
