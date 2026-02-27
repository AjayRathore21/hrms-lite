import React, { useEffect } from "react";
import { Row, Col, Card, Typography } from "antd";
import {
  TeamOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from "@ant-design/icons";
import { useEmployeeStore } from "../store/useEmployeeStore";
import { useAttendanceStore } from "../store/useAttendanceStore";
import AppLayout from "../layouts/AppLayout";

const { Title, Text } = Typography;

const DashboardPage: React.FC = () => {
  const { employees, fetchEmployees } = useEmployeeStore();
  const { todayStats, fetchAttendance, getTodayStats } = useAttendanceStore();

  useEffect(() => {
    fetchEmployees();
    fetchAttendance();
    getTodayStats();
  }, [fetchEmployees, fetchAttendance, getTodayStats]);

  const statCards = [
    {
      title: "Total Workforce",
      value: employees.length,
      trend: "2.4%",
      trendUp: true,
      icon: <TeamOutlined />,
      iconBg: "linear-gradient(135deg, #0f172a 0%, #334155 100%)",
      color: "#0f172a",
    },
    {
      title: "Active Today",
      value: todayStats?.present ?? 0,
      trend: "1.2%",
      trendUp: true,
      icon: <CheckCircleOutlined />,
      iconBg: "linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)",
      color: "#7c3aed",
    },
    {
      title: "Offline / Absent",
      value: todayStats?.absent ?? 0,
      trend: "0.5%",
      trendUp: false,
      icon: <CloseCircleOutlined />,
      iconBg: "linear-gradient(135deg, #e11d48 0%, #fb7185 100%)",
      color: "#e11d48",
    },
  ];

  return (
    <AppLayout>
      <div className="analytics-header" style={{ marginBottom: 48 }}>
        <Title
          level={1}
          style={{
            fontSize: 42,
            fontWeight: 900,
            marginBottom: 8,
            letterSpacing: "-1px",
          }}
        >
          Analytics Overview
        </Title>
        <Text style={{ fontSize: 16, color: "var(--text-secondary)" }}>
          Real-time metrics and workforce distribution for your organization.
        </Text>
      </div>

      <div>
        <Row gutter={[24, 24]} style={{ marginBottom: 48 }}>
          {statCards.map((card, idx) => (
            <Col xs={24} md={8} key={idx}>
              <div>
                <Card
                  bordered={false}
                  className="card card--hoverable"
                  styles={{ body: { padding: "32px" } }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                    }}
                  >
                    <div>
                      <Text className="card__stat-title">{card.title}</Text>
                      <div className="card__stat-value">{card.value}</div>
                      <div
                        className={`card__stat-trend ${card.trendUp ? "card__stat-trend--up" : "card__stat-trend--down"}`}
                      >
                        {card.trendUp ? (
                          <ArrowUpOutlined />
                        ) : (
                          <ArrowDownOutlined />
                        )}
                        <span>{card.trend}</span>
                        <span
                          style={{
                            color: "var(--text-secondary)",
                            fontWeight: 400,
                          }}
                        >
                          vs last month
                        </span>
                      </div>
                    </div>
                    <div
                      className="card__stat-icon"
                      style={{
                        background: card.iconBg,
                        color: "#fff",
                        boxShadow: `0 8px 16px -4px ${card.color}44`,
                      }}
                    >
                      {card.icon}
                    </div>
                  </div>
                </Card>
              </div>
            </Col>
          ))}
        </Row>
      </div>

      <Row gutter={24}>
        <Col span={24}>
          <Card
            className="card"
            title={
              <Title level={4} style={{ margin: 0 }}>
                Recent Activity
              </Title>
            }
            style={{ minHeight: 400 }}
          >
            <div style={{ padding: "40px", textAlign: "center" }}>
              <div
                style={{
                  margin: "0 auto 24px",
                  width: 64,
                  height: 64,
                  background: "var(--bg-layout)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--text-secondary)",
                  fontSize: 24,
                }}
              >
                📊
              </div>
              <Title level={5} type="secondary">
                Dynamic charts and logs will appear here
              </Title>
              <Text type="secondary">
                Start adding data to generate detailed workforce insights.
              </Text>
            </div>
          </Card>
        </Col>
      </Row>
    </AppLayout>
  );
};

export default DashboardPage;
