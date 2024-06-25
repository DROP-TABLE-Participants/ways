from fastapi import APIRouter

from api.endpoints.session.session import session_endpoints

session_router = APIRouter()

session_router.include_router(
    session_endpoints,
    tags=["Session"],
    prefix="/session",
    responses={404: {"description": "Not found"}},
)


