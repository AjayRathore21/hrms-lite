import { create } from "zustand";
import type { Employee, NewEmployee } from "../types";
import { employeeService } from "../services/api";

interface EmployeeState {
  employees: Employee[];
  loading: boolean;
  error: string | null;
  fetchEmployees: () => Promise<void>;
  addEmployee: (data: NewEmployee) => Promise<void>;
  deleteEmployee: (id: string) => Promise<void>;
}

/** Zustand store for managing employee state. */
export const useEmployeeStore = create<EmployeeState>((set) => ({
  employees: [],
  loading: false,
  error: null,

  fetchEmployees: async () => {
    set({ loading: true, error: null });
    try {
      const data = await employeeService.getAll();
      set({ employees: data, loading: false });
    } catch (err) {
      set({ error: (err as Error).message, loading: false });
    }
  },

  addEmployee: async (data: NewEmployee) => {
    set({ loading: true, error: null });
    try {
      const newEmp = await employeeService.add(data);
      set((state) => ({
        employees: [...state.employees, newEmp],
        loading: false,
      }));
    } catch (err) {
      set({ error: (err as Error).message, loading: false });
      throw err;
    }
  },

  deleteEmployee: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await employeeService.delete(id);
      set((state) => ({
        employees: state.employees.filter((e) => e.id !== id),
        loading: false,
      }));
    } catch (err) {
      set({ error: (err as Error).message, loading: false });
      throw err;
    }
  },
}));
