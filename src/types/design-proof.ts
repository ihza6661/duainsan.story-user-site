export type DesignProofStatus = 'pending_approval' | 'approved' | 'revision_requested' | 'rejected';

export interface DesignProof {
  id: number;
  order_item_id: number;
  file_url: string;
  thumbnail_url?: string;
  file_name?: string;
  file_type?: string;
  file_size?: number;
  version?: number;
  status?: DesignProofStatus;
  customer_feedback?: string;
  admin_notes?: string;
  uploaded_by?: number;
  reviewed_by?: number;
  reviewed_at?: string;
  customer_notified?: boolean;
  customer_notified_at?: string;
  created_at: string;
  updated_at: string;
}

export interface DesignProofResponse {
  data: DesignProof;
  message?: string;
}

export interface DesignProofListResponse {
  data: DesignProof[];
  message?: string;
}

export interface ApproveDesignProofRequest {
  feedback?: string;
}

export interface RejectDesignProofRequest {
  feedback: string;
}

export interface RequestRevisionRequest {
  feedback: string;
}
