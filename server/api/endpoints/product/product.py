from typing import List

from fastapi import APIRouter

from models.product import ProductIn_Pydantic, Product, Product_Pydantic
from services.product_service import ProductService

product_endpoints = APIRouter()


@product_endpoints.get("/", response_model=List[Product_Pydantic])
async def get_products(search: str = None, filter_category: str = None):
    return await ProductService.get_products(search, filter_category)


@product_endpoints.get("/categories", response_model=List[str])
async def get_categories():
    return await ProductService.get_categories()


"""
@product_endpoints.post("/", response_model=Product_Pydantic)
async def create_product(product: ProductIn_Pydantic):
    product_obj = await Product.create(**product.model_dump(exclude_unset=True))
    return await Product_Pydantic.from_tortoise_orm(product_obj)
"""
