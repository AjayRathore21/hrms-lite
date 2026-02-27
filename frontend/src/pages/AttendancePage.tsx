import React, { useEffect, useState } from "react";
import {
  Card,
  Table,
  Button,
  Select,
  DatePicker,
  Form,
  Tag,
  Typography,
  Row,
  Col,
  Alert,
  Empty,
  Space,
  Avatar,
} from "antd";
import {
  PlusOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  HistoryOutlined,
} from "@ant-design/icons";

import { useAttendanceStore } from "../store/useAttendanceStore";
import { useEmployeeStore } from "../store/useEmployeeStore";
import AppLayout from "../layouts/AppLayout";
import type { AttendanceStatus, AttendanceRecord } from "../types";
import toast from "react-hot-toast";
import dayjs from "dayjs";

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
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [filterDate, setFilterDate] = useState<string | null>(null);
  const [filterEmployee, setFilterEmployee] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<AttendanceStatus | null>(
    null,
  );

  useEffect(() => {
    fetchAttendance();
    fetchEmployees();
  }, [fetchAttendance, fetchEmployees]);

  const handleToggleStatus = async (record: AttendanceRecord) => {
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
      toast.error((err as Error).message || "Failed to update attendance");
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setSubmitting(true);
      await addAttendance({
        employeeId: values.employeeId,
        date: dayjs(values.date).format("YYYY-MM-DD"),
        status: values.status,
      });
      toast.success("Attendance recorded successfully!");
      form.resetFields();
    } catch (err: unknown) {
      if (err && typeof err === "object" && "errorFields" in err) return;
      toast.error((err as Error).message || "Failed to record attendance");
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = attendanceRecords.filter((r) => {
    const matchDate = filterDate ? r.date === filterDate : true;
    const matchStatus = filterStatus ? r.status === filterStatus : true;
    const matchEmployee = filterEmployee
      ? r.employeeId === filterEmployee
      : true;
    return matchDate && matchStatus && matchEmployee;
  });

  const sorted = [...filtered].sort((a, b) => b.date.localeCompare(a.date));

  const columns = [
    {
      title: "Employee",
      dataIndex: "employeeName",
      key: "employeeName",
      render: (name: string, record: AttendanceRecord) => (
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
            <Text strong style={{ color: "var(--text-primary)" }}>
              {name}
            </Text>
            <br />
            <Text style={{ fontSize: 12, color: "var(--text-secondary)" }}>
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
      key: "update",
      width: 100,
      render: (_: unknown, record: AttendanceRecord) => (
        <Button
          size="small"
          type="link"
          onClick={() => handleToggleStatus(record)}
          style={{ fontSize: 12, fontWeight: 600 }}
        >
          TOGGLE
        </Button>
      ),
    },
  ];

  return (
    <AppLayout pageTitle="Attendance">
      <div className="page-header" style={{ marginBottom: 32 }}>
        <Title level={2} style={{ margin: 0, fontWeight: 800 }}>
          Attendance Tracking
        </Title>
        <Text type="secondary">
          Monitor and record employee daily presence logs.
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

      <Row gutter={[24, 24]}>
        <Col xs={24} xl={8}>
          <Card
            className="card"
            title={
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div className="icon-badge primary">
                  <CalendarOutlined />
                </div>
                <Text strong style={{ fontSize: 16 }}>
                  Check-in Registry
                </Text>
              </div>
            }
            style={{ position: "sticky", top: 100 }}
          >
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              className="form premium-form"
            >
              <Form.Item
                label="Select Employee"
                name="employeeId"
                rules={[
                  { required: true, message: "Please select an employee" },
                ]}
              >
                <Select
                  size="large"
                  placeholder="Search by name or ID"
                  showSearch
                  optionFilterProp="label"
                  options={employees.map((e) => ({
                    label: `${e.fullName} (${e.employeeId})`,
                    value: e.id,
                  }))}
                />
              </Form.Item>

              <Form.Item
                label="Work Date"
                name="date"
                rules={[{ required: true, message: "Please select a date" }]}
                initialValue={dayjs()}
              >
                <DatePicker
                  size="large"
                  style={{ width: "100%" }}
                  disabledDate={(current) =>
                    current && current > dayjs().endOf("day")
                  }
                />
              </Form.Item>

              <Form.Item
                label="Status"
                name="status"
                rules={[{ required: true, message: "Please select status" }]}
                initialValue="Present"
              >
                <Select
                  size="large"
                  placeholder="Select status"
                  options={[
                    {
                      label: (
                        <Space>
                          <CheckCircleOutlined style={{ color: "#10b981" }} />
                          <span style={{ fontWeight: 600 }}>Present</span>
                        </Space>
                      ),
                      value: "Present",
                    },
                    {
                      label: (
                        <Space>
                          <CloseCircleOutlined style={{ color: "#ef4444" }} />
                          <span style={{ fontWeight: 600 }}>Absent</span>
                        </Space>
                      ),
                      value: "Absent",
                    },
                  ]}
                />
              </Form.Item>

              <Button
                size="large"
                type="primary"
                htmlType="submit"
                loading={submitting}
                block
                icon={<PlusOutlined />}
                className="btn btn--primary"
                style={{ marginTop: 8 }}
              >
                Submit Attendance
              </Button>
            </Form>
          </Card>
        </Col>

        <Col xs={24} xl={16}>
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
                    onChange={(val) => setFilterEmployee(val ?? null)}
                    options={employees.map((e) => ({
                      label: e.fullName,
                      value: e.id,
                    }))}
                  />
                  <DatePicker
                    placeholder="By Date"
                    onChange={(date) =>
                      setFilterDate(
                        date ? dayjs(date).format("YYYY-MM-DD") : null,
                      )
                    }
                    className="form-input"
                  />
                  <Select
                    placeholder="By Status"
                    allowClear
                    style={{ width: 110 }}
                    onChange={(val) =>
                      setFilterStatus((val as AttendanceStatus) ?? null)
                    }
                    options={[
                      { label: "Present", value: "Present" },
                      { label: "Absent", value: "Absent" },
                    ]}
                  />
                </Space>
              </div>
            }
            styles={{ body: { padding: 0 } }}
          >
            <div className="table-container">
              <Table
                dataSource={sorted}
                columns={columns}
                rowKey="id"
                loading={loading}
                pagination={{
                  pageSize: 8,
                  showSizeChanger: false,
                  className: "custom-pagination",
                }}
              />
              {!loading && sorted.length === 0 && (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description="No records found for this period."
                  style={{ padding: "64px 0" }}
                />
              )}
            </div>
          </Card>
        </Col>
      </Row>
    </AppLayout>
  );
};

export default AttendancePage;
