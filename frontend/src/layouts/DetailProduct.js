import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getProductById, getProductReviews, addProductReview, deleteProductReview } from '../api/apiService';
import AddToCart from '../components/AddToCart';
import { jwtDecode } from 'jwt-decode';
import { Modal, Button, Form, Spinner } from 'react-bootstrap';
import { FaStar, FaTrash } from 'react-icons/fa';
// ... các import khác giữ nguyên

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const DetailProduct = () => {
  const query = useQuery();
  const id = query.get('productId');
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`http://localhost:8900/api/catalog/products/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Không tìm thấy sản phẩm');
        return res.json();
      })
      .then((data) => {
        setProduct(data);
        console.log('Product:', data);
        setLoading(false);
      })
      .catch(() => {
        setProduct(null);
        setLoading(false);
      });
  }, [id]);

  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState(null);
  const [userRating, setUserRating] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const productId = queryParams.get("productId");

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        if (!productId || productId === 'undefined') {
          setError('Thiếu mã sản phẩm.');
          setLoading(false);
          console.warn('productId bị null hoặc undefined:', productId);
          return;
        }
        const productData = await getProductById(productId);
        setProduct(productData);
        if (!productData || !productData.productName) {
          setError('Không tìm thấy thông tin sản phẩm hợp lệ.');
          setReviews([]);
          console.warn('productData hoặc productData.productName bị null:', productData);
          return;
        }
        try {
          const reviewsData = await getProductReviews(productData.productName);
          setReviews(Array.isArray(reviewsData) ? reviewsData : []);
        } catch (error) {
          setReviews([]);
          console.warn('Lỗi khi lấy đánh giá sản phẩm:', error);
        }
        setError(null);
      } catch (error) {
        setError('Không thể tải thông tin sản phẩm. Vui lòng thử lại sau.');
        console.error('Lỗi khi lấy thông tin sản phẩm:', error);
      } finally {
        setLoading(false);
      }
    };
    if (productId && productId !== 'undefined') fetchProductData();
    else {
      setError('Thiếu mã sản phẩm trên URL hoặc mã sản phẩm không hợp lệ.');
      setLoading(false);
    }
  }, [productId]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const handleRatingClick = async (rating) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        alert('Vui lòng đăng nhập để đánh giá sản phẩm');
        navigate('/login', { state: { from: location.pathname + location.search } });
        return;
      }

      // Decode token để lấy userId từ claims
      const decodedToken = jwtDecode(token);
      // userId được lưu trong claims.id
      const userId = decodedToken.id;

      if (!userId) {
        console.error('Token không chứa ID người dùng:', decodedToken);
        alert('Không thể xác định người dùng. Vui lòng đăng nhập lại');
        navigate('/login');
        return;
      }

      if (!product || !product.id) {
        alert('Không tìm thấy sản phẩm để đánh giá.');
        console.warn('product hoặc product.id bị null:', product);
        return;
      }

      console.log('Sending review with userId:', userId, 'productId:', product.id, 'rating:', rating);
      // Gọi API đánh giá sản phẩm
      const response = await addProductReview(userId, product.id, rating);
      if (response) {
        // Cập nhật lại danh sách đánh giá
        if (!product.productName) {
          console.warn('product.productName bị null khi lấy lại đánh giá:', product);
        } else {
          const reviewsData = await getProductReviews(product.productName);
          setReviews(Array.isArray(reviewsData) ? reviewsData : []);
        }
        setUserRating(rating);
        alert('Cảm ơn bạn đã đánh giá sản phẩm!');
      }
    } catch (error) {
      console.error('Lỗi khi đánh giá:', error);
      if (error.response?.status === 401) {
        alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại');
        navigate('/login');
      } else {
        alert('Không thể đánh giá sản phẩm. Vui lòng thử lại sau.');
      }
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

  if (error || !product) {
    return (
      <div className="container text-center py-5">
        <h2>{error || 'Không tìm thấy sản phẩm'}</h2>
        <Link to="/" className="btn btn-primary mt-3">
          Quay lại trang chủ
        </Link>
      </div>
    );
  }

  if (loading) return <div style={{padding:32, textAlign:'center'}}>Đang tải chi tiết sản phẩm...</div>;
  if (error) return (
    <div style={{padding:32, color:'red', textAlign:'center'}}>
      <h2>{error || 'Không tìm thấy sản phẩm'}</h2>
      <Link to="/" className="btn btn-primary mt-3">Quay lại trang chủ</Link>
    </div>
  );
  if (!product) return (
    <div style={{padding:32, color:'red', textAlign:'center'}}>
      <h2>Không tìm thấy sản phẩm</h2>
      <Link to="/" className="btn btn-primary mt-3">Quay lại trang chủ</Link>
    </div>
  );

  const averageRating = reviews.length > 0 
    ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length 
    : 0;

  return (
    <>
      <div style={{ background: "#fff", padding: "40px 0" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", gap: 48 }}>
          {/* Hình ảnh sản phẩm */}
          <div style={{ flex: "0 0 360px", textAlign: "center" }}>
            <img
              src={product?.imageUrl ? `http://localhost:8900/api/catalog/images/${product.imageUrl}` : ''}
              alt={product?.productName || 'Không có ảnh'}
              style={{ width: 320, height: 320, objectFit: 'contain', borderRadius: 16, background: '#f8f8f8' }}
            />
            {/* Slider dot (nếu có nhiều ảnh, ở đây chỉ minh họa) */}
            <div style={{ marginTop: 16 }}>
              <span style={{ display: "inline-block", width: 12, height: 12, borderRadius: 6, background: "#FFA991", margin: "0 4px" }}></span>
              <span style={{ display: "inline-block", width: 12, height: 12, borderRadius: 6, background: "#FFA991", opacity: 0.3, margin: "0 4px" }}></span>
              <span style={{ display: "inline-block", width: 12, height: 12, borderRadius: 6, background: "#FFA991", opacity: 0.3, margin: "0 4px" }}></span>
            </div>
          </div>
          {/* Thông tin chi tiết */}
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: 28, fontWeight: 600, marginBottom: 8 }}>{product?.productName || 'Không có tên sản phẩm'}</h1>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
              <span style={{ color: "#bbb", textDecoration: "line-through", fontSize: 20 }}>
                {product?.oldPrice ? formatPrice(product.oldPrice) : (product?.price ? formatPrice(product.price * 1.2) : '')}
              </span>
              <span style={{ color: "#222", fontWeight: 700, fontSize: 32 }}>
                {product?.price ? formatPrice(product.price) : 'Không có giá'}
              </span>
            </div>
            {/* Dịch vụ */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "18px 36px", marginBottom: 18, color: "#444", fontSize: 16 }}>
              <div><span role="img" aria-label="delivery">🚚</span> Giao hàng toàn quốc</div>
              <div><span role="img" aria-label="cod">💵</span> Thanh toán khi nhận hàng</div>
              <div><span role="img" aria-label="return">🔄</span> Cam kết đổi/trả hàng miễn phí</div>
              <div><span role="img" aria-label="warranty">🛡️</span> Hàng chính hãng/Bảo hành 10 năm</div>
            </div>
            {/* Bộ chọn số lượng và nút */}
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
              <QuantitySelector quantity={quantity} setQuantity={setQuantity} />
              <button
                onClick={() => handleAddToCart(product, quantity, setAddingToCart, navigate, location)}
                style={{
                  background: "#fff",
                  color: "#FF7753",
                  border: "2px solid #FF7753",
                  borderRadius: 6,
                  padding: "0 32px",
                  height: 44,
                  fontWeight: 600,
                  fontSize: 16,
                  marginRight: 8,
                  cursor: "pointer"
                }}
                disabled={addingToCart}
              >
                Thêm vào giỏ hàng
              </button>
              
            </div>
            {/* Thông tin thêm */}
            <div style={{ color: "#444", fontSize: 15, marginBottom: 8 }}>
              <b>Danh mục:</b> {product?.categoryName || 'Không có thông tin'}
            </div>
            <div style={{ color: "#444", fontSize: 15, marginBottom: 8 }}>
              <b>Số lượng còn:</b> {product?.availability ?? 'Không có thông tin'}
            </div>
            <div style={{ color: "#444", fontSize: 15 }}>
              <b>Mô tả:</b> {product?.description || 'Không có mô tả'}
            </div>
          </div>
        </div>
      </div>
      {/* --- ĐÁNH GIÁ SẢN PHẨM --- */}
      <ReviewSection product={product} reviews={reviews} setReviews={setReviews} />
      {/* --- KẾT THÚC ĐÁNH GIÁ SẢN PHẨM --- */}
    </>
  );
}

function QuantitySelector({ quantity, setQuantity }) {
  const handleDecrease = () => setQuantity(q => Math.max(1, q - 1));
  const handleIncrease = () => setQuantity(q => q + 1);
  const handleChange = (e) => {
    let val = parseInt(e.target.value, 10);
    if (isNaN(val) || val < 1) val = 1;
    setQuantity(val);
  };
  return (
    <div style={{ border: '1px solid #eee', borderRadius: 6, display: 'flex', alignItems: 'center', height: 44 }}>
      <button onClick={handleDecrease} style={{ border: 'none', background: 'none', fontSize: 22, width: 36, color: '#e38a8a' }}>-</button>
      <input type="number" min={1} value={quantity} onChange={handleChange} style={{ width: 40, border: 'none', textAlign: 'center', outline: 'none' }} />
      <button onClick={handleIncrease} style={{ border: 'none', background: 'none', fontSize: 22, width: 36, color: '#e38a8a' }}>+</button>
    </div>
  );
}

function getOrCreateCartId() {
  let cartId = localStorage.getItem('cartId');
  if (!cartId) {
    cartId = Math.random().toString(36).substring(2, 18);
    localStorage.setItem('cartId', cartId);
    document.cookie = `cartId=${cartId}; path=/;`;
  } else {
    // Đảm bảo cartId luôn có trong cookie (nếu user xóa cookie)
    if (!document.cookie.includes('cartId=')) {
      document.cookie = `cartId=${cartId}; path=/;`;
    }
  }
  return cartId;
}

async function handleAddToCart(product, quantity, setAddingToCart, navigate, location) {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      alert('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!');
      navigate('/login', { state: { from: location.pathname + location.search } });
      return;
    }
    if (!product || !product.id) {
      alert('Không tìm thấy sản phẩm để thêm vào giỏ hàng.');
      return;
    }
    // Đảm bảo luôn có cartId ở frontend trước khi thêm vào giỏ hàng
    getOrCreateCartId();
    setAddingToCart(true);
    const formData = new URLSearchParams({
      productId: product.id,
      quantity: quantity || 1
    });
    const response = await fetch('http://localhost:8900/api/shop/cart', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      credentials: 'include',
      body: formData
    });
    let responseData;
    try {
      responseData = await response.json();
    } catch (e) {
      responseData = { error: 'Không thể parse response thành JSON' };
    }
    if (response.ok) {
      alert('Đã thêm sản phẩm vào giỏ hàng!');
      window.dispatchEvent(new Event('cartUpdated'));
    } else {
      throw new Error(responseData.message || `Lỗi ${response.status}: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Lỗi khi thêm vào giỏ hàng:', error);
    if (error.message.includes('401') || error.message.includes('403')) {
      localStorage.removeItem('authToken');
      alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
      navigate('/login');
    }
  } finally {
    setAddingToCart(false);
  }
}

// ... (giữ lại các phần code phía trên)

// --- ĐÁNH GIÁ SẢN PHẨM ---

function ReviewSection({ product, reviews, setReviews }) {
  const [showModal, setShowModal] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem('authToken');
  let userId = null, userName = null;
  try {
    if (token) {
      const decoded = jwtDecode(token);
      userId = decoded.id;
      userName = decoded.sub;
    }
  } catch {}

  const hasReviewed = reviews.some(r => (r.userId === userId || r.userName === userName));

  const handleSubmit = async () => {
    if (!token) {
      alert('Vui lòng đăng nhập để đánh giá sản phẩm!');
      navigate('/login', { state: { from: location.pathname + location.search } });
      return;
    }
    setIsSubmitting(true);
    try {
      await addProductReview(userId, product.id, rating, comment.trim());
      const reviewsData = await getProductReviews(product.productName);
      setReviews(Array.isArray(reviewsData) ? reviewsData : []);
      setShowModal(false);
      setRating(5);
      setComment('');
      alert('Cảm ơn bạn đã đánh giá!');
    } catch (error) {
      alert('Không thể gửi đánh giá. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (reviewId) => {
    if (!window.confirm('Bạn chắc chắn muốn xóa đánh giá này?')) return;
    setDeletingId(reviewId);
    try {
      await deleteProductReview(reviewId);
      const reviewsData = await getProductReviews(product.productName);
      setReviews(Array.isArray(reviewsData) ? reviewsData : []);
    } catch {
      alert('Không thể xóa đánh giá. Vui lòng thử lại.');
    }
    setDeletingId(null);
  };

  return (
    <div style={{marginTop:48}}>
      <h3 style={{color:'#d46a92', fontWeight:700, marginBottom:16}}>Đánh giá sản phẩm</h3>
      <div style={{marginBottom:10, color:'#555', fontSize:15}}>
        Người dùng: <b>{userName ? userName : 'Khách'}</b>
      </div>
      <Button 
        variant="outline-primary" 
        style={{borderColor:'#ff6b8b', color:'#ff6b8b', fontWeight:600, marginBottom:18}}
        onClick={() => setShowModal(true)}
        disabled={hasReviewed}
      >
        {hasReviewed ? 'Bạn đã đánh giá sản phẩm này' : 'Đánh giá sản phẩm'}
      </Button>
      <div>
        {Array.isArray(reviews) && reviews.length > 0 ? (
          reviews.map(r => (
            <div key={r.id} style={{background:'#fff9fa', borderRadius:10, padding:18, marginBottom:14, boxShadow:'0 2px 10px #fcdff0'}}>
              <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:2}}>
                <span style={{fontWeight:600, color:'#d46a92', fontSize:16}}>{r.user && r.user.userName ? r.user.userName : 'Ẩn danh'}</span>
                <div style={{display:'flex', alignItems:'center', gap:8}}>
                  <span style={{color:'#aaa', fontSize:13}}>{new Date(r.createdDate).toLocaleDateString('vi-VN')}</span>
                  {(r.userId===userId||r.userName===userName) && (
                    <Button size="sm" variant="light" style={{color:'#dc3545'}} onClick={()=>handleDelete(r.id)} disabled={deletingId===r.id}>
                      {deletingId===r.id ? <Spinner size="sm"/> : <FaTrash/>}
                    </Button>
                  )}
                </div>
              </div>
              <div style={{margin:'4px 0 4px 0'}}>
                {[1,2,3,4,5].map(i => <FaStar key={i} color={i<=r.rating?'#ffc107':'#e4e5e9'} />)}
              </div>
              <div style={{marginTop:6, color:'#444', whiteSpace:'pre-line'}}>{r.comment}</div>
            </div>
          ))
        ) : <div style={{color:'#888'}}>Chưa có đánh giá nào cho sản phẩm này.</div>}
      </div>
      <Modal show={showModal} onHide={()=>setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Đánh giá sản phẩm</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <div className="d-flex mb-2">
              {[1,2,3,4,5].map(star => (
                <FaStar key={star} size={32} style={{cursor:'pointer', color:star<=rating?'#ffc107':'#e4e5e9'}} onClick={()=>setRating(star)} />
              ))}
            </div>
            <Form.Group>
              <Form.Label>Nhận xét (tùy chọn)</Form.Label>
              <Form.Control as="textarea" rows={3} value={comment} onChange={e=>setComment(e.target.value)} placeholder="Chia sẻ cảm nhận về sản phẩm..." />
            </Form.Group>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={()=>setShowModal(false)}>Hủy</Button>
          <Button variant="primary" style={{background:'#ff6b8b', borderColor:'#ff6b8b'}} onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? <Spinner size="sm"/> : 'Gửi đánh giá'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default DetailProduct;