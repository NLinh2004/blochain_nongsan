// src/pages/Login/Login.tsx
import React, { useState } from 'react';
import { ethers } from 'ethers';
import { useNavigate } from 'react-router-dom';
import './Login.css';

// 1. Mở rộng interface Window để TypeScript nhận diện biến ethereum
declare global {
  interface Window {
    ethereum?: any; // Dùng 'any' để linh hoạt với các provider khác nhau
  }
}

// 2. Định nghĩa kiểu cho lỗi (để truy cập error.code)
interface WalletError {
  code?: number;
  message?: string;
}

const Login: React.FC = () => {
  // State quản lý trạng thái UI
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  
  // Hook điều hướng trang
  const navigate = useNavigate();

  // Hàm xử lý chính: Kết nối ví
  const connectWallet = async () => {
    // 1. Reset lỗi cũ và bật loading
    setErrorMessage('');
    setIsConnecting(true);

    // 2. Kiểm tra trình duyệt có cài MetaMask không
    if (!window.ethereum) {
      setErrorMessage('Không tìm thấy MetaMask! Vui lòng cài đặt extension.');
      setIsConnecting(false);
      return;
    }

    try {
      // 3. Khởi tạo Provider (Chuẩn Ethers v6)
      const provider = new ethers.BrowserProvider(window.ethereum);

      // 4. Gửi yêu cầu kết nối tới MetaMask
      const accounts = await provider.send("eth_requestAccounts", []);
      const userAddress = accounts[0];

      console.log("Đã kết nối ví:", userAddress);

      // 5. Lưu tạm địa chỉ vào localStorage
      localStorage.setItem('walletAddress', userAddress);

      // 6. Chuyển hướng sang trang Dashboard
      navigate('/dashboard');

    } catch (error) {
      console.error(error);
      
      // Ép kiểu error để TypeScript hiểu được thuộc tính .code
      const walletError = error as WalletError;

      // Xử lý các mã lỗi phổ biến
      if (walletError.code === 4001) {
        setErrorMessage('Bạn đã từ chối kết nối.');
      } else {
        setErrorMessage('Có lỗi xảy ra. Vui lòng thử lại.');
      }
    } finally {
      // Tắt loading dù thành công hay thất bại
      setIsConnecting(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="logo-section">
            {/* Mình giữ nguyên text AgriChain như code gốc của bạn */}
            <h1>ChanNong</h1> 
            <p>Hệ thống truy xuất nguồn gốc nông sản</p>
        </div>

        <button 
          className="btn-login" 
          onClick={connectWallet}
          disabled={isConnecting}
        >
          {isConnecting ? "Đang kết nối..." : "Đăng nhập bằng MetaMask"}
        </button>

        {errorMessage && (
          <div className="error-box">
            {errorMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;