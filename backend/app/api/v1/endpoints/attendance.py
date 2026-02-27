from fastapi import APIRouter, HTTPException
from typing import List
from app.db.prisma import db
from app.schemas.attendance import Attendance, AttendanceCreate
from datetime import datetime

router = APIRouter()

@router.get("/", response_model=List[Attendance])
async def get_attendance():
    return await db.client.attendance.find_many(order={"date": "desc"})

@router.post("/", response_model=Attendance)
async def mark_attendance(attendance: AttendanceCreate):
    # Check if employee exists
    employee = await db.client.employee.find_unique(where={"id": attendance.employeeId})
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")

    # Check if attendance already marked for this day
    # Note: Prisma @unique([employeeId, date]) requires exact match.
    # For HRMS, we often mean "same day". For simplicity in this lite version,
    # we'll assume 'date' is sent as the start of the day or handled by the user.
    
    try:
        return await db.client.attendance.create(
            data={
                "status": attendance.status,
                "date": attendance.date,
                "employeeId": attendance.employeeId
            }
        )
    except Exception as e:
        # Handle duplicate for the same day (simplified)
        raise HTTPException(status_code=400, detail="Attendance already marked for this employee on this date")

@router.put("/{attendance_id}", response_model=Attendance)
async def update_attendance(attendance_id: str, attendance: AttendanceCreate):
    # Verify record exists first
    existing = await db.client.attendance.find_unique(where={"id": attendance_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Attendance record not found")
    
    try:
        return await db.client.attendance.update(
            where={"id": attendance_id},
            data={
                "status": attendance.status,
            }
        )
    except Exception as e:
        print(f"Error updating attendance: {e}")
        raise HTTPException(status_code=400, detail=f"Failed to update attendance: {str(e)}")

@router.get("/employee/{employee_id}", response_model=List[Attendance])
async def get_employee_attendance(employee_id: str):
    return await db.client.attendance.find_many(
        where={"employeeId": employee_id},
        order={"date": "desc"}
    )
