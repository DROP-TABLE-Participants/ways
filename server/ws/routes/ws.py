from fastapi import APIRouter

from ws.routes.move import move_router

wsRouter = APIRouter(prefix="/ws")

wsRouter.include_router(move_router)