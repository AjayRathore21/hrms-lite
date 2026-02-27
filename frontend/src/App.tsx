import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ConfigProvider, theme as antdTheme } from "antd";
import { Toaster } from "react-hot-toast";
import DashboardPage from "./pages/DashboardPage";
import EmployeePage from "./pages/EmployeePage";
import AttendancePage from "./pages/AttendancePage";
import dayjs from "dayjs";
import weekday from "dayjs/plugin/weekday";
import localeData from "dayjs/plugin/localeData";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useThemeStore } from "./store/useThemeStore";
import "./styles/main.scss";

dayjs.extend(weekday);
dayjs.extend(localeData);
dayjs.extend(customParseFormat);

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
          colorPrimary: "#3b82f6",
          borderRadius: 8,
          fontFamily: "'Inter', system-ui, sans-serif",
          colorBgLayout: isDark ? "#0f172a" : "#f8fafc",
          colorBgContainer: isDark ? "#1e293b" : "#ffffff",
          colorText: isDark ? "#f8fafc" : "#0f172a",
          colorBorder: isDark ? "#334155" : "#cbd5e1",
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
            headerBg: isDark ? "#1e293b" : "#f1f5f9",
            headerColor: isDark ? "#94a3b8" : "#475569",
            rowHoverBg: isDark ? "#334155" : "#f8fafc",
            borderColor: isDark ? "#334155" : "#cbd5e1",
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

      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3500,
          style: {
            borderRadius: "10px",
            fontSize: "14px",
            fontWeight: 500,
            background: isDark ? "#1e293b" : "#ffffff",
            color: isDark ? "#f8fafc" : "#0f172a",
            border: `1px solid ${isDark ? "#334155" : "#cbd5e1"}`,
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
