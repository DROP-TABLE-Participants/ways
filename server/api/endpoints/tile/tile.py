from typing import List

from fastapi import APIRouter, Depends, HTTPException
from starlette import status

from models.tile import Tile_Pydantic, TileIn_Pydantic, TileWithoutProductIn_Pydantic
from services.admin_auth_service import get_admin_id
from services.tile_service import TileService

tile_endpoints = APIRouter()


@tile_endpoints.get("", response_model=List[Tile_Pydantic])
async def get_tiles():
    items = await TileService.get_tiles()
    return items


@tile_endpoints.put("", response_model=Tile_Pydantic)
async def put_tile(tile: TileWithoutProductIn_Pydantic, user_id: str = Depends(get_admin_id)):
    item = await TileService.update_or_create_tile(tile)
    return item


@tile_endpoints.delete("/{tile_id}")
async def delete_tile(tile_id: int, user_id: str = Depends(get_admin_id)):
    try:
        await TileService.delete_tile(tile_id=tile_id)
    except:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Tile not found")
    return {"message": "tile deleted"}
