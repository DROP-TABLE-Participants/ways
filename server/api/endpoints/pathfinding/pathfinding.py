import json

from fastapi import APIRouter, Depends, Request
from starlette.responses import Response

from services.auth_service import get_user_id
from services.product_service import ProductService
from services.tile_service import TileService

from helper.pathfinding import get_path



pathfinding_endpoints = APIRouter()


@pathfinding_endpoints.get("")
async def get_route(request: Request, response: Response, user_id: str = Depends(get_user_id)):
    cart = request.cookies.get("cart")

    if cart is None:
        return {"message": "Cart is empty"}

    parsed_cart = json.loads(cart)
    items = []

    for item in parsed_cart:
        product_id = item["product_id"]
        product = await ProductService.get_product_by_id(product_id)

        if product:
            items.append(product.legacy_product_id)

    path = await get_path(items)

    products_raw = path[2]
    products = []

    for product in products_raw:
        if product.startswith("P"):
            product_obj = await ProductService.get_product_by_legacy_id(product)
            tile_obj = await TileService.get_tile_by_product_id(product_obj.id)
            products.append({
                "product": product_obj,
                "tile": tile_obj

            })

    return {"path": path[1], "distance": path[0], "products": products}



