import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { getAllProducts, getProductsByCategory, searchProducts } from "../../api/apiService";

const SectionContent = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState("id");
  const [sortDirection, setSortDirection] = useState("asc");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const currentPage = parseInt(queryParams.get("page")) || 1;
  const category = queryParams.get("category");
  const searchTerm = queryParams.get("search");
  const itemsPerPage = 4;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND' 
    }).format(price);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        let data;

        // Sử dụng API search mới
        const searchParams = {
          category: category,
          name: searchTerm,
          sortBy: sortBy,
          sortDirection: sortDirection,
          minPrice: priceRange.min || null,
          maxPrice: priceRange.max || null
        };

        data = await searchProducts(searchParams);
        setProducts(data || []);
        setError(null);
      } catch (error) {
        console.error("Lỗi khi tải sản phẩm:", error);
        setError("Không thể tải sản phẩm. Vui lòng thử lại sau.");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, searchTerm, sortBy, sortDirection, priceRange]);

  // Tính toán phân trang
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = products.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    const params = new URLSearchParams(location.search);
    params.set("page", page);
    navigate(`${location.pathname}?${params.toString()}`);
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };

  const handleSortChange = (event) => {
    const [newSortBy, newSortDirection] = event.target.value.split('-');
    setSortBy(newSortBy);
    setSortDirection(newSortDirection);
  };

  const handlePriceRangeChange = (type, value) => {
    setPriceRange(prev => ({
      ...prev,
      [type]: value
    }));
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <li key={i} className={`page-item ${currentPage === i ? "active" : ""}`}>
          <button className="page-link" onClick={() => handlePageChange(i)}>
            {i}
          </button>
        </li>
      );
    }
    return pageNumbers;
  };

  return (
    <section className="section-content padding-y">
      <div className="container">
        <div className="card mb-3">
          <div className="card-body">
            <div className="row">
              <div className="col-md-2">Bạn đang ở đây: </div>
              <nav className="col-md-8">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/">Trang chủ</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to={category ? `/ListingGrid?category=${category}` : '/ListingGrid'}>
                      {category || 'Tất cả sản phẩm'}
                    </Link>
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </div>

        <header className="mb-3">
          <div className="form-inline">
            <strong className="mr-md-auto">{products.length} sản phẩm</strong>
            <select className="form-control mr-2" onChange={handleSortChange}>
              <option value="id-asc">Mặc định</option>
              <option value="price-asc">Giá tăng dần</option>
              <option value="price-desc">Giá giảm dần</option>
              <option value="productName-asc">Tên A-Z</option>
              <option value="productName-desc">Tên Z-A</option>
            </select>
            <div className="form-inline ml-2">
              <input
                type="number"
                className="form-control mr-2"
                placeholder="Giá từ"
                value={priceRange.min}
                onChange={(e) => handlePriceRangeChange('min', e.target.value)}
              />
              <input
                type="number"
                className="form-control"
                placeholder="Đến"
                value={priceRange.max}
                onChange={(e) => handlePriceRangeChange('max', e.target.value)}
              />
            </div>
          </div>
        </header>

        {loading && (
          <div className="text-center my-4">
            <div className="spinner-border text-primary" role="status">
              <span className="sr-only">Đang tải...</span>
            </div>
          </div>
        )}

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <div className="row">
          {!loading && currentProducts.map((product) => (
            <div className="col-md-3" key={product.id}>
              <figure className="card card-product-grid">
                <div className="img-wrap">
                  <img
                    src={`http://localhost:8900/api/catalog/images/${product.imageUrl}`}
                    alt={product.productName}
                  />
                </div>
                <figcaption className="info-wrap">
                  <Link to={`/Detail?productId=${product.id}`} className="title mb-2">
                    {product.productName}
                  </Link>
                  <div className="price-wrap">
                    <span className="price">{formatPrice(product.price)}</span>
                  </div>
                  <p className="text-muted">{product.category}</p>
                  <hr />
                  <div className="row">
                    <div className="col-6">
                      <button className="btn btn-outline-primary btn-sm">
                        <i className="fa fa-cart-plus"></i> Thêm vào giỏ
                      </button>
                    </div>
                    <div className="col-6">
                      <Link to={`/Detail?productId=${product.id}`} className="btn btn-outline-secondary btn-sm">
                        Chi tiết
                      </Link>
                    </div>
                  </div>
                </figcaption>
              </figure>
            </div>
          ))}
        </div>

        {!loading && products.length === 0 && (
          <div className="text-center my-4">
            <p>Không tìm thấy sản phẩm nào.</p>
          </div>
        )}

        {totalPages > 1 && (
          <nav className="mt-4">
            <ul className="pagination justify-content-center">
              <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                <button className="page-link" onClick={handlePrevious} disabled={currentPage === 1}>
                  Trang trước
                </button>
              </li>
              {renderPageNumbers()}
              <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                <button className="page-link" onClick={handleNext} disabled={currentPage === totalPages}>
                  Trang sau
                </button>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </section>
  );
};

export default SectionContent;
