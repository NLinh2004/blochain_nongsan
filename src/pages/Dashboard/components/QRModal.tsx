import React from 'react';
import { QRCodeCanvas } from 'qrcode.react';

// 1. Định nghĩa Interface cho props
// Lưu ý: Cấu trúc Product phải khớp (hoặc là tập con) của Interface bên ProductList
interface Product {
  id: number | string;
  name: string;
}

interface QRModalProps {
  product: Product | null;
  onClose: () => void;
}

const QRModal: React.FC<QRModalProps> = ({ product, onClose }) => {
  // Guard clause: Nếu không có product thì không render gì cả
  if (!product) return null;

  // URL thực tế khi triển khai (Domain web của bạn + ID sản phẩm)
  const qrValue = `https://your-domain.com/verify/${product.id}`; 
  const fileName = `QR_Code_${product.name.replace(/\s/g, '_')}.png`;

  // Hàm xử lý tải ảnh
  const downloadQR = () => {
    // 2. Type Assertion: Ép kiểu HTMLElement về HTMLCanvasElement
    const canvas = document.getElementById('qr-gen') as HTMLCanvasElement; 
    
    if (canvas) {
      const pngUrl = canvas.toDataURL("image/png"); // Chuyển sang ảnh PNG
      
      const downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = fileName; // Tên file khi tải về
      
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      {/* Ngăn sự kiện click lan ra overlay làm đóng modal nhầm */}
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Mã truy xuất nguồn gốc</h3>
          <button className="btn-close" onClick={onClose}>&times;</button>
        </div>
        
        <div className="modal-body">
          <p className="product-name-preview">{product.name}</p>
          
          {/* Canvas vẽ QR Code */}
          <div className="qr-container">
            <QRCodeCanvas 
              id="qr-gen" 
              value={qrValue} 
              size={250} 
              level={"H"} // Mức độ sửa lỗi cao (in bị mờ vẫn quét được)
              includeMargin={true}
            />
          </div>

          <p className="qr-note">
            ID: <span style={{fontWeight:'bold'}}>{product.id}</span>
          </p>
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>Đóng</button>
          <button className="btn-primary" onClick={downloadQR}>
            ⬇️ Tải ảnh QR (In tem)
          </button>
        </div>
      </div>
    </div>
  );
};

export default QRModal;