from tortoise import fields
from tortoise.models import Model


class Product(Model):
    id = fields.IntField(primary_key=True)