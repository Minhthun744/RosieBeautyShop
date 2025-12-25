import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { getOrdersByUserName, getProductReviews, deleteProductReview, cancelOrder, addProductReview, deleteOrder, searchProducts } from "../api/apiService";
import { FaBox, FaTruck, FaCheckCircle, FaTimesCircle, FaStar, FaTrash, FaShoppingBag, FaEye, FaInfoCircle, FaHourglassHalf, FaClipboardCheck, FaMoneyCheckAlt } from "react-icons/fa";
import OrderDetailsModal from "../components/OrderDetailsModal";
import { Button, Modal, Form, Spinner } from "react-bootstrap";

const ProfileOrders = () => {
  // Hàm xử lý xoá đơn hàng
  const handleDeleteOrder = async (orderId) => {
    // Xác nhận trước khi xoá
    if (!window.confirm('Bạn có chắc chắn muốn xoá đơn hàng này? Hành động này không thể hoàn tác.')) {
      return;
    }

    try {
      setUpdatingOrder(orderId);
      console.log('Thực hiện xoá đơn hàng:', orderId);
      
      // Cập nhật UI ngay lập tức
      setOrders(prevOrders => prevOrders.filter(order => order.id !== orderId));
      
      // Gọi API xoá đơn hàng
      await deleteOrder(orderId);
      
      console.log('Đã xoá đơn hàng thành công:', orderId);
      // Không cần thông báo vì đã xoá trực tiếp trên UI
    } catch (error) {
      console.error('Lỗi khi xoá đơn hàng:', error);
      // Nếu có lỗi, cập nhật lại danh sách từ server
      try {
        const response = await getOrdersByUserName(jwtDecode(localStorage.getItem("authToken")).sub);
        setOrders(response.orders || []);
      } catch (e) {
        console.error('Lỗi khi lấy lại danh sách đơn hàng:', e);
      }
      const errorMessage = error?.response?.data?.message || error?.message || 'Không thể xoá đơn hàng';
      alert(`Lỗi: ${errorMessage}\nVui lòng thử lại sau.`);
    } finally {
      setUpdatingOrder(null);
    }
};
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productReviews, setProductReviews] = useState({});
  const reviewCache = useRef(new Map()); // Cache for storing fetched reviews
  const [updatingOrder, setUpdatingOrder] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const navigate = useNavigate();

  const fetchProductReviews = async (productName) => {
    // Return cached reviews if available
    if (reviewCache.current.has(productName)) {
      return reviewCache.current.get(productName);
    }

    try {
      const reviews = await getProductReviews(productName);
      const result = reviews || [];
      // Cache the result
      reviewCache.current.set(productName, result);
      return result;
    } catch (error) {
      console.error(`Lỗi khi lấy đánh giá cho sản phẩm ${productName}:`, error);
      return [];
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          navigate("/login");
          return;
        }

        try {
          const decodedToken = jwtDecode(token);
          const userName = decodedToken.sub;
          if (!userName) {
            console.error('Không tìm thấy userName trong token');
            navigate('/login');
            return;
          }
          const response = await getOrdersByUserName(userName);
          // Đảm bảo lấy tất cả đơn hàng, không lọc trạng thái
          const ordersData = Array.isArray(response.orders) ? response.orders : [];
          // Nếu backend trả về phân trang, cần lấy tất cả các trang ở đây
          // (Nếu cần, bổ sung logic fetch nhiều trang)
          // Sắp xếp giảm dần theo ngày đặt hàng
          ordersData.sort((a, b) => new Date(b.orderedDate) - new Date(a.orderedDate));
          setOrders(ordersData);

          // Lấy danh sách tất cả sản phẩm đã mua (không trùng lặp)
          const uniqueProducts = [];
          const seenProductIds = new Set();
          
          ordersData
            .filter(order => order.status === "PAID" && order.items)
            .flatMap(order => order.items || [])
            .forEach(item => {
              if (!seenProductIds.has(item.product.id)) {
                seenProductIds.add(item.product.id);
                uniqueProducts.push(item.product);
              }
            });
          
          // Tạo một promise cho mỗi sản phẩm để lấy đánh giá
          const reviewsPromises = uniqueProducts.map(async (product) => {
            try {
              const reviews = await fetchProductReviews(product.productName);
              return { [product.productName]: reviews };
            } catch (error) {
              console.error(`Error fetching reviews for ${product.productName}:`, error);
              return {};
            }
          });

          // Chờ tất cả các promise hoàn thành và kết hợp kết quả
          const reviewsResults = await Promise.all(reviewsPromises);
          const reviewsMap = reviewsResults.reduce((acc, curr) => ({ ...acc, ...curr }), {});
          setProductReviews(reviewsMap);
        } catch (error) {
          console.error("Lỗi khi decode token hoặc lấy danh sách đơn hàng:", error);
        }
      } catch (error) {
        console.error("Lỗi khi lấy token hoặc navigate:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  const handleCancelOrder = async (orderId) => {
    if (window.confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) {
      try {
        setUpdatingOrder(orderId);
        await cancelOrder(orderId);
        const response = await getOrdersByUserName(jwtDecode(localStorage.getItem("authToken")).sub);
        setOrders(response.orders || []);
        alert('Đã hủy đơn hàng thành công!');
      } catch (error) {
        console.error('Lỗi khi hủy đơn hàng:', error);
        alert('Không thể hủy đơn hàng. Vui lòng thử lại sau.');
      } finally {
        setUpdatingOrder(null);
      }
    }
  };

  const handleDeleteReview = async (reviewId, productName) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa đánh giá này?')) {
      try {
        await deleteProductReview(reviewId);
        // Cập nhật lại danh sách đánh giá
        const updatedReviews = await fetchProductReviews(productName);
        setProductReviews(prev => ({
          ...prev,
          [productName]: updatedReviews
        }));
        alert('Đã xóa đánh giá thành công!');
      } catch (error) {
        console.error('Lỗi khi xóa đánh giá:', error);
        alert('Không thể xóa đánh giá. Vui lòng thử lại sau.');
      }
    }
  };

  // Kiểm tra xem sản phẩm đã được mua chưa
  const hasPurchasedProduct = (productId) => {
    return orders.some(order => 
      order.status === 'PAID' && 
      order.items?.some(item => item.product.id === productId)
    );
  };

  const handleReviewSubmit = async () => {
    if (!selectedProduct) {
      alert('Không tìm thấy thông tin sản phẩm');
      return;
    }

    if (!reviewRating) {
      alert('Vui lòng chọn số sao đánh giá');
      return;
    }

    if (!hasPurchasedProduct(selectedProduct.id)) {
      alert('Bạn cần mua sản phẩm này trước khi đánh giá');
      return;
    }

    setIsSubmittingReview(true);
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        navigate('/login');
        return;
      }
      
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.sub;

      console.log('Submitting review for product:', {
        productName: selectedProduct.productName,
        orderProductId: selectedProduct.id,
        userId,
        rating: reviewRating,
        comment: reviewComment.trim()
      });
      
      // Sử dụng tên sản phẩm để gọi API, hàm addProductReview sẽ tự động lấy đúng ID từ CSDL
      await addProductReview(
        userId,
        selectedProduct.productName, // Gửi tên sản phẩm thay vì ID
        reviewRating,
        reviewComment.trim()
      );

      // Clear the cache for this product's reviews
      reviewCache.current.delete(selectedProduct.productName);
      
      // Fetch fresh reviews
      const updatedReviews = await fetchProductReviews(selectedProduct.productName);
      
      // Update state with the new review
      setProductReviews(prev => ({
        ...prev,
        [selectedProduct.productName]: updatedReviews || []
      }));

      // Reset form
      setReviewRating(5);
      setReviewComment('');
      
      // Show success message
      alert('Cảm ơn bạn đã đánh giá sản phẩm!');
      setShowReviewModal(false);
      
      // Refresh orders to update the display
      const response = await getOrdersByUserName(userId);
      const ordersData = response.orders || [];
      ordersData.sort((a, b) => new Date(a.orderedDate) - new Date(b.orderedDate));
      setOrders(ordersData);
    } catch (error) {
      console.error('Lỗi khi đánh giá sản phẩm:', error);
      const errorMessage = error.response?.data?.message || 'Có lỗi xảy ra khi gửi đánh giá. Vui lòng thử lại sau.';
      alert(errorMessage);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  // Hàm kiểm tra xem người dùng đã đánh giá sản phẩm chưa
  const hasReviewedProduct = (productId) => {
    const token = localStorage.getItem("authToken");
    if (!token) return false;
    
    const decodedToken = jwtDecode(token);
    const userName = decodedToken.sub;
    
    return Object.values(productReviews).some(reviews => 
      Array.isArray(reviews) && 
      reviews.some(review => 
        review.productId === productId && 
        (review.userName === userName || review.userId === userName)
      )
    );
  };

  const ReviewModal = () => (
    <Modal show={showReviewModal} onHide={() => setShowReviewModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Đánh giá sản phẩm</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {selectedProduct && (
          <>
            <h5>{selectedProduct.productName}</h5>
            <div className="my-3">
              <p className="mb-2">Đánh giá của bạn:</p>
              <div className="d-flex mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar
                    key={star}
                    size={30}
                    className="me-2"
                    style={{ 
                      cursor: 'pointer',
                      color: star <= reviewRating ? '#ffc107' : '#e4e5e9'
                    }}
                    onClick={() => setReviewRating(star)}
                  />
                ))}
              </div>
              <Form.Group className="mb-3">
                <Form.Label>Nhận xét (tùy chọn)</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Hãy chia sẻ cảm nhận của bạn về sản phẩm..."
                />
              </Form.Group>
            </div>
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowReviewModal(false)}>
          Hủy
        </Button>
        <Button 
          variant="primary" 
          style={{
            background: '#ff6b8b',
            borderColor: '#ff6b8b',
            ':hover': {
              background: '#ff4d6d',
              borderColor: '#ff4d6d'
            }
          }} 
          onClick={handleReviewSubmit}
          disabled={isSubmittingReview}
        >
          {isSubmittingReview ? (
            <>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
                className="me-2"
              />
              Đang gửi...
            </>
          ) : 'Gửi đánh giá'}
        </Button>
      </Modal.Footer>
    </Modal>
  );

  const getUserReviewForProduct = (productName, userName) => {
    const reviews = productReviews[productName] || [];
    return reviews.find(review => {
      const reviewUserName = review.userName || review.userId;
      return reviewUserName === userName;
    });
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="row">
          <div className="col-md-3">
            <div className="card">
              <div className="card-body">
                <div className="skeleton-loading" style={{height: '200px'}}></div>
              </div>
            </div>
          </div>
          <div className="col-md-9">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="card mb-4">
                <div className="card-body">
                  <div className="skeleton-loading" style={{height: '300px'}}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Debug log to check orders data
  console.log('Orders data:', orders);

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  const bgStyle = {
    background: "linear-gradient(135deg, #ffb6b9 0%, #fcdff0 100%)",
    minHeight: "100vh",
    padding: "48px 0 32px 0",
    fontFamily: "'Quicksand', 'Roboto', Arial, sans-serif"
  };

  const wrapperStyle = {
    background: "rgba(255,255,255,0.97)",
    borderRadius: 22,
  };

  const titleStyle = {
    fontSize: 32,
    fontWeight: 800,
    marginBottom: 30,
    color: "#d46a92",
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
      <div className="container" style={wrapperStyle}>
        <h2 style={titleStyle}>ĐƠN HÀNG CỦA TÔI</h2>
        
        <div className="section-content p-4">
          {/* Order Details Modal */}
          <OrderDetailsModal 
            show={showOrderDetails} 
            onHide={() => setShowOrderDetails(false)} 
            order={selectedOrder} 
          />
          <div className="row">
            <aside className="col-md-3">
              <div className="card mb-3" style={{
                border: 'none',
                borderRadius: '16px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.06)',
                overflow: 'hidden',
                background: '#fff9fa'
              }}>
                
              </div>
            </aside>

            <main className="col-md-9">
            {Array.isArray(orders) && orders.length === 0 ? (
              <div className="card" style={{
                border: 'none',
                borderRadius: '16px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.06)',
                marginBottom: '24px',
                overflow: 'hidden'
              }}>
                <div className="card-body text-center py-5" style={{
                  background: '#fff9fa'
                }}>
                  <div className="mb-4">
                    <FaShoppingBag size={64} className="text-muted mb-3" />
                    <h4 className="text-muted mb-3">Bạn chưa có đơn hàng nào</h4>
                    <p className="text-muted mb-4">Hãy khám phá các sản phẩm mới nhất của chúng tôi</p>
                    <Link to="/" className="btn btn-primary btn-lg px-5">
                      Mua sắm ngay
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              Array.isArray(orders) ? (
                [...orders].reverse().map((order) => (
                  <article key={order.id} className="card mb-4" style={{
                    border: 'none',
                    borderRadius: '16px',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
                    overflow: 'hidden',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    ':hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 20px rgba(0,0,0,0.12)'
                    }
                  }}>
                    <header className="card-header d-flex justify-content-between align-items-center" style={{
                      background: 'linear-gradient(135deg, #fff9fa 0%, #fff0f2 100%)',
                      borderBottom: '1px solid #ffdfe4',
                      padding: '16px 24px',
                      position: 'relative',
                      zIndex: 1
                    }}>
                      <div>
                        <strong className="d-inline-block mr-3">
                          Mã đơn hàng: {order.id}
                        </strong>
                        <span>
                          Ngày đặt: {new Date(order.orderedDate).toLocaleDateString("vi-VN")}
                        </span>
                      </div>
                      <div className="d-flex align-items-center">
                        <span
                          className={`badge badge-pill mr-2`}
                          style={{
                            background:
                              order.status === 'PENDING' ? '#fff3cd' :
                              order.status === 'CONFIRMED' ? '#d1ecf1' :
                              order.status === 'SHIPPING' ? '#cce5ff' :
                              order.status === 'DELIVERED' ? '#d4edda' :
                              order.status === 'CANCELLED' ? '#f8d7da' :
                              order.status === 'PAID' ? '#d1e7dd' : '#e2e3e5',
                            color:
                              order.status === 'PENDING' ? '#856404' :
                              order.status === 'CONFIRMED' ? '#0c5460' :
                              order.status === 'SHIPPING' ? '#004085' :
                              order.status === 'DELIVERED' ? '#155724' :
                              order.status === 'CANCELLED' ? '#721c24' :
                              order.status === 'PAID' ? '#0f5132' : '#383d41',
                            padding: '6px 12px',
                            borderRadius: '20px',
                            fontWeight: '500',
                            fontSize: '0.85rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6
                          }}
                        >
                          {order.status === 'PENDING' && <FaHourglassHalf className="mr-1" />}
{order.status === 'CONFIRMED' && <FaClipboardCheck className="mr-1" />}
{order.status === 'SHIPPING' && <FaTruck className="mr-1" />}
{order.status === 'DELIVERED' && <FaCheckCircle className="mr-1" />}
{order.status === 'PAID' && <FaCheckCircle className="mr-1" style={{color:'#0f5132'}} />}
{order.status === 'PENDING' ? 'Đang xử lý'
  : order.status === 'CONFIRMED' ? 'Đã xác nhận'
  : order.status === 'SHIPPING' ? 'Đang giao hàng'
  : order.status === 'DELIVERED' ? 'Đã giao'
  : order.status === 'CANCELLED' ? ''
  : order.status === 'PAID' ? 'Hoạt động'
  : order.status}
                        </span>
                        <div className="d-flex">
                          <button 
                            className="btn btn-sm mr-2"
                           style={{
                              background: 'transparent',
                              border: '1px solid #ff6b8b',
                              color: '#ff6b8b',
                              ':hover': {
                                background: '#ff6b8b',
                                color: '#fff'
                              }
                            }}
                            onClick={() => handleViewDetails(order)}
                          >
                            <FaEye className="mr-1" /> Chi tiết
                          </button>
                          {order.status === "PENDING" && (
                            <button 
                              className="btn btn-sm mr-2"
                              style={{
                                background: 'transparent',
                                border: '1px solid #ff6b8b',
                                color: '#ff6b8b',
                                ':hover': {
                                  background: '#ff6b8b',
                                  color: '#fff'
                                }
                              }}
                              onClick={() => handleCancelOrder(order.id)}
                              disabled={updatingOrder === order.id}
                            >
                              
                            </button>
                          )}
                          <button
                            className="btn btn-sm"
                            style={{
                              background: 'transparent',
                              border: '1px solid #dc3545',
                              color: '#dc3545',
                              ':hover': {
                                background: '#dc3545',
                                color: '#fff'
                              }
                            }}
                            onClick={() => handleCancelOrder(order.id)}
                            disabled={updatingOrder === order.id}
                          >
                            {updatingOrder === order.id ? (
                              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            ) : (
                              <><FaTimesCircle className="mr-1"/> Huỷ đơn hàng</>
                            )}
                          </button>
                        </div>
                      </div>
                    </header>
                    <div className="card-body" style={{
                      background: '#fff',
                      padding: '24px',
                      position: 'relative',
                      zIndex: 0
                    }}>
                      <div className="row mb-3">
                        <div className="col-md-8">
                          <div className="d-flex align-items-center mb-2">
                            {order.status === "PENDING" ? (
  <>
    <FaBox className="text-warning mr-2" size={20} />
    <h6 className="mb-0">Đang xử lý</h6>
  </>
) : order.status === "PAID" ? (
  <>
    <FaCheckCircle className="text-success mr-2" size={20} />
    <h6 className="mb-0" style={{color:'#0f5132'}}>Hoạt động</h6>
  </>
) : order.status === "CANCELLED" ? (
  <>
   <FaTimesCircle className="text-danger mr-2" size={20} />
    <h6 className="mb-0" style={{color:'#dc3545'}}>Đã hủy</h6>
  </>
) : null}
                          </div>
                          <div className="pl-4">
                            <p className="mb-1">
                              <span className="text-muted">Ngày đặt:</span>{' '}
                              {new Date(order.orderedDate).toLocaleString("vi-VN")}
                            </p>
                            <p className="mb-1">
                              <span className="text-muted">Số lượng sản phẩm:</span>{' '}
                              {order.items.reduce((total, item) => total + item.quantity, 0)}
                            </p>
                            <p className="mb-0">
                              <span className="text-muted">Tổng tiền:</span>{' '}
                              <span className="font-weight-bold text-primary">
                                {order.items.reduce((total, item) => total + item.subTotal, 0).toLocaleString("vi-VN")}đ
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>

                      <hr />

                      <div className="table-responsive">
                        <table className="table table-hover">
                          <tbody>
                            {order.items.map((item) => (
                              <tr key={item.product.id} className="align-middle">
                                <td width="100">
                                  <div
  className="position-relative"
  style={{ width: '80px', height: '80px', cursor: 'pointer' }}
  onClick={async (e) => {
  if (e && e.stopPropagation) e.stopPropagation();
  try {
    const res = await searchProducts({ name: item.product.productName });
    const found = Array.isArray(res?.content) ? res.content[0] : (Array.isArray(res) ? res[0] : null);
    if (found && found.id) {
      navigate(`/Detail?productId=${found.id}`);
    } else {
      alert('Không tìm thấy sản phẩm theo tên!');
    }
  } catch (err) {
    alert('Lỗi khi tìm sản phẩm theo tên!');
  }
}}
  title={item.product.productName}
>
  <img
    src={`http://localhost:8900/api/catalog/images/${item.product.imageUrl}`}
    className="img-fluid rounded border"
    alt={item.product.productName}
    style={{
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      objectPosition: 'center',
      cursor: 'pointer'
    }}
  />
  {item.quantity > 1 && (
    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-primary">
      {item.quantity}x
    </span>
  )}
</div>
                                </td>
                                <td>
                                  <div className="d-flex flex-column">
                                    <span
  className="font-weight-bold text-dark mb-1"
  style={{ fontSize: '1.1rem', display: 'inline-block', cursor: 'pointer' }}
  onClick={async (e) => {
  if (e && e.stopPropagation) e.stopPropagation();
  try {
    const res = await searchProducts({ name: item.product.productName });
    const found = Array.isArray(res?.content) ? res.content[0] : (Array.isArray(res) ? res[0] : null);
    if (found && found.id) {
      navigate(`/Detail?productId=${found.id}`);
    } else {
      alert('Không tìm thấy sản phẩm theo tên!');
    }
  } catch (err) {
    alert('Lỗi khi tìm sản phẩm theo tên!');
  }
}}
  title={item.product.productName}
>
  {item.product.productName}
</span>
                                    <div className="d-flex align-items-center mb-2">
                                      <span className="text-primary font-weight-bold mr-2">
                                        {item.product.price.toLocaleString("vi-VN")}đ
                                      </span>
                                      <span className="text-muted">x {item.quantity}</span>
                                    </div>
                                    <div className="d-flex align-items-center">
                                      <span className="badge bg-light text-dark border mr-2">
                                        Mã SP: {item.product.id}
                                      </span>
                                    </div>
                                  </div>
                                  {order.status === "PAID" && (
                                    <div className="mt-2">
                                      {(() => {
                                        const token = localStorage.getItem("authToken");
                                        const decodedToken = token ? jwtDecode(token) : null;
                                        const userName = decodedToken?.sub;
                                        const review = getUserReviewForProduct(item.product.productName, userName);
                                        const hasPurchased = hasPurchasedProduct(item.product.id);
                                        
                                        if (review) {
                                          // Đã đánh giá
                                          return (
                                            <div className="border-top pt-2 mt-2">
                                              <div className="d-flex align-items-center justify-content-between">
                                                <div>
                                                  <strong>Đánh giá của bạn:</strong>
                                                  <div className="d-flex align-items-center my-1">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                      <FaStar 
                                                        key={star}
                                                        className={`${star <= review.rating ? 'text-warning' : 'text-muted'}`}
                                                      />
                                                    ))}
                                                    <span className="ms-2 text-muted">
                                                      {new Date(review.createdAt || new Date()).toLocaleDateString('vi-VN')}
                                                    </span>
                                                  </div>
                                                  {review.comment && (
                                                    <div className="bg-light p-2 rounded mt-1">
                                                      <p className="mb-0">{review.comment}</p>
                                                    </div>
                                                  )}
                                                </div>
                                                <button 
                                                  className="btn btn-sm"
                                                  style={{
                                                    background: 'transparent',
                                                    border: '1px solid #dc3545',
                                                    color: '#dc3545',
                                                    padding: '0.15rem 0.5rem',
                                                    ':hover': {
                                                      background: '#dc3545',
                                                      color: '#fff'
                                                    }
                                                  }}
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteReview(review.id, item.product.productName);
                                                  }}
                                                  title="Xóa đánh giá"
                                                >
                                                  <i className="fa fa-trash"></i>
                                                </button>
                                              </div>
                                            </div>
                                          );
                                        } else if (hasPurchased) {
                                          // Chưa đánh giá nhưng đã mua
                                          return (
                                            <Button
                                              variant="outline-primary"
                                              size="sm"
                                              style={{
                                                borderColor: '#ff6b8b',
                                                color: '#ff6b8b',
                                                ':hover': {
                                                  background: '#ff6b8b',
                                                  borderColor: '#ff6b8b',
                                                  color: '#fff'
                                                }
                                              }} 
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedProduct(item.product);
                                                setReviewRating(5);
                                                setReviewComment('');
                                                setShowReviewModal(true);
                                              }}
                                              className="mt-2"
                                            >
                                              <FaStar className="me-1" /> Đánh giá sản phẩm
                                            </Button>
                                          );
                                        } else {
                                          // Chưa mua sản phẩm
                                          return (
                                            <div className="text-muted small mt-2">
                                              <FaInfoCircle className="me-1" />
                                              Mua sản phẩm để đánh giá
                                            </div>
                                          );
                                        }
                                      })()}
                                    </div>
                                  )}
                                </td>
                                <td className="text-right align-middle">
                                  <div className="d-flex flex-column align-items-end">
                                    <span className="text-primary font-weight-bold mb-1" style={{ fontSize: '1.1rem' }}>
                                      {item.subTotal?.toLocaleString("vi-VN")}đ
                                    </span>
                                    {item.discount > 0 && (
                                      <small className="text-success">
                                        Đã giảm: {item.discount.toLocaleString("vi-VN")}đ
                                      </small>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </article>
                ))
              ) : (
                <div className="card" style={{
                border: 'none',
                borderRadius: '16px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.06)',
                marginBottom: '24px',
                overflow: 'hidden'
              }}>
                <div className="card-body text-center" style={{
                  background: '#fff9fa'
                }}>
                    <p>Đã xảy ra lỗi khi lấy danh sách đơn hàng.</p>
                  </div>
                </div>
              )
            )}
            </main>
          </div>
        </div>
        {/* --- ĐÁNH GIÁ SẢN PHẨM ĐỒNG BỘ STYLE --- */}
        <Modal show={showReviewModal} onHide={() => setShowReviewModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Đánh giá sản phẩm</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedProduct && (
              <>
                <h5 style={{color:'#d46a92', fontWeight:600}}>{selectedProduct.productName}</h5>
                <div className="my-3">
                  <p className="mb-2">Đánh giá của bạn:</p>
                  <div className="d-flex mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FaStar
                        key={star}
                        size={30}
                        className="me-2"
                        style={{ 
                          cursor: 'pointer',
                          color: star <= reviewRating ? '#ffc107' : '#e4e5e9'
                        }}
                        onClick={() => setReviewRating(star)}
                      />
                    ))}
                  </div>
                  <Form.Group className="mb-3">
                    <Form.Label>Nhận xét (tùy chọn)</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="Hãy chia sẻ cảm nhận của bạn về sản phẩm..."
                    />
                  </Form.Group>
                </div>
              </>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowReviewModal(false)}>
              Hủy
            </Button>
            <Button 
              variant="primary" 
              style={{
                background: '#ff6b8b',
                borderColor: '#ff6b8b',
              }} 
              onClick={handleReviewSubmit}
              disabled={isSubmittingReview}
            >
              {isSubmittingReview ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-2"
                  />
                  Đang gửi...
                </>
              ) : 'Gửi đánh giá'}
            </Button>
          </Modal.Footer>
        </Modal>
        {/* --- KẾT THÚC ĐỒNG BỘ ĐÁNH GIÁ --- */}
      </div>
    </div>
  );
};

export default ProfileOrders;
