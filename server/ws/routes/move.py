from fastapi import APIRouter

from ws.endpoint.move.move import move_endpoints

move_router = APIRouter()

move_router.include_router(
    move_endpoints,
    tags=["Move"],
    prefix="/move",
    responses={404: {"description": "Not found"}},
)