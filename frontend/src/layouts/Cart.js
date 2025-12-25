import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { getCart, updateCartItem, removeFromCart } from '../api/apiService';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      setLoading(true);
      
      // Lấy hoặc tạo cartId từ cookie
      let cartId = document.cookie
        .split('; ')
        .find(row => row.startsWith('cartId='))
        ?.split('=')[1];

      if (!cartId) {
        cartId = Date.now().toString();
        document.cookie = `cartId=${cartId}; path=/; SameSite=Lax; Secure`;
      }

      // Gọi API lấy giỏ hàng
      const cartData = await getCart(cartId);
      setCartItems(cartData.products || []);
      setTotalPrice(cartData.totalPrice || 0);
      
    } catch (error) {
      console.error('Lỗi khi lấy thông tin giỏ hàng:', error);
      
      // Xử lý lỗi xác thực
      if (error.response?.status === 401) {
        localStorage.removeItem('authToken');
        navigate('/login');
        return;
      }
      
      // Hiển thị thông báo lỗi cho người dùng
      alert('Không thể tải giỏ hàng. Vui lòng thử lại sau.');
      
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleQuantityChange = async (productId, newQuantity) => {
    try {
      if (newQuantity < 1 || newQuantity > 100) {
        return;
      }
      await updateCartItem(productId, newQuantity);
      await fetchCart();
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (error) {
      console.error('Lỗi khi cập nhật số lượng:', error);
      alert('Có lỗi xảy ra khi cập nhật số lượng');
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      await removeFromCart(productId);
      await fetchCart();
      window.dispatchEvent(new Event('cartUpdated'));
      alert('Đã xóa sản phẩm khỏi giỏ hàng');
    } catch (error) {
      console.error('Lỗi khi xóa sản phẩm:', error);
      alert('Có lỗi xảy ra khi xóa sản phẩm');
    }
  };

  if (loading) {
    return (
      <div className="container text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Đang tải...</span>
        </div>
      </div>
    );
  }

  const bgStyle = {
    background: "linear-gradient(135deg, #ffb6b9 0%, #fcdff0 100%)",
    minHeight: "100vh",
    padding: "48px 0 32px 0",
    fontFamily: "'Quicksand', 'Roboto', Arial, sans-serif"
  };

  const wrapperStyle = {
    background: "rgba(255,255,255,0.97)",
    borderRadius: 22,
    boxShadow: "0 6px 32px rgba(255,182,185,0.16)",
    maxWidth: 1200,
    margin: "0 auto",
    padding: "40px 32px 32px 32px"
  };

  const titleStyle = {
    fontSize: 32,
    fontWeight: 800,
    marginBottom: 30,
    color: "#d46a92", // Giữ đúng màu tiêu đề đồng bộ
    textAlign: "center",
    letterSpacing: 1,
    position: 'relative',
    paddingBottom: '15px'
  };

  titleStyle[':after'] = {
    content: '""',
    position: 'absolute',
    width: '80px',
    height: '4px',
    background: '#ffb6b9',
    bottom: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    borderRadius: '2px'
  };

  return (
    <div style={bgStyle}>
      <div style={wrapperStyle}>
        <h2 style={titleStyle}>GIỎ HÀNG CỦA TÔI</h2>
        <div className="section-content">
        <div className="container">
          <div className="row">
            <main className="col-md-9">
              <div className="card">
  <table className="table align-middle" style={{marginBottom: 0}}>
    <thead style={{background: '#fafbfc'}}>
      <tr className="text-center">
        <th style={{width: 40}}></th>
        <th style={{minWidth: 220}}>Thông tin sản phẩm</th>
        <th style={{width: 120}}>Đơn giá</th>
        <th style={{width: 140}}>Số lượng</th>
        <th style={{width: 120}}>Thành tiền</th>
        <th style={{width: 60}}></th>
      </tr>
    </thead>
    <tbody>
      {cartItems.length > 0 ? (
        cartItems.map((item) => (
          <tr key={item.product.id}>
            <td className="text-center">
              <input type="checkbox" />
            </td>
            <td>
              <div className="d-flex align-items-center">
                <img src={`http://localhost:8900/api/catalog/images/${item.product.imageUrl}`} alt={item.product.productName} style={{width: 60, height: 60, objectFit: 'cover', borderRadius: 8, marginRight: 14, border: '1px solid #eee'}} />
                <div>
                  <div style={{fontWeight: 600, fontSize: 15}}>{item.product.productName}</div>
                  <div className="text-muted small">{item.product.description}</div>
                  <button onClick={() => handleRemoveItem(item.product.id)} className="btn btn-link p-0 text-danger" style={{fontSize: 15}}>Xoá</button>
                </div>
              </div>
            </td>
            <td className="text-center" style={{color: 'red', fontWeight: 600}}>
              {item.product.price.toLocaleString('vi-VN')}đ
            </td>
            <td className="text-center">
              <div className="d-inline-flex align-items-center border rounded px-2 py-1" style={{background: '#fff'}}>
                <button 
                  className="btn btn-sm btn-light px-2"
                  style={{fontSize: 18, fontWeight: 700}}
                  onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                >-</button>
                <span className="mx-2" style={{minWidth: 22, display: 'inline-block'}}>{item.quantity}</span>
                <button 
                  className="btn btn-sm btn-light px-2"
                  style={{fontSize: 18, fontWeight: 700}}
                  onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                  disabled={item.quantity >= 100}
                >+</button>
              </div>
            </td>
            <td className="text-center" style={{color: 'red', fontWeight: 600}}>
              {(item.product.price * item.quantity).toLocaleString('vi-VN')}đ
            </td>
            <td className="text-center">
              <button 
                onClick={() => handleRemoveItem(item.product.id)}
                className="btn btn-link p-0"
                title="Xoá sản phẩm"
                style={{color: 'red', fontSize: 20}}
              >
                <i className="fa fa-trash"></i>
              </button>
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan="6" className="text-center py-5">
            <p>Giỏ hàng trống</p>
            <Link to="/" className="btn btn-primary " style={{boxShadow: '0 4px 12px rgba(255, 107, 139, 0.4)',background: '#ff6b8b'}}>Tiếp tục mua sắm</Link>
          </td>
        </tr>
      )}
    </tbody>
    {cartItems.length > 0 && (
      <tfoot>
        <tr>
          <td colSpan="4" className="text-right" style={{fontWeight: 600, fontSize: 17}}>Tổng tiền:</td>
          <td className="text-center" style={{color: 'red', fontWeight: 700, fontSize: 17}}>
            {totalPrice.toLocaleString('vi-VN')}đ
          </td>
          <td></td>
        </tr>
      </tfoot>
    )}
  </table>
  <div className="card-body border-top text-right" style={{
  background: '#fff9fa',
  padding: '20px 30px'
}}>
    <button
      className="btn btn-lg px-5"
      style={{
        background: '#ff6b8b',
        border: 'none',
        borderRadius: '10px',
        padding: '12px 30px',
        fontWeight: '600',
        letterSpacing: '0.5px',
        transition: 'all 0.3s ease',
        opacity: cartItems.length === 0 ? 0.6 : 1,
        pointerEvents: cartItems.length === 0 ? 'none' : 'auto',
        ':hover': {
          background: '#ff4d6d',
          transform: 'translateY(-2px)',
          boxShadow: '0 4px 12px rgba(255, 107, 139, 0.4)'
        }
      }}
      disabled={cartItems.length === 0}
      onClick={() => navigate('/checkout')}
    >
      Thanh toán
    </button>
  </div>
</div>

             
            </main>

            {cartItems.length > 0 && (
              <aside className="col-md-3">
                <div className="card mb-3" style={{
  border: 'none',
  borderRadius: '16px',
  overflow: 'hidden',
  boxShadow: '0 4px 15px rgba(0,0,0,0.06)'
}}>
                  
                </div>

               
              </aside>
            )}
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
