import os

TORTOISE_ORM = {
    "connections": {"default": f"postgres://{os.getenv('DB_USER')}:"
                               f"{os.getenv('DB_PASSWORD')}@"
                               f"{os.getenv('DB_HOST')}:"
                               f"{os.getenv('DB_PORT')}/"
                               f"{os.getenv('DB_NAME')}"
                    },
    "apps": {
        "models": {
            "models": ["models.product", "models.tile", "models.session", "aerich.models"],
            "default_connection": "default",
        },
    },
}