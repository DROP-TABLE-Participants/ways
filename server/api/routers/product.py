from fastapi import APIRouter

from api.endpoints.product.product import product_endpoints

product_router = APIRouter()

product_router.include_router(
    product_endpoints,
    tags=["Products"],
    prefix="/product",
    responses={404: {"description": "Not found"}},
)
