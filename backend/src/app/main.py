from contextlib import asynccontextmanager

from fastapi import FastAPI

from src.app.database import init_db
from src.app.routers import health


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield


app = FastAPI(
    title="Portfolio API",
    description="Backend API for personal portfolio",
    version="0.1.0",
    lifespan=lifespan,
)

app.include_router(health.router)


@app.get("/")
def root():
    return {"message": "Welcome to the Portfolio API"}
