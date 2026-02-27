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
  Typography,
  Row,
  Col,
  Popconfirm,
  Alert,
  Space,
  Avatar,
} from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  DeleteOutlined,
  UserOutlined,
  TeamOutlined,
  ExclamationCircleOutlined,
  MailOutlined,
} from "@ant-design/icons";
import { useEmployeeStore } from "../store/useEmployeeStore";
import AppLayout from "../layouts/AppLayout";
import type { Employee, NewEmployee } from "../types";
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
  }, [fetchEmployees]);

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
      width: 140,
      render: (id: string) => <span className="employee-id-badge">{id}</span>,
    },
    {
      title: "Full Name",
      dataIndex: "fullName",
      key: "fullName",
      render: (name: string, record: Employee) => (
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Avatar
            size={40}
            style={{
              background: "var(--avatar-bg)",
              fontWeight: 700,
              fontSize: 16,
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            {name.charAt(0)}
          </Avatar>
          <div>
            <Text strong style={{ fontSize: 14, color: "var(--text-primary)" }}>
              {name}
            </Text>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <MailOutlined
                style={{ fontSize: 11, color: "var(--text-secondary)" }}
              />
              <Text style={{ fontSize: 12, color: "var(--text-secondary)" }}>
                {record.email}
              </Text>
            </div>
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
          {dayjs(date).isValid()
            ? dayjs(date).format("MMM DD, YYYY")
            : "Invalid Date"}
        </Text>
      ),
    },
    {
      title: "Action",
      key: "action",
      width: 100,
      align: "right" as const,
      render: (_: unknown, record: Employee) => (
        <Popconfirm
          title="Delete Employee"
          description={`Are you sure you want to remove ${record.fullName}?`}
          onConfirm={() => handleDelete(record.id, record.fullName)}
          okText="Yes, delete"
          cancelText="No"
          okButtonProps={{ danger: true, className: "btn" }}
          cancelButtonProps={{ className: "btn" }}
          icon={<ExclamationCircleOutlined style={{ color: "#dc2626" }} />}
        >
          <Button
            danger
            type="text"
            icon={<DeleteOutlined />}
            className="action-btn-delete"
          />
        </Popconfirm>
      ),
    },
  ];

  return (
    <AppLayout pageTitle="Employees">
      <div className="page-header" style={{ marginBottom: 32 }}>
        <Title level={2} style={{ margin: 0, fontWeight: 800 }}>
          Workforce Management
        </Title>
        <Text type="secondary">
          View and manage your organization's employees in one place.
        </Text>
      </div>

      {error && (
        <div>
          <Alert
            type="error"
            message={error}
            showIcon
            closable
            style={{ marginBottom: 24, borderRadius: 12 }}
          />
        </div>
      )}

      <Card className="card card--main" styles={{ body: { padding: 0 } }}>
        <div className="toolbar">
          <Row gutter={[16, 12]} align="middle" style={{ width: "100%" }}>
            <Col flex="auto">
              <Row gutter={12}>
                <Col xs={24} sm={14}>
                  <Input
                    size="large"
                    placeholder="Search employees..."
                    prefix={
                      <SearchOutlined
                        style={{ color: "var(--text-secondary)" }}
                      />
                    }
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className="form-input"
                    allowClear
                  />
                </Col>
                <Col xs={24} sm={10}>
                  <Select
                    size="large"
                    placeholder="All Departments"
                    showSearch
                    optionFilterProp="label"
                    allowClear
                    style={{ width: "100%" }}
                    value={selectedDept}
                    onChange={setSelectedDept}
                    options={DEPARTMENTS.map((d) => ({ label: d, value: d }))}
                  />
                </Col>
              </Row>
            </Col>
            <Col xs={24} sm="auto">
              <Button
                size="large"
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setModalOpen(true)}
                className="btn btn--primary"
                style={{ width: "100%" }}
              >
                Add Employee
              </Button>
            </Col>
          </Row>
        </div>

        <div className="toolbar__stats">
          <Space size={24}>
            <div className="stat-mini">
              <TeamOutlined />
              <span className="label">Total</span>
              <span className="stat-value">{employees.length}</span>
            </div>
            <div className="stat-mini">
              <div className="dot" />
              <span className="label">Filtered</span>
              <span className="stat-value">{filtered.length}</span>
            </div>
          </Space>
        </div>

        <div className="table-container">
          <Table
            dataSource={filtered}
            columns={columns}
            rowKey="id"
            loading={loading}
            pagination={{
              pageSize: 10,
              showSizeChanger: false,
              position: ["bottomRight"],
              className: "custom-pagination",
            }}
            scroll={{ x: 800 }}
          />
        </div>
      </Card>

      <Modal
        title={
          <div className="modal-title-custom">
            <div className="icon-box">
              <UserOutlined />
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
        width={560}
        className="premium-modal"
        okText="Create Employee"
        okButtonProps={{ className: "btn btn--primary" }}
        cancelButtonProps={{ className: "btn btn--secondary" }}
        confirmLoading={submitting}
      >
        <Form
          form={form}
          layout="vertical"
          className="form premium-form"
          style={{ marginTop: 24 }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Employee ID"
                name="employeeId"
                rules={[
                  { required: true, message: "Required" },
                  {
                    validator: (_, value) => {
                      if (
                        value &&
                        employees.find((e) => e.employeeId === value)
                      ) {
                        return Promise.reject("Already exists");
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <Input placeholder="EMP001" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Full Name"
                name="fullName"
                rules={[{ required: true, message: "Required" }]}
              >
                <Input placeholder="John Doe" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="Email Address"
            name="email"
            rules={[
              { required: true, message: "Required" },
              { type: "email", message: "Invalid email" },
            ]}
          >
            <Input placeholder="john@company.com" />
          </Form.Item>

          <Form.Item
            label="Department"
            name="department"
            rules={[{ required: true, message: "Required" }]}
          >
            <Select
              placeholder="Select department"
              showSearch
              optionFilterProp="label"
              options={DEPARTMENTS.map((d) => ({ label: d, value: d }))}
            />
          </Form.Item>
        </Form>
      </Modal>
    </AppLayout>
  );
};

export default EmployeePage;
