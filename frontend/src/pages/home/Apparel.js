import React, { useState, useEffect } from 'react';
import { searchProducts } from '../../api/apiService';
import { Link } from 'react-router-dom';
import { FaStar, FaRegStar } from 'react-icons/fa';

// Import item images for fallback
import item1 from '../../assets/images/items/1.jpg';

const Apparel = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Hàm tạo số ngẫu nhiên từ min đến max
  const getRandomRating = (min, max) => {
    // Làm tròn đến 0.5 gần nhất (4.0, 4.5 hoặc 5.0)
    return Math.round((Math.random() * (max - min) + min) * 2) / 2;
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const allProducts = await searchProducts();
        const sortedProducts = allProducts
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 8)
          .map(product => ({
            ...product,
            rating: getRandomRating(4, 5) // Thêm đánh giá ngẫu nhiên từ 4-5 sao
          }));
        setProducts(sortedProducts);
        setLoading(false);
      } catch (error) {
        console.error("Lỗi khi lấy sản phẩm:", error);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Slider state
  const [currentIndex, setCurrentIndex] = useState(0);
  const productsPerSlide = 4;
  const totalSlides = Math.ceil(products.length / productsPerSlide);

  const handlePrev = () => {
    setCurrentIndex(prev => (prev === 0 ? totalSlides - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev === totalSlides - 1 ? 0 : prev + 1));
  };

  const visibleProducts = products.slice(
    currentIndex * productsPerSlide,
    currentIndex * productsPerSlide + productsPerSlide
  );

  if (loading) {
    return (
      <div className="text-center my-4">
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Đang tải...</span>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <section className="padding-bottom" style={{ padding: '32px 0' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ 
            marginBottom: 16, 
            background: "#ffe3df", 
            borderRadius: 12, 
            padding: "16px 0", 
            textAlign: "center", 
            fontWeight: 700, 
            fontSize: 24, 
            color: "#b86d5a", 
            letterSpacing: 1 
          }}>
            HÀNG MỚI VỀ
          </div>
        </div>
        <div style={{ textAlign: 'center', color: '#888', fontSize: 20, padding: 48 }}>
          Không có sản phẩm nào
        </div>
      </section>
    );
  }

  return (
    <section className="padding-bottom" style={{ background: '#fff', padding: '32px 0' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ 
          marginBottom: 16, 
          background: "#ffe3df", 
          borderRadius: 12, 
          padding: "16px 0", 
          textAlign: "center", 
          fontWeight: 700, 
          fontSize: 24, 
          color: "#b86d5a", 
          letterSpacing: 1 
        }}>
          HÀNG MỚI VỀ
        </div>
        
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          background: '#fff',
          borderRadius: 12,
          boxShadow: '0 2px 8px #0001',
          minHeight: 320,
          position: 'relative',
          padding: '0 40px'
        }}>
          <button 
            onClick={handlePrev} 
            style={{ 
              background: 'none', 
              border: 'none', 
              fontSize: 28, 
              color: '#ccc', 
              cursor: 'pointer', 
              zIndex: 2 
            }} 
            aria-label="Trước"
          >
            &#60;
          </button>
          
          <div style={{ 
            width: '100%', 
            overflow: 'hidden',
            position: 'relative',
          }}>
            <div style={{
              display: 'flex',
              transition: 'transform 0.6s cubic-bezier(.4,1.3,.6,1)',
              transform: `translateX(-${currentIndex * 25}%)`,
              gap: '24px'
            }}>
              {products.map((product, idx) => (
                <div 
                  key={product.id || idx}
                  style={{
                    flex: '0 0 calc(25% - 18px)',
                    background: '#fff',
                    borderRadius: 8,
                    boxShadow: '0 1px 4px #0002',
                    padding: 16,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    position: 'relative'
                  }}
                >
                  <Link 
                    to={`/Detail?productId=${product.id}`} 
                    style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}
                  >
                    <img
                      src={product.imageUrl ? `http://localhost:8900/api/catalog/images/${product.imageUrl}` : item1}
                      alt={product.productName || "Sản phẩm"}
                      style={{ 
                        width: '100%', 
                        height: '180px', 
                        objectFit: 'contain', 
                        borderRadius: 8, 
                        marginBottom: 12,
                        backgroundColor: '#f8f9fa'
                      }}
                      onError={e => {
                        e.target.src = item1;
                      }}
                    />
                    
                    <div style={{ 
                      fontWeight: 500, 
                      fontSize: 16, 
                      marginBottom: 8, 
                      textAlign: 'center', 
                      height: '40px', 
                      overflow: 'hidden',
                      color: '#222'
                    }}>
                      {product.productName || "Sản phẩm"}
                    </div>
                    
                    <div style={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center', 
                      marginBottom: 8 
                    }}>
                      {product.oldPrice && (
                        <span style={{ 
                          textDecoration: 'line-through', 
                          color: '#aaa', 
                          fontSize: 14 
                        }}>
                          {typeof product.oldPrice === 'number' ? product.oldPrice.toLocaleString('vi-VN') : product.oldPrice}₫
                        </span>
                      )}
                      {/* Đánh giá sao */}
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 2, 
                        margin: '4px 0',
                        justifyContent: 'center'
                      }}>
                        {[1, 2, 3, 4, 5].map((star) => {
                          const rating = product.rating || 0;
                          if (star <= Math.floor(rating)) {
                            return <FaStar key={star} style={{ color: '#FFD700', fontSize: '14px' }} />;
                          } else if (star === Math.ceil(rating) && rating % 1 >= 0.5) {
                            return <FaStar key={star} style={{ color: '#FFD700', opacity: 0.7, fontSize: '14px' }} />;
                          } else {
                            return <FaRegStar key={star} style={{ color: '#E0E0E0', fontSize: '14px' }} />;
                          }
                        })}
                        <span style={{ 
                          marginLeft: 4, 
                          color: '#666',
                          fontSize: '13px',
                          fontWeight: 500
                        }}>
                          {product.rating ? product.rating.toFixed(1) : '5.0'}
                        </span>
                      </div>
                      <span style={{ 
                        fontWeight: 700, 
                        color: '#222', 
                        fontSize: 18, 
                        marginBottom: 8 
                      }}>
                        {product.price ? Number(product.price).toLocaleString('vi-VN') : "0"}₫
                      </span>
                    </div>
                    
                    <button 
                      className="btn btn-outline-secondary btn-sm" 
                      style={{ 
                        width: '100%', 
                        fontWeight: 500,
                        backgroundColor: '#ff6b6b',
                        color: 'white',
                        border: 'none',
                        padding: '8px 0',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                      onClick={e => {
                        e.preventDefault();
                        window.location.href = `/Detail?productId=${product.id}`;
                      }}
                    >
                      Mua ngay
                    </button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
          
          <button 
            onClick={handleNext} 
            style={{ 
              background: 'none', 
              border: 'none', 
              fontSize: 28, 
              color: '#ccc', 
              cursor: 'pointer', 
              zIndex: 2 
            }} 
            aria-label="Tiếp"
          >
            &#62;
          </button>
        </div>
      </div>
    </section>
  );
};

export default Apparel;