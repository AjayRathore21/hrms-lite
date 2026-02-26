from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class AttendanceBase(BaseModel):
    status: str # "Present" or "Absent"
    date: datetime = datetime.now()

class AttendanceCreate(AttendanceBase):
    employeeId: str

class Attendance(AttendanceBase):
    id: str
    employeeId: str
    createdAt: datetime
    updatedAt: datetime

    class Config:
        from_attributes = True
