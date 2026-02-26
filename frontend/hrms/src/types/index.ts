// ─── Employee Types ───────────────────────────────────────────────────────────
export interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  position: string;
  phone: string;
  joinDate: string;
  status: "Active" | "Inactive";
}

export type NewEmployee = Omit<Employee, "joinDate" | "status">;

// ─── Attendance Types ─────────────────────────────────────────────────────────
export type AttendanceStatus = "Present" | "Absent";

export interface Attendance {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  date: string;
  status: AttendanceStatus;
}

export type NewAttendance = Omit<
  Attendance,
  "id" | "employeeName" | "department"
>;

// ─── Dashboard Stats ──────────────────────────────────────────────────────────
export interface DashboardStats {
  totalEmployees: number;
  presentToday: number;
  absentToday: number;
}
