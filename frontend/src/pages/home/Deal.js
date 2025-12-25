import React, { useState, useEffect, useRef } from "react";
import { Link } from 'react-router-dom';
import { getAllProducts } from "../../api/apiService";
import promoBanner from "../../assets/images/banners/banner_promotion.webp";
import { FaStar, FaRegStar } from 'react-icons/fa';

const ITEM_WIDTH = 240; // chiều rộng mỗi card + gap

const Deal = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const visibleCount = 2;
  const intervalRef = useRef(null);

  // Hàm tạo số ngẫu nhiên từ min đến max
  const getRandomRating = (min, max) => {
    // Làm tròn đến 0.5 gần nhất (4.0, 4.5 hoặc 5.0)
    return Math.round((Math.random() * (max - min) + min) * 2) / 2;
  };

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getAllProducts();
        // Lọc chỉ lấy 3 sản phẩm đầu tiên có tên chứa 'dầu gội' (không phân biệt hoa thường)
        // và thêm đánh giá ngẫu nhiên từ 4-5 sao
        const filtered = (Array.isArray(data) ? data : [])
          .filter(p => p.productName && p.productName.toLowerCase().includes('dầu gội'))
          .slice(0, 4)
          .map(product => ({
            ...product,
            rating: getRandomRating(4, 5) // Thêm đánh giá ngẫu nhiên từ 4-5 sao
          }));
        
        setProducts(filtered);
        setError(null);
      } catch (err) {
        setError("Không thể tải sản phẩm. Vui lòng thử lại sau.");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Auto-slide
  useEffect(() => {
    if (products.length <= 2) return;
    intervalRef.current = setInterval(() => {
      setCurrentIndex(prev => (prev + visibleCount) % products.length);
    }, 3000);
    return () => clearInterval(intervalRef.current);
  }, [products, visibleCount]);

  // Manual navigation resets auto-slide
  const restartInterval = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setCurrentIndex(prev => (prev + visibleCount) % products.length);
    }, 3000);
  };

  const handlePrev = () => {
    if (products.length <= 2) return;
    clearInterval(intervalRef.current);
    setCurrentIndex(prev =>
      prev - visibleCount < 0
        ? (products.length - visibleCount + (prev % visibleCount)) % products.length
        : prev - visibleCount
    );
    restartInterval();
  };

  const handleNext = () => {
    if (products.length <= 2) return;
    clearInterval(intervalRef.current);
    setCurrentIndex(prev => (prev + visibleCount) % products.length);
    restartInterval();
  };

  // Hiển thị loading, error, empty
  if (loading) return <div>Đang tải...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  // Hàm hiển thị đánh giá sao
  const renderRating = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        // Màu vàng đậm cho sao đầy
        stars.push(<FaStar key={i} style={{ color: '#FFD700', fontSize: '16px' }} />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        // Màu vàng nhạt hơn cho nửa sao
        stars.push(<FaStar key={i} style={{ color: '#FFD700', opacity: 0.7, fontSize: '16px' }} />);
      } else {
        // Màu xám cho sao rỗng
        stars.push(<FaRegStar key={i} style={{ color: '#E0E0E0', fontSize: '16px' }} />);
      }
    }
    
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 4, 
        marginBottom: 8,
        justifyContent: 'center'
      }}>
        {stars}
        <span style={{ 
          marginLeft: 4, 
          color: '#666',
          fontSize: '14px',
          fontWeight: 500
        }}>
          {rating.toFixed(1)}
        </span>
      </div>
    );
  };

  if (!products.length)
    return <div className="text-center">Không có sản phẩm nào</div>;

  // Tạo track chứa tất cả sản phẩm, dịch chuyển theo currentIndex
  const trackStyle = {
    display: "flex",
    transition: "transform 0.6s cubic-bezier(.4,1.3,.6,1)",
    transform: `translateX(-${currentIndex * ITEM_WIDTH}px)`,
    gap: 24,
  };

  return (
    <section style={{ background: "#fff", padding: "24px 0" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ marginBottom: 16, background: "#ffe3df", borderRadius: 12, padding: "16px 0", textAlign: "center", fontWeight: 700, fontSize: 24, color: "#b86d5a", letterSpacing: 1 }}>
          KHUYẾN MÃI
        </div>
       
        <div style={{ display: "flex", gap: 24, alignItems: "stretch" }}>
          {/* Product Cards with arrows */}
          <div style={{
            display: "flex",
            alignItems: "center",
            flex: 2,
            background: "#fff",
            borderRadius: 12,
            boxShadow: "0 2px 8px #0001",
            minHeight: 320,
            overflow: "hidden",
            position: "relative"
          }}>
            <button onClick={handlePrev} style={{ background: "none", border: "none", fontSize: 28, color: "#ccc", cursor: "pointer", marginLeft: 8, zIndex: 2 }} aria-label="Prev">
              &#60;
            </button>
            <div style={{
              width: ITEM_WIDTH * visibleCount,
              overflow: "hidden",
              position: "relative",
              flexShrink: 0
            }}>
              <div style={trackStyle}>
                {products.map((p, idx) => {
                  const hasId = p.productId || p.id;
                  const card = (
                    <div
                      style={{
                        background: "#fff",
                        borderRadius: 8,
                        boxShadow: "0 1px 4px #0002",
                        width: 220,
                        minWidth: 220,
                        padding: 16,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        position: "relative"
                      }}
                      key={idx}
                    >
                      <img
                        src={p.imageUrl ? `http://localhost:8900/api/catalog/images/${p.imageUrl}` : "https://via.placeholder.com/120x180?text=No+Image"}
                        alt={p.productName || "Sản phẩm"}
                        style={{ width: 120, height: 180, objectFit: "cover", borderRadius: 8, marginBottom: 12 }}
                      />
                      <div style={{ fontWeight: 500, fontSize: 16, marginBottom: 8, textAlign: "center", height: '40px', overflow: 'hidden' }}>
                        {p.productName || "Sản phẩm"}
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 8 }}>
                        {p.oldPrice && (
                          <span style={{ textDecoration: "line-through", color: "#aaa", fontSize: 14 }}>
                            {typeof p.oldPrice === "number" ? p.oldPrice.toLocaleString("vi-VN") : p.oldPrice}₫
                          </span>
                        )}
                        {renderRating(p.rating || 0)}
                        <span style={{ fontWeight: 700, color: "#222", fontSize: 18, marginBottom: 8 }}>
                          {p.price ? Number(p.price).toLocaleString("vi-VN") : "0"}₫
                        </span>
                      </div>
                      
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 4, width: '100%' }}>
                        {hasId ? (
                          <button 
                            className="btn btn-outline-secondary btn-sm" 
                            style={{ 
                              width: '100%', 
                              fontWeight: 500,
                              backgroundColor: '#ff6b6b',
                              color: 'white',
                              border: 'none',
                              padding: '8px 0',
                              borderRadius: '4px'
                            }} 
                            onClick={() => window.location.href = `/Detail?productId=${p.productId || p.id}`}
                          >
                            Mua ngay
                          </button>
                        ) : (
                          <span 
                            className="btn btn-outline-secondary btn-sm disabled" 
                            style={{ 
                              width: '100%',
                              fontWeight: 500, 
                              pointerEvents: 'none', 
                              opacity: 0.6,
                              backgroundColor: '#e0e0e0',
                              color: '#666',
                              border: 'none',
                              padding: '8px 0',
                              borderRadius: '4px'
                            }}
                          >
                            Hết hàng
                          </span>
                        )}
                      </div>
                    </div>
                  );
                  
                  if (hasId) {
                    return (
                      <Link to={`/Detail?productId=${p.productId || p.id}`} style={{ textDecoration: 'none', color: 'inherit' }} key={hasId}>
                        {card}
                      </Link>
                    );
                  }
                  return card;
                })}
              </div>
            </div>
            <button onClick={handleNext} style={{ background: "none", border: "none", fontSize: 28, color: "#ccc", cursor: "pointer", marginRight: 8, zIndex: 2 }} aria-label="Next">
              &#62;
            </button>
          </div>
          
          {/* Promo Banner */}
          <div style={{ flex: 3, background: "#ffeef6", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", minHeight: 320, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", right: 32, top: 24, fontSize: 90, color: "#f7d1d1", fontWeight: 700, opacity: 0.15, zIndex: 0 }}>
              %
            </div>
            <div style={{ zIndex: 2, textAlign: "left", padding: 32, flex: 1 }}>
              <div style={{ fontSize: 48, fontWeight: 700, color: "#e38a8a", marginBottom: 8 }}>-20%</div>
              <div style={{ fontSize: 22, color: "#b86d5a", marginBottom: 8 }}>KHI MUA CÁC SẢN PHẨM</div>
              <div style={{ fontSize: 28, color: "#e38a8a", fontFamily: "cursive", marginBottom: 16 }}>Tại Rosie</div>
            </div>
            <div style={{ zIndex: 2, flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <img src={promoBanner} alt="Promo" style={{ width: 200, borderRadius: 16, boxShadow: "0 2px 8px #0001" }} onError={e => { e.target.src = "https://i.imgur.com/1n7fJ5k.png"; }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Deal;