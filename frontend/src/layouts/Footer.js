import React from 'react';
import { Link } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import logo from '../assets/images/logo1.jpg';

const Footer = () => {
    return (
        <footer className="custom-footer">
            <div className="container">
                <div className="row py-5">
                    {/* Logo và liên hệ */}
                    <div className="col-md-3">
                        <div className="">
                            <Link to="/Home" className="brand-wrap">
                                <img className="logo" src={logo} alt="Brand Logo" />
                            </Link>
                        </div>
                        <ul className="list-unstyled contact-info">
                            <li><i className="fas fa-map-marker-alt me-2"></i>266 Đội Cấn, Liễu Giai, Hà Nội</li>
                            <li><i className="fas fa-envelope me-2"></i>support@sapo.vn</li>
                            <li><i className="fas fa-phone me-2"></i>1800 6750</li>
                            <li><i className="fas fa-store me-2"></i>Hệ thống cửa hàng</li>
                        </ul>
                    </div>

                    {/* Hỗ trợ khách hàng */}
                    <div className="col-md-3">
                        <h6 className="footer-title">HỖ TRỢ KHÁCH HÀNG</h6>
                        <ul className="list-unstyled">
                            <li><Link to="/">Trang chủ</Link></li>
                            <li><Link to="/about">Giới thiệu</Link></li>
                            <li><Link to="/products">Sản phẩm</Link></li>
                            <li><Link to="/contact">Liên hệ</Link></li>
                            <li><Link to="/news">Tin tức</Link></li>
                            <li><Link to="/cart">Giỏ hàng</Link></li>
                            <li><Link to="/search">Tìm kiếm</Link></li>
                        </ul>
                    </div>

                    {/* Chính sách */}
                    <div className="col-md-3">
                        <h6 className="footer-title">CHÍNH SÁCH</h6>
                        <ul className="list-unstyled">
                            <li><Link to="/">Trang chủ</Link></li>
                            <li><Link to="/about">Giới thiệu</Link></li>
                            <li><Link to="/products">Sản phẩm</Link></li>
                            <li><Link to="/contact">Liên hệ</Link></li>
                            <li><Link to="/news">Tin tức</Link></li>
                            <li><Link to="/cart">Giỏ hàng</Link></li>
                            <li><Link to="/search">Tìm kiếm</Link></li>
                        </ul>
                    </div>

                    {/* Giờ mở cửa */}
                    <div className="col-md-3">
                        <h6 className="footer-title">Giờ mở cửa</h6>
                        <p className="mb-3">Từ 9:00 - 21:30 tất cả các ngày trong tuần (bao gồm cả các ngày lễ, ngày Tết).</p>
                        <h6 className="footer-title">GÓP Ý, KHIẾU NẠI</h6>
                        <p><i className="fas fa-phone me-2"></i>1900 6750</p>
                    </div>
                </div>
                <div className="text-center py-3">
                    <a href="#top" className="go-top">
                        <i className="fas fa-chevron-up"></i> Lên đầu trang
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
