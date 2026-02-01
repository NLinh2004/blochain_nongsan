// src/components/Footer/Footer.tsx
import React from 'react';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        {/* Cột 1: Thông tin thương hiệu */}
        <div className="footer-section brand">
          <h2>🌿 ChanNong Solution</h2>
          <p>
            Nền tảng truy xuất nguồn gốc nông sản minh bạch, 
            ứng dụng công nghệ Blockchain để truy vết nguồn gốc thông qua các giấy chứng nhận tiêu chuẩn nông sản.
          </p>
        </div>

        {/* Cột 2: Liên kết nhanh */}
        <div className="footer-section links">
          <h3>Khám phá</h3>
          <ul>
            <li><a href="#about">Về chúng tôi</a></li>
            <li><a href="#solution">Giải pháp</a></li>
            <li><a href="#news">Tin tức</a></li>
          </ul>
        </div>

        {/* Cột 3: Liên hệ */}
        <div className="footer-section contact">
          <h3>Liên hệ</h3>
          <p>📍 Ninh Kiều, Cần Thơ</p>
          <p>📧 contact@channong.vn</p>
          <p>📞 (+84) 775 907 742</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2025 ChanNong Solutions</p>
      </div>
    </footer>
  );
};

export default Footer;