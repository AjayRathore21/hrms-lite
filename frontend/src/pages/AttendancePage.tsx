import React, { useEffect, useState } from "react";
import {
  Card,
  Table,
  Input,
  Select,
  Tag,
  Typography,
  Row,
  Col,
  Alert,
  Empty,
  Space,
  Avatar,
  DatePicker,
} from "antd";
import {
  SearchOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  HistoryOutlined,
  TeamOutlined,
} from "@ant-design/icons";

import { useAttendanceStore } from "../store/useAttendanceStore";
import { useEmployeeStore } from "../store/useEmployeeStore";
import AppLayout from "../layouts/AppLayout";
import type { Employee, AttendanceStatus, AttendanceRecord } from "../types";
import toast from "react-hot-toast";
import dayjs from "dayjs";

const DEPARTMENTS = [
  "Engineering",
  "Design",
  "Operations",
  "Human Resources",
  "Marketing",
  "Sales",
  "Product",
];

const { Text, Title } = Typography;

const AttendancePage: React.FC = () => {
  const {
    attendanceRecords,
    loading,
    error,
    fetchAttendance,
    addAttendance,
    updateAttendance,
  } = useAttendanceStore();
  const { employees, fetchEmployees } = useEmployeeStore();

  // ── Filters for "Mark Attendance" section ───────────────────
  const [searchText, setSearchText] = useState("");
  const [filterDept, setFilterDept] = useState<string | null>(null);
  const [rowLoading, setRowLoading] = useState<Record<string, boolean>>({});

  // ── Filters for "History" section ───────────────────────────
  const [historyEmployee, setHistoryEmployee] = useState<string | null>(null);
  const [historyDate, setHistoryDate] = useState<string | null>(null);
  const [historyStatus, setHistoryStatus] = useState<AttendanceStatus | null>(
    null,
  );

  const today = dayjs().format("YYYY-MM-DD");

  useEffect(() => {
    fetchAttendance();
    fetchEmployees();
  }, [fetchAttendance, fetchEmployees]);

  // ── Build today's attendance lookup ─────────────────────────
  const todayMap = new Map(
    attendanceRecords
      .filter((r) => r.date.startsWith(today))
      .map((r) => [r.employeeId, r]),
  );

  // ── Filter employees for the marking table ──────────────────
  const filteredEmployees = employees.filter((e) => {
    const matchSearch =
      searchText === "" ||
      e.fullName.toLowerCase().includes(searchText.toLowerCase()) ||
      e.employeeId.toLowerCase().includes(searchText.toLowerCase());
    const matchDept = filterDept ? e.department === filterDept : true;
    return matchSearch && matchDept;
  });

  // ── Filter history records ──────────────────────────────────
  const filteredHistory = attendanceRecords.filter((r) => {
    const matchEmployee = historyEmployee
      ? r.employeeId === historyEmployee
      : true;
    const matchDate = historyDate ? r.date.startsWith(historyDate) : true;
    const matchStatus = historyStatus ? r.status === historyStatus : true;
    return matchEmployee && matchDate && matchStatus;
  });
  const sortedHistory = [...filteredHistory].sort((a, b) =>
    b.date.localeCompare(a.date),
  );

  // ── Handle attendance mark / update ─────────────────────────
  const handleMarkAttendance = async (
    employee: Employee,
    status: AttendanceStatus,
  ) => {
    const existing = todayMap.get(employee.id);
    setRowLoading((prev) => ({ ...prev, [employee.id]: true }));
    try {
      if (existing) {
        await updateAttendance(existing.id, {
          employeeId: employee.id,
          date: today,
          status,
        });
        toast.success(`${employee.fullName} → ${status}`);
      } else {
        await addAttendance({
          employeeId: employee.id,
          date: today,
          status,
        });
        toast.success(`${employee.fullName} marked ${status}`);
      }
    } catch (err: unknown) {
      toast.error((err as Error).message || "Failed to mark attendance");
    } finally {
      setRowLoading((prev) => ({ ...prev, [employee.id]: false }));
    }
  };

  // ── Handle history record toggle ────────────────────────────
  const handleToggleHistory = async (record: AttendanceRecord) => {
    const newStatus: AttendanceStatus =
      record.status === "Present" ? "Absent" : "Present";
    try {
      await updateAttendance(record.id, {
        employeeId: record.employeeId,
        date: record.date,
        status: newStatus,
      });
      toast.success(`Updated to ${newStatus}`);
    } catch (err: unknown) {
      toast.error((err as Error).message || "Failed to update");
    }
  };

  // ── Columns: Mark Today's Attendance ────────────────────────
  const markColumns = [
    {
      title: "Employee ID",
      dataIndex: "employeeId",
      key: "employeeId",
      width: 130,
      render: (id: string) => <span className="employee-id-badge">{id}</span>,
    },
    {
      title: "Full Name",
      dataIndex: "fullName",
      key: "fullName",
      render: (name: string, record: Employee) => (
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Avatar
            size={36}
            style={{
              background: "var(--avatar-bg)",
              fontWeight: 700,
              fontSize: 14,
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            {name.charAt(0)}
          </Avatar>
          <div>
            <Text strong style={{ fontSize: 13, color: "var(--text-primary)" }}>
              {name}
            </Text>
            <br />
            <Text style={{ fontSize: 11, color: "var(--text-secondary)" }}>
              {record.email}
            </Text>
          </div>
        </div>
      ),
    },
    {
      title: "Department",
      dataIndex: "department",
      key: "department",
      render: (dept: string) => {
        const colors: Record<string, string> = {
          Engineering: "blue",
          Design: "purple",
          Operations: "orange",
          "Human Resources": "magenta",
          Marketing: "volcano",
          Sales: "gold",
          Product: "cyan",
        };
        return (
          <Tag
            color={colors[dept] || "default"}
            style={{
              borderRadius: 12,
              padding: "2px 12px",
              border: "none",
              fontWeight: 600,
            }}
          >
            {dept}
          </Tag>
        );
      },
    },
    {
      title: "Joined On",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => (
        <Text style={{ color: "var(--text-secondary)", fontSize: 13 }}>
          {dayjs(date).isValid() ? dayjs(date).format("MMM DD, YYYY") : "—"}
        </Text>
      ),
    },
    {
      title: "Today's Status",
      key: "todayStatus",
      width: 190,
      render: (_: unknown, record: Employee) => {
        const att = todayMap.get(record.id);
        return (
          <Select
            size="small"
            value={att?.status ?? undefined}
            placeholder="Mark Attendance"
            loading={rowLoading[record.id]}
            style={{ width: 170 }}
            onChange={(val) =>
              handleMarkAttendance(record, val as AttendanceStatus)
            }
            options={[
              {
                label: (
                  <Space>
                    <CheckCircleOutlined style={{ color: "#10b981" }} />
                    <span>Present</span>
                  </Space>
                ),
                value: "Present",
              },
              {
                label: (
                  <Space>
                    <CloseCircleOutlined style={{ color: "#ef4444" }} />
                    <span>Absent</span>
                  </Space>
                ),
                value: "Absent",
              },
            ]}
          />
        );
      },
    },
  ];

  // ── Columns: Attendance History ─────────────────────────────
  const historyColumns = [
    {
      title: "Employee",
      dataIndex: "employeeName",
      key: "employeeName",
      render: (name: string, record: AttendanceRecord) => (
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Avatar
            size={32}
            style={{
              background: "var(--avatar-bg)",
              fontWeight: 700,
              fontSize: 13,
            }}
          >
            {name?.charAt(0) ?? "?"}
          </Avatar>
          <div>
            <Text strong style={{ color: "var(--text-primary)", fontSize: 13 }}>
              {name}
            </Text>
            <br />
            <Text style={{ fontSize: 11, color: "var(--text-secondary)" }}>
              {record.department}
            </Text>
          </div>
        </div>
      ),
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      width: 180,
      render: (date: string) => (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <CalendarOutlined
            style={{ color: "var(--text-secondary)", fontSize: 13 }}
          />
          <Text style={{ color: "var(--text-primary)", fontSize: 13 }}>
            {dayjs(date).isValid()
              ? dayjs(date).format("MMMM DD, YYYY")
              : "Invalid Date"}
          </Text>
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 140,
      render: (status: AttendanceStatus) => (
        <Tag
          icon={
            status === "Present" ? (
              <CheckCircleOutlined />
            ) : (
              <CloseCircleOutlined />
            )
          }
          color={status === "Present" ? "success" : "error"}
          style={{
            borderRadius: 20,
            padding: "4px 16px",
            fontWeight: 700,
            fontSize: 12,
            border: "none",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}
        >
          {status}
        </Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      width: 150,
      render: (_: unknown, record: AttendanceRecord) => (
        <Select
          size="small"
          value={record.status}
          style={{ width: 130 }}
          onChange={() => handleToggleHistory(record)}
          options={[
            {
              label: (
                <Space>
                  <CheckCircleOutlined style={{ color: "#10b981" }} />
                  <span>Present</span>
                </Space>
              ),
              value: "Present",
            },
            {
              label: (
                <Space>
                  <CloseCircleOutlined style={{ color: "#ef4444" }} />
                  <span>Absent</span>
                </Space>
              ),
              value: "Absent",
            },
          ]}
        />
      ),
    },
  ];

  // ── Count stats ─────────────────────────────────────────────
  const presentCount = Array.from(todayMap.values()).filter(
    (r) => r.status === "Present",
  ).length;
  const absentCount = Array.from(todayMap.values()).filter(
    (r) => r.status === "Absent",
  ).length;
  const unmarkedCount = employees.length - todayMap.size;

  return (
    <AppLayout pageTitle="Attendance">
      <div className="page-header" style={{ marginBottom: 32 }}>
        <Title level={2} style={{ margin: 0, fontWeight: 800 }}>
          Attendance Tracking
        </Title>
        <Text type="secondary">
          Mark daily attendance and view historical records.
        </Text>
      </div>

      {error && (
        <Alert
          type="error"
          message={error}
          showIcon
          style={{ marginBottom: 24, borderRadius: 12 }}
        />
      )}

      {/* ═══════════════════════════════════════════════════════════
          SECTION 1: Mark Today's Attendance
         ═══════════════════════════════════════════════════════════ */}
      <Card
        className="card card--main"
        style={{ marginBottom: 24 }}
        title={
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div className="icon-badge primary">
                <CalendarOutlined />
              </div>
              <div>
                <Text strong style={{ fontSize: 16 }}>
                  Today's Attendance
                </Text>
                <br />
                <Text
                  type="secondary"
                  style={{ fontSize: 12, fontWeight: 400 }}
                >
                  {dayjs().format("dddd, MMMM DD, YYYY")}
                </Text>
              </div>
            </div>

            {/* Mini stats */}
            <Space size={16}>
              <Tag
                color="success"
                icon={<CheckCircleOutlined />}
                style={{
                  borderRadius: 12,
                  fontWeight: 600,
                  padding: "2px 10px",
                }}
              >
                {presentCount} Present
              </Tag>
              <Tag
                color="error"
                icon={<CloseCircleOutlined />}
                style={{
                  borderRadius: 12,
                  fontWeight: 600,
                  padding: "2px 10px",
                }}
              >
                {absentCount} Absent
              </Tag>
              <Tag
                color="default"
                icon={<TeamOutlined />}
                style={{
                  borderRadius: 12,
                  fontWeight: 600,
                  padding: "2px 10px",
                }}
              >
                {unmarkedCount} Unmarked
              </Tag>
            </Space>
          </div>
        }
        styles={{ body: { padding: 0 } }}
      >
        {/* Filter toolbar */}
        <div className="toolbar" style={{ padding: "16px 24px" }}>
          <Row gutter={12}>
            <Col xs={24} sm={12} md={10}>
              <Input
                placeholder="Search by name or Employee ID..."
                prefix={
                  <SearchOutlined style={{ color: "var(--text-secondary)" }} />
                }
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                allowClear
              />
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Select
                placeholder="All Departments"
                allowClear
                showSearch
                optionFilterProp="label"
                style={{ width: "100%" }}
                value={filterDept}
                onChange={(val) => setFilterDept(val ?? null)}
                options={DEPARTMENTS.map((d) => ({ label: d, value: d }))}
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  height: "100%",
                  color: "var(--text-secondary)",
                  fontSize: 13,
                }}
              >
                <TeamOutlined />
                <span>
                  Showing{" "}
                  <strong style={{ color: "var(--text-primary)" }}>
                    {filteredEmployees.length}
                  </strong>{" "}
                  of {employees.length} employees
                </span>
              </div>
            </Col>
          </Row>
        </div>

        {/* Marking table */}
        <div className="table-container">
          <Table
            dataSource={filteredEmployees}
            columns={markColumns}
            rowKey="id"
            loading={loading}
            pagination={{
              pageSize: 10,
              showSizeChanger: false,
              className: "custom-pagination",
            }}
            size="middle"
          />
        </div>
      </Card>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 2: Attendance History
         ═══════════════════════════════════════════════════════════ */}
      <Card
        className="card card--main"
        title={
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div className="icon-badge secondary">
                <HistoryOutlined />
              </div>
              <Text strong style={{ fontSize: 16 }}>
                Attendance History
              </Text>
            </div>
            <Space wrap>
              <Select
                placeholder="By Employee"
                allowClear
                showSearch
                optionFilterProp="label"
                style={{ width: 160 }}
                onChange={(val) => setHistoryEmployee(val ?? null)}
                options={employees.map((e) => ({
                  label: e.fullName,
                  value: e.id,
                }))}
              />
              <DatePicker
                placeholder="By Date"
                style={{ width: 150 }}
                onChange={(date) =>
                  setHistoryDate(date ? dayjs(date).format("YYYY-MM-DD") : null)
                }
              />
              <Select
                placeholder="By Status"
                allowClear
                style={{ width: 140 }}
                onChange={(val) =>
                  setHistoryStatus((val as AttendanceStatus) ?? null)
                }
                options={[
                  {
                    label: (
                      <Space>
                        <CheckCircleOutlined style={{ color: "#10b981" }} />
                        <span>Present</span>
                      </Space>
                    ),
                    value: "Present",
                  },
                  {
                    label: (
                      <Space>
                        <CloseCircleOutlined style={{ color: "#ef4444" }} />
                        <span>Absent</span>
                      </Space>
                    ),
                    value: "Absent",
                  },
                ]}
              />
            </Space>
          </div>
        }
        styles={{ body: { padding: 0 } }}
      >
        <div className="table-container">
          <Table
            dataSource={sortedHistory}
            columns={historyColumns}
            rowKey="id"
            loading={loading}
            pagination={{
              pageSize: 8,
              showSizeChanger: false,
              className: "custom-pagination",
            }}
          />
          {!loading && sortedHistory.length === 0 && (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="No records found."
              style={{ padding: "64px 0" }}
            />
          )}
        </div>
      </Card>
    </AppLayout>
  );
};

export default AttendancePage;
