import os
from uuid import uuid4
import secrets

from fastapi import HTTPException
from starlette import status
from starlette.requests import Request
from starlette.websockets import WebSocket

from models.admin_session import AdminSession, AdminSessionIn_Pydantic


class AdminAuthService:
    @staticmethod
    async def admin_create_session():
        admin_session_info = AdminSessionIn_Pydantic(
            user_id=str(uuid4()),
            token=secrets.token_urlsafe(32)
        )
        admin_session_obj = await AdminSession.create(**admin_session_info.model_dump(exclude_unset=True))
        return admin_session_obj

    @staticmethod
    async def get_admin_id_for_session(token: str) -> str:
        session = await AdminSession.get(token=token)
        return session.user_id

    @staticmethod
    async def delete_session(user_id: str):
        session = await AdminSession.get(user_id=user_id)
        await session.delete()

    @staticmethod
    async def check_is_login_data_valid(username: str, password: str) -> bool:
        return username == os.getenv("ADMIN_USERNAME") and password == os.getenv("ADMIN_PASSWORD")


async def get_admin_id(request: Request):
    token = request.cookies.get("token")
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")
    try:
        user_id = await AdminAuthService.get_admin_id_for_session(token)
        return user_id
    except:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Session not found")


async def ws_get_admin_id(webSocket: WebSocket):
    token = webSocket.cookies.get("token")
    if not token:
        await webSocket.close(code=status.WS_1008_POLICY_VIOLATION)
    try:
        user_id = await AdminAuthService.get_admin_id_for_session(token)
        return user_id
    except:
        await webSocket.close(code=status.WS_1008_POLICY_VIOLATION)
