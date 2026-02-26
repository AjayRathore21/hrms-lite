from fastapi import APIRouter, HTTPException, Depends
from typing import List
from app.db.prisma import db
from app.schemas.employee import Employee, EmployeeCreate, EmployeeUpdate

router = APIRouter()

@router.get("/", response_model=List[Employee])
async def get_employees():
    return await db.client.employee.find_many(order={"createdAt": "desc"})

@router.post("/", response_model=Employee)
async def create_employee(employee: EmployeeCreate):
    # Check for existing employee ID or email
    existing = await db.client.employee.find_first(
        where={
            "OR": [
                {"employeeId": employee.employeeId},
                {"email": employee.email}
            ]
        }
    )
    if existing:
        raise HTTPException(
            status_code=400, 
            detail="Employee with this ID or Email already exists"
        )
    
    return await db.client.employee.create(
        data={
            "employeeId": employee.employeeId,
            "fullName": employee.fullName,
            "email": employee.email,
            "department": employee.department,
        }
    )

@router.delete("/{id}", response_model=Employee)
async def delete_employee(id: str):
    try:
        return await db.client.employee.delete(where={"id": id})
    except Exception:
        raise HTTPException(status_code=404, detail="Employee not found")
