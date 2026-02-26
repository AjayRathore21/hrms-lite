import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ConfigProvider } from "antd";
import { Toaster } from "react-hot-toast";
import DashboardPage from "./pages/DashboardPage";
import EmployeePage from "./pages/EmployeePage";
import AttendancePage from "./pages/AttendancePage";

/**
 * Root application component.
 * Configures Ant Design theme and sets up React Router routes.
 */
const App: React.FC = () => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#3b82f6",
          borderRadius: 8,
          fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
          colorBgLayout: "#f1f5f9",
        },
        components: {
          Menu: {
            darkItemSelectedBg: "rgba(59,130,246,0.2)",
            darkItemSelectedColor: "#60a5fa",
            darkItemColor: "#94a3b8",
            darkItemHoverBg: "rgba(255,255,255,0.06)",
            darkItemHoverColor: "#e2e8f0",
          },
          Table: {
            headerBg: "#f8fafc",
            headerColor: "#64748b",
            rowHoverBg: "#f8fafc",
            borderColor: "#f1f5f9",
          },
          Card: {
            headerBg: "#fff",
          },
        },
      }}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/employees" element={<EmployeePage />} />
          <Route path="/attendance" element={<AttendancePage />} />
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>

      {/* Global toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            borderRadius: "10px",
            fontSize: "14px",
            fontWeight: 500,
          },
          success: {
            iconTheme: { primary: "#16a34a", secondary: "#fff" },
          },
          error: {
            iconTheme: { primary: "#dc2626", secondary: "#fff" },
          },
        }}
      />
    </ConfigProvider>
  );
};

export default App;
