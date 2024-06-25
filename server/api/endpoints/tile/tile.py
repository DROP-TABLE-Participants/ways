from typing import List

from fastapi import APIRouter

from models.tile import Tile_Pydantic
from services.tile_service import TileService

tile_endpoints = APIRouter()


@tile_endpoints.get("/", response_model=List[Tile_Pydantic])
async def get_tiles():
    items = await TileService.get_tiles()
    return items
