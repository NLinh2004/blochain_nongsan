// src/components/ProductList.tsx
import React, { useState } from 'react';
import productService, { type ProductOutput } from '../../../services/productService';


const ProductList: React.FC = () => {
  // 1. State quản lý tìm kiếm
  const [searchId, setSearchId] = useState<string>('');
  const [product, setProduct] = useState<ProductOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 2. Hàm gọi Smart Contract
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchId) return;

    setLoading(true);
    setError('');
    setProduct(null);

    try {
      console.log("Đang tìm ID:", searchId);
      // Gọi hàm get() từ service chúng ta vừa viết
      const data = await productService.get(Number(searchId));
      setProduct(data);
    } catch (err: any) {
      console.error(err);
      setError('❌ Không tìm thấy sản phẩm! (Hoặc chưa kết nối ví)');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-card">
      <h2 className="section-title">🔍 Tra cứu & Xác thực Nông sản</h2>
      
      {/* --- FORM TÌM KIẾM --- */}
      <form onSubmit={handleSearch} className="search-box" style={{ marginBottom: '30px' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            type="number"
            className="form-input"
            placeholder="Nhập mã ID sản phẩm (Ví dụ: 101)"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            style={{ flex: 1 }}
          />
          <button 
            type="submit"
            disabled={loading}
            className="btn-submit"
            style={{ width: '150px', margin: 0, height: '45px' }}
          >
            {loading ? 'Đang tìm...' : '🔎 Kiểm tra'}
          </button>
        </div>
      </form>

      {/* --- HIỂN THỊ LỖI --- */}
      {error && (
        <div style={{ 
          padding: '15px', background: '#f8d7da', color: '#721c24', 
          borderRadius: '8px', marginBottom: '20px', textAlign: 'center'
        }}>
          {error}
        </div>
      )}

      {/* --- HIỂN THỊ KẾT QUẢ --- */}
      {product ? (
        <div className="product-result" style={{ animation: 'fadeIn 0.5s' }}>
          <div style={{ 
            border: '2px solid #28a745', borderRadius: '10px', 
            overflow: 'hidden', backgroundColor: '#fff' 
          }}>
            {/* Header kết quả */}
            <div style={{ 
              background: '#28a745', color: 'white', padding: '15px', 
              display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
              <h3 style={{ margin: 0 }}>🌾 {product.name}</h3>
              <span style={{ background: 'white', color: '#28a745', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold' }}>
                Đã xác thực trên Blockchain
              </span>
            </div>

            {/* Body kết quả */}
            <div style={{ padding: '20px', display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
              
              {/* Cột thông tin */}
              <div style={{ flex: 2, minWidth: '300px' }}>
                <div style={{ marginBottom: '15px', paddingBottom: '15px', borderBottom: '1px dashed #eee' }}>
                  <p><strong>🆔 Mã số định danh:</strong> #{product.id}</p>
                  <p><strong>📍 Nguồn gốc:</strong> {product.origin}</p>
                </div>

                <div style={{ display: 'flex', gap: '20px', marginBottom: '15px' }}>
                  <div>
                    <strong style={{ color: '#666' }}>Ngày sản xuất</strong>
                    <div style={{ fontSize: '1.1em' }}>{product.productionDate}</div>
                  </div>
                  <div>
                    <strong style={{ color: '#666' }}>Hạn sử dụng</strong>
                    <div style={{ fontSize: '1.1em', color: '#d9534f' }}>{product.expiryDate}</div>
                  </div>
                </div>

                <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '8px' }}>
                  <p><strong>✅ Tiêu chuẩn:</strong> {product.qualityStandard}</p>
                  <p><strong>🔬 Kiểm định:</strong> {product.inspectionResult}</p>
                  <div style={{ marginTop: '10px', fontSize: '12px', color: '#888', wordBreak: 'break-all' }}>
                    <strong>✍️ Chữ ký điện tử (Người tạo):</strong><br/>
                    {product.producer}
                  </div>
                </div>
              </div>

              {/* Cột QR Code */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderLeft: '1px solid #eee' }}>
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=Product-ID:${product.id}-Origin:${product.origin}`} 
                  alt="QR Code" 
                  style={{ border: '5px solid #fff', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}
                />
                <p style={{ marginTop: '10px', color: '#666', fontSize: '14px' }}>Quét để truy xuất nguồn gốc</p>
              </div>

            </div>
          </div>
        </div>
      ) : (
        // Màn hình chờ khi chưa tìm kiếm
        !loading && !error && (
          <div style={{ textAlign: 'center', color: '#999', padding: '40px' }}>
            <div style={{ fontSize: '40px', marginBottom: '10px' }}>🛡️</div>
            <p>Nhập mã ID sản phẩm để kiểm tra thông tin trên Blockchain</p>
          </div>
        )
      )}
    </div>
  );
};

export default ProductList;