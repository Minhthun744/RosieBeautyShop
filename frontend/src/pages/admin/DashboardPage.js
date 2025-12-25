import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import { ShoppingCartOutlined, UserOutlined, MoneyCollectOutlined, ShoppingOutlined } from '@ant-design/icons';

const DashboardPage = () => {
  // Đây là dữ liệu giả, trong thực tế nên lấy từ API
  const stats = {
    totalProducts: 156,
    totalOrders: 1245,
    totalUsers: 845,
    revenue: 125000000,
  };

  return (
    <div>
      <h2>Bảng điều khiển</h2>
      
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng sản phẩm"
              value={stats.totalProducts}
              prefix={<ShoppingOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng đơn hàng"
              value={stats.totalOrders}
              prefix={<ShoppingCartOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng người dùng"
              value={stats.totalUsers}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Doanh thu (VNĐ)"
              value={stats.revenue}
              prefix={<MoneyCollectOutlined />}
              formatter={(value) => `${value.toLocaleString()} VNĐ`}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card title="Hoạt động gần đây">
            <p>Không có hoạt động gần đây</p>
            {/* Ở đây có thể thêm bảng hoặc danh sách các hoạt động gần đây */}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardPage;
