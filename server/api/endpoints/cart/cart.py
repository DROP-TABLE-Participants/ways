import json
from json import JSONEncoder
from typing import Any

from fastapi import APIRouter, Depends
from fastapi.encoders import jsonable_encoder
from pydantic import BaseModel
from starlette.requests import Request
from starlette.responses import Response
from tortoise.contrib.pydantic import pydantic_model_creator

from services.auth_service import get_user_id
from services.product_service import ProductService

cart_endpoints = APIRouter()


class CartItem(BaseModel):
    product_id: int
    quantity: int


class CartItemEncoder(JSONEncoder):
    def default(self, o: CartItem) -> Any:
        if isinstance(o, CartItem):
            return o.dict()
        return super().default(o)


@cart_endpoints.put("/")
async def put_cart(request: Request, response: Response, cart: CartItem, user_id: str = Depends(get_user_id)):
    if cart.quantity < 1:
        return {"message": "Quantity must be greater than 0"}

    try:
        await ProductService.get_product_by_id(cart.product_id)
    except:
        return {"message": "Product not found"}

    cart_cookie = request.cookies.get("cart")

    if cart_cookie is None:
        cart_cookie = []
    else:
        cart_cookie = json.loads(cart_cookie)

  
    is_found = False
   
    for item in cart_cookie:
        if item["product_id"] == cart.product_id:
            item["quantity"] += cart.quantity
            is_found = True
            break
            
    if not is_found:
        cart_cookie.append(cart.dict())

    response.set_cookie("cart", json.dumps(cart_cookie, cls=CartItemEncoder))

    return {"message": "Cart updated"}

@cart_endpoints.delete("/")
async def delete_cart(request: Request, response: Response, cart: CartItem, user_id: str = Depends(get_user_id)):
    cart_cookie = request.cookies.get("cart")

    if cart_cookie is None:
        return {"message": "Cart is empty"}

    cart_cookie = json.loads(cart_cookie)

    for item in cart_cookie:
        if item["product_id"] == cart.product_id:
            item["quantity"] -= cart.quantity
            if item["quantity"] < 1:
                cart_cookie.remove(item)
            break

    response.set_cookie("cart", json.dumps(cart_cookie, cls=CartItemEncoder))

    return {"message": "Cart updated"}
