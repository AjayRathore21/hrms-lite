import React, { useState } from "react";
import { Layout, Menu, Typography, Badge, Avatar, Dropdown } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import {
  DashboardOutlined,
  TeamOutlined,
  CalendarOutlined,
  UserOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DownOutlined,
} from "@ant-design/icons";
import { format } from "date-fns";

const { Sider, Content, Header } = Layout;
const { Text } = Typography;

const menuItems = [
  { key: "/", icon: <DashboardOutlined />, label: "Dashboard" },
  { key: "/employees", icon: <TeamOutlined />, label: "Employees" },
  { key: "/attendance", icon: <CalendarOutlined />, label: "Attendance" },
];

interface AppLayoutProps {
  children: React.ReactNode;
  pageTitle: string;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children, pageTitle }) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const adminMenu = {
    items: [
      { key: "profile", label: "Profile" },
      { key: "settings", label: "Settings" },
    ],
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* ── Sidebar ─────────────────────────────────────────────────────── */}
      <Sider
        collapsible
        collapsed={collapsed}
        trigger={null}
        width={230}
        style={{
          background: "#0f172a",
          boxShadow: "2px 0 8px rgba(0,0,0,0.15)",
          position: "fixed",
          height: "100vh",
          left: 0,
          top: 0,
          zIndex: 100,
        }}
      >
        {/* Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: collapsed ? "20px 16px" : "20px 24px",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            marginBottom: 8,
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: "linear-gradient(135deg, #3b82f6, #6366f1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <TeamOutlined style={{ color: "#fff", fontSize: 18 }} />
          </div>
          {!collapsed && (
            <div>
              <div
                style={{
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: 16,
                  lineHeight: 1.2,
                }}
              >
                HRMS Lite
              </div>
              <div style={{ color: "#94a3b8", fontSize: 11 }}>Admin Panel</div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          onClick={({ key }) => navigate(key)}
          items={menuItems}
          style={{
            background: "transparent",
            border: "none",
            padding: "0 8px",
          }}
          theme="dark"
        />

        {/* Collapse Trigger */}
        <div
          onClick={() => setCollapsed(!collapsed)}
          style={{
            position: "absolute",
            bottom: 24,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              background: "rgba(255,255,255,0.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#94a3b8",
              transition: "all 0.2s",
            }}
          >
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </div>
        </div>
      </Sider>

      {/* ── Main Content ─────────────────────────────────────────────────── */}
      <Layout
        style={{
          marginLeft: collapsed ? 80 : 230,
          transition: "margin-left 0.2s",
        }}
      >
        {/* Top Header */}
        <Header
          style={{
            background: "#fff",
            padding: "0 28px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
            position: "sticky",
            top: 0,
            zIndex: 99,
            height: 64,
          }}
        >
          <div>
            <Text style={{ fontSize: 20, fontWeight: 700, color: "#0f172a" }}>
              {pageTitle}
            </Text>
            <br />
            <Text type="secondary" style={{ fontSize: 12 }}>
              {format(new Date(), "EEEE, MMMM dd, yyyy")}
            </Text>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Badge count={3} size="small">
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  background: "#f1f5f9",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              ></div>
            </Badge>

            <Dropdown menu={adminMenu} trigger={["click"]}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  cursor: "pointer",
                  padding: "6px 12px",
                  borderRadius: 8,
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                }}
              >
                <Avatar
                  size={30}
                  icon={<UserOutlined />}
                  style={{
                    background: "linear-gradient(135deg, #3b82f6, #6366f1)",
                  }}
                />
                <Text strong style={{ fontSize: 14 }}>
                  Admin
                </Text>
                <DownOutlined style={{ fontSize: 10, color: "#94a3b8" }} />
              </div>
            </Dropdown>
          </div>
        </Header>

        {/* Page Content */}
        <Content
          style={{
            background: "#f1f5f9",
            padding: 28,
            minHeight: "calc(100vh - 64px)",
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
