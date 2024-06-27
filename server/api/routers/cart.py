from fastapi import APIRouter

from api.endpoints.cart.cart import cart_endpoints

cart_router = APIRouter()

cart_router.include_router(
    cart_endpoints,
    tags=["Cart"],
    prefix="/cart",
    responses={404: {"description": "Not found"}},
)
