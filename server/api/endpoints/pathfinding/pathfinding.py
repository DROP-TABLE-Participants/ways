from fastapi import APIRouter, Depends, Request
from starlette.responses import Response

from services.auth_service import get_user_id
from helper.pathfinding import get_path


pathfinding_endpoints = APIRouter()


@pathfinding_endpoints.get("/")
async def get_route(request: Request, response: Response, user_id: str = Depends(get_user_id)):
    cart = ["P206", "P207", "P243"]

    path  = get_path(cart)

    print(path)

    return { "message": "kur" }



