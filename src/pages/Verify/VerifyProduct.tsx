import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar.tsx';
import Footer from '../../components/Footer/Footer.tsx';
import './VerifyProduct.css';

// Interfaces
interface Certificate {
  name: string;
  code: string;
  date: string;
  icon: string;
}

interface HistoryEvent {
  time: string;
  event: string;
}

interface ProductData {
  id: string;
  name: string;
  origin: string;
  productionDate: string;
  expiryDate: string;
  status: 'verified' | 'warning' | string;
  image: string;
  certificates: Certificate[];
  history: HistoryEvent[];
}

const VerifyProduct: React.FC = () => {
  // Lấy query string từ URL
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");   // lấy id từ ?id=1

  const [product, setProduct] = useState<ProductData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    setTimeout(() => {
      if (id === '123' || id === '1') {
        setProduct({
          id: id!,
          name: 'Gạo ST25 Ông Cua (Chính Hãng)',
          origin: 'HTX Nông nghiệp Sóc Trăng',
          productionDate: '12/10/2025',
          expiryDate: '12/10/2026',
          status: 'verified',
          image: 'https://cdn-icons-png.flaticon.com/512/2933/2933116.png',
          certificates: [
            { name: 'VietGAP', code: 'VG-2025-888', date: '01/01/2025', icon: '✅' },
            { name: 'OCOP 4 Sao', code: 'OC-VN-999', date: '05/06/2025', icon: '⭐' }
          ],
          history: [
            { time: '12/10/2025 08:00', event: 'Thu hoạch tại nông trại' },
            { time: '13/10/2025 10:30', event: 'Đóng gói & Dán tem truy xuất' },
            { time: '13/10/2025 14:00', event: 'Được ghi nhận trên Blockchain' }
          ]
        });
        setLoading(false);
      } else {
        setError(true);
        setLoading(false);
      }
    }, 1500);
  }, [id]);

  if (loading) return (
    <div className="verify-loading">
      <div className="spinner"></div>
      <p>Đang truy xuất dữ liệu từ Blockchain...</p>
    </div>
  );

  return (
    <div className="page-wrapper">
      <Navbar />
      <div className="verify-container">
        {error ? (
          <div className="error-card">
            <div className="icon-warning">⚠️</div>
            <h2>CẢNH BÁO: KHÔNG TÌM THẤY DỮ LIỆU</h2>
            <p>Mã sản phẩm <strong>#{id}</strong> không tồn tại trên hệ thống.</p>
            <p>Sản phẩm này có thể là hàng giả hoặc chưa được đăng ký.</p>
            <button className="btn-home" onClick={() => window.location.href='/'}>Về trang chủ</button>
          </div>
        ) : (
          product && (
            <div className="product-card">
              <div className="status-header verified">
                <span className="shield-icon">🛡️</span>
                <div>
                  <h3>XÁC THỰC THÀNH CÔNG</h3>
                  <small>Thông tin được bảo chứng bởi Blockchain</small>
                </div>
              </div>

              <div className="product-info-section">
                <img src={product.image} alt={product.name} className="product-img" />
                <h1 className="product-name">{product.name}</h1>
                <p className="product-origin">📍 {product.origin}</p>
              </div>

              <hr className="divider" />

              <div className="details-grid">
                <div className="detail-item">
                  <span className="label">Ngày sản xuất</span>
                  <span className="value">{product.productionDate}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Hạn sử dụng</span>
                  <span className="value">{product.expiryDate}</span>
                </div>
                <div className="detail-item full">
                  <span className="label">Mã số Blockchain</span>
                  <span className="value hash">0x71C...9A23 (Đã xác thực)</span>
                </div>
              </div>

              <div className="cert-section">
                <h4>🎖️ Chứng nhận chất lượng</h4>
                <div className="cert-list">
                  {product.certificates.map((cert, index) => (
                    <div key={index} className="cert-badge">
                      <div className="cert-icon">{cert.icon}</div>
                      <div className="cert-info">
                        <strong>{cert.name}</strong>
                        <span>Mã: {cert.code}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="timeline-section">
                <h4>🚚 Nhật ký canh tác & Vận chuyển</h4>
                <ul className="timeline">
                  {product.history.map((item, index) => (
                    <li key={index} className="timeline-item">
                      <span className="time">{item.time}</span>
                      <span className="event">{item.event}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )
        )}
      </div>
      <Footer />
    </div>
  );
};

export default VerifyProduct;
