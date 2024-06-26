from fastapi import APIRouter

from api.routers.cart import cart_router
from api.routers.product import product_router
from api.routers.session import session_router
from api.routers.tile import tile_router
from api.routers.pathfinding import pathfinding_router

apiRouter = APIRouter(prefix="/api")

apiRouter.include_router(product_router)
apiRouter.include_router(tile_router)
apiRouter.include_router(session_router)
apiRouter.include_router(pathfinding_router)
apiRouter.include_router(cart_router)