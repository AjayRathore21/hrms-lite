import axios from "axios";
import type {
  Employee,
  NewEmployee,
  Attendance,
  NewAttendance,
  AttendanceRecord,
} from "../types";
import { format } from "date-fns";

const API_BASE_URL = "http://localhost:8000/api/v1";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ─── Employee Services ─────────────────────────────────────────────────────────
export const employeeService = {
  /** Fetch all employees */
  getAll: async (): Promise<Employee[]> => {
    const response = await apiClient.get<Employee[]>("/employees/");
    return response.data;
  },

  /** Add a new employee */
  add: async (data: NewEmployee): Promise<Employee> => {
    try {
      const response = await apiClient.post<Employee>("/employees/", data);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.detail || "Failed to add employee";
      throw new Error(message);
    }
  },

  /** Delete an employee */
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/employees/${id}`);
  },
};

// ─── Attendance Services ───────────────────────────────────────────────────────
export const attendanceService = {
  /** Fetch all attendance records */
  getAll: async (): Promise<AttendanceRecord[]> => {
    // In a real app, we might join this on the backend.
    // For now, we fetch both and join or handle it in the store.
    const [attendanceResp, employeesResp] = await Promise.all([
      apiClient.get<Attendance[]>("/attendance/"),
      apiClient.get<Employee[]>("/employees/"),
    ]);

    const employees = employeesResp.data;
    return attendanceResp.data.map((record) => {
      const emp = employees.find((e) => e.id === record.employeeId);
      return {
        ...record,
        employeeName: emp?.fullName || "Unknown",
        department: emp?.department || "N/A",
      };
    });
  },

  /** Add an attendance record */
  add: async (data: NewAttendance): Promise<Attendance> => {
    try {
      const response = await apiClient.post<Attendance>("/attendance/", data);
      return response.data;
    } catch (error: any) {
      const message =
        error.response?.data?.detail || "Failed to mark attendance";
      throw new Error(message);
    }
  },

  /** Get today's stat counts */
  getTodayStats: async (): Promise<{ present: number; absent: number }> => {
    const response = await apiClient.get<Attendance[]>("/attendance/");
    const today = format(new Date(), "yyyy-MM-dd");
    const todayRecords = response.data.filter((a) => a.date.startsWith(today));

    return {
      present: todayRecords.filter((a) => a.status === "Present").length,
      absent: todayRecords.filter((a) => a.status === "Absent").length,
    };
  },

  /** Update an attendance record */
  update: async (id: string, data: NewAttendance): Promise<Attendance> => {
    try {
      const response = await apiClient.put<Attendance>(
        `/attendance/${id}`,
        data,
      );
      return response.data;
    } catch (error: any) {
      const message =
        error.response?.data?.detail || "Failed to update attendance";
      throw new Error(message);
    }
  },
};
