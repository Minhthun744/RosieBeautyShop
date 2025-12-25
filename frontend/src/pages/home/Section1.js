import React, { useEffect, useState, useCallback } from "react";
import { getProductsByCategory, getProductReviews, calculateAverageRating, addToCart } from "../../api/apiService";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import QuickView from "../../components/QuickView";
import '../../assets/css/Section1.css';

// Format price helper function
const formatPrice = (price) => {
  if (price === undefined || price === null) return '';
  return new Intl.NumberFormat('vi-VN', { 
    style: 'currency', 
    currency: 'VND' 
  }).format(price);
};

const Section1 = ({ categoryName, categoryId }) => {
  const [products, setProducts] = useState([]);
  const [productRatings, setProductRatings] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantities, setQuantities] = useState({});
  const [isAddingToCart, setIsAddingToCart] = useState({});
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [showQuickView, setShowQuickView] = useState(false);
  const [imgLoaded, setImgLoaded] = useState([]); // <-- Moved to top-level
  const [promoPage, setPromoPage] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const promoCount = products.filter(p => p.discountPercentage > 0).length;
    const maxPage = Math.max(0, Math.ceil(promoCount / 2) - 1);
    if (promoPage > maxPage) setPromoPage(maxPage);
  }, [promoPage, products.length]);

  // Handle quick view
  const handleQuickView = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    setQuickViewProduct(product);
    setShowQuickView(true);
  };

  const handleCloseQuickView = useCallback(() => {
    setShowQuickView(false);
    setQuickViewProduct(null);
  }, []);

  const handleAddToCart = useCallback(async (productId, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      setIsAddingToCart(prev => ({ ...prev, [productId]: true }));
      const quantity = quantities[productId] || 1;
      
      await addToCart(productId, quantity);
      toast.success('Đã thêm sản phẩm vào giỏ hàng');
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (error) {
      console.error('Lỗi khi thêm vào giỏ hàng:', error);
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi thêm vào giỏ hàng');
    } finally {
      setIsAddingToCart(prev => ({ ...prev, [productId]: false }));
    }
  }, [quantities]);

  useEffect(() => {
    const promoCount = products.filter(p => p.discountPercentage > 0).length;
    const maxPage = Math.max(0, Math.ceil(promoCount / 2) - 1);
    if (promoPage > maxPage) setPromoPage(maxPage);
  }, [promoPage, products.length]);

  useEffect(() => {
    let didCancel = false;
    let timeoutId;
    setLoading(true);
    
    const cleanup = () => {
      didCancel = true;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
    
    const fetchProducts = async () => {
      try {
        const timeoutPromise = new Promise((resolve) => {
          timeoutId = setTimeout(() => resolve('timeout'), 2000);
        });
        
        // Fetch products by category ID if available, otherwise by name
        const fetchPromise = categoryId 
          ? getProductsByCategory(categoryId, true) 
          : getProductsByCategory(categoryName);
          
        const data = await Promise.race([fetchPromise, timeoutPromise]);
        
        if (didCancel) return;
        
        if (data === 'timeout') {
          setProducts([]);
          setProductRatings({});
          setError(null);
        } else {
          // Get ratings for each product in parallel
          const ratingsArr = await Promise.all(
            (data || []).map(async (product) => {
              try {
                const reviews = await getProductReviews(product.id); 
                return [product.id, calculateAverageRating(reviews)];
              } catch (err) {
                console.error(`Error fetching reviews for product ${product.id}:`, err);
                return [product.id, 0];
              }
            })
          );
          
          const ratings = Object.fromEntries(ratingsArr);
          setProductRatings(ratings);
          setProducts(data || []);
          setError(null);
        }
      } catch (error) {
        if (!didCancel) {
          console.error('Error fetching products:', error);
          setError("Không thể tải sản phẩm. Vui lòng thử lại sau.");
          setProducts([]);
        }
      } finally {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        if (!didCancel) {
          setLoading(false);
        }
      }
    };
    
    if (categoryId || categoryName) {
      fetchProducts();
    }
    
    return cleanup;
  }, [categoryId, categoryName]);

  const formatPrice = (price) => {
    if (price === undefined || price === null) return '';
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND' 
    }).format(price);
  };

  const renderStars = (rating) => {
    rating = parseFloat(rating);
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<i key={i} className="fa fa-star text-warning"></i>);
      } else if (i - 0.5 <= rating) {
        stars.push(<i key={i} className="fa fa-star-half-o text-warning"></i>);
      } else {
        stars.push(<i key={i} className="fa fa-star-o text-muted"></i>);
      }
    }
    return stars;
  };

  const skeletons = Array.from({ length: 4 }).map((_, idx) => (
    <div key={idx} className="col-xl-3 col-lg-4 col-md-6 col-6 mb-4">
      <div className="card h-100 border-0 overflow-hidden">
        <div className="position-relative" style={{ height: '200px', backgroundColor: '#f8f9fa' }}>
          <div className="bg-light w-100 h-100" style={{ borderRadius: 12, animation: 'pulse 1.5s infinite' }} />
        </div>
        <div className="card-body">
          <div className="bg-light mb-2" style={{ height: 22, width: '80%', borderRadius: 4, animation: 'pulse 1.5s infinite' }} />
          <div className="d-flex justify-content-between align-items-center mb-2">
            <div className="bg-light" style={{height: 18, width: 70, borderRadius: 4, animation: 'pulse 1.5s infinite'}}></div>
            <div className="bg-light" style={{height: 18, width: 40, borderRadius: 4, animation: 'pulse 1.5s infinite'}}></div>
          </div>
          <div className="d-flex justify-content-between align-items-center mt-2">
            <div className="bg-light" style={{height: 22, width: 60, borderRadius: 4, animation: 'pulse 1.5s infinite'}}></div>
            <div className="bg-light" style={{height: 32, width: 32, borderRadius: 8, animation: 'pulse 1.5s infinite'}}></div>
          </div>
        </div>
      </div>
    </div>
  ));

  // Loading state
  if (loading) {
    return (
      <section className="py-5">
        <div className="container">
          <div className="row">
            {skeletons}
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  // Display only first 4 products if more than 4 exist
  const displayProducts = products.length > 4 ? products.slice(0, 4) : products;
  const hasProducts = displayProducts.length > 0;

  // Render when no products
  const renderNoProducts = () => (
    <div className="col-12">
      <div className="text-center py-5 bg-light rounded-3">
        <i className="fas fa-box-open fa-3x text-muted mb-3"></i>
        <h5 className="text-muted">Không có sản phẩm nào</h5>
        <p className="text-muted mb-0">Hiện chưa có sản phẩm nào trong danh mục này</p>
      </div>
    </div>
  );

  // Render view more button
  const renderViewMore = () => {
    if (products.length <= 4) return null;
    
    const viewMoreLink = categoryId 
      ? `/products?category_id=${categoryId}`
      : `/products?category=${encodeURIComponent(categoryName || '')}`;
      
    return (
      <div className="text-center mt-4">
        <Link 
          to={viewMoreLink}
          className="btn btn-outline-primary px-4"
        >
          Xem thêm {products.length - 4} sản phẩm
        </Link>
      </div>
    );
  };

  // State quản lý trạng thái loading của ảnh
  const handleImgLoad = (idx) => {
    setImgLoaded((prev) => {
      const arr = [...prev];
      arr[idx] = true;
      return arr;
    });
  };

  // Render product card
  // const renderProductCard = (product, idx) => (
  //   <div key={product.id} className="col-xl-3 col-lg-4 col-md-6 col-6 mb-4">
  //     <div className="card h-100 border-0 overflow-hidden">
  //       <div className="position-relative" style={{ height: '200px', backgroundColor: '#f8f9fa' }}>
  //         {product.id && product.id !== 'undefined' && (
  // <Link to={`/Detail?productId=${product.id}`} className="d-block h-100">
  //           <div className="position-relative h-100 w-100">
  //             <img
  //               src={product.imageUrl 
  //                 ? `http://localhost:8900/api/catalog/images/${product.imageUrl}`
  //                 : 'https://via.placeholder.com/300x300?text=No+Image'}
  //               alt={product.productName || product.name || 'Product Image'}
  //               className="img-fluid h-100 w-100 p-3"
  //               loading="lazy"
  //               style={{ 
  //                 objectFit: 'contain', 
  //                 opacity: imgLoaded[idx] ? 1 : 0.5, 
  //                 transition: 'opacity 0.5s',
  //                 maxHeight: '100%',
  //                 maxWidth: '100%'
  //               }}
  //               onLoad={() => handleImgLoad(idx)}
  //               onError={(e) => {
  //                 e.target.onerror = null;
  //                 e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
  //               }}
  //             />
  //             {product.discountPercentage > 0 && (
  //               <span className="position-absolute top-0 start-0 m-2 badge bg-danger">
  //                 -{Math.round(product.discountPercentage)}%
  //               </span>
  //             )}
  //           </div>
  //           {!imgLoaded[idx] && (
  //             <div style={{position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.5)'}}>
  //               <span className="spinner-border spinner-border-sm text-secondary" role="status" aria-hidden="true"></span>
  //             </div>
  //           )}
  //         </Link>
  //         <button 
  //           className="btn btn-light btn-sm position-absolute top-0 end-0 m-2 rounded-circle"
  //           onClick={(e) => handleQuickView(e, product)}
  //           title="Xem nhanh"
  //           style={{ width: '36px', height: '36px' }}
  //         >
  //           <i className="fas fa-eye"></i>
  //         </button>
  //       </div>
        <div className="card-body">
          <h5 className="card-title" style={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            minHeight: '48px'
          }}>
            {product.id && product.id !== 'undefined' && (
  <Link to={`/Detail?productId=${product.id}`} className="text-decoration-none text-dark">
              {product.productName || product.name || 'Tên sản phẩm'}
            </Link>
          </h5>
          <div className="d-flex justify-content-between align-items-center mb-2">
            <div className="text-warning">
              {renderStars(productRatings[product.id] || 0)}
              <small className="text-muted ms-1">
                ({(productRatings[product.id] || 0).toFixed(1)})
              </small>
            </div>
            {product.categoryName && (
              <span className="badge bg-secondary">
                {product.categoryName}
              </span>
            )}
          </div>
          <div className="d-flex justify-content-between align-items-center mt-2">
            <div>
              <span className="h5 text-danger fw-bold">
                {formatPrice(product.price)}
              </span>
              {product.oldPrice > product.price && (
                <small className="text-muted text-decoration-line-through ms-2">
                  {formatPrice(product.oldPrice)}
                </small>
              )}
            </div>
            <button 
              className="btn btn-outline-primary btn-sm"
              onClick={(e) => handleAddToCart(product.id, e)}
              disabled={isAddingToCart[product.id]}
            >
              {isAddingToCart[product.id] ? (
                <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
              ) : (
                <i className="fas fa-cart-plus me-1"></i>
              )}
              Thêm
            </button>
      </div>
    </div>
  </div>
);

// Determine the view all link based on whether we have categoryId or categoryName
const viewAllLink = categoryId 
  ? `/products?category_id=${categoryId}`
  : categoryName 
    ? `/products?category=${encodeURIComponent(categoryName)}`
    : '/products';

const promoProducts = products.filter(product => product.promotion);
const totalPromoPages = Math.ceil(promoProducts.length / 4);
const promoToShow = promoProducts.slice(0, 4);

return (
  <section className="py-5">
    <ToastContainer position="top-right" autoClose={3000} />
    
    {/* Quick View Modal */}
    {quickViewProduct && (
      <QuickView 
        productId={quickViewProduct.id} 
        show={showQuickView} 
        onHide={handleCloseQuickView} 
      />
    )}

    <div className="container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold mb-0">
          {categoryName || 'Sản phẩm nổi bật'}
          {loading && (
            <span className="ms-2">
              <span className="spinner-border spinner-border-sm text-primary" role="status">
                <span className="visually-hidden">Đang tải...</span>
              </span>
            </span>
            )}
          </h2>
          {products.length > 0 && (
            <Link to={viewAllLink} className="btn btn-outline-primary btn-sm">
              Xem tất cả <i className="fas fa-arrow-right ms-1"></i>
            </Link>
          )}
        </div>
        
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Đang tải...</span>
            </div>
            <p className="mt-2 text-muted">Đang tải sản phẩm...</p>
          </div>
        ) : error ? (
          <div className="alert alert-danger">{error}</div>
        ) : (
          <>
            <div className="row">
              {hasProducts ? (
                displayProducts.map((product, idx) => renderProductCard(product, idx))
              ) : (
                renderNoProducts()
              )}
            </div>
            {renderViewMore()}
          </>
        )}
      </div>
    </section>
  );
};

export default Section1;