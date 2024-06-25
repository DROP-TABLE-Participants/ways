from typing import Annotated

from fastapi import (
    Cookie,
    Depends,
    WebSocket,
    WebSocketException,
    APIRouter,
)
from starlette import status

from services.auth_service import AuthService, ws_get_user_id

move_endpoints = APIRouter()


@move_endpoints.websocket("")
async def move(websocket: WebSocket, user_id: str = Depends(ws_get_user_id)):
    await websocket.accept()

    while True:
        data = await websocket.receive_text()
        await websocket.send_text(f"User {user_id} send data: {data}")
