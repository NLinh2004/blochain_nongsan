// src/pages/Home/Home.tsx
import React, { useState } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import { FaSearch, FaRocket, FaShieldAlt, FaHandshake, FaQrcode, FaGlobeAsia, FaTimes } from 'react-icons/fa';
import './Home.css';

// Import Service để kết nối Blockchain
import productService, { type ProductOutput } from '../../services/productService';

const Home: React.FC = () => {
  // 1. State quản lý
  const [productId, setProductId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ProductOutput | null>(null);
  const [showModal, setShowModal] = useState(false); // Bật/tắt Popup

  // 2. Xử lý tìm kiếm
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productId.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      // Gọi Smart Contract lấy dữ liệu
      const data = await productService.get(Number(productId));
      setResult(data);
      setShowModal(true); // Tìm thấy thì hiện Popup
    } catch (error: any) {
      alert("❌ Không tìm thấy sản phẩm này trên Blockchain (hoặc chưa kết nối ví)!");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // 3. Đóng Popup
  const closeModal = () => {
    setShowModal(false);
    setResult(null);
  };

  return (
    <div className="home-wrapper">
      <Navbar />

      {/* --- HERO SECTION --- */}
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content animate-fade-in-up">
          <div className="hero-text-box">
            <span className="badge-tech">
              <span className="badge-dot"></span> ChanNong Solutions
            </span>
            
            <h1 className="hero-title">
              Minh bạch hóa <br />
              <span className="text-gradient">Nông Sản Việt</span>
            </h1>
            
            <p className="hero-desc">
              Hệ thống xác thực chứng chỉ nông nghiệp (VietGAP, OCOP) dựa trên công nghệ <strong>Blockchain</strong>. 
              Bảo vệ uy tín thương hiệu và sức khỏe cộng đồng.
            </p>

            {/* Form Tìm kiếm */}
            <form className="search-glass-container" onSubmit={handleSearch}>
              <div className="input-group">
                <FaSearch className="search-icon" />
                <input 
                  type="number" 
                  placeholder="Nhập mã ID sản phẩm (VD: 101)..." 
                  value={productId}
                  onChange={(e) => setProductId(e.target.value)}
                  className="search-input-home"
                />
              </div>
              <button type="submit" className="btn-glow" disabled={loading}>
                {loading ? 'Đang tra cứu...' : 'Tra cứu ngay'}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* --- POPUP KẾT QUẢ (MODAL) --- */}
      {showModal && result && (
        <div className="modal-overlay" style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 9999,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          animation: 'fadeIn 0.3s'
        }}>
          <div className="modal-content" style={{
            background: 'white', padding: '30px', borderRadius: '16px',
            maxWidth: '650px', width: '90%', position: 'relative',
            boxShadow: '0 0 25px rgba(40, 167, 69, 0.5)'
          }}>
            {/* Nút đóng */}
            <button onClick={closeModal} style={{
              position: 'absolute', top: '15px', right: '15px',
              background: '#f1f1f1', border: 'none', borderRadius: '50%',
              width: '32px', height: '32px', cursor: 'pointer', color: '#333',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <FaTimes />
            </button>

            {/* Header Popup */}
            <div style={{ textAlign: 'center', marginBottom: '25px', borderBottom: '1px solid #eee', paddingBottom: '15px' }}>
              <div style={{ fontSize: '40px', marginBottom: '10px' }}>✅</div>
              <h2 style={{ color: '#28a745', margin: 0 }}>Xác thực thành công</h2>
              <p style={{ color: '#666', margin: '5px 0 0 0' }}>Sản phẩm đã được ghi nhận trên Blockchain</p>
            </div>

            <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
              {/* Cột thông tin */}
              <div style={{ flex: 2, minWidth: '280px' }}>
                 <h3 style={{ fontSize: '24px', color: '#333', margin: '0 0 15px 0' }}>🌾 {result.name}</h3>
                 
                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                    <div>
                        <small style={{ color: '#888', textTransform: 'uppercase', fontSize: '11px' }}>Mã ID</small>
                        <div style={{ fontWeight: 'bold', fontSize: '16px' }}>#{result.id}</div>
                    </div>
                    <div>
                        <small style={{ color: '#888', textTransform: 'uppercase', fontSize: '11px' }}>Nguồn gốc</small>
                        <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{result.origin}</div>
                    </div>
                    <div>
                        <small style={{ color: '#888', textTransform: 'uppercase', fontSize: '11px' }}>Ngày sản xuất</small>
                        <div style={{ fontWeight: 'bold' }}>{result.productionDate}</div>
                    </div>
                    <div>
                        <small style={{ color: '#888', textTransform: 'uppercase', fontSize: '11px' }}>Hạn sử dụng</small>
                        <div style={{ fontWeight: 'bold', color: '#d9534f' }}>{result.expiryDate}</div>
                    </div>
                 </div>

                 <div style={{ background: '#f0fff4', padding: '15px', borderRadius: '10px', border: '1px border #c3e6cb' }}>
                    <p style={{ margin: '0 0 8px 0' }}><strong>🏅 Tiêu chuẩn:</strong> <span style={{ color: '#155724' }}>{result.qualityStandard}</span></p>
                    <p style={{ margin: 0 }}><strong>🔬 Kiểm định:</strong> {result.inspectionResult}</p>
                 </div>
              </div>

              {/* Cột QR */}
              <div style={{ flex: 1, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent('https://<project-name>.vercel.app/verify?id=' + result.id)}`}
                    alt="QR Code"
                    style={{ borderRadius: '8px', border: '4px solid white', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }} 
                />
                <p style={{ fontSize: '12px', color: '#999', marginTop: '10px' }}>Quét để truy xuất</p>
              </div>
            </div>

            <div style={{ marginTop: '20px', paddingTop: '15px', borderTop: '1px dashed #eee', fontSize: '12px', color: '#999', wordBreak: 'break-all' }}>
               <strong>Ví người tạo:</strong> {result.producer}
            </div>
          </div>
        </div>
      )}

      {/* --- CÁC SECTION GIỚI THIỆU (Giữ nguyên) --- */}
      <section id="mission-vision" className="mv-section">
        <div className="container">
          <div className="mv-grid">
            <div className="mv-card mission-card">
              <div className="mv-icon-box"><FaRocket /></div>
              <div className="mv-content">
                <h3>Sứ mệnh</h3>
                <p>Xây dựng <strong>"Cổng công chứng số"</strong> bất biến. Giải quyết triệt để bài toán làm giả chứng chỉ.</p>
              </div>
            </div>
            <div className="mv-card vision-card">
              <div className="mv-icon-box"><FaGlobeAsia /></div>
              <div className="mv-content">
                <h3>Tầm nhìn</h3>
                <p>Đồng hành cùng Hợp tác xã trong công cuộc <strong>Chuyển đổi số</strong> và nâng tầm giá trị nông sản.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="features-section">
        <div className="container">
          <div className="section-header">
             <h2>Giải pháp công nghệ</h2>
             <div className="header-line"></div>
             <p>Ba trụ cột tạo nên uy tín của ChanNong Solutions</p>
          </div>
          <div className="feature-grid">
             <div className="feature-card">
               <div className="feature-icon bg-blue"><FaShieldAlt /></div>
               <h3>Bảo mật tuyệt đối</h3>
               <p>Dữ liệu chứng chỉ được mã hóa trên Blockchain, ngăn chặn hoàn toàn việc làm giả.</p>
             </div>
             <div className="feature-card">
               <div className="feature-icon bg-green"><FaHandshake /></div>
               <h3>Thân thiện Nhà nông</h3>
               <p>Giao diện tối giản, quy trình "No-Code". Nông dân không cần thao tác phức tạp.</p>
             </div>
             <div className="feature-card">
               <div className="feature-icon bg-purple"><FaQrcode /></div>
               <h3>Truy xuất tức thì</h3>
               <p>Người tiêu dùng quét QR để xem hồ sơ gốc của sản phẩm ngay tại điểm bán.</p>
             </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;