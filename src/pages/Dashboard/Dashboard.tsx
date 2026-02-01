import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

// Import 3 components con
// Lưu ý: Bạn cần tạo các file này (xem hướng dẫn bên dưới) để code không báo lỗi
import CreateProduct from './components/CreateProduct.tsx';
import ProductList from './components/ProductList.tsx';
import Settings from './components/Settings.tsx';

// Định nghĩa kiểu dữ liệu cho Tab để tránh lỗi gõ sai
type DashboardTab = 'create' | 'list' | 'settings';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  
  // State quản lý địa chỉ ví
  const [walletAddress, setWalletAddress] = useState<string>('');
  
  // State quản lý Tab đang hiển thị
  const [activeTab, setActiveTab] = useState<DashboardTab>('create');

  useEffect(() => {
    const address = localStorage.getItem('walletAddress');
    if (!address) {
      navigate('/login');
    } else {
      setWalletAddress(address);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('walletAddress');
    navigate('/');
  };

  // Hàm render nội dung dựa trên activeTab
  const renderContent = () => {
    switch (activeTab) {
      case 'create':
        return <CreateProduct />;
      case 'list':
        return <ProductList />;
      case 'settings':
        // Truyền props walletAddress vào Settings
        return <Settings walletAddress={walletAddress} />;
      default:
        return <CreateProduct />;
    }
  };

  return (
    <div className="dashboard-container">
      {/* --- SIDEBAR --- */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <span className="logo-icon">🌿</span>
          <span className="brand-title">AgriManager</span>
        </div>
        
        <ul className="menu-list">
          <li 
            className={`menu-item ${activeTab === 'create' ? 'active' : ''}`}
            onClick={() => setActiveTab('create')}
          >
            ➕ Tạo sản phẩm mới
          </li>
          <li 
            className={`menu-item ${activeTab === 'list' ? 'active' : ''}`}
            onClick={() => setActiveTab('list')}
          >
            📋 Danh sách sản phẩm
          </li>
          <li 
            className={`menu-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            ⚙️ Cài đặt tài khoản
          </li>
          <li className="menu-item logout" onClick={handleLogout}>
            🚪 Đăng xuất
          </li>
        </ul>

        <div className="user-info">
          <p>Ví đang kết nối:</p>
          <small>{walletAddress ? `${walletAddress.substring(0, 15)}...` : '...'}</small>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="main-content">
        <div className="page-header">
          {/* Đổi tiêu đề động theo Tab */}
          <h1 className="page-title">
            {activeTab === 'create' && 'Đăng ký Nông sản'}
            {activeTab === 'list' && 'Quản lý Nông sản'}
            {activeTab === 'settings' && 'Hồ sơ Nhà cung cấp'}
          </h1>
          <div className="wallet-badge">🟢 Connected</div>
        </div>

        {/* Render nội dung tương ứng */}
        <div className="content-body">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;