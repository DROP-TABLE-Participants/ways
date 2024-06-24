import os

from fastapi import FastAPI
from tortoise.contrib.fastapi import register_tortoise, RegisterTortoise

TORTOISE_ORM = {
    "connections": {"default": f"postgres://{os.getenv('DB_USER')}:"
                               f"{os.getenv('DB_PASSWORD')}@"
                               f"{os.getenv('DB_HOST')}:"
                               f"{os.getenv('DB_PORT')}/"
                               f"{os.getenv('DB_NAME')}"
                    },
    "apps": {
        "models": {
            "models": ["models.product", "aerich.models"],
            "default_connection": "default",
        },
    },
}


def init_db(app: FastAPI):
    register_tortoise(
        app,
        db_url= f"postgres://{os.getenv('DB_USER')}:"
                f"{os.getenv('DB_PASSWORD')}@"
                f"{os.getenv('DB_HOST')}:"
                f"{os.getenv('DB_PORT')}/"
                f"{os.getenv('DB_NAME')}",
        modules={"models": ["models.product", "aerich.models"]},
        generate_schemas=True,
        add_exception_handlers=True,
    )
