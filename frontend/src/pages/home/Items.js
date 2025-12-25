import React from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaShoppingCart, FaStar, FaRegStar, FaSearch, FaCheck, FaTruck, FaHeadset } from 'react-icons/fa';
import slide1 from "../../assets/images/banners/banner_content.jpg";

const Items = () => {
  // Dữ liệu mẫu sản phẩm
  const products = [
    
    
    
    
   
   
   
  ];

  // Hàm hiển thị đánh giá sao
  const renderRating = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} className="text-warning" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FaStar key={i} className="text-warning" style={{opacity: 0.5}} />);
      } else {
        stars.push(<FaRegStar key={i} className="text-muted" />);
      }
    }
    
    return stars;
  };

  return (
    <section className="py-5">
      <div className="container">
        {/* Phần giới thiệu Lemonade */}
        <div className="row mb-5 align-items-center">
          <div className="col-lg-6 mb-4 mb-lg-0">
            <img 
              src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" 
              alt="Lemonade Makeup" 
              className="img-fluid rounded-3 shadow"
              style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
            />
          </div>
          <div className="col-lg-6">
            <div className="ps-lg-4">
              <h2 className="fw-bold mb-3" style={{color: '#b86d5a'}}>Giải Pháp Trang Điểm Dễ Dàng<br />Cho Phụ Nữ Việt</h2>
              <p className="text-muted mb-4" style={{ lineHeight: '1.8' }}>
                Dựa trên kinh nghiệm 15 năm chinh chiến trong ngành làm đẹp và hợp tác với các tập đoàn mỹ phẩm nổi tiếng trên Thế giới, 
                Makeup Artist Quách Ánh cùng những cộng sự của mình đã tạo nên thương hiệu mỹ phẩm Lemonade. Với các dòng sản phẩm đa công năng 
                và tiện dụng được nghiên cứu dựa trên khí hậu và làn da của phụ nữ Việt, Lemonade giúp bạn hoàn thiện vẻ đẹp một cách nhanh 
                chóng và dễ dàng hơn: Dễ dàng sử dụng, dễ dàng kết hợp và dễ dàng mang đi.
              </p>
            </div>
          </div>
        </div>
        
        {/* Phần bài viết và hình ảnh */}
        <div className="row mb-5">
          <div className="col-lg-6 mb-4 mb-lg-0">
            <div className="p-4 rounded-3 h-100" style={{ backgroundColor: 'rgb(255, 227, 223)' }}>
              <h3 className="fw-bold mb-4" style={{color: '#b86d5a'}}>Giới thiệu về cửa hàng của chúng tôi</h3>
              <p className="mb-4">
              Trong cuộc sống hiện đại, việc chăm sóc cơ thể là điều không thể thiếu để duy trì sự tự tin và khỏe mạnh. Dầu gội giúp làm sạch da đầu, nuôi dưỡng mái tóc chắc khỏe, mềm mượt. Kem dưỡng da cung cấp độ ẩm, làm sáng và bảo vệ làn da khỏi các tác nhân gây hại từ môi trường. Sữa tắm nhẹ nhàng loại bỏ bụi bẩn, tế bào chết, đồng thời mang lại cảm giác thư giãn và làn da mịn màng sau mỗi lần sử dụng. Sữa rửa mặt là bước chăm sóc da mặt cơ bản nhưng quan trọng, giúp làm sạch sâu, ngăn ngừa mụn và tạo điều kiện cho da hấp thụ dưỡng chất hiệu quả. Việc lựa chọn và sử dụng đúng các sản phẩm chăm sóc cá nhân này sẽ giúp bạn duy trì vẻ ngoài tươi tắn và làn da khỏe mạnh mỗi ngày.
              </p>
              <div className="mb-4">
                <div className="d-flex align-items-center mb-3">
                  <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{width: '40px', height: '40px'}}>
                    <FaCheck />
                  </div>
                  <div>
                    <h6 className="mb-0 fw-bold">Sản phẩm chính hãng</h6>
                    <small className="text-muted">100% hàng chính hãng, bảo hành dài hạn</small>
                  </div>
                </div>
                <div className="d-flex align-items-center mb-3">
                  <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{width: '40px', height: '40px'}}>
                    <FaTruck />
                  </div>
                  <div>
                    <h6 className="mb-0 fw-bold">Giao hàng nhanh chóng</h6>
                    <small className="text-muted">Miễn phí vận chuyển cho đơn hàng từ 500K</small>
                  </div>
                </div>
                <div className="d-flex align-items-center">
                  <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{width: '40px', height: '40px'}}>
                    <FaHeadset />
                  </div>
                  <div>
                    <h6 className="mb-0 fw-bold">Hỗ trợ 24/7</h6>
                    <small className="text-muted">Đội ngũ tư vấn nhiệt tình, chuyên nghiệp</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="position-relative h-100 rounded-3 overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=880&q=80"
                alt="Cửa hàng mỹ phẩm sang trọng" 
                className="img-fluid w-100 h-100"
                style={{objectFit: 'cover', minHeight: '300px'}}
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1572635148818-ef6fd7eb32fc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=880&q=80';
                }}
              />
              <div className="position-absolute bottom-0 start-0 p-4 text-white" style={{background: 'linear-gradient(transparent, rgba(0,0,0,0.7))', width: '100%'}}>
                <h4 className="fw-bold mb-2">Không gian mua sắm</h4>
                <p className="mb-0">Trải nghiệm dịch vụ chuyên nghiệp và sản phẩm chất lượng</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Danh sách sản phẩm */}
       

        <div className="row">
          {products.map((product) => (
            <div key={product.id} className="col-xl-3 col-lg-4 col-md-6 col-6 mb-4">
              <div className="card h-100 border-0 shadow-sm position-relative">
                {product.discount && (
                  <div className="position-absolute top-0 end-0 bg-danger text-white px-2 py-1 m-2 rounded">
                    {product.discount}
                  </div>
                )}
                <div className="position-relative">
                  <Link to={`/product/${product.id}`} className="d-block">
                    <img 
                      src={product.image} 
                      className="card-img-top" 
                      alt={product.name}
                      style={{height: '200px', objectFit: 'cover'}} 
                    />
                  </Link>
                  <div className="position-absolute top-0 end-0 p-2">
                    <button className="btn btn-light btn-sm rounded-circle shadow-sm">
                      <FaHeart className="text-danger" />
                    </button>
                  </div>
                </div>
                <div className="card-body">
                  <h6 className="card-title mb-1">
                    <Link to={`/product/${product.id}`} className="text-dark text-decoration-none">
                      {product.name}
                    </Link>
                  </h6>
                  <div className="mb-2 d-flex align-items-center">
                    {renderRating(product.rating)}
                    <small className="text-muted ms-2">({Math.floor(Math.random() * 100)})</small>
                  </div>
                  <div className="d-flex align-items-center">
                    <p className="card-text text-primary fw-bold mb-0 me-2">
                      {product.price.toLocaleString('vi-VN')} đ
                    </p>
                    {product.originalPrice > product.price && (
                      <p className="text-muted text-decoration-line-through mb-0 small">
                        {product.originalPrice.toLocaleString('vi-VN')} đ
                      </p>
                    )}
                  </div>
                </div>
                
              </div>
            </div>
          ))}
        </div>

        {/* Phần bài viết mới */}
        <div className="row mt-5 mb-5">
          <div className="col-12 text-center mb-5">
            <h2 className="fw-bold" style={{color: '#b86d5a'}}>Chia sẻ bí quyết</h2>
          </div>
          
          <div className="col-lg-3 col-md-6 mb-4">
            <div className="card h-100 border-0 shadow-sm p-3">
              <h5 className="text-center fw-bold mb-2">Giải mã 5 màu son Perfect Couple Lip do chính tay Đông Nhi lựa chọn</h5>
              <p className="text-muted text-center small mb-0">Nếu bạn là fan của Đông Nhi chắc chắn không thể bỏ qua 5 màu son mới toanh Perfect Couple Lip LOVE EDITION phiên bản giới hạn do chính Đông Nhi nghiên cứu và chọn lựa tỉ mỉ.</p>
            </div>
          </div>
          
          <div className="col-lg-3 col-md-6 mb-4">
            <div className="card h-100 border-0 shadow-sm p-3">
              <h5 className="text-center fw-bold mb-2">Soaring Mascara - Bí quyết cho hàng mi tơi dài, cong tự nhiên</h5>
              <p className="text-muted text-center small mb-0">Đánh dấu đợt Rebranding lần này, Lemonade đã cho ra mắt bộ sưu tập mới toanh dành riêng cho mắt mang tên "Soaring Mascara Collection" với diện mạo đầy trẻ trung và hiện đại.</p>
            </div>
          </div>
          
          <div className="col-lg-3 col-md-6 mb-4">
            <div className="card h-100 border-0 shadow-sm p-3">
              <h5 className="text-center fw-bold mb-2">Bộ sưu tập kỷ niệm thương hiệu tròn 5 tuổi</h5>
              <p className="text-muted text-center small mb-0">5 Years Collection là bộ sưu tập kỷ niệm 5 năm tuổi của Lemonade với bộ đôi Perfect Couple Lip và Perfect Couple Blush. Với sản phẩm công năng 2 đầu như tên gọi "Perfect Couple".</p>
            </div>
          </div>
          
          <div className="col-lg-3 col-md-6 mb-4">
            <div className="card h-100 border-0 shadow-sm p-3">
              <h5 className="text-center fw-bold mb-2">Giải pháp tuyệt vời cho làn da dầu bất trị</h5>
              <p className="text-muted text-center small mb-0">Chúng tôi nhận ra rằng, đối với làn da dầu, để có thể đạt hiệu quả nhất định thì chúng ta vẫn cần một lớp Face Filler trước khi dùng Cushion truyền thống.</p>
            </div>
          </div>
        </div>

        {/* Thêm font awesome */}
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
        
      </div>
    </section>
  );
};

export default Items;