from fastapi import FastAPI
from fastapi.responses import Response

app = FastAPI()


@app.get("/")
def app():
    return Response("Hello World")