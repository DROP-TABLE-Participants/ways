from tortoise import BaseDBAsyncClient


async def upgrade(db: BaseDBAsyncClient) -> str:
    return """
        CREATE TABLE IF NOT EXISTS "product" (
    "id" SERIAL NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "quantity" INT NOT NULL
);
CREATE TABLE IF NOT EXISTS "tile" (
    "id" SERIAL NOT NULL PRIMARY KEY,
    "x" INT NOT NULL,
    "y" INT NOT NULL,
    "type" SMALLINT NOT NULL,
    "product_id" INT REFERENCES "product" ("id") ON DELETE CASCADE
);
COMMENT ON COLUMN "tile"."type" IS 'PRODUCT: 0\nSELF_CHECKOUT: 1\nCARD_ONLY_SELF_CHECKOUT: 2\nCASH_REGISTER: 3\nWALL: 4\nEASTER_EGG: 5\nENTER: 6\nEXIT: 7\nCLEAR: 8';
CREATE TABLE IF NOT EXISTS "session" (
    "id" SERIAL NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS "aerich" (
    "id" SERIAL NOT NULL PRIMARY KEY,
    "version" VARCHAR(255) NOT NULL,
    "app" VARCHAR(100) NOT NULL,
    "content" JSONB NOT NULL
);"""


async def downgrade(db: BaseDBAsyncClient) -> str:
    return """
        """
