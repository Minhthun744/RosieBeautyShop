import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAllProducts, searchProducts, getAllCategories, getAuthUser } from '../api/apiService';
import logo from '../assets/images/logo1.jpg';
import { Navbar, Nav, NavDropdown, Form, FormControl, Button } from 'react-bootstrap';
import axios from 'axios';
import Slider from '../pages/home/Slider';
import { FaUser, FaClipboardList, FaShoppingCart, FaBars } from 'react-icons/fa';
const Header = () => {
  // Gọi lấy thông tin user khi Header mount
  useEffect(() => {
    fetchUserData();
  }, []);
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [categories, setCategories] = useState([
    // Dữ liệu mẫu để test giao diện
    { id: 1, name: 'Đồ uống', productCount: 5 },
    { id: 2, name: 'Đồ ăn nhanh', productCount: 3 },
    { id: 3, name: 'Đồ ngọt', productCount: 8 }
  ]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [forceUpdate, setForceUpdate] = useState(false); // Thêm state để force update UI
  const navigate = useNavigate();

  // Hàm lấy thông tin người dùng
  const fetchUserData = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setIsAuthenticated(false);
      setUsername('');
      setForceUpdate(!forceUpdate); // Force update UI
      return;
    }
    try {
      console.log('[Header] Gọi getAuthUser...');
      const userProfile = await getAuthUser();
      console.log('[Header] Kết quả getAuthUser:', userProfile);
      let name = '';
      if (userProfile) {
        console.log('[Header] userProfile:', userProfile);
        // Ưu tiên tên đầy đủ nếu có
        if (userProfile.userDetails && (userProfile.userDetails.firstName || userProfile.userDetails.lastName)) {
          name = `${userProfile.userDetails.firstName || ''} ${userProfile.userDetails.lastName || ''}`.trim();
        }
        // Nếu không có tên đầy đủ, lấy userName
        if (!name && (userProfile.userName || userProfile.username)) {
          name = userProfile.userName || userProfile.username;
        }
        // Nếu không có, lấy email
        if (!name && userProfile.userDetails && userProfile.userDetails.email) {
          name = userProfile.userDetails.email;
        }
        // Nếu không có, lấy các trường khác
        if (!name && (userProfile.name || userProfile.fullName || userProfile.email)) {
          name = userProfile.name || userProfile.fullName || userProfile.email;
        }
      }
      // Nếu vẫn chưa có tên, thử decode token
      if (!name && token) {
        try {
          const { jwtDecode } = await import('jwt-decode');
          const decoded = jwtDecode(token.replace('Bearer ', ''));
          name = decoded.sub || decoded.username || decoded.preferred_username || decoded.email || '';
        } catch (e) {
          // ignore
        }
      }
      if (name) {
        setIsAuthenticated(true);
        setUsername(name);
        console.log('[Header] Hiển thị username:', name);
      } else {
        setIsAuthenticated(false);
        setUsername('');
        localStorage.removeItem('authToken');
        window.location.href = '/login';
      }
    } catch (error) {
      console.error('Lỗi khi lấy thông tin người dùng:', error);
      setIsAuthenticated(false);
      setUsername('');
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
  };

  // Hàm lấy số lượng sản phẩm trong giỏ hàng
  const fetchCartCount = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setCartCount(0);
        return;
      }
      let username = localStorage.getItem('username');
      if (!username) {
        try {
          const { jwtDecode } = await import('jwt-decode');
          const decoded = jwtDecode(token.replace('Bearer ', ''));
          username = decoded.sub || decoded.username || decoded.preferred_username || '';
        } catch (e) {
          console.error('Lỗi khi decode token để lấy username:', e);
          username = '';
        }
      }
      if (!username) {
        setCartCount(0);
        return;
      }
      let cartId = '';
      try {
        cartId = document.cookie.split('; ').find(row => row.startsWith('cartId='))?.split('=')[1] || '';
      } catch (e) { }
      const headers = {
        'Authorization': `Bearer ${token}`,
        'X-Username': username,
        'X-Requested-With': 'XMLHttpRequest',
      };
      const response = await axios.get('http://localhost:8900/api/shop/cart', {
        headers,
        withCredentials: true
      });
      if (response.data && Array.isArray(response.data.products)) {
        setCartCount(response.data.products.length);
      }
    } catch (error) {
      console.error('Lỗi khi lấy giỏ hàng:', error);
      setCartCount(0);
    }
  };

  const fetchCategories = async () => {
    try {
      setIsLoadingCategories(true);
      const categories = await getAllCategories();
      if (Array.isArray(categories)) {
        setCategories(categories);
      } else {
        setCategories([
          { id: 1, name: 'Đồ uống', productCount: 5 },
          { id: 2, name: 'Đồ ăn nhanh', productCount: 3 },
          { id: 3, name: 'Đồ ngọt', productCount: 8 }
        ]);
      }
    } catch (error) {
      setCategories([
        { id: 1, name: 'Đồ uống', productCount: 5 },
        { id: 2, name: 'Đồ ăn nhanh', productCount: 3 },
        { id: 3, name: 'Đồ ngọt', productCount: 8 }
      ]);
    } finally {
      setIsLoadingCategories(false);
    }
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    const performSearch = async () => {
      if (!searchTerm || searchTerm.trim() === '') {
        setFilteredProducts([]);
        setShowDropdown(false);
        return;
      }

      try {
        const searchParams = {
          name: searchTerm,
          category: selectedCategory || null,
          sortBy: 'productName',
          sortDirection: 'asc'
        };

        const results = await searchProducts(searchParams);
        setFilteredProducts(results || []);
        setShowDropdown(true);
      } catch (error) {
        console.error('Lỗi khi tìm kiếm:', error);
        setFilteredProducts([]);
      }
    };

    const debounceTimer = setTimeout(performSearch, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, selectedCategory]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm && searchTerm.trim()) {
      const searchParams = new URLSearchParams();
      searchParams.append('search', searchTerm.trim());
      if (selectedCategory) {
        searchParams.append('category', selectedCategory);
      }
      navigate(`/ListingGrid?${searchParams.toString()}`);
      setSearchTerm('');
      setShowDropdown(false);
    }
  };

  const handleProfileClick = () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/Login');
    } else {
      navigate('/Profile');
    }
  };

  return (
    <>
      <Slider />
      <header className="section-header">
        <section className="header-main border-bottom">
          <div className="ms-5 me-5">
            <div className="row align-items-center">
              <div className="col-xl-2 col-lg-3 col-md-12">
                <Link to="/Home" className="brand-wrap">
                  <img className="logo" src={logo} alt="Brand Logo" />
                </Link>
              </div>
              <div className="col-xl-6 col-lg-5 col-md-6">
                <Form className="search-header" onSubmit={handleSearchSubmit}>
                  <div className="input-group w-100">
                    <Form.Select
                      className="custom-select border-right"
                      name="category_name"
                      onChange={handleCategoryChange}
                      value={selectedCategory}
                    >
                      <option value="">Tất cả loại</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </Form.Select>
                    <FormControl
                      type="text"
                      placeholder="Tìm kiếm"
                      value={searchTerm}
                      onChange={handleSearchChange}
                    />
                    <Button type="submit" style={{ backgroundColor: '#ffece7', border: 'none', color: '#000' }}>
                      <i className="fa fa-search"></i> Tìm kiếm
                    </Button>

                  </div>
                </Form>
              </div>
              <div className="col-xl-4 col-lg-4 col-md-6">
                <div className="widgets-wrap float-md-right">
                  <div className="widget-header mr-3">
                    <Link to="/Profile" className="widget-view" onClick={handleProfileClick}>
                      <div className="icon-area">
                        <FaUser size={24} />
                      </div>
                      <small className="text"> {isAuthenticated && username ? username : 'Đăng nhập'} </small>
                    </Link>

                  </div>
                  <div className="widget-header mr-3">
                    <Link to="/profile/orders" className="widget-view">
                      <div className="icon-area">
                        <FaClipboardList size={24} />
                      </div>
                      <small className="text"> Đơn hàng </small>
                    </Link>
                  </div>
                  <div className="widget-header">
                    <Link to="/Cart" className="widget-view">
                      <div className="icon-area">
                        <FaShoppingCart size={24} />
                        {cartCount > 0 && <span className="notify">{cartCount}</span>}
                      </div>
                      <small className="text"> Giỏ hàng </small>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Navbar expand="lg" className="navbar-main border-bottom w-100">
          <div className="container-fluid">
            <Navbar.Toggle aria-controls="main_nav" />
            <Navbar.Collapse id="main_nav">
              <Nav className="mx-auto d-flex justify-content-evenly w-100 fs-5">
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
                          as={Link}
                          to={`/products?categoryId=${category.id}`}
                          className="d-flex align-items-center py-2 px-3"
                          style={{
                            minWidth: 250,
                            transition: 'all 0.2s',
                            borderLeft: '3px solid transparent',
                            textDecoration: 'none',
                            color: '#333'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderLeftColor = '#ff6b8b';
                            e.currentTarget.style.backgroundColor = '#fff9fa';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderLeftColor = 'transparent';
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }}
                          onClick={() => {
                            // Lưu thông tin danh mục đã chọn vào localStorage
                            localStorage.setItem('selectedCategory', JSON.stringify({
                              id: category.id,
                              name: category.name
                            }));
                            // Chuyển hướng đến trang sản phẩm với danh mục đã chọn
                            navigate(`/products?categoryId=${category.id}`);
                          }}
                        >
                          {category.image ? (
  <img
    src={category.image}
    alt={category.name}
    className="me-2"
    style={{
      width: 32,
      height: 32,
      objectFit: 'cover',
      borderRadius: 8,
      background: '#fff',
      border: '1px solid #eee',
      boxShadow: '0 1px 4px #0001',
      transition: 'box-shadow 0.2s',
    }}
    onError={e => {
      e.target.onerror = null;
      e.target.src = require('../assets/images/2-jpeg-1ecf7f6c-428e-4b09-a57c-8ed072188b73.jpg');
    }}
  />
) : (
  <div
    className="d-flex align-items-center justify-content-center me-2"
    style={{
      width: 32,
      height: 32,
      backgroundColor: '#f8f9fa',
      borderRadius: 8,
      border: '1px solid #eee',
      boxShadow: '0 1px 4px #0001',
    }}
  >
    <i className="fas fa-folder text-muted" style={{ fontSize: 18 }}></i>
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

              <Nav.Link as={Link} to="/Home" className="px-3">TRANG CHỦ</Nav.Link>
              <Nav.Link as={Link} to="/About" className="px-3">GIỚI THIỆU</Nav.Link>
              <Nav.Link as={Link} to="/Contact" className="px-3">LIÊN HỆ</Nav.Link>
              <Nav.Link as={Link} to="/News" className="px-3">TIN TỨC</Nav.Link>
              <Nav.Link as={Link} to="/Cart" className="px-3">GIỎ HÀNG</Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </div>
        </Navbar>

      </header>
    </>
  );
}

export default Header;
