import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { FaBox, FaTruck, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const OrderDetailsModal = ({ show, onHide, order }) => {
  if (!order) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PENDING':
        return <FaBox className="text-warning mr-2" size={20} />;
      case 'PAID':
        return <FaTruck className="text-success mr-2" size={20} />;
      case 'CANCELLED':
        return <FaTimesCircle className="text-danger mr-2" size={20} />;
      default:
        return <FaBox className="text-primary mr-2" size={20} />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'PENDING':
        return 'Đang xử lý';
      case 'PAID':
        return 'Đã thanh toán';
      case 'CANCELLED':
        return 'Đã hủy';
      default:
        return status;
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Chi tiết đơn hàng #{order.id}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-4">
          <div className="d-flex align-items-center mb-3">
            {getStatusIcon(order.status)}
            <h5 className="mb-0">{getStatusText(order.status)}</h5>
          </div>
          
          <div className="row mb-3">
            <div className="col-md-6">
              <p className="mb-1">
                <strong>Ngày đặt hàng:</strong> {formatDate(order.orderedDate)}
              </p>
              <p className="mb-1">
                <strong>Phương thức thanh toán:</strong> {order.paymentMethod || 'Chưa xác định'}
              </p>
            </div>
            <div className="col-md-6">
              <p className="mb-1">
                <strong>Tổng tiền:</strong>{' '}
                <span className="text-danger font-weight-bold">
                  {order.items?.reduce((total, item) => total + item.subTotal, 0).toLocaleString('vi-VN')}đ
                </span>
              </p>
              <p className="mb-0">
                <strong>Số lượng sản phẩm:</strong> {order.items?.reduce((total, item) => total + item.quantity, 0)}
              </p>
            </div>
          </div>

          <hr />

          <h6 className="mb-3">Sản phẩm đã đặt:</h6>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Sản phẩm</th>
                  <th className="text-center">Số lượng</th>
                  <th className="text-right">Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {order.items?.map((item) => (
                  <tr key={item.product.id}>
                    <td>
                      <div className="d-flex align-items-center">
                        <img
                          src={`http://localhost:8900/api/catalog/images/${item.product.imageUrl}`}
                          alt={item.product.productName}
                          style={{ width: '60px', height: '60px', objectFit: 'cover', marginRight: '15px' }}
                        />
                        <div>
                          <div className="font-weight-bold">{item.product.productName}</div>
                          <div className="text-muted">
                            {item.product.price.toLocaleString('vi-VN')}đ x {item.quantity}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="text-center align-middle">{item.quantity}</td>
                    <td className="text-right align-middle">
                      <div className="font-weight-bold">
                        {item.subTotal.toLocaleString('vi-VN')}đ
                      </div>
                      {item.discount > 0 && (
                        <div className="text-success small">
                          Giảm: {item.discount.toLocaleString('vi-VN')}đ
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="2" className="text-right">
                    <strong>Tổng cộng:</strong>
                  </td>
                  <td className="text-right">
                    <strong className="text-danger">
                      {order.items?.reduce((total, item) => total + item.subTotal, 0).toLocaleString('vi-VN')}đ
                    </strong>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Đóng
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default OrderDetailsModal;
