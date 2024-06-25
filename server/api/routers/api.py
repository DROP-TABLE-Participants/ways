from fastapi import APIRouter

from api.routers.product import product_router
from api.routers.tile import tile_router

router = APIRouter(prefix="/api")

router.include_router(product_router)
router.include_router(tile_router)