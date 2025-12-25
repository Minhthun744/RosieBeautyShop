import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAllProducts, searchProducts, getAllCategories } from '../api/apiService';
import logo from '../assets/images/logo1.jpg';
import { Navbar, Nav, NavDropdown, Form, FormControl, Button } from 'react-bootstrap';
import { FaUser, FaClipboardList, FaShoppingCart, FaBars } from 'react-icons/fa';

const Header = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [cartCount, setCartCount] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Lấy danh mục sản phẩm từ API
    const fetchCategories = async () => {
      try {
        console.log('Đang tải danh mục sản phẩm...');
        setIsLoadingCategories(true);
        const categories = await getAllCategories();
        console.log('Danh sách danh mục đã tải:', categories);
        
        // Đảm bảo categories là mảng trước khi set
        if (Array.isArray(categories)) {
          setCategories(categories);
        } else {
          console.warn('Dữ liệu danh mục không hợp lệ:', categories);
          // Sử dụng dữ liệu mẫu nếu API trả về lỗi
          setCategories([
            { id: 1, name: 'Đồ uống', productCount: 5 },
            { id: 2, name: 'Đồ ăn nhanh', productCount: 3 },
            { id: 3, name: 'Đồ ngọt', productCount: 8 }
          ]);
        }
      } catch (error) {
        console.error('Lỗi khi lấy danh mục sản phẩm:', error);
        // Sử dụng dữ liệu mẫu nếu có lỗi
        setCategories([
          { id: 1, name: 'Đồ uống', productCount: 5 },
          { id: 2, name: 'Đồ ăn nhanh', productCount: 3 },
          { id: 3, name: 'Đồ ngọt', productCount: 8 }
        ]);
      } finally {
        setIsLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  // Xử lý tìm kiếm sản phẩm
  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
      setSearchTerm('');
    }
  };

  // Xử lý khi click vào danh mục
  const handleCategoryClick = (category) => {
    // Lưu thông tin danh mục đã chọn vào localStorage
    localStorage.setItem('selectedCategory', JSON.stringify({
      id: category.id,
      name: category.name
    }));
    
    // Chuyển hướng đến trang sản phẩm với danh mục đã chọn
    navigate(`/products?categoryId=${category.id}`);
  };

  return (
    <header className="sticky-top bg-white shadow-sm">
      <div className="top-bar bg-dark text-white py-2">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <a href="tel:0123456789" className="text-white text-decoration-none me-3">
                <i className="fas fa-phone-alt me-1"></i> 0123 456 789
              </a>
              <a href="mailto:info@example.com" className="text-white text-decoration-none">
                <i className="fas fa-envelope me-1"></i> info@example.com
              </a>
            </div>
            <div>
              <a href="#" className="text-white text-decoration-none me-3">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="text-white text-decoration-none me-3">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="text-white text-decoration-none">
                <i className="fab fa-youtube"></i>
              </a>
            </div>
          </div>
        </div>
      </div>

      <Navbar expand="lg" className="navbar-main border-bottom w-100">
        <div className="container">
          <Navbar.Brand as={Link} to="/" className="me-4">
            <img src={logo} alt="Logo" height="50" />
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="main_nav" />
          <Navbar.Collapse id="main_nav">
            <Nav className="me-auto align-items-center">
              <NavDropdown
                title={
                  <span>
                    <FaBars className="text-muted me-2" />
                    DANH MỤC SẢN PHẨM
                  </span>
                }
                id="basic-nav-dropdown"
                className="category-dropdown-menu"
                menuVariant="light"
                style={{ minWidth: 250 }}
              >
                {isLoadingCategories ? (
                  <div className="text-center p-3">
                    <div className="spinner-border spinner-border-sm text-primary" role="status">
                      <span className="visually-hidden">Đang tải...</span>
                    </div>
                    <span className="ms-2">Đang tải danh mục...</span>
                  </div>
                ) : categories.length > 0 ? (
                  <div style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                    {categories.map((category) => (
                      <NavDropdown.Item
                        key={category.id}
                        className="d-flex align-items-center py-2 px-3"
                        style={{
                          minWidth: 250,
                          transition: 'all 0.2s',
                          borderLeft: '3px solid transparent',
                          textDecoration: 'none',
                          color: '#333',
                          cursor: 'pointer'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderLeftColor = '#ff6b8b';
                          e.currentTarget.style.backgroundColor = '#fff9fa';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderLeftColor = 'transparent';
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                        onClick={() => handleCategoryClick(category)}
                      >
                        {category.image ? (
                          <img
                            src={category.image}
                            alt={category.name}
                            className="me-2"
                            style={{
                              width: 24,
                              height: 24,
                              objectFit: 'cover',
                              borderRadius: 4
                            }}
                          />
                        ) : (
                          <div 
                            className="d-flex align-items-center justify-content-center me-2"
                            style={{
                              width: 24,
                              height: 24,
                              backgroundColor: '#f8f9fa',
                              borderRadius: 4
                            }}
                          >
                            <i className="fas fa-folder text-muted" style={{ fontSize: 14 }}></i>
                          </div>
                        )}
                        <span className="flex-grow-1 text-truncate" title={category.name}>
                          {category.name}
                        </span>
                        {category.productCount > 0 && (
                          <span 
                            className="badge rounded-pill ms-2"
                            style={{ 
                              fontSize: '0.65rem',
                              padding: '0.25em 0.5em',
                              backgroundColor: '#ff6b8b',
                              color: 'white'
                            }}
                          >
                            {category.productCount}
                          </span>
                        )}
                      </NavDropdown.Item>
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-3 text-muted">
                    <i className="fas fa-inbox fa-2x mb-2 d-block"></i>
                    <span>Không có danh mục nào</span>
                  </div>
                )}
              </NavDropdown>

              <Nav.Link as={Link} to="/" className="mx-2 fw-medium">TRANG CHỦ</Nav.Link>
              <Nav.Link as={Link} to="/products" className="mx-2 fw-medium">SẢN PHẨM</Nav.Link>
              <Nav.Link as={Link} to="/about" className="mx-2 fw-medium">GIỚI THIỆU</Nav.Link>
              <Nav.Link as={Link} to="/contact" className="mx-2 fw-medium">LIÊN HỆ</Nav.Link>
            </Nav>

            <Form className="d-flex mx-3" onSubmit={handleSearch}>
              <div className="input-group">
                <FormControl
                  type="search"
                  placeholder="Tìm kiếm sản phẩm..."
                  className="border-end-0"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button 
                  variant="outline-secondary" 
                  type="submit"
                  className="border-start-0"
                  style={{ backgroundColor: '#f8f9fa' }}
                >
                  <i className="fas fa-search"></i>
                </Button>
              </div>
            </Form>

            <Nav className="align-items-center">
              <Nav.Link as={Link} to="/account" className="mx-2">
                <div className="d-flex flex-column align-items-center">
                  <FaUser className="fs-5" />
                  <span className="small d-none d-md-block">Tài khoản</span>
                </div>
              </Nav.Link>
              <Nav.Link as={Link} to="/orders" className="mx-2">
                <div className="d-flex flex-column align-items-center">
                  <FaClipboardList className="fs-5" />
                  <span className="small d-none d-md-block">Đơn hàng</span>
                </div>
              </Nav.Link>
              <Nav.Link as={Link} to="/cart" className="mx-2 position-relative">
                <div className="d-flex flex-column align-items-center">
                  <FaShoppingCart className="fs-5" />
                  <span className="small d-none d-md-block">Giỏ hàng</span>
                  {cartCount > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                      {cartCount}
                    </span>
                  )}
                </div>
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </div>
      </Navbar>
    </header>
  );
};

export default Header;
