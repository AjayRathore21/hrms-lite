import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ConfigProvider, theme as antdTheme } from "antd";
import { Toaster } from "react-hot-toast";
import DashboardPage from "./pages/DashboardPage";
import EmployeePage from "./pages/EmployeePage";
import AttendancePage from "./pages/AttendancePage";
import { useThemeStore } from "./store/useThemeStore";
import "./styles/main.scss";

/**
 * Root application component.
 * Configures Ant Design theme and sets up React Router routes.
 */
const App: React.FC = () => {
  const { theme } = useThemeStore();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // Sync Ant Design with our themes
  const isDark = theme === "dark";

  return (
    <ConfigProvider
      theme={{
        algorithm: isDark
          ? antdTheme.darkAlgorithm
          : antdTheme.defaultAlgorithm,
        token: {
          colorPrimary: isDark ? "#3b82f6" : "#000000",
          borderRadius: 20,
          fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
          colorBgLayout: isDark ? "#0f172a" : "#fdfdf4",
          colorBgContainer: isDark ? "#1e293b" : "#ffffff",
          colorText: isDark ? "#f8fafc" : "#000000",
          colorBorder: isDark ? "#334155" : "#f1f5f9",
        },
        components: {
          Layout: {
            headerBg: "transparent",
            headerPadding: "0 40px",
          },
          Card: {
            borderRadius: 24,
            boxShadow: isDark
              ? "0 4px 12px rgba(0,0,0,0.2)"
              : "0 4px 12px rgba(0,0,0,0.03)",
            headerBg: "transparent",
            colorBgContainer: isDark ? "#1e293b" : "#ffffff",
          },
          Table: {
            headerBg: isDark ? "#1e293b" : "#fdfdf4",
            headerColor: isDark ? "#94a3b8" : "#64748b",
            rowHoverBg: isDark ? "#334155" : "#f9fbf1",
            borderColor: isDark ? "#334155" : "#f1f5f9",
          },
          Button: {
            borderRadius: 8,
            controlHeight: 38,
            fontWeight: 600,
          },
          Input: {
            borderRadius: 8,
            controlHeight: 38,
          },
          Select: {
            borderRadius: 8,
            controlHeight: 38,
          },
        },
      }}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/employees" replace />} />
          <Route path="/employees" element={<EmployeePage />} />
          <Route path="/attendance" element={<AttendancePage />} />
          <Route path="/analytics" element={<DashboardPage />} />
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/employees" replace />} />
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
            background: isDark ? "#1e293b" : "#ffffff",
            color: isDark ? "#f8fafc" : "#000000",
            border: `1px solid ${isDark ? "#334155" : "#f1f5f9"}`,
          },
          success: {
            iconTheme: { primary: "#10b981", secondary: "#fff" },
          },
          error: {
            iconTheme: { primary: "#ef4444", secondary: "#fff" },
          },
        }}
      />
    </ConfigProvider>
  );
};

export default App;
