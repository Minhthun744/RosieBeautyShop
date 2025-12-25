import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getProductsByCategory } from '../api/apiService';
import { Container, Row, Col, Card, Button, Spinner, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Products = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [categoryName, setCategoryName] = useState('Tất cả sản phẩm');

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const categoryId = searchParams.get('categoryId');

    const fetchProducts = async () => {
      try {
        setLoading(true);
        let data;
        
        if (categoryId) {
          // Lấy sản phẩm theo danh mục
          data = await getProductsByCategory(categoryId);
          // Lấy tên danh mục từ localStorage hoặc API nếu cần
          const savedCategory = localStorage.getItem('selectedCategory');
          if (savedCategory) {
            const category = JSON.parse(savedCategory);
            setCategoryName(category.name);
          }
        } else {
          // Nếu không có categoryId, lấy tất cả sản phẩm
          // data = await getAllProducts(); // Hàm này cần được định nghĩa trong apiService
          setCategoryName('Tất cả sản phẩm');
        }
        
        setProducts(data || []);
      } catch (err) {
        console.error('Lỗi khi tải sản phẩm:', err);
        setError('Đã xảy ra lỗi khi tải sản phẩm. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [location.search]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <Spinner animation="border" variant="primary" />
        <span className="ms-3">Đang tải sản phẩm...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Container className="my-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <h2 className="mb-4">{categoryName}</h2>
      
      {products.length === 0 ? (
        <div className="text-center py-5">
          <i className="fas fa-box-open fa-3x text-muted mb-3"></i>
          <p className="h5">Không có sản phẩm nào trong danh mục này</p>
          <Button as={Link} to="/products" variant="outline-primary" className="mt-3">
            Xem tất cả sản phẩm
          </Button>
        </div>
      ) : (
        <Row xs={1} md={2} lg={3} xl={4} className="g-4">
          {[...products.slice(0, 5), ...Array(5 - products.slice(0, 5).length).fill(null)].map((product, idx) => (
  <Col key={product ? product.id : `placeholder-${idx}`}>
    {product ? (
      <div
        className="shadow-sm bg-white rounded-4 d-flex flex-column align-items-center justify-content-between p-3 h-100"
        style={{ minHeight: 420, boxShadow: '0 2px 16px #0001', border: '1.5px solid #f5f5f5' }}
      >
        <Link to={`/product/${product.id}`} style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          <img
            src={product.imageUrl
              ? `http://localhost:8900/api/catalog/images/${product.imageUrl}`
              : 'https://via.placeholder.com/300x200?text=No+Image'}
            alt={product.name || product.productName || "Sản phẩm"}
            style={{ width: 160, height: 160, objectFit: 'contain', borderRadius: 12, backgroundColor: '#fafafa', marginBottom: 12 }}
            onError={e => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
            }}
          />
        </Link>
        <div className="w-100 text-center" style={{ minHeight: 48, marginBottom: 8 }}>
          <Link to={`/product/${product.id}`} className="fw-bold text-dark text-decoration-none" style={{ fontSize: 18 }}>
            {product.name || product.productName || "Tên sản phẩm"}
          </Link>
        </div>
        <div className="d-flex align-items-center justify-content-center mb-2" style={{ minHeight: 28 }}>
          {[1,2,3,4,5].map(i => (
            <i key={i} className={
              'fa-star ' + (i <= Math.round(product.rating || 5) ? 'fas text-warning' : 'far text-secondary')
            } style={{ fontSize: 18, marginRight: 2 }}></i>
          ))}
          <span className="ms-2 fw-semibold" style={{ color: '#222', fontSize: 16 }}>
            {(product.rating || 5.0).toFixed(1)}
          </span>
        </div>
        <div className="fw-bold text-danger text-center mb-3" style={{ fontSize: 22 }}>
          {new Intl.NumberFormat('vi-VN', { style: 'decimal' }).format(product.price)}<span style={{ color: '#ff6b8b', marginLeft: 2, fontSize: 18 }}>đ</span>
        </div>
        <Button
  style={{ background: '#ff6b8b', border: 'none', borderRadius: 8, fontWeight: 600, fontSize: 17, width: '100%' }}
  className="py-2 mt-auto"
  onClick={() => navigate(`/Detail?productId=${product.id}`)}
>
  Mua ngay
</Button>
      </div>
    ) : (
      <div
        className="shadow-none bg-transparent rounded-4 d-flex flex-column align-items-center justify-content-between p-3 h-100"
        style={{ minHeight: 420, border: 'none', background: 'transparent', boxShadow: 'none' }}
      ></div>
    )}
  </Col>
))}
        </Row>
      )}
    </Container>
  );
};

export default Products;
