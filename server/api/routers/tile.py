from fastapi import APIRouter

from api.endpoints.tile.tile import tile_endpoints

tile_router = APIRouter()

tile_router.include_router(
    tile_endpoints,
    tags=["Tiles"],
    prefix="/tile",
    responses={404: {"description": "Not found"}},
)