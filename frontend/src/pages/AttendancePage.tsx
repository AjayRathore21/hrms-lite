import React, { useEffect, useState } from "react";
import {
  Card,
  Table,
  Button,
  Select,
  DatePicker,
  Form,
  Tag,
  Skeleton,
  Typography,
  Row,
  Col,
  Alert,
  Empty,
  Space,
} from "antd";
import {
  PlusOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { useAttendanceStore } from "../store/useAttendanceStore";
import { useEmployeeStore } from "../store/useEmployeeStore";
import AppLayout from "../layouts/AppLayout";
import type { AttendanceStatus, AttendanceRecord } from "../types";
import toast from "react-hot-toast";
import { format } from "date-fns";
import dayjs from "dayjs";

const { Text } = Typography;

const AttendancePage: React.FC = () => {
  const { attendanceRecords, loading, error, fetchAttendance, addAttendance } =
    useAttendanceStore();
  const { employees, fetchEmployees } = useEmployeeStore();
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [filterDate, setFilterDate] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<AttendanceStatus | null>(
    null,
  );

  useEffect(() => {
    fetchAttendance();
    fetchEmployees();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    return matchDate && matchStatus;
  });

  const sorted = [...filtered].sort((a, b) => b.date.localeCompare(a.date));

  const columns = [
    {
      title: "Employee",
      dataIndex: "employeeName",
      key: "employeeName",
      render: (name: string, record: AttendanceRecord) => (
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 9,
              background: "linear-gradient(135deg, #3b82f6, #6366f1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontWeight: 700,
              fontSize: 13,
              flexShrink: 0,
            }}
          >
            {name.charAt(0)}
          </div>
          <div>
            <Text strong>{name}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: 12 }}>
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
        <Text>{format(new Date(date + "T00:00:00"), "MMM dd, yyyy")}</Text>
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
            padding: "3px 14px",
            fontWeight: 600,
            fontSize: 13,
          }}
        >
          {status}
        </Tag>
      ),
    },
  ];

  return (
    <AppLayout pageTitle="Attendance">
      {error && (
        <Alert
          type="error"
          message={error}
          showIcon
          style={{ marginBottom: 20, borderRadius: 10 }}
        />
      )}

      <Row gutter={[20, 20]}>
        {/* Mark Attendance Form */}
        <Col xs={24} lg={8}>
          <Card
            title={
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    background: "linear-gradient(135deg, #3b82f6, #6366f1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <CalendarOutlined style={{ color: "#fff", fontSize: 15 }} />
                </div>
                <Text strong style={{ fontSize: 15 }}>
                  Mark Attendance
                </Text>
              </div>
            }
            style={{
              borderRadius: 16,
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              position: "sticky",
              top: 80,
            }}
          >
            <Form form={form} layout="vertical" onFinish={handleSubmit}>
              <Form.Item
                label="Employee"
                name="employeeId"
                rules={[
                  { required: true, message: "Please select an employee" },
                ]}
              >
                <Select
                  placeholder="Select employee"
                  showSearch
                  optionFilterProp="label"
                  options={employees.map((e) => ({
                    label: `${e.fullName} (${e.employeeId})`,
                    value: e.id,
                  }))}
                />
              </Form.Item>

              <Form.Item
                label="Date"
                name="date"
                rules={[{ required: true, message: "Please select a date" }]}
              >
                <DatePicker
                  style={{ width: "100%", borderRadius: 8 }}
                  disabledDate={(current) =>
                    current && current > dayjs().endOf("day")
                  }
                  format="YYYY-MM-DD"
                />
              </Form.Item>

              <Form.Item
                label="Status"
                name="status"
                rules={[{ required: true, message: "Please select status" }]}
              >
                <Select
                  placeholder="Select status"
                  options={[
                    {
                      label: (
                        <span>
                          <CheckCircleOutlined
                            style={{ color: "#16a34a", marginRight: 8 }}
                          />
                          Present
                        </span>
                      ),
                      value: "Present",
                    },
                    {
                      label: (
                        <span>
                          <CloseCircleOutlined
                            style={{ color: "#dc2626", marginRight: 8 }}
                          />
                          Absent
                        </span>
                      ),
                      value: "Absent",
                    },
                  ]}
                />
              </Form.Item>

              <Button
                type="primary"
                htmlType="submit"
                loading={submitting}
                block
                icon={<PlusOutlined />}
                style={{
                  borderRadius: 8,
                  height: 40,
                  background: "linear-gradient(135deg, #3b82f6, #6366f1)",
                  border: "none",
                  fontWeight: 600,
                  marginTop: 4,
                }}
              >
                Submit Attendance
              </Button>
            </Form>
          </Card>
        </Col>

        {/* Attendance Records Table */}
        <Col xs={24} lg={16}>
          <Card
            title={
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: 12,
                }}
              >
                <Text strong style={{ fontSize: 15 }}>
                  Attendance Records
                </Text>
                <Space wrap>
                  <DatePicker
                    placeholder="Filter by date"
                    format="YYYY-MM-DD"
                    onChange={(date) =>
                      setFilterDate(
                        date ? dayjs(date).format("YYYY-MM-DD") : null,
                      )
                    }
                    style={{ borderRadius: 8 }}
                    allowClear
                  />
                  <Select
                    placeholder="All statuses"
                    allowClear
                    style={{ width: 140 }}
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
            style={{
              borderRadius: 16,
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            }}
            styles={{ body: { padding: 0 } }}
          >
            {loading ? (
              <div style={{ padding: 24 }}>
                <Skeleton active paragraph={{ rows: 6 }} />
              </div>
            ) : sorted.length === 0 ? (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="No attendance records found."
                style={{ padding: "48px 0" }}
              />
            ) : (
              <Table
                dataSource={sorted}
                columns={columns}
                rowKey="id"
                pagination={{
                  pageSize: 8,
                  showSizeChanger: false,
                  showTotal: (t) => `${t} records`,
                }}
              />
            )}
          </Card>
        </Col>
      </Row>
    </AppLayout>
  );
};

export default AttendancePage;
