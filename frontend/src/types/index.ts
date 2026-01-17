export interface User {
  id: number;
  phone: string;
  role: {
    id: number;
    name: 'CITIZEN' | 'SERVICE_PROVIDER' | 'ADMIN';
    created_at: string;
  };
  created_at: string;
}

export interface Service {
  id: number;
  name: string;
  description: string | null;
  base_url: string;
  category: string;
  status: string;
  service_id: string;
  provider_id: number;
  created_at: string;
}

export interface ServiceOnboardingRequest {
  id: number;
  name: string;
  description: string | null;
  base_url: string;
  category: string;
  service_id: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CHANGES_REQUESTED';
  admin_notes: string | null;
  submitted_at: string;
  updated_at: string | null;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (phone: string) => Promise<void>;
  verifyOTP: (phone: string, otpId: string, otpCode: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}
