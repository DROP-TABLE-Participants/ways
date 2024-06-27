from tortoise import fields
from tortoise.contrib.pydantic import pydantic_model_creator
from tortoise.models import Model


class Product(Model):
    id = fields.IntField(primary_key=True)
    name = fields.TextField()
    category = fields.TextField()
    price = fields.IntField()

    def __str__(self):
        return self.name


Product_Pydantic = pydantic_model_creator(Product, name="Product")
ProductIn_Pydantic = pydantic_model_creator(Product, name="ProductIn", exclude_readonly=True)
