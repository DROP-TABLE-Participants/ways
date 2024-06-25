from uuid import uuid4, UUID
from fastapi import APIRouter, Depends
from starlette.responses import JSONResponse

from services.auth_service import SessionData, backend, cookie

session_endpoints = APIRouter()


@session_endpoints.post("/")
async def create_session():
    session = uuid4()
    userId = str(uuid4())
    data = SessionData(userId=userId)

    await backend.create(session, data)

    response = JSONResponse(content={"message": "created session", "userId": userId})
    cookie.attach_to_response(response, session)

    return response


@session_endpoints.delete("/")
async def del_session(session_id: UUID = Depends(cookie)):
    response = JSONResponse(content={"message": "deleted session"})

    try:
        await backend.read(session_id)
    except:
        return "session not found"

    cookie.delete_from_response(response)
    return "deleted session"
