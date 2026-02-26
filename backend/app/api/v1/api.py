from fastapi import APIRouter
from app.api.v1.endpoints import employee, attendance

api_router = APIRouter()
api_router.include_router(employee.router, prefix="/employees", tags=["employees"])
api_router.include_router(attendance.router, prefix="/attendance", tags=["attendance"])
