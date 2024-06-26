from fastapi import APIRouter

from api.endpoints.pathfinding.pathfinding import pathfinding_endpoints

pathfinding_router = APIRouter()

pathfinding_router.include_router(
    pathfinding_endpoints,
    tags=["pathfinding"],
    prefix="/pathfinding",
    responses={404: {"description": "Not found"}},
)
