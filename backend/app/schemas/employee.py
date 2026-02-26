from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import Optional, List

class EmployeeBase(BaseModel):
    employeeId: str = Field(..., description="Unique employee identifier")
    fullName: str
    email: EmailStr
    department: str

class EmployeeCreate(EmployeeBase):
    pass

class EmployeeUpdate(BaseModel):
    fullName: Optional[str] = None
    email: Optional[EmailStr] = None
    department: Optional[str] = None

class Employee(EmployeeBase):
    id: str
    createdAt: datetime
    updatedAt: datetime

    class Config:
        from_attributes = True
