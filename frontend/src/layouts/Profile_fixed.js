import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { getUserById } from '../api/apiService';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaUser, FaBox, FaShoppingBag, FaCreditCard } from 'react-icons/fa';

const Profile = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recentOrder, setRecentOrder] = useState(null);
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

        const response = await getUserById(userId);
        if (response) {
          setUserInfo(response);
          if (response.orders && Array.isArray(response.orders) && response.orders.length > 0) {
            const sortedOrders = response.orders.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
            setRecentOrder(sortedOrders[0]);
          }
        }
      } catch (error) {
        console.error('Lỗi khi lấy thông tin người dùng:', error);
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
    navigate('/login');
  };

  if (loading) {
    return <div className="text-center mt-5">Đang tải...</div>;
  }

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
            <div className="col-md-3">
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
                    <Link 
                      className="list-group-item list-group-item-action d-flex align-items-center text-danger" 
                      to="/logout" 
                      onClick={(e) => {
                        e.preventDefault();
                        if (window.confirm('Bạn có chắc chắn muốn đăng xuất?')) {
                          handleLogout();
                        }
                      }}
                    >
                      <i className="fas fa-sign-out-alt mr-2"></i> Đăng xuất
                    </Link>
                  </nav>
                </div>
              </div>
            </div>

            <div className="col-md-9">
              <div className="card mb-4" style={{
                border: 'none',
                borderRadius: '16px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.06)',
                overflow: 'hidden',
                background: '#fff'
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
                    <div className="d-flex align-items-start">
                      <div className="mr-4">
                        <img 
                          className="rounded-circle border" 
                          src={userInfo.image || "https://i.pinimg.com/736x/c3/c9/b1/c3c9b187b3cc4d4fe639982681ab3329.jpg"} 
                          alt="Ảnh đại diện"
                          style={{
                            width: '100px',
                            height: '100px',
                            objectFit: 'cover'
                          }}
                        />
                      </div>
                      <div>
                        <h5 style={{
                          color: '#333',
                          marginBottom: '10px'
                        }}>
                          {userInfo.userDetails?.firstName} {userInfo.userDetails?.lastName}
                        </h5>
                        <p className="text-muted mb-3">{userInfo.userDetails?.email}</p>
                        <Link 
                          to="/profile/settings" 
                          className="btn btn-sm"
                          style={{
                            background: '#ff6b8b',
                            color: 'white',
                            border: 'none',
                            borderRadius: '20px',
                            padding: '5px 15px',
                            boxShadow: '0 2px 8px rgba(255, 107, 139, 0.3)'
                          }}
                        >
                          Chỉnh sửa
                        </Link>
                      </div>
                    </div>
                  )}
                  <hr style={{
                    border: 0,
                    height: '1px',
                    background: 'linear-gradient(90deg, transparent, #ffb6b9, transparent)',
                    margin: '20px 0'
                  }} />
                  {userInfo && (
                    <div style={{
                      lineHeight: '2',
                      color: '#555',
                      fontSize: '0.95rem'
                    }}>
                      <div className="d-flex align-items-center">
                        <FaMapMarkerAlt className="mr-2" style={{color: '#ff6b8b'}} />
                        <span>{formatAddress(userInfo.userDetails)}</span>
                      </div>
                      <div className="d-flex align-items-center">
                        <FaPhone className="mr-2" style={{color: '#ff6b8b'}} />
                        <span>{userInfo.userDetails?.phoneNumber || 'Chưa cập nhật số điện thoại'}</span>
                      </div>
                      <div className="d-flex align-items-center">
                        <FaEnvelope className="mr-2" style={{color: '#ff6b8b'}} />
                        <span>{userInfo.userDetails?.email}</span>
                      </div>
                      <div className="d-flex align-items-center">
                        <FaUser className="mr-2" style={{color: '#ff6b8b'}} />
                        <span>{userInfo.userName}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="card mb-4" style={{
                border: 'none',
                borderRadius: '16px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.06)',
                overflow: 'hidden',
                background: '#fff'
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
                  {recentOrder ? (
                    <div>
                      <div style={{
                        lineHeight: '2',
                        color: '#555',
                        fontSize: '0.95rem',
                        marginBottom: '20px'
                      }}>
                        <div><strong>Mã đơn hàng:</strong> {recentOrder.orderId}</div>
                        <div><strong>Ngày đặt:</strong> {new Date(recentOrder.orderDate).toLocaleDateString('vi-VN')}</div>
                        <div className="d-flex align-items-center">
                          <strong>Trạng thái: </strong>
                          <span className={`badge ml-2 ${
                            recentOrder.orderStatus === 'PENDING' ? 'badge-warning' :
                            recentOrder.orderStatus === 'CONFIRMED' ? 'badge-info' :
                            recentOrder.orderStatus === 'SHIPPING' ? 'badge-primary' :
                            recentOrder.orderStatus === 'DELIVERED' ? 'badge-success' :
                            recentOrder.orderStatus === 'CANCELLED' ? 'badge-danger' : 'badge-secondary'
                          }`}>
                            {recentOrder.orderStatus === 'PENDING' ? 'Đang xử lý' :
                             recentOrder.orderStatus === 'CONFIRMED' ? 'Đã xác nhận' :
                             recentOrder.orderStatus === 'SHIPPING' ? 'Đang giao hàng' :
                             recentOrder.orderStatus === 'DELIVERED' ? 'Đã giao hàng' :
                             recentOrder.orderStatus === 'CANCELLED' ? 'Đã hủy' : recentOrder.orderStatus}
                          </span>
                        </div>
                      </div>
                      
                      <div className="table-responsive">
                        <table className="table table-hover">
                          <tbody>
                            {recentOrder.orderItems?.map((item) => (
                              <tr key={item.orderItemId}>
                                <td width="80">
                                  <img 
                                    src={`http://localhost:8900/api/public/products/image/${item.product.image}`} 
                                    className="img-fluid rounded border" 
                                    alt={item.product.productName}
                                    style={{
                                      width: '60px',
                                      height: '60px',
                                      objectFit: 'cover'
                                    }}
                                  />
                                </td>
                                <td>
                                  <div className="font-weight-bold">{item.product.productName}</div>
                                  <div className="text-muted">
                                    {item.orderedProductPrice?.toLocaleString('vi-VN')}đ x {item.quantity}
                                  </div>
                                </td>
                                <td className="text-right">
                                  <strong>{(item.orderedProductPrice * item.quantity)?.toLocaleString('vi-VN')}đ</strong>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <div className="text-right mt-4">
                        <div className="d-inline-block p-3 rounded" style={{
                          background: 'linear-gradient(135deg, #fff9fa 0%, #fff0f2 100%)',
                          border: '1px solid #ffdfe4',
                          borderRadius: '12px',
                          marginBottom: '20px'
                        }}>
                          <strong className="h5 mb-0">
                            Tổng tiền: <span style={{ color: '#ff6b8b' }}>{recentOrder.totalAmount?.toLocaleString('vi-VN')}đ</span>
                          </strong>
                        </div>
                        <div className="mt-3">
                          <Link 
                            to="/profile/orders" 
                            className="btn btn-sm"
                            style={{
                              background: '#ff6b8b',
                              color: 'white',
                              border: 'none',
                              padding: '8px 20px',
                              borderRadius: '20px',
                              boxShadow: '0 4px 12px rgba(255, 107, 139, 0.3)'
                            }}
                          >
                            <FaBox className="mr-2" /> Xem tất cả đơn hàng
                          </Link>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-5">
                      <i className="fas fa-shopping-bag fa-3x text-muted mb-3" style={{ color: '#d46a92' }}></i>
                      <p className="text-muted">Chưa có đơn hàng nào</p>
                      <Link 
                        to="/" 
                        className="btn btn-sm mt-2" 
                        style={{
                          background: '#ff6b8b',
                          color: 'white',
                          border: 'none',
                          padding: '8px 20px',
                          borderRadius: '20px',
                          boxShadow: '0 4px 12px rgba(255, 107, 139, 0.3)'
                        }}
                      >
                        Mua sắm ngay
                      </Link>
                    </div>
                  )}
                </div>
              </div>

              <div className="card mb-4" style={{
                border: 'none',
                borderRadius: '16px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.06)',
                overflow: 'hidden',
                background: '#fff'
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
                <div className="card-body p-4 text-center">
                  <i className="fas fa-credit-card fa-3x mb-3" style={{ color: '#d46a92' }}></i>
                  <p className="text-muted mb-0">Chưa có phương thức thanh toán nào</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
