// ─── Employee Types ───────────────────────────────────────────────────────────
export interface Employee {
  id: string; // Internal database ID (UUID)
  employeeId: string; // Unique employee identifier
  fullName: string;
  email: string;
  department: string;
  createdAt: string;
  updatedAt: string;
}

export interface NewEmployee {
  employeeId: string;
  fullName: string;
  email: string;
  department: string;
}

// ─── Attendance Types ─────────────────────────────────────────────────────────
export type AttendanceStatus = "Present" | "Absent";

export interface Attendance {
  id: string;
  employeeId: string;
  date: string;
  status: AttendanceStatus;
  createdAt: string;
  updatedAt: string;
}

export interface NewAttendance {
  employeeId: string;
  status: AttendanceStatus;
  date: string; // ISO string
}

// ─── Extended Types (For UI) ──────────────────────────────────────────────────
export interface AttendanceRecord extends Attendance {
  employeeName: string;
  department: string;
}

// ─── Dashboard Stats ──────────────────────────────────────────────────────────
export interface DashboardStats {
  totalEmployees: number;
  presentToday: number;
  absentToday: number;
}
