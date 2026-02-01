// src/components/CreateProduct.tsx
import React, { useState, type ChangeEvent, type FormEvent } from 'react';
import productService from '../../../services/productService';
// 1. Định nghĩa kiểu dữ liệu cho Form (Mở rộng để khớp contract)
interface ProductFormData {
  productId: number;       // MỚI: Contract cần uint256
  name: string;
  origin: string;
  productionDate: string;
  expiryDate: string;
  certificates: string[];  // UI dùng mảng, khi gửi sẽ gộp thành chuỗi
  inspectionResult: string;// MỚI: Contract cần string
  description: string;     // Chỉ dùng cho UI, không gửi lên chain
}

const CreateProduct: React.FC = () => {
  // 2. Khởi tạo State
  const [productData, setProductData] = useState<ProductFormData>({
    productId: 0,
    name: '',
    origin: '',
    productionDate: '',
    expiryDate: '',
    certificates: [],
    inspectionResult: '',
    description: ''
  });

  // State quản lý trạng thái tải và thông báo
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | ''; msg: string }>({ type: '', msg: '' });

  const standards: string[] = ["VietGAP", "GlobalGAP", "Organic", "OCOP 4 Sao"];

  // 3. Xử lý thay đổi Input
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProductData(prev => ({
      ...prev,
      [name]: name === 'productId' ? parseInt(value) || 0 : value
    }));
  };

  // 4. Xử lý thay đổi Checkbox
  const handleCheckboxChange = (std: string) => {
    setProductData(prev => {
      const isSelected = prev.certificates.includes(std);
      if (isSelected) {
        return { ...prev, certificates: prev.certificates.filter(c => c !== std) };
      } else {
        return { ...prev, certificates: [...prev.certificates, std] };
      }
    });
  };

  // 5. Xử lý Submit Form
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', msg: '' });

    // Validate cơ bản
    if (productData.productId <= 0) {
      setStatus({ type: 'error', msg: '⚠️ Mã sản phẩm phải lớn hơn 0' });
      setLoading(false);
      return;
    }

    try {
      console.log("Đang chuẩn bị dữ liệu...");

      // CHUYỂN ĐỔI DỮ LIỆU UI -> DỮ LIỆU BLOCKCHAIN
      // Contract: addProduct(id, name, origin, qualityStandard, inspectionResult, prodDate, expDate)
      const payload = {
        productId: productData.productId,
        name: productData.name,
        origin: productData.origin,
        // Gộp mảng checkbox thành chuỗi: "VietGAP, Organic"
        qualityStandard: productData.certificates.join(', '), 
        inspectionResult: productData.inspectionResult,
        productionDate: productData.productionDate,
        expiryDate: productData.expiryDate
      };

      // Gọi Service
      const result = await productService.add(payload);
      
      setStatus({ 
        type: 'success', 
        msg: `✅ Thành công! Hash giao dịch: ${result.txHash.substring(0, 15)}...` 
      });

      // Reset Form sau khi thành công
      setProductData({
        productId: 0, name: '', origin: '', productionDate: '', 
        expiryDate: '', certificates: [], inspectionResult: '', description: ''
      });

    } catch (error: any) {
      console.error(error);
      setStatus({ type: 'error', msg: `❌ Lỗi: ${error.message}` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-card">
       <h2 className="section-title">➕ Tạo nông sản mới (Ghi lên Blockchain)</h2>
       
       <form onSubmit={handleSubmit}>
            <div className="form-grid">
              {/* --- MỚI: ID SẢN PHẨM --- */}
              <div className="form-group full-width">
                <label>Mã số định danh (Product ID)</label>
                <input 
                  type="number" 
                  name="productId" 
                  className="form-input"
                  placeholder="Nhập mã số (VD: 101)"
                  required
                  value={productData.productId || ''}
                  onChange={handleInputChange}
                />
                <small style={{color: '#666'}}>*Mã này là duy nhất trên Blockchain</small>
              </div>

              {/* Tên sản phẩm */}
              <div className="form-group">
                <label>Tên sản phẩm nông sản</label>
                <input 
                  type="text" name="name" className="form-input"
                  placeholder="Nhập tên nông sản" required
                  value={productData.name} onChange={handleInputChange}
                />
              </div>

              {/* Nơi sản xuất */}
              <div className="form-group">
                <label>Nơi sản xuất</label>
                <input 
                  type="text" name="origin" className="form-input"
                  placeholder="Tên Trang trại/HTX" required
                  value={productData.origin} onChange={handleInputChange}
                />
              </div>

              {/* Ngày sản xuất */}
              <div className="form-group">
                <label>Ngày thu hoạch</label>
                <input 
                  type="date" name="productionDate" className="form-input" required
                  value={productData.productionDate} onChange={handleInputChange}
                />
              </div>

              {/* Hạn sử dụng */}
              <div className="form-group">
                <label>Hạn sử dụng</label>
                <input 
                  type="date" name="expiryDate" className="form-input" required
                  value={productData.expiryDate} onChange={handleInputChange}
                />
              </div>

              {/* Chọn tiêu chuẩn (Checkbox) -> Mapping vào qualityStandard */}
              <div className="form-group full-width">
                <label>Chứng nhận tiêu chuẩn (qualityStandard)</label>
                <div className="checkbox-group">
                  {standards.map((std) => (
                    <label key={std} className="checkbox-label">
                      <input 
                        type="checkbox" 
                        value={std}
                        checked={productData.certificates.includes(std)}
                        onChange={() => handleCheckboxChange(std)}
                      />
                      {std}
                    </label>
                  ))}
                </div>
              </div>

              {/* --- MỚI: KẾT QUẢ KIỂM ĐỊNH --- */}
              <div className="form-group full-width">
                <label>Kết quả kiểm định (inspectionResult)</label>
                <input 
                  type="text" name="inspectionResult" className="form-input"
                  placeholder="VD: Đạt chuẩn A, Hàm lượng thuốc BVTV < 0.01%" required
                  value={productData.inspectionResult} onChange={handleInputChange}
                />
              </div>

              {/* Ghi chú (UI Only) */}
              <div className="form-group full-width">
                <label>Mô tả chi tiết (Chỉ lưu nội bộ, không đưa lên chain)</label>
                <textarea 
                  name="description" className="form-textarea" rows={3}
                  placeholder="Mô tả thêm..."
                  value={productData.description} onChange={handleInputChange}
                ></textarea>
              </div>
            </div>

            {/* Hiển thị thông báo trạng thái */}
            {status.msg && (
              <div className={`status-box ${status.type}`} style={{
                marginTop: '15px', padding: '10px', borderRadius: '5px',
                backgroundColor: status.type === 'success' ? '#d4edda' : '#f8d7da',
                color: status.type === 'success' ? '#155724' : '#721c24'
              }}>
                {status.msg}
              </div>
            )}

            <button type="submit" className="btn-submit" disabled={loading} style={{
                marginTop: '20px', width: '100%', padding: '12px',
                backgroundColor: loading ? '#ccc' : '#28a745', color: '#fff',
                border: 'none', borderRadius: '5px', cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '16px', fontWeight: 'bold'
            }}>
              {loading ? '⏳ Đang chờ xác nhận ví...' : '🚀 Ghi dữ liệu lên Blockchain'}
            </button>
         </form>
    </div>
  );
};

export default CreateProduct;