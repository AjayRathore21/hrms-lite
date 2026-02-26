import type {
  Employee,
  NewEmployee,
  Attendance,
  NewAttendance,
} from "../types";
import { mockEmployees, mockAttendance } from "./mockData";
import { format } from "date-fns";

// ─── In-memory data store (simulates database) ────────────────────────────────
let employees: Employee[] = [...mockEmployees];
let attendance: Attendance[] = [...mockAttendance];
let attendanceCounter = attendance.length + 1;

// ─── Helper: simulate API latency ─────────────────────────────────────────────
const delay = (ms = 600) => new Promise((r) => setTimeout(r, ms));

// ─── Employee Services ─────────────────────────────────────────────────────────
export const employeeService = {
  /** Fetch all employees (simulates GET /api/employees) */
  getAll: async (): Promise<Employee[]> => {
    await delay();
    return [...employees];
  },

  /** Add a new employee (simulates POST /api/employees) */
  add: async (data: NewEmployee): Promise<Employee> => {
    await delay();
    if (employees.find((e) => e.id === data.id)) {
      throw new Error(`Employee ID "${data.id}" already exists.`);
    }
    const newEmployee: Employee = {
      ...data,
      joinDate: format(new Date(), "yyyy-MM-dd"),
      status: "Active",
    };
    employees = [...employees, newEmployee];
    return newEmployee;
  },

  /** Delete an employee (simulates DELETE /api/employees/:id) */
  delete: async (id: string): Promise<void> => {
    await delay();
    employees = employees.filter((e) => e.id !== id);
  },
};

// ─── Attendance Services ───────────────────────────────────────────────────────
export const attendanceService = {
  /** Fetch all attendance records (simulates GET /api/attendance) */
  getAll: async (): Promise<Attendance[]> => {
    await delay();
    return [...attendance];
  },

  /** Add an attendance record (simulates POST /api/attendance) */
  add: async (data: NewAttendance): Promise<Attendance> => {
    await delay();
    const duplicate = attendance.find(
      (a) => a.employeeId === data.employeeId && a.date === data.date,
    );
    if (duplicate) {
      throw new Error(
        "Attendance already recorded for this employee on the selected date.",
      );
    }
    const emp = employees.find((e) => e.id === data.employeeId);
    if (!emp) throw new Error("Employee not found.");

    const newRecord: Attendance = {
      id: `ATT${String(attendanceCounter++).padStart(3, "0")}`,
      employeeId: data.employeeId,
      employeeName: emp.name,
      department: emp.department,
      date: data.date,
      status: data.status,
    };
    attendance = [...attendance, newRecord];
    return newRecord;
  },

  /** Get today's stat counts (simulates GET /api/attendance/stats) */
  getTodayStats: async (): Promise<{ present: number; absent: number }> => {
    await delay(300);
    const today = format(new Date(), "yyyy-MM-dd");
    const todayRecords = attendance.filter((a) => a.date === today);
    return {
      present: todayRecords.filter((a) => a.status === "Present").length,
      absent: todayRecords.filter((a) => a.status === "Absent").length,
    };
  },
};
