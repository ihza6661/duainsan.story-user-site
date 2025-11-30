import api from '@/lib/api';
import {
  DesignProof,
  DesignProofListResponse,
  DesignProofResponse,
  ApproveDesignProofRequest,
  RejectDesignProofRequest,
  RequestRevisionRequest,
} from '@/types/design-proof';

/**
 * Fetch all design proofs for a specific order
 */
export const getDesignProofsByOrderId = async (orderId: number): Promise<DesignProof[]> => {
  const response = await api.get<DesignProofListResponse>(`/orders/${orderId}/design-proofs`);
  return response.data.data;
};

/**
 * Get a single design proof by ID
 */
export const getDesignProofById = async (proofId: number): Promise<DesignProof> => {
  const response = await api.get<DesignProofResponse>(`/design-proofs/${proofId}`);
  return response.data.data;
};

/**
 * Approve a design proof
 */
export const approveDesignProof = async (
  proofId: number,
  data: ApproveDesignProofRequest
): Promise<DesignProof> => {
  const response = await api.post<DesignProofResponse>(
    `/design-proofs/${proofId}/approve`,
    data
  );
  return response.data.data;
};

/**
 * Reject a design proof
 */
export const rejectDesignProof = async (
  proofId: number,
  data: RejectDesignProofRequest
): Promise<DesignProof> => {
  const response = await api.post<DesignProofResponse>(
    `/design-proofs/${proofId}/reject`,
    data
  );
  return response.data.data;
};

/**
 * Request revision for a design proof
 */
export const requestRevision = async (
  proofId: number,
  data: RequestRevisionRequest
): Promise<DesignProof> => {
  const response = await api.post<DesignProofResponse>(
    `/design-proofs/${proofId}/request-revision`,
    data
  );
  return response.data.data;
};
