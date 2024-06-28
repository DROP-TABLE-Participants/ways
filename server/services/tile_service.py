from models.tile import Tile, Tile_Pydantic, TileIn_Pydantic


class TileService:
    @staticmethod
    async def get_tiles():
        return await Tile_Pydantic.from_queryset(Tile.all())

    @staticmethod
    async def create_tile(tile: TileIn_Pydantic):
        tile_obj = await Tile.create(**tile.model_dump(exclude_unset=True))
        return await Tile_Pydantic.from_tortoise_orm(tile_obj)

    @staticmethod
    async def update_or_create_tile(tile: TileIn_Pydantic):
        tile_obj, created = await Tile.get_or_create(**tile.model_dump(exclude_unset=True))
        return await Tile_Pydantic.from_tortoise_orm(tile_obj)

    @classmethod
    async def delete_tile(cls, tile_id: int):
        tile = await Tile.get(id=tile_id)
        await tile.delete()

    # get tile by product id
    @staticmethod
    async def get_tile_by_product_id(product_id: int):
        return await Tile_Pydantic.from_queryset_single(Tile.get(product_id=product_id))