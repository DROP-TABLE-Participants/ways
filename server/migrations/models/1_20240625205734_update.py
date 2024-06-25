from tortoise import BaseDBAsyncClient


async def upgrade(db: BaseDBAsyncClient) -> str:
    return """
        ALTER TABLE "session" RENAME COLUMN "userId" TO "user_id";"""


async def downgrade(db: BaseDBAsyncClient) -> str:
    return """
        ALTER TABLE "session" RENAME COLUMN "user_id" TO "userId";"""
