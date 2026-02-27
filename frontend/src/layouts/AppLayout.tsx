import React, { useState, useEffect } from "react";
import { Layout, Avatar, Dropdown, Button } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { UserOutlined, SunOutlined, MoonOutlined } from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";
import { useThemeStore } from "../store/useThemeStore";

const { Header, Content } = Layout;

const menuItems = [
  { key: "/employees", label: "Employees" },
  { key: "/attendance", label: "Attendance" },
  { key: "/analytics", label: "Analytics" },
];

interface AppLayoutProps {
  children: React.ReactNode;
  pageTitle?: string;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useThemeStore();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const adminMenu = {
    items: [
      { key: "profile", label: "Profile" },
      { key: "settings", label: "Settings" },
    ],
  };

  return (
    <Layout className="app-layout">
      {/* ── Top Header ─────────────────────────────────────────────────── */}
      <Header
        className={`app-layout__header ${scrolled ? "app-layout__header--scrolled" : ""}`}
      >
        {/* Logo */}
        <div
          className="app-layout__logo"
          onClick={() => navigate("/employees")}
        >
          HRMS<span>.</span>
        </div>

        {/* Centered Navigation */}
        <nav className="app-layout__nav">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.key;
            return (
              <div
                key={item.key}
                className={`app-layout__nav-item ${isActive ? "app-layout__nav-item--active" : ""}`}
                onClick={() => navigate(item.key)}
              >
                {item.label}
              </div>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="app-layout__actions">
          <Button
            type="text"
            icon={theme === "light" ? <MoonOutlined /> : <SunOutlined />}
            onClick={toggleTheme}
            style={{ fontSize: "18px", color: "var(--text-primary)" }}
          />
          <Dropdown menu={adminMenu} trigger={["click"]}>
            <Avatar
              size={36}
              icon={<UserOutlined />}
              className="app-layout__avatar"
              style={{
                cursor: "pointer",
                background: "var(--avatar-bg)",
                border: "2px solid #fff",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              }}
            />
          </Dropdown>
        </div>
      </Header>

      {/* ── Main Content with Transitions ───────────────────────────────── */}
      <Content className="app-layout__content">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </Content>
    </Layout>
  );
};

export default AppLayout;
