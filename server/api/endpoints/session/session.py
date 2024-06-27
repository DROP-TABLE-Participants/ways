from uuid import uuid4, UUID
from fastapi import APIRouter, Depends
from starlette.requests import Request
from starlette.responses import JSONResponse, Response

from services.auth_service import AuthService, get_user_id

session_endpoints = APIRouter()


@session_endpoints.post("")
async def create_session():
    session = await AuthService.create_session()

    response = JSONResponse(content={"message": "created session", "userId": session.user_id})

    response.set_cookie("token", session.token, samesite="none", secure=True)

    return response


@session_endpoints.get("/whoami")
async def whoami(user_id: str = Depends(get_user_id)):
    return {"userId": user_id}


@session_endpoints.delete("")
async def del_session(response: Response, user_id: str = Depends(get_user_id)):
    await AuthService.delete_session(user_id)
    response.delete_cookie("token")
    return {"message": "session deleted"}
