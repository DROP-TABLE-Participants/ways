from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from starlette import status
from starlette.responses import Response, JSONResponse

from services.admin_auth_service import get_admin_id, AdminAuthService

admin_auth_endpoints = APIRouter()


class LoginModel(BaseModel):
    username: str
    password: str


@admin_auth_endpoints.post("/login")
async def login(loginData: LoginModel):
    if not await AdminAuthService.check_is_login_data_valid(loginData.username, loginData.password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    session = await AdminAuthService.admin_create_session()

    response = JSONResponse(content={"message": "created session", "userId": session.user_id})

    response.set_cookie("token", session.token, samesite="none", secure=True)

    return response


@admin_auth_endpoints.post("/logout")
async def del_session(response: Response, user_id: str = Depends(get_admin_id)):
    await AdminAuthService.delete_session(user_id)
    response.delete_cookie("token")
    return {"message": "session deleted"}
