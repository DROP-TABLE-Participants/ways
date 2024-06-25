import os
from uuid import uuid4
import secrets

from fastapi import HTTPException
from starlette import status
from starlette.requests import Request
from starlette.websockets import WebSocket

from models.session import SessionIn_Pydantic, Session


class AuthService:
    @staticmethod
    async def create_session():
        session_info = SessionIn_Pydantic(
            user_id=str(uuid4()),
            token=secrets.token_urlsafe(32)
        )
        session_obj = await Session.create(**session_info.model_dump(exclude_unset=True))
        return session_obj

    @staticmethod
    async def get_user_id_for_session(token: str) -> str:
        session = await Session.get(token=token)
        return session.user_id

    @staticmethod
    async def delete_session(user_id: str):
        session = await Session.get(user_id=user_id)
        await session.delete()


async def get_user_id(request: Request):
    token = request.cookies.get("token")
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")
    try:
        user_id = await AuthService.get_user_id_for_session(token)
        return user_id
    except:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Session not found")


async def ws_get_user_id(webSocket: WebSocket):
    token = webSocket.cookies.get("token")
    if not token:
        await webSocket.close(code=status.WS_1008_POLICY_VIOLATION)
    try:
        user_id = await AuthService.get_user_id_for_session(token)
        return user_id
    except:
        await webSocket.close(code=status.WS_1008_POLICY_VIOLATION)
