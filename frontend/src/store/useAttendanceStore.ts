import { create } from "zustand";
import type { NewAttendance, AttendanceRecord } from "../types";
import { attendanceService } from "../services/api";

interface AttendanceState {
  attendanceRecords: AttendanceRecord[];
  loading: boolean;
  error: string | null;
  todayStats: { present: number; absent: number } | null;
  fetchAttendance: () => Promise<void>;
  addAttendance: (data: NewAttendance) => Promise<void>;
  updateAttendance: (id: string, data: NewAttendance) => Promise<void>;
  getTodayStats: () => Promise<void>;
}

/** Zustand store for managing attendance state. */
export const useAttendanceStore = create<AttendanceState>((set) => ({
  attendanceRecords: [],
  loading: false,
  error: null,
  todayStats: null,

  fetchAttendance: async () => {
    set({ loading: true, error: null });
    try {
      const data = await attendanceService.getAll();
      set({ attendanceRecords: data, loading: false });
    } catch (err) {
      set({ error: (err as Error).message, loading: false });
    }
  },

  addAttendance: async (data: NewAttendance) => {
    set({ loading: true, error: null });
    try {
      await attendanceService.add(data);
      // Re-fetch all because we need the joined employee details for the new record
      const updatedData = await attendanceService.getAll();
      set({ attendanceRecords: updatedData, loading: false });
    } catch (err) {
      set({ error: (err as Error).message, loading: false });
      throw err;
    }
  },

  updateAttendance: async (id: string, data: NewAttendance) => {
    set({ loading: true, error: null });
    try {
      await attendanceService.update(id, data);
      const updatedData = await attendanceService.getAll();
      set({ attendanceRecords: updatedData, loading: false });
    } catch (err) {
      set({ error: (err as Error).message, loading: false });
      throw err;
    }
  },

  getTodayStats: async () => {
    try {
      const stats = await attendanceService.getTodayStats();
      set({ todayStats: stats });
    } catch (err) {
      set({ error: (err as Error).message });
    }
  },
}));
