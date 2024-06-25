from tortoise import fields, Tortoise
from tortoise.contrib.pydantic import pydantic_model_creator
from tortoise.models import Model

from models.product import Product
from models.tile_type import TileType


class Tile(Model):
    id = fields.IntField(primary_key=True)
    x = fields.IntField()
    y = fields.IntField()
    type = fields.IntEnumField(enum_type=TileType)
    product: fields.ForeignKeyRelation[Product] = fields.ForeignKeyField(
        "models.Product", related_name="FK_TileType_To_ProductId", null=True
    )

    def __str__(self):
        return f"{self.x}, {self.y}, {self.type}, {self.product}"


Tortoise.init_models(["models.tile"], "models")
Tile_Pydantic = pydantic_model_creator(Tile, name="Tile")
TileIn_Pydantic = pydantic_model_creator(Tile, name="TileIn", exclude_readonly=True)
TileWithoutProductIn_Pydantic = pydantic_model_creator(
    Tile, name="TileWithoutProductIn", exclude=("product","product_id"), exclude_readonly=True
)
