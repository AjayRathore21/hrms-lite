import React, { useEffect } from "react";
import {
  Row,
  Col,
  Card,
  Statistic,
  Table,
  Tag,
  Skeleton,
  Typography,
} from "antd";
import {
  TeamOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { useEmployeeStore } from "../store/useEmployeeStore";
import { useAttendanceStore } from "../store/useAttendanceStore";
import AppLayout from "../layouts/AppLayout";
import { format } from "date-fns";
import type { AttendanceRecord } from "../types";

const { Text } = Typography;

const DashboardPage: React.FC = () => {
  const { employees, loading: empLoading, fetchEmployees } = useEmployeeStore();
  const {
    attendanceRecords,
    loading: attLoading,
    todayStats,
    fetchAttendance,
    getTodayStats,
  } = useAttendanceStore();

  useEffect(() => {
    fetchEmployees();
    fetchAttendance();
    getTodayStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const recentRecords = [...attendanceRecords]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 8);

  const statCards = [
    {
      title: "Total Employees",
      value: employees.length,
      icon: <TeamOutlined style={{ fontSize: 28, color: "#3b82f6" }} />,
      bg: "linear-gradient(135deg, #eff6ff, #dbeafe)",
      border: "#bfdbfe",
      color: "#1d4ed8",
    },
    {
      title: "Present Today",
      value: todayStats?.present ?? 0,
      icon: <CheckCircleOutlined style={{ fontSize: 28, color: "#16a34a" }} />,
      bg: "linear-gradient(135deg, #f0fdf4, #dcfce7)",
      border: "#bbf7d0",
      color: "#15803d",
    },
    {
      title: "Absent Today",
      value: todayStats?.absent ?? 0,
      icon: <CloseCircleOutlined style={{ fontSize: 28, color: "#dc2626" }} />,
      bg: "linear-gradient(135deg, #fff1f2, #ffe4e6)",
      border: "#fecdd3",
      color: "#b91c1c",
    },
  ];

  const columns = [
    {
      title: "Employee",
      dataIndex: "employeeName",
      key: "employeeName",
      render: (name: string, record: AttendanceRecord) => (
        <div>
          <Text strong>{name}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: 12 }}>
            {record.department}
          </Text>
        </div>
      ),
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (date: string) => (
        <Text>{format(new Date(date + "T00:00:00"), "MMM dd, yyyy")}</Text>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag
          color={status === "Present" ? "success" : "error"}
          style={{ borderRadius: 20, padding: "2px 12px", fontWeight: 600 }}
        >
          {status}
        </Tag>
      ),
    },
  ];

  return (
    <AppLayout pageTitle="Dashboard">
      {/* Stat Cards */}
      <Row gutter={[20, 20]} style={{ marginBottom: 24 }}>
        {statCards.map((card, idx) => (
          <Col xs={24} sm={8} key={idx}>
            {empLoading || attLoading ? (
              <Card style={{ borderRadius: 16 }}>
                <Skeleton active paragraph={{ rows: 1 }} />
              </Card>
            ) : (
              <Card
                style={{
                  borderRadius: 16,
                  background: card.bg,
                  border: `1px solid ${card.border}`,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                }}
                styles={{ body: { padding: "24px 28px" } }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Statistic
                    title={
                      <Text
                        style={{
                          fontSize: 13,
                          color: "#64748b",
                          fontWeight: 500,
                        }}
                      >
                        {card.title}
                      </Text>
                    }
                    value={card.value}
                    valueStyle={{
                      fontSize: 36,
                      fontWeight: 800,
                      color: card.color,
                    }}
                  />
                  <div
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: 14,
                      background: "rgba(255,255,255,0.7)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {card.icon}
                  </div>
                </div>
              </Card>
            )}
          </Col>
        ))}
      </Row>

      {/* Recent Attendance Table */}
      <Card
        title={
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Text strong style={{ fontSize: 16 }}>
              Recent Attendance
            </Text>
            <Tag color="blue" style={{ borderRadius: 12, fontSize: 11 }}>
              Latest 8 records
            </Tag>
          </div>
        }
        style={{ borderRadius: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}
        styles={{ body: { padding: 0 } }}
      >
        {attLoading ? (
          <div style={{ padding: 24 }}>
            <Skeleton active paragraph={{ rows: 5 }} />
          </div>
        ) : (
          <Table
            dataSource={recentRecords}
            columns={columns}
            rowKey="id"
            pagination={false}
            locale={{
              emptyText: (
                <div
                  style={{ padding: 40, textAlign: "center", color: "#94a3b8" }}
                >
                  No attendance records yet.
                </div>
              ),
            }}
          />
        )}
      </Card>
    </AppLayout>
  );
};

export default DashboardPage;
