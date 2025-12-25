import React from 'react';
import '../../assets/css/ui.css';
import hinh1 from '../../assets/images/h1.jpg';
import hinh2 from '../../assets/images/h2-removebg-preview.png';
import hinh3 from '../../assets/images/h3-removebg-preview.png';
import hinh4 from '../../assets/images/h4-removebg-preview.png';

const Product = () => {
    return (
        <section className="product-banner py-5">
            <div className="container">
                <div className="row align-items-center">
                    {/* Hình ảnh và quảng cáo */}
                    <div className="col-md-8">
                        <div className="product-image-banner d-flex align-items-center flex-column flex-md-row">
                            <img
                                src={hinh1}
                                alt="Lipstick"
                                className="img-fluid banner-img mb-3 mb-md-0"
                                style={{ maxWidth: '1000px', width: '800px', height: '500px' }}
                            />


                        </div>
                    </div>

                    {/* Các box thông tin dịch vụ */}
                    <div className="col-md-4 mt-4 mt-md-0">
                        <div
                            className="info-box"
                            style={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: '16px',
                                padding: '20px',
                                backgroundColor: '#ffece7',
                                borderRadius: '10px',
                                marginBottom: '20px',
                                fontSize: '16px',
                                width: '100%',               // Full width
                                boxSizing: 'border-box'      // Ensure padding doesn't overflow
                            }}
                        >
                            <img
                                src={hinh2}
                                alt="Thanh toán"
                                style={{ width: '60px', height: '60px', objectFit: 'contain' }}
                            />
                            <div style={{ flex: 1 }}>
                                <h6 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '6px' }}>Thanh toán</h6>
                                <p style={{ marginBottom: 0 }}>Khách hàng có thể lựa chọn một hoặc nhiều hình thức thanh toán</p>
                            </div>
                        </div>

                        <div
                            className="info-box"
                            style={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: '16px',
                                padding: '20px',
                                backgroundColor: '#ffece7',
                                borderRadius: '10px',
                                marginBottom: '20px',
                                fontSize: '16px',
                                width: '100%',
                                boxSizing: 'border-box'
                            }}
                        >
                            <img
                                src={hinh3}
                                alt="Chính hãng"
                                style={{ width: '60px', height: '60px', objectFit: 'contain' }}
                            />
                            <div style={{ flex: 1 }}>
                                <h6 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '6px' }}>Cam kết chính hãng</h6>
                                <p style={{ marginBottom: 0 }}>Chúng tôi cam kết hàng chính hãng và đảm bảo về chất lượng sản phẩm</p>
                            </div>
                        </div>

                        <div
                            className="info-box"
                            style={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: '16px',
                                padding: '20px',
                                backgroundColor: '#ffece7',
                                borderRadius: '10px',
                                marginBottom: '20px',
                                fontSize: '16px',
                                width: '100%',
                                boxSizing: 'border-box'
                            }}
                        >
                            <img
                                src={hinh4}
                                alt="Giao hàng 2H"
                                style={{ width: '60px', height: '60px', objectFit: 'contain' }}
                            />
                            <div style={{ flex: 1 }}>
                                <h6 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '6px' }}>Siêu tốc 2H</h6>
                                <p style={{ marginBottom: 0 }}>Dịch vụ giao hàng nhanh 2h trong nội thành Hà Nội</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default Product;
