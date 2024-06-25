from tortoise import BaseDBAsyncClient


async def upgrade(db: BaseDBAsyncClient) -> str:
    return """
        CREATE TABLE IF NOT EXISTS "tile" (
    "id" SERIAL NOT NULL PRIMARY KEY,
    "x" INT NOT NULL,
    "y" INT NOT NULL,
    "type" SMALLINT NOT NULL,
    "product_id" INT REFERENCES "product" ("id") ON DELETE CASCADE
);
COMMENT ON COLUMN "tile"."type" IS 'PRODUCT: 0\nSELF_CHECKOUT: 1\nCARD_ONLY_SELF_CHECKOUT: 2\nCASH_REGISTER: 3\nWALL: 4\nEASTER_EGG: 5\nENTER: 6\nEXIT: 7\nCLEAR: 8';"""


async def downgrade(db: BaseDBAsyncClient) -> str:
    return """
        DROP TABLE IF EXISTS "tile";"""
