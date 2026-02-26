from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.db.prisma import db

def get_application() -> FastAPI:
    _app = FastAPI(
        title=settings.PROJECT_NAME,
        debug=settings.DEBUG,
    )

    _app.add_middleware(
        CORSMiddleware,
        allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @_app.on_event("startup")
    async def startup():
        await db.connect()

    @_app.on_event("shutdown")
    async def shutdown():
        await db.disconnect()

    @_app.get("/health")
    async def health_check():
        return {"status": "ok", "project": settings.PROJECT_NAME}

    return _app

app = get_application()
