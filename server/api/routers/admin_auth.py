from fastapi import APIRouter

from api.endpoints.admin_auth.admin_auth import admin_auth_endpoints

admin_auth_router = APIRouter()

admin_auth_router.include_router(
    admin_auth_endpoints,
    tags=["Admin Auth"],
    prefix="/admin/auth",
    responses={404: {"description": "Not found"}},
)