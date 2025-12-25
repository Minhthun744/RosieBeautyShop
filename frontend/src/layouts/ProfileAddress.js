import React from 'react';
import { Link } from 'react-router-dom';

const ProfileAddress = () => {
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

  const mapContainerStyle = {
    width: '100%',
    height: '400px',
    borderRadius: '16px',
    overflow: 'hidden',
    marginBottom: '30px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
  };

  const addressCardStyle = {
    background: '#fff',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '20px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
    transition: 'transform 0.3s, box-shadow 0.3s',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 8px 25px rgba(0,0,0,0.1)'
    }
  };

  return (
    <div style={bgStyle}>
      <div className="container" style={wrapperStyle}>
        <h2 style={titleStyle}>ĐỊA CHỈ CỦA TÔI</h2>
        <div className="row">
          <aside className="col-md-3">
            <div className="card" style={{
              border: 'none',
              borderRadius: '16px',
              boxShadow: '0 4px 15px rgba(0,0,0,0.06)',
              overflow: 'hidden',
              background: '#fff9fa'
            }}>
              <div className="card-body p-0">
                <nav className="list-group list-group-flush">
                  <Link className="list-group-item list-group-item-action d-flex align-items-center" to="/profile">
                    <i className="fas fa-user mr-2"></i> Tổng quan tài khoản
                  </Link>
                  <Link className="list-group-item list-group-item-action d-flex align-items-center active" to="/profile/address" style={{
                    background: 'rgba(255, 107, 139, 0.1)',
                    borderLeft: '4px solid #ff6b8b',
                    color: '#d46a92'
                  }}>
                    <i className="fas fa-map-marker-alt mr-2"></i> Địa chỉ của tôi
                  </Link>
                  <Link className="list-group-item list-group-item-action d-flex align-items-center" to="/profile/orders">
                    <i className="fas fa-box mr-2"></i> Đơn hàng của tôi
                  </Link>
                  <Link className="list-group-item list-group-item-action d-flex align-items-center" to="/profile/wishlist">
                    <i className="fas fa-heart mr-2"></i> Danh sách yêu thích
                  </Link>
                  <Link className="list-group-item list-group-item-action d-flex align-items-center" to="/profile/selling">
                    <i className="fas fa-store mr-2"></i> Sản phẩm đang bán
                  </Link>
                  <Link className="list-group-item list-group-item-action d-flex align-items-center" to="/profile/settings">
                    <i className="fas fa-cog mr-2"></i> Cài đặt
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
                    <i className="fas fa-sign-out-alt mr-2"></i> Đăng xuất
                  </Link>
                </nav>
              </div>
            </div>
          </aside>

          <main className="col-md-9">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className="mb-0" style={{ color: '#d46a92' }}>Địa chỉ giao hàng</h4>
              <Link 
                to="/profile/address/add" 
                className="btn"
                style={{
                  background: '#ff6b8b',
                  color: 'white',
                  border: 'none',
                  borderRadius: '20px',
                  padding: '8px 20px',
                  boxShadow: '0 4px 12px rgba(255, 107, 139, 0.3)'
                }}
              >
                <i className="fas fa-plus mr-2"></i> Thêm địa chỉ mới
              </Link>
            </div>

            {/* Bản đồ Hồ Chí Minh */}
            <div style={mapContainerStyle}>
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d501726.4604585515!2d106.41503808359376!3d10.754666399999995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317529292e8d3dd1%3A0xf15f5aad773c112b!2zSOG7kyBIb8OgIEtp4buHdCBOZ8OsbmggQ2hp4buDdSBUaOG6r25nIE5naGnhu4d0IFRow6BuaCBUaOG6oWkga2hvYSBI4buTbmcgUXXhu5FjIHThuiBE4Lijbg!5e0!3m2!1svi!2s!4v1620000000000!5m2!1svi!2s" 
                width="100%" 
                height="100%" 
                style={{border:0}} 
                allowFullScreen="" 
                loading="lazy"
                title="Bản đồ Hồ Chí Minh"
              ></iframe>
            </div>

            <div className="row">
              {/* Địa chỉ mặc định */}
              <div className="col-md-6">
                <div style={{
                  ...addressCardStyle,
                  border: '2px solid #ff6b8b'
                }}>
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <h5 className="mb-0">Địa chỉ mặc định</h5>
                    <span className="badge" style={{
                      background: '#ff6b8b',
                      color: 'white',
                      padding: '5px 10px',
                      borderRadius: '12px',
                      fontSize: '0.8rem'
                    }}>Mặc định</span>
                  </div>
                  <p className="mb-2"><strong>Họ tên:</strong> Nguyễn Văn A</p>
                  <p className="mb-2"><strong>Điện thoại:</strong> 0909 123 456</p>
                  <p className="mb-3">
                    <strong>Địa chỉ:</strong> 123 Đường Lê Lợi, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh
                  </p>
                  <div>
                    <button className="btn btn-sm btn-light mr-2" style={{
                      borderRadius: '15px',
                      padding: '5px 15px',
                      border: '1px solid #ddd'
                    }}>
                      <i className="fas fa-edit mr-1"></i> Chỉnh sửa
                    </button>
                    <button className="btn btn-sm btn-light" style={{
                      borderRadius: '15px',
                      padding: '5px 15px',
                      border: '1px solid #ff6b8b',
                      color: '#ff6b8b'
                    }}>
                      <i className="fas fa-trash-alt mr-1"></i> Xóa
                    </button>
                  </div>
                </div>
              </div>

              {/* Địa chỉ khác */}
              <div className="col-md-6">
                <div style={addressCardStyle}>
                  <h5 className="mb-3">Địa chỉ khác</h5>
                  <p className="mb-2"><strong>Họ tên:</strong> Trần Thị B</p>
                  <p className="mb-2"><strong>Điện thoại:</strong> 0987 654 321</p>
                  <p className="mb-3">
                    <strong>Địa chỉ:</strong> 456 Đường Nguyễn Văn Linh, Phường Tân Thuận Đông, Quận 7, TP. Hồ Chí Minh
                  </p>
                  <div>
                    <button className="btn btn-sm btn-light mr-2" style={{
                      borderRadius: '15px',
                      padding: '5px 15px',
                      border: '1px solid #ddd'
                    }}>
                      <i className="fas fa-edit mr-1"></i> Chỉnh sửa
                    </button>
                    <button className="btn btn-sm btn-light mr-2" style={{
                      borderRadius: '15px',
                      padding: '5px 15px',
                      border: '1px solid #ff6b8b',
                      marginRight: '10px'
                    }}>
                      <i className="fas fa-check mr-1"></i> Đặt làm mặc định
                    </button>
                    <button className="btn btn-sm btn-light" style={{
                      borderRadius: '15px',
                      padding: '5px 15px',
                      border: '1px solid #ff6b8b',
                      color: '#ff6b8b'
                    }}>
                      <i className="fas fa-trash-alt mr-1"></i> Xóa
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default ProfileAddress;
