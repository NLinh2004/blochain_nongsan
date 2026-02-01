// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import các trang (Pages)
// Đảm bảo các file này có đuôi .tsx hoặc .jsx
import Login from './pages/Login/Login.tsx';
import Home from './pages/Home/Home.tsx';
import Dashboard from './pages/Dashboard/Dashboard.tsx';
import VerifyProduct from './pages/Verify/VerifyProduct.tsx';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* 1. Route trang chủ: Nơi khách hàng tra cứu và xem giới thiệu */}
        <Route path="/" element={<Home />} />

        {/* 2. Route đăng nhập: Dành riêng cho Producer */}
        <Route path="/login" element={<Login />} />
        
        {/* 3. Route Dashboard: Sau khi Login thành công mới vào đây */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* 4. Route Verify: Nơi hiển thị kết quả truy xuất (Dành cho Consumer) */}
        {/* URL sẽ có dạng: domain.com/verify/123 */}
        <Route path="/verify" element={<VerifyProduct />} />


      </Routes>
    </Router>
  );
};

export default App;