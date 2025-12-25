import React from 'react';

const Region = () => (
    <section className="section-padding">
        <div className="container">
            <ul className="row mt-4">
                {/* Other country list items */}
            </ul>
            
            {/* Subscribe Section */}
            <div className="subscribe-section mt-5">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-md-6">
                            <h4 className="text-primary-color mb-3">Nhận bản tin làm đẹp từ chúng tôi</h4>
                            <p className="text-muted">Nhận thông tin cập nhật mới nhất về sản phẩm mới và các đợt bán sắp tới</p>
                        </div>
                        <div className="col-md-6">
                            <div className="subscribe-form">
                                <input 
                                    type="email" 
                                    className="form-control" 
                                    placeholder="Nhập email của bạn" 
                                />
                                <button className="btn btn-subscribe">Đăngký</button>
                            </div>
                        </div>
                    </div>
                    <div className="row mt-4">
                        <div className="col-12 text-center">
                            <div className="social-icons">
                                <a href="#" className="me-3"><i className="fab fa-facebook-f"></i></a>
                                <a href="#" className="me-3"><i className="fab fa-twitter"></i></a>
                                <a href="#" className="me-3"><i className="fab fa-instagram"></i></a>
                                <a href="#"><i className="fab fa-youtube"></i></a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

export default Region;