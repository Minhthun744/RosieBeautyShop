import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { getUserById } from '../api/apiService';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaUser, FaBox, FaShoppingBag, FaCreditCard } from 'react-icons/fa';

const Profile = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recentOrders, setRecentOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          navigate('/login');
          return;
        }

        const tokenWithoutBearer = token.replace('Bearer ', '');
        const decodedToken = jwtDecode(tokenWithoutBearer);
        const userId = decodedToken.id;
        const userName = decodedToken.sub;

        // Lấy thông tin user
        const response = await getUserById(userId);
        if (response) {
          setUserInfo(response);
        }

        // Lấy 3 đơn hàng gần nhất bằng userName
        if (userName) {
          const { orders } = await require('../api/apiService').getOrdersByUserName(userName);
          if (orders && Array.isArray(orders) && orders.length > 0) {
            const sortedOrders = orders.sort((a, b) => new Date(b.orderedDate) - new Date(a.orderedDate));
            setRecentOrders(sortedOrders.slice(0, 3));
          } else {
            setRecentOrders([]);
          }
        }
      } catch (error) {
        console.error('Lỗi khi lấy thông tin người dùng hoặc đơn hàng:', error);
        if (error && (
          error.name === 'InvalidTokenError' || 
          (error.message && error.message.includes('token')) ||
          error.response?.status === 401 ||
          error.response?.status === 403
        )) {
          localStorage.removeItem('authToken');
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const formatAddress = (userDetails) => {
    if (!userDetails) return 'Chưa cập nhật địa chỉ';
    const { street, streetNumber, locality, country, zipCode } = userDetails;
    return `${street || ''} ${streetNumber || ''}, ${locality || ''}, ${country || ''} ${zipCode || ''}`.replace(/,\s+,/g, ',').replace(/^,\s+/, '').replace(/,\s+$/, '');
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    window.dispatchEvent(new Event('authChanged'));
    navigate('/login');
    setTimeout(() => {
      window.location.reload();
    }, 200);
  };

  if (loading) {
    return <div className="text-center mt-5">Đang tải...</div>;
  }

  // Style cho background và container
  const bgStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #ffb6b9 0%, #fcdff0 100%)',
    padding: '40px 0',
    fontFamily: '"Roboto", sans-serif'
  };

  const wrapperStyle = {
    background: 'rgba(255, 255, 255, 0.9)',
    borderRadius: '20px',
    padding: '30px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    backdropFilter: 'blur(10px)',
    marginTop: '20px',
    marginBottom: '40px'
  };

  const titleStyle = {
    color: '#d46a92',
    textAlign: 'center',
    marginBottom: '30px',
    position: 'relative',
    paddingBottom: '15px',
    fontWeight: '600',
    fontSize: '2rem',
    textTransform: 'uppercase',
    letterSpacing: '1px'
  };

  return (
    <div style={bgStyle}>
      <div className="container" style={wrapperStyle}>
        <h2 style={titleStyle}>TÀI KHOẢN CỦA TÔI</h2>
        <div className="section-content p-4">
          <div className="row">
            <aside className="col-md-3">
            <div className="card mb-3" style={{
              border: 'none',
              borderRadius: '16px',
              boxShadow: '0 4px 15px rgba(0,0,0,0.06)',
              overflow: 'hidden',
              background: '#fff9fa'
            }}>
              <div className="card-body p-0">
                <nav className="list-group list-group-flush">
                  <Link className="list-group-item list-group-item-action d-flex align-items-center" to="/profile" style={{
                    borderLeft: '4px solid #ff6b8b',
                    background: 'rgba(255, 107, 139, 0.1)'
                  }}>
                    <FaUser className="mr-2" /> Tổng quan tài khoản
                  </Link>
                  <Link className="list-group-item list-group-item-action d-flex align-items-center" to="/profile/address">
                    <FaMapMarkerAlt className="mr-2" /> Địa chỉ của tôi
                  </Link>
                  <Link className="list-group-item list-group-item-action d-flex align-items-center" to="/profile/orders">
                    <FaBox className="mr-2" /> Đơn hàng của tôi
                  </Link>
                  <Link className="list-group-item list-group-item-action d-flex align-items-center" to="/profile/selling">
                    <FaShoppingBag className="mr-2" /> Sản phẩm đang bán
                  </Link>
                  <Link className="list-group-item list-group-item-action d-flex align-items-center" to="/profile/settings">
                    <FaCreditCard className="mr-2" /> Cài đặt
                  </Link>
                  <Link className="list-group-item list-group-item-action d-flex align-items-center text-danger" to="/logout" onClick={(e) => {
                    e.preventDefault();
                    if (window.confirm('Bạn có chắc chắn muốn đăng xuất?')) {
                      handleLogout();
                    }
                  }}>
                    <i className="fas fa-sign-out-alt mr-2"></i> Đăng xuất
                  </Link>
                </nav>
              </div>
            </div>
            </aside>

            <main className="col-md-9">
              <div className="card mb-4" style={{
                border: 'none',
                borderRadius: '16px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.06)',
                overflow: 'hidden'
              }}>
                <div className="card-header" style={{
                  background: 'linear-gradient(135deg, #fff9fa 0%, #fff0f2 100%)',
                  borderBottom: '1px solid #ffdfe4',
                  padding: '16px 24px'
                }}>
                  <h5 className="mb-0 d-flex align-items-center" style={{
                    color: '#d46a92',
                    fontWeight: '600',
                    fontSize: '1.1rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    <FaUser className="mr-2" /> Thông tin tài khoản
                  </h5>
                </div>
                <div className="card-body p-4">
                  {userInfo && (
                    <figure className="icontext">
                      <div className="icon">
                        <img className="rounded-circle img-sm border" 
                          src={userInfo.image || "https://i.pinimg.com/736x/c3/c9/b1/c3c9b187b3cc4d4fe639982681ab3329.jpg"} 
                          alt="Ảnh đại diện" 
                        />
                      </div>
                      <div className="text">
                        <strong style={{
                          fontSize: '1.2rem',
                          color: '#333',
                          marginBottom: '5px',
                          display: 'block'
                        }}>{userInfo.userDetails?.firstName} {userInfo.userDetails?.lastName}</strong>
                        <p className="mb-3" style={{
                      color: '#666',
                      fontSize: '0.95rem'
                    }}>{userInfo.userDetails?.email}</p>
                        <Link 
                          to="/profile/settings" 
                          className="btn btn-sm"
                          style={{
                            background: '#ff6b8b',
                            color: 'white',
                            border: 'none',
                            borderRadius: '20px',
                            padding: '5px 15px',
                            boxShadow: '0 2px 8px rgba(255, 107, 139, 0.3)',
                            transition: 'all 0.3s ease'
                          }}
                          onMouseOver={(e) => {
                            e.target.style.background = '#ff4d73';
                            e.target.style.transform = 'translateY(-2px)';
                          }}
                          onMouseOut={(e) => {
                            e.target.style.background = '#ff6b8b';
                            e.target.style.transform = 'translateY(0)';
                          }}
                        >
                          Chỉnh sửa
                        </Link>
                      </div>
                    </figure>
                  )}
                  <hr style={{
                    border: 0,
                    height: '1px',
                    background: 'linear-gradient(90deg, transparent, #ffb6b9, transparent)',
                    margin: '20px 0'
                  }} />
                  {userInfo && (
                    <p>
                      <FaMapMarkerAlt className="text-muted mr-2" style={{color: '#ff6b8b'}} /> &nbsp; {formatAddress(userInfo.userDetails)} <br />
                      <FaPhone className="text-muted mr-2" style={{color: '#ff6b8b'}} /> &nbsp; {userInfo.userDetails?.phoneNumber || 'Chưa cập nhật số điện thoại'} <br />
                      <FaEnvelope className="text-muted mr-2" style={{color: '#ff6b8b'}} /> &nbsp; {userInfo.userDetails?.email}<br />
                      <FaUser className="text-muted mr-2" style={{color: '#ff6b8b'}} /> &nbsp; {userInfo.userName}
                    </p>
                  )}
                </div>
              </div>

              <div className="card mb-4" style={{
                border: 'none',
                borderRadius: '16px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.06)',
                overflow: 'hidden'
              }}>
                <div className="card-header" style={{
                  background: 'linear-gradient(135deg, #fff9fa 0%, #fff0f2 100%)',
                  borderBottom: '1px solid #ffdfe4',
                  padding: '16px 24px'
                }}>
                  <h5 className="mb-0 d-flex align-items-center">
                    <FaBox className="mr-2" /> Đơn hàng gần đây
                  </h5>
                </div>
                <div className="card-body p-4">
                  <div className="row">
                    {recentOrders && recentOrders.length > 0 ? (
                      recentOrders.map((order, idx) => (
                        <div className="col-md-12" key={order.orderId || idx}>
                          <p style={{
                            lineHeight: '2',
                            color: '#555',
                            fontSize: '0.95rem'
                          }}>
                            <strong>Mã đơn hàng:</strong> {order.orderId}<br />
                            <strong>Ngày đặt:</strong> {new Date(order.orderDate).toLocaleDateString('vi-VN')}<br />
                            <strong>Trạng thái:</strong>{' '}
                            <span className={`badge badge-${
                              order.orderStatus === 'PENDING' ? 'warning' :
                              order.orderStatus === 'CONFIRMED' ? 'info' :
                              order.orderStatus === 'SHIPPING' ? 'primary' :
                              order.orderStatus === 'DELIVERED' ? 'success' :
                              order.orderStatus === 'CANCELLED' ? 'danger' : 'secondary'
                            }`} style={{
                              color: 'white',
                              border: 'none',
                              padding: '8px 20px',
                              borderRadius: '20px',
                              boxShadow: '0 4px 12px rgba(255, 107, 139, 0.3)'
                            }}>
                              Mua sắm ngay
                            </span>
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="col-md-12 text-center text-muted">Không có đơn hàng gần đây</div>
                    )}
                  </div>
                </div>
              </div>

              <div className="card mb-4" style={{
                border: 'none',
                borderRadius: '16px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.06)',
                overflow: 'hidden'
              }}>
                <div className="card-header" style={{
                  background: 'linear-gradient(135deg, #fff9fa 0%, #fff0f2 100%)',
                  borderBottom: '1px solid #ffdfe4',
                  padding: '16px 24px'
                }}>
                  <h5 className="mb-0 d-flex align-items-center">
                    <FaCreditCard className="mr-2" /> Phương thức thanh toán
                  </h5>
                </div>
                <div className="card-body p-4">
                  <p className="text-center w-100 text-muted">
                    <i className="fas fa-credit-card fa-2x mb-3 d-block" style={{color: '#d46a92'}}></i>
                    Chưa có phương thức thanh toán nào
                  </p>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
