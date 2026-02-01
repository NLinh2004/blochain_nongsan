// src/services/productService.ts
import { ethers } from 'ethers';
import ChanNongABI from '../abis/ChanNong.json';
import { CONTRACT_ADDRESS } from '../abis/contractConfig';

// 1. Dữ liệu đầu vào
export interface ProductInput {
  productId: number;
  name: string;
  origin: string;
  qualityStandard: string;
  inspectionResult: string;
  productionDate: string;
  expiryDate: string;
}

// 2. Dữ liệu đầu ra
export interface ProductOutput {
  id: number;
  name: string;
  origin: string;
  qualityStandard: string;
  inspectionResult: string;
  productionDate: string;
  expiryDate: string;
  producer: string;
  exists: boolean;
}

// --- KHÔNG CẦN declare global NỮA ĐỂ TRÁNH LỖI XUNG ĐỘT ---

const getContract = async (withSigner = false) => {
  // Ép kiểu window thành any để truy cập ethereum mà không bị lỗi TS
  const { ethereum } = window as any;

  if (!ethereum) throw new Error("Vui lòng cài đặt ví MetaMask!");

  const provider = new ethers.BrowserProvider(ethereum);
  
  if (withSigner) {
    const signer = await provider.getSigner();
    return new ethers.Contract(CONTRACT_ADDRESS, ChanNongABI.abi, signer);
  } else {
    return new ethers.Contract(CONTRACT_ADDRESS, ChanNongABI.abi, provider);
  }
};

const productService = {
  // --- HÀM GHI ---
  add: async (data: ProductInput): Promise<{ txHash: string }> => {
    try {
      const contract = await getContract(true);
      
      console.log("📡 Đang gửi dữ liệu xuống Blockchain:", data);

      const tx = await contract.addProduct(
        data.productId,         
        data.name,              
        data.origin,            
        data.qualityStandard,   
        data.inspectionResult,  
        data.productionDate,    
        data.expiryDate         
      );

      console.log("⏳ Đang chờ xác nhận giao dịch...");
      await tx.wait(); 
      
      return { txHash: tx.hash };

    } catch (error: any) {
      console.error("Lỗi Blockchain:", error);
      if (error.reason) throw new Error(error.reason); 
      throw new Error(error.message || "Giao dịch thất bại");
    }
  },

  // --- HÀM ĐỌC ---
  get: async (id: number): Promise<ProductOutput> => {
    try {
      const contract = await getContract(false);
      const result = await contract.getProduct(id);

      return {
        id: Number(result.id), 
        name: result.name,
        origin: result.origin,
        qualityStandard: result.qualityStandard,
        inspectionResult: result.inspectionResult,
        productionDate: result.productionDate, 
        expiryDate: result.expiryDate,         
        producer: result.producer,
        exists: result.exists
      };
    } catch (error: any) {
      console.error("Lỗi lấy dữ liệu:", error);
      throw new Error("Không tìm thấy sản phẩm hoặc lỗi kết nối.");
    }
  }
};

export default productService;