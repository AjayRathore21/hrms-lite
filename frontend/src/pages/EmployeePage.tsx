import React, { useEffect, useState } from "react";
import {
  Card,
  Table,
  Button,
  Input,
  Select,
  Modal,
  Form,
  Tag,
  Skeleton,
  Typography,
  Row,
  Col,
  Popconfirm,
  Alert,
  Empty,
  Tooltip,
} from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  DeleteOutlined,
  UserOutlined,
  TeamOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { useEmployeeStore } from "../store/useEmployeeStore";
import AppLayout from "../layouts/AppLayout";
import { DEPARTMENTS } from "../services/mockData";
import type { Employee, NewEmployee } from "../types";
import toast from "react-hot-toast";

const { Text } = Typography;

const EmployeePage: React.FC = () => {
  const {
    employees,
    loading,
    error,
    fetchEmployees,
    addEmployee,
    deleteEmployee,
  } = useEmployeeStore();
  const [searchText, setSearchText] = useState("");
  const [selectedDept, setSelectedDept] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchEmployees();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = employees.filter((e) => {
    const matchSearch =
      e.fullName.toLowerCase().includes(searchText.toLowerCase()) ||
      e.email.toLowerCase().includes(searchText.toLowerCase()) ||
      e.employeeId.toLowerCase().includes(searchText.toLowerCase());
    const matchDept = selectedDept ? e.department === selectedDept : true;
    return matchSearch && matchDept;
  });

  const handleAdd = async () => {
    try {
      const values = await form.validateFields();
      setSubmitting(true);
      await addEmployee(values as NewEmployee);
      toast.success(`Employee "${values.fullName}" added successfully!`);
      form.resetFields();
      setModalOpen(false);
    } catch (err: unknown) {
      if (err && typeof err === "object" && "errorFields" in err) return;
      toast.error((err as Error).message || "Failed to add employee");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    try {
      await deleteEmployee(id);
      toast.success(`"${name}" removed successfully.`);
    } catch (err: unknown) {
      toast.error((err as Error).message || "Failed to delete employee");
    }
  };

  const columns = [
    {
      title: "Employee ID",
      dataIndex: "employeeId",
      key: "employeeId",
      width: 120,
      render: (id: string) => (
        <Tag style={{ borderRadius: 6, fontSize: 12, fontFamily: "monospace" }}>
          {id}
        </Tag>
      ),
    },
    {
      title: "Full Name",
      dataIndex: "fullName",
      key: "fullName",
      render: (name: string, record: Employee) => (
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: "linear-gradient(135deg, #3b82f6, #6366f1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontWeight: 700,
              fontSize: 14,
              flexShrink: 0,
            }}
          >
            {name.charAt(0)}
          </div>
          <div>
            <Text strong>{name}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: 12 }}>
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
      render: (dept: string) => (
        <Tag color="blue" style={{ borderRadius: 12, padding: "2px 10px" }}>
          {dept}
        </Tag>
      ),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Action",
      key: "action",
      width: 80,
      render: (_: unknown, record: Employee) => (
        <Popconfirm
          title="Delete Employee"
          description={`Are you sure you want to remove "${record.fullName}"?`}
          onConfirm={() => handleDelete(record.id, record.fullName)}
          okText="Delete"
          cancelText="Cancel"
          okButtonProps={{ danger: true }}
          icon={<ExclamationCircleOutlined style={{ color: "#dc2626" }} />}
        >
          <Tooltip title="Delete employee">
            <Button
              danger
              type="text"
              icon={<DeleteOutlined />}
              size="small"
              style={{ borderRadius: 6 }}
            />
          </Tooltip>
        </Popconfirm>
      ),
    },
  ];

  return (
    <AppLayout pageTitle="Employees">
      {error && (
        <Alert
          type="error"
          message={error}
          showIcon
          style={{ marginBottom: 20, borderRadius: 10 }}
        />
      )}

      <Card
        style={{ borderRadius: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}
        styles={{ body: { padding: 0 } }}
      >
        {/* Toolbar */}
        <div
          style={{ padding: "20px 24px", borderBottom: "1px solid #f1f5f9" }}
        >
          <Row gutter={[16, 12]} align="middle" justify="space-between">
            <Col flex="auto">
              <Row gutter={12}>
                <Col xs={24} sm={14} md={12}>
                  <Input
                    placeholder="Search by name, email, or ID..."
                    prefix={<SearchOutlined style={{ color: "#94a3b8" }} />}
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    style={{ borderRadius: 8 }}
                    allowClear
                  />
                </Col>
                <Col xs={24} sm={10} md={8}>
                  <Select
                    placeholder="Filter by department"
                    allowClear
                    style={{ width: "100%" }}
                    value={selectedDept}
                    onChange={setSelectedDept}
                    options={DEPARTMENTS.map((d) => ({ label: d, value: d }))}
                  />
                </Col>
              </Row>
            </Col>
            <Col>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setModalOpen(true)}
                style={{
                  borderRadius: 8,
                  background: "linear-gradient(135deg, #3b82f6, #6366f1)",
                  border: "none",
                  height: 38,
                  fontWeight: 600,
                  paddingInline: 20,
                }}
              >
                Add Employee
              </Button>
            </Col>
          </Row>
        </div>

        {/* Stats */}
        <div
          style={{
            padding: "12px 24px",
            background: "#f8fafc",
            borderBottom: "1px solid #f1f5f9",
            display: "flex",
            gap: 20,
          }}
        >
          <Text type="secondary" style={{ fontSize: 13 }}>
            <TeamOutlined style={{ marginRight: 6 }} />
            Total: <Text strong>{employees.length}</Text>
          </Text>
          <Text type="secondary" style={{ fontSize: 13 }}>
            Showing: <Text strong>{filtered.length}</Text>
          </Text>
        </div>

        {/* Table */}
        {loading ? (
          <div style={{ padding: 24 }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton
                key={i}
                active
                avatar
                paragraph={{ rows: 1 }}
                style={{ marginBottom: 20 }}
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <span>
                {searchText || selectedDept
                  ? "No employees match your search."
                  : "No employees yet. "}
                {!searchText && !selectedDept && (
                  <Button
                    type="link"
                    onClick={() => setModalOpen(true)}
                    style={{ padding: 0 }}
                  >
                    Add the first employee
                  </Button>
                )}
              </span>
            }
            style={{ padding: "48px 0" }}
          />
        ) : (
          <Table
            dataSource={filtered}
            columns={columns}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: false,
              showTotal: (t) => `${t} employees`,
            }}
            scroll={{ x: 800 }}
          />
        )}
      </Card>

      {/* Add Employee Modal */}
      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: "linear-gradient(135deg, #3b82f6, #6366f1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <UserOutlined style={{ color: "#fff" }} />
            </div>
            <span>Add New Employee</span>
          </div>
        }
        open={modalOpen}
        onCancel={() => {
          setModalOpen(false);
          form.resetFields();
        }}
        onOk={handleAdd}
        okText="Add Employee"
        confirmLoading={submitting}
        okButtonProps={{
          style: {
            background: "linear-gradient(135deg, #3b82f6, #6366f1)",
            border: "none",
            borderRadius: 8,
            fontWeight: 600,
          },
        }}
        cancelButtonProps={{ style: { borderRadius: 8 } }}
        width={520}
        style={{ top: 60 }}
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Employee ID"
                name="employeeId"
                rules={[
                  { required: true, message: "Employee ID is required" },
                  {
                    validator: (_, value) => {
                      if (
                        value &&
                        employees.find((e) => e.employeeId === value)
                      ) {
                        return Promise.reject(
                          "This Employee ID already exists",
                        );
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <Input placeholder="e.g. EMP007" style={{ borderRadius: 8 }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Full Name"
                name="fullName"
                rules={[{ required: true, message: "Full name is required" }]}
              >
                <Input
                  placeholder="e.g. John Doe"
                  style={{ borderRadius: 8 }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="Email Address"
            name="email"
            rules={[
              { required: true, message: "Email is required" },
              { type: "email", message: "Please enter a valid email" },
            ]}
          >
            <Input
              placeholder="e.g. john.doe@hrms.com"
              style={{ borderRadius: 8 }}
            />
          </Form.Item>

          <Form.Item
            label="Department"
            name="department"
            rules={[{ required: true, message: "Department is required" }]}
          >
            <Select
              placeholder="Select department"
              options={DEPARTMENTS.map((d) => ({ label: d, value: d }))}
            />
          </Form.Item>
        </Form>
      </Modal>
    </AppLayout>
  );
};

export default EmployeePage;
