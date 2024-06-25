from models.tile import Tile, Tile_Pydantic, TileIn_Pydantic


class TileService:
    @staticmethod
    async def get_tiles():
        return await Tile_Pydantic.from_queryset(Tile.all())

    @staticmethod
    async def create_tile(tile: TileIn_Pydantic):
        tile_obj = await Tile.create(**tile.model_dump(exclude_unset=True))
        return await Tile_Pydantic.from_tortoise_orm(tile_obj)
