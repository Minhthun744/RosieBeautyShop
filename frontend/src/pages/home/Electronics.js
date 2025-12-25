import React, { useState, useEffect } from 'react';
import { GET_ALL } from '../../api/apiService';
import { Link } from 'react-router-dom';
import { FaStar, FaRegStar } from 'react-icons/fa';

const Electronics = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  // Số sản phẩm mỗi hàng
  const productsPerRow = 5;
  // Số hàng hiển thị
  const numberOfRows = 2;
  // Tổng số sản phẩm cần hiển thị
  const totalProductsToShow = productsPerRow * numberOfRows;
  // Lấy số lượng sản phẩm cần hiển thị
  const displayedProducts = products.slice(0, totalProductsToShow);
  
  // Hàm tạo số ngẫu nhiên từ min đến max
  const getRandomRating = (min, max) => {
    // Làm tròn đến 0.5 gần nhất (4.0, 4.5 hoặc 5.0)
    return Math.round((Math.random() * (max - min) + min) * 2) / 2;
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const params = {
          pageNumber: 0,
          pageSize: 10,
          sortBy: "productId",
          sortOrder: "desc"
        };

        const response = await GET_ALL('/catalog/products', { ...params });
        const data = response.content || response.data || response;
        const productsWithRating = Array.isArray(data) 
          ? data.map(product => ({
              ...product,
              rating: getRandomRating(4, 5) // Thêm đánh giá ngẫu nhiên từ 4-5 sao
            }))
          : [];
        setProducts(productsWithRating);
      } catch (error) {
        console.error("Lỗi khi lấy sản phẩm điện tử:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Hàm chia mảng sản phẩm thành các hàng
  const chunkArray = (array, size) => {
    const chunkedArr = [];
    for (let i = 0; i < array.length; i += size) {
      chunkedArr.push(array.slice(i, i + size));
    }
    return chunkedArr;
  };
  
  // Chia sản phẩm thành các hàng
  const productRows = chunkArray(displayedProducts, productsPerRow);

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
            SẢN PHẨM BÁN CHẠY
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
          SẢN PHẨM BÁN CHẠY
        </div>
        
        <div style={{ 
          background: '#fff',
          borderRadius: 12,
          boxShadow: '0 2px 8px #0001',
          padding: '20px',
          position: 'relative'
        }}>
          {productRows.map((row, rowIndex) => (
            <div 
              key={rowIndex}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: rowIndex < productRows.length - 1 ? '20px' : '0',
                gap: '20px'
              }}
            >
              {row.map((product, idx) => (
                <div 
                  key={product.id || idx}
                  style={{
                    flex: 1,
                    minWidth: 0,
                    background: '#fff',
                    borderRadius: 8,
                    boxShadow: '0 1px 4px #0002',
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    position: 'relative',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    ':hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 6px 12px #0002'
                    },
                    '@media (max-width: 1200px)': {
                      padding: '12px'
                    }
                  }}
                >
                  <Link 
                    to={`/Detail?productId=${product.id}`} 
                    style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}
                  >
                    <img
                      src={product.imageUrl ? `http://localhost:8900/api/catalog/images/${product.imageUrl}` : 'https://via.placeholder.com/200x200?text=No+Image'}
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
                        e.target.src = 'https://via.placeholder.com/200x200?text=No+Image';
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
          ))}
        </div>
      </div>
    </section>
  );
};

export default Electronics;