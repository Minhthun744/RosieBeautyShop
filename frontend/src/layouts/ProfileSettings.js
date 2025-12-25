import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getUserById, updateUser } from '../api/apiService';
import { jwtDecode } from 'jwt-decode';
import { FaUser, FaMapMarkerAlt, FaBox, FaHeart, FaStore, FaCog, FaSignOutAlt, FaSave, FaKey } from 'react-icons/fa';

const ProfileSettings = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [formData, setFormData] = useState({
    userId: '',
    firstName: '',
    lastName: '',
    email: '',
    mobileNumber: '',
    password: '',
    roles: [],
    address: {
      addressId: 0,
      street: '',
      buildingName: '',
      city: '',
      state: '',
      country: '',
      pincode: ''
    },
    cart: null
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          navigate('/login');
          return;
        }

        const decodedToken = jwtDecode(token);
        const userId = decodedToken.id;

        const response = await getUserById(userId);
        setUserInfo(response);
        setFormData({
          userId: response.id,
          firstName: response.userDetails.firstName || '',
          lastName: response.userDetails.lastName || '',
          email: response.email || '',
          mobileNumber: response.userDetails.phoneNumber || '',
          password: response.password || '',
          roles: response.roles || [],
          address: {
            addressId: 0,
            street: response.userDetails.street || '',
            buildingName: response.userDetails.streetNumber || '',
            city: response.userDetails.locality || '',
            state: '',
            country: response.userDetails.country || '',
            pincode: response.userDetails.zipCode || ''
          },
          cart: response.cart || null
        });
      } catch (error) {
        console.error('Lỗi khi lấy thông tin người dùng:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      // Xử lý cho các trường trong address
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedUser = {
        ...userInfo,
        userDetails: {
          ...userInfo.userDetails,
          firstName: e.target.firstName.value,
          lastName: e.target.lastName.value,
          phoneNumber: e.target.mobileNumber.value,
          street: e.target.street.value,
          streetNumber: e.target.buildingName.value,
          zipCode: e.target.pincode.value,
          locality: e.target.city.value,
          country: e.target.country.value
        }
      };

      await updateUser(userInfo.id, updatedUser);
      alert('Cập nhật thông tin thành công');
      navigate('/profile');
    } catch (error) {
      console.error('Lỗi khi cập nhật thông tin:', error);
      alert('Có lỗi xảy ra khi cập nhật thông tin');
    }
  };

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
    fontWeight: '600',
    fontSize: '2rem',
    textTransform: 'uppercase',
    letterSpacing: '1px'
  };

  const cardStyle = {
    background: '#fff',
    borderRadius: '16px',
    padding: '25px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.06)',
    marginBottom: '30px',
    border: 'none'
  };

  const inputStyle = {
    borderRadius: '10px',
    border: '1px solid #e0e0e0',
    padding: '12px 15px',
    fontSize: '0.95rem',
    '&:focus': {
      borderColor: '#ff6b8b',
      boxShadow: '0 0 0 0.2rem rgba(255, 107, 139, 0.25)'
    }
  };

  const btnPrimary = {
    background: '#ff6b8b',
    border: 'none',
    borderRadius: '20px',
    padding: '10px 25px',
    fontWeight: '500',
    boxShadow: '0 4px 12px rgba(255, 107, 139, 0.3)',
    '&:hover': {
      background: '#e65a7a',
      transform: 'translateY(-2px)'
    }
  };

  const btnOutline = {
    background: 'transparent',
    border: '1px solid #ff6b8b',
    color: '#ff6b8b',
    borderRadius: '20px',
    padding: '10px 25px',
    fontWeight: '500',
    '&:hover': {
      background: 'rgba(255, 107, 139, 0.1)'
    }
  };

  if (loading) {
    return (
      <div style={bgStyle}>
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
          <div className="spinner-border text-pink" role="status">
            <span className="sr-only">Đang tải...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!userInfo) {
    return (
      <div style={bgStyle}>
        <div className="container text-center py-5">
          <div className="alert alert-danger">Không tìm thấy thông tin người dùng</div>
          <Link to="/login" className="btn btn-pink">Đăng nhập lại</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={bgStyle}>
      <div className="container" style={wrapperStyle}>
        <h2 style={titleStyle}>CÀI ĐẶT TÀI KHOẢN</h2>
        <div className="row">
          <aside className="col-md-3">
            <div className="card" style={{
              border: 'none',
              borderRadius: '16px',
              boxShadow: '0 4px 15px rgba(0,0,0,0.06)',
              overflow: 'hidden',
              background: '#fff9fa',
              marginBottom: '20px'
            }}>
              <div className="card-body p-0">
                <nav className="list-group list-group-flush">
                  <Link className="list-group-item list-group-item-action d-flex align-items-center" to="/profile">
                    <FaUser className="mr-2" /> Tổng quan tài khoản
                  </Link>
                  <Link className="list-group-item list-group-item-action d-flex align-items-center" to="/profile/address">
                    <FaMapMarkerAlt className="mr-2" /> Địa chỉ của tôi
                  </Link>
                  <Link className="list-group-item list-group-item-action d-flex align-items-center" to="/profile/orders">
                    <FaBox className="mr-2" /> Đơn hàng của tôi
                  </Link>
                  <Link className="list-group-item list-group-item-action d-flex align-items-center" to="/profile/wishlist">
                    <FaHeart className="mr-2" /> Danh sách yêu thích
                  </Link>
                  <Link className="list-group-item list-group-item-action d-flex align-items-center" to="/profile/selling">
                    <FaStore className="mr-2" /> Sản phẩm đang bán
                  </Link>
                  <Link 
                    className="list-group-item list-group-item-action d-flex align-items-center active" 
                    to="/profile/settings"
                    style={{
                      background: 'rgba(255, 107, 139, 0.1)',
                      borderLeft: '4px solid #ff6b8b',
                      color: '#d46a92'
                    }}
                  >
                    <FaCog className="mr-2" /> Cài đặt
                  </Link>
                  <Link 
                    className="list-group-item list-group-item-action d-flex align-items-center text-danger" 
                    to="/logout" 
                    onClick={(e) => {
                      e.preventDefault();
                      if (window.confirm('Bạn có chắc chắn muốn đăng xuất?')) {
                        window.location.href = '/logout';
                      }
                    }}
                  >
                    <FaSignOutAlt className="mr-2" /> Đăng xuất
                  </Link>
                </nav>
              </div>
            </div>

            <div className="text-center">
              <img 
                src={userInfo?.image || "https://i.pinimg.com/736x/c3/c9/b1/c3c9b187b3cc4d4fe639982681ab3329.jpg"} 
                className="img-fluid rounded-circle border" 
                alt="Ảnh đại diện" 
                style={{
                  width: '120px',
                  height: '120px',
                  objectFit: 'cover',
                  border: '3px solid #ff6b8b',
                  padding: '3px'
                }}
              />
              <h5 className="mt-3 mb-0">{formData.firstName} {formData.lastName}</h5>
              <p className="text-muted">{formData.email}</p>
            </div>
          </aside>

          <main className="col-md-9">
            <div className="card" style={cardStyle}>
              <div className="card-body">
                <h4 className="mb-4" style={{ color: '#d46a92' }}>Thông tin cá nhân</h4>
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group mb-4">
                        <label className="form-label">Họ</label>
                        <input 
                          type="text" 
                          className="form-control" 
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          style={inputStyle}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group mb-4">
                        <label className="form-label">Tên</label>
                        <input 
                          type="text" 
                          className="form-control" 
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          style={inputStyle}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group mb-4">
                        <label className="form-label">Email</label>
                        <input 
                          type="email" 
                          className="form-control bg-light" 
                          name="email"
                          value={formData.email}
                          readOnly
                          style={{
                            ...inputStyle,
                            cursor: 'not-allowed',
                            backgroundColor: '#f8f9fa'
                          }}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group mb-4">
                        <label className="form-label">Số điện thoại</label>
                        <input 
                          type="text" 
                          className="form-control" 
                          name="mobileNumber"
                          value={formData.mobileNumber}
                          onChange={handleInputChange}
                          style={inputStyle}
                        />
                      </div>
                    </div>
                  </div>

                  <h5 className="mt-5 mb-4" style={{ color: '#d46a92' }}>Địa chỉ</h5>
                  
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group mb-4">
                        <label className="form-label">Số nhà, tên đường</label>
                        <input 
                          type="text" 
                          className="form-control" 
                          name="street"
                          value={formData.address.street}
                          onChange={handleInputChange}
                          style={inputStyle}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group mb-4">
                        <label className="form-label">Tên tòa nhà</label>
                        <input 
                          type="text" 
                          className="form-control" 
                          name="buildingName"
                          value={formData.address.buildingName}
                          onChange={handleInputChange}
                          style={inputStyle}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group mb-4">
                        <label className="form-label">Tỉnh/Thành phố</label>
                        <input 
                          type="text" 
                          className="form-control" 
                          name="city"
                          value={formData.address.city}
                          onChange={handleInputChange}
                          style={inputStyle}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group mb-4">
                        <label className="form-label">Quận/Huyện</label>
                        <input 
                          type="text" 
                          className="form-control" 
                          name="state"
                          value={formData.address.state}
                          onChange={handleInputChange}
                          style={inputStyle}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group mb-4">
                        <label className="form-label">Quốc gia</label>
                        <input 
                          type="text" 
                          className="form-control" 
                          name="country"
                          value={formData.address.country}
                          onChange={handleInputChange}
                          style={inputStyle}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group mb-4">
                        <label className="form-label">Mã bưu điện</label>
                        <input 
                          type="text" 
                          className="form-control" 
                          name="pincode"
                          value={formData.address.pincode}
                          onChange={handleInputChange}
                          style={inputStyle}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="d-flex justify-content-between align-items-center mt-5">
                    <div>
                      <button 
                        type="submit" 
                        className="btn mr-3"
                        style={btnPrimary}
                      >
                        <FaSave className="mr-2" /> Lưu thay đổi
                      </button>
                      <Link 
                        to="/change-password" 
                        className="btn"
                        style={btnOutline}
                      >
                        <FaKey className="mr-2" /> Đổi mật khẩu
                      </Link>
                    </div>
                    <div>
                      <Link to="/profile" className="text-muted">
                        <i className="fas fa-arrow-left mr-1"></i> Quay lại
                      </Link>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
};

export default ProfileSettings;
