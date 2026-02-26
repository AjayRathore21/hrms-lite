import type { Employee, Attendance } from "../types";
import { format, subDays } from "date-fns";

// ─── Mock Employees ────────────────────────────────────────────────────────────
export const mockEmployees: Employee[] = [
  {
    id: "EMP001",
    name: "Alice Johnson",
    email: "alice.johnson@hrms.com",
    department: "Engineering",
    position: "Senior Developer",
    phone: "+1 (555) 101-2020",
    joinDate: "2022-03-15",
    status: "Active",
  },
  {
    id: "EMP002",
    name: "Bob Martinez",
    email: "bob.martinez@hrms.com",
    department: "Design",
    position: "UI/UX Designer",
    phone: "+1 (555) 202-3030",
    joinDate: "2021-07-01",
    status: "Active",
  },
  {
    id: "EMP003",
    name: "Carol White",
    email: "carol.white@hrms.com",
    department: "HR",
    position: "HR Manager",
    phone: "+1 (555) 303-4040",
    joinDate: "2020-01-10",
    status: "Active",
  },
  {
    id: "EMP004",
    name: "David Lee",
    email: "david.lee@hrms.com",
    department: "Finance",
    position: "Financial Analyst",
    phone: "+1 (555) 404-5050",
    joinDate: "2023-05-20",
    status: "Active",
  },
  {
    id: "EMP005",
    name: "Eva Chen",
    email: "eva.chen@hrms.com",
    department: "Engineering",
    position: "Backend Developer",
    phone: "+1 (555) 505-6060",
    joinDate: "2022-11-30",
    status: "Active",
  },
  {
    id: "EMP006",
    name: "Frank Brown",
    email: "frank.brown@hrms.com",
    department: "Marketing",
    position: "Marketing Lead",
    phone: "+1 (555) 606-7070",
    joinDate: "2021-09-14",
    status: "Inactive",
  },
];

// ─── Mock Attendance ───────────────────────────────────────────────────────────
const today = format(new Date(), "yyyy-MM-dd");
const yesterday = format(subDays(new Date(), 1), "yyyy-MM-dd");
const twoDaysAgo = format(subDays(new Date(), 2), "yyyy-MM-dd");

export const mockAttendance: Attendance[] = [
  {
    id: "ATT001",
    employeeId: "EMP001",
    employeeName: "Alice Johnson",
    department: "Engineering",
    date: today,
    status: "Present",
  },
  {
    id: "ATT002",
    employeeId: "EMP002",
    employeeName: "Bob Martinez",
    department: "Design",
    date: today,
    status: "Absent",
  },
  {
    id: "ATT003",
    employeeId: "EMP003",
    employeeName: "Carol White",
    department: "HR",
    date: today,
    status: "Present",
  },
  {
    id: "ATT004",
    employeeId: "EMP004",
    employeeName: "David Lee",
    department: "Finance",
    date: today,
    status: "Present",
  },
  {
    id: "ATT005",
    employeeId: "EMP005",
    employeeName: "Eva Chen",
    department: "Engineering",
    date: today,
    status: "Absent",
  },
  {
    id: "ATT006",
    employeeId: "EMP001",
    employeeName: "Alice Johnson",
    department: "Engineering",
    date: yesterday,
    status: "Present",
  },
  {
    id: "ATT007",
    employeeId: "EMP002",
    employeeName: "Bob Martinez",
    department: "Design",
    date: yesterday,
    status: "Present",
  },
  {
    id: "ATT008",
    employeeId: "EMP003",
    employeeName: "Carol White",
    department: "HR",
    date: yesterday,
    status: "Present",
  },
  {
    id: "ATT009",
    employeeId: "EMP004",
    employeeName: "David Lee",
    department: "Finance",
    date: twoDaysAgo,
    status: "Absent",
  },
  {
    id: "ATT010",
    employeeId: "EMP005",
    employeeName: "Eva Chen",
    department: "Engineering",
    date: twoDaysAgo,
    status: "Present",
  },
];

export const DEPARTMENTS = [
  "Engineering",
  "Design",
  "HR",
  "Finance",
  "Marketing",
  "Operations",
  "Sales",
];
