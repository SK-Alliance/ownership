// API Types
export interface RegisterItemRequest {
  title: string;
  category: string;
  est_value: number;
  billFile?: File;
  idFile?: File;
}

export interface RegisterItemResponse {
  success: boolean;
  data?: {
    id: string;
    title: string;
    category: string;
    estimated_value: number;
    owner_id: string;
    bill_url?: string;
    id_url?: string;
    status: string;
    created_at: string;
  };
  error?: string;
}

export interface FileUploadResponse {
  success: boolean;
  url?: string;
  error?: string;
}

export interface User {
  id: string;
  wallet_address: string;
  username?: string;
  created_at: string;
}
