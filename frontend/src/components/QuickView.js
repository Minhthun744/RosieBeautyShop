import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';

const QuickView = ({ product, show, onHide }) => {
  const [loading, setLoading] = useState(true);
  const [productDetails, setProductDetails] = useState(null);

  useEffect(() => {
    if (product && show) {
      setLoading(true);
      // Giả lập việc tải chi tiết sản phẩm
      const timer = setTimeout(() => {
        setProductDetails({
          ...product,
          description: product.description || 'Không có mô tả chi tiết.',
          category: product.category || 'Chưa phân loại',
          inStock: product.inStock !== undefined ? product.inStock : true
        });
        setLoading(false);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [product, show]);

  if (!show) return null;

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Xem nhanh sản phẩm</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading ? (
          <div className="text-center py-4">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Đang tải...</span>
            </div>
          </div>
        ) : (
          <div className="row">
            <div className="col-md-6">
              <img 
                src={product.image || '/images/no-image.png'} 
                alt={product.name} 
                className="img-fluid rounded"
                style={{ maxHeight: '400px', objectFit: 'contain' }}
              />
            </div>
            <div className="col-md-6">
              <h4>{product.name}</h4>
              <div className="mb-3">
                <span className="h5 text-danger">{product.price?.toLocaleString('vi-VN')}₫</span>
              </div>
              <p className="text-muted">{product.description}</p>
              <div className="mb-3">
                <strong>Danh mục:</strong> {productDetails?.category}
              </div>
              <div className="mb-3">
                <strong>Tình trạng:</strong> {productDetails?.inStock ? 'Còn hàng' : 'Hết hàng'}
              </div>
              <button className="btn btn-primary w-100">
                Thêm vào giỏ hàng
              </button>
            </div>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Đóng
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default QuickView;
