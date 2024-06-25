from fastapi import APIRouter

from api.routers.product import product_router
from api.routers.session import session_router
from api.routers.tile import tile_router

apiRouter = APIRouter(prefix="/api")

apiRouter.include_router(product_router)
apiRouter.include_router(tile_router)
apiRouter.include_router(session_router)