import asyncio
from typing import List

from fastapi import FastAPI
from fastapi.responses import Response

from data.data import init_db
from models.product import Product_Pydantic, ProductIn_Pydantic, Product
from seed import Seeder
from services.product_service import ProductService


def create_application() -> FastAPI:
    application = FastAPI()
    return application


app = create_application()


@app.on_event("startup")
async def startup_event():
    print("Starting up...")
    init_db(app)


@app.get("/")
async def main():
    await Seeder.seed()
    items = await ProductService.get_products()
    return items


@app.post("/products")
async def create_product(product: ProductIn_Pydantic):
    product_obj = await Product.create(**product.model_dump(exclude_unset=True))
    return await Product_Pydantic.from_tortoise_orm(product_obj)
