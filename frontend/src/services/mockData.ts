import type { Employee, AttendanceRecord } from "../types";

export const DEPARTMENTS = [
  "Engineering",
  "Human Resources",
  "Design",
  "Marketing",
  "Finance",
  "Operations",
];

export const mockEmployees: Employee[] = [
  {
    id: "1",
    employeeId: "EMP001",
    fullName: "Ajay Maurya",
    email: "ajay@hrms.com",
    department: "Engineering",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    employeeId: "EMP002",
    fullName: "Jane Smith",
    email: "jane.smith@hrms.com",
    department: "Human Resources",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const mockAttendance: AttendanceRecord[] = [
  {
    id: "ATT001",
    employeeId: "1",
    employeeName: "Ajay Maurya",
    department: "Engineering",
    date: "2024-03-20",
    status: "Present",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];
