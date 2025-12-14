import api from './api';

// Types for API requests and responses
// Utility: always send number with +98 prefix
const formatMobileNumber = (input: string): string => {
  // keep digits only
  const digits = (input || '').replace(/\D/g, '');
  if (digits.startsWith('98')) {
    return `+${digits}`;
  }
  if (digits.startsWith('0')) {
    return `+98${digits.slice(1)}`;
  }
  // fallback: prepend +98 if no country code
  return digits.startsWith('+98') ? digits : `+98${digits}`;
};

export interface OTPRequestPayload {
  mobile_number: string;
}

export interface RegisterParentPayload {
  national_id: string;
  mobile_number: string;
  otp: string;
  first_name: string;
  last_name: string;
}

export interface LoginPayload {
  loginType: 'USERNAME_PASSWORD' | 'MOBILE_OTP' | 'CHILD' | 'QR';
  usernamePasswordCredentials?: {
    username: string;
    password: string;
  };
  otpCredentials?: {
    mobileNumber: string;
    otp: string;
  };
  childCredentials?: {
    nationalId: string;
    password: string;
  };
  qrCredentials?: {
    token: string;
  };
  childAuthMethod?: 'NATIONAL_ID_PASSWORD';
}

export interface AuthTokenData {
  access_token: string;
  expires_in: number;
  issued_at: string;
  refresh_expires_in: number;
  refresh_token: string;
  token_type: string;
}

export interface AuthResponse {
  data?: AuthTokenData;
  token?: string; // Legacy support
  user?: {
    id: string;
    phone: string;
    firstName?: string;
    lastName?: string;
    nationalId?: string;
    email?: string;
  };
  message?: string;
}

/**
 * Request OTP code for mobile number
 */
export const requestOTP = async (mobileNumber: string): Promise<{ message?: string; success: boolean }> => {
  const formattedMobile = formatMobileNumber(mobileNumber);
  
  const response = await api.post<{ message?: string }>('/api/auth/otp/request', {
    mobile_number: formattedMobile,
  });
  
  return {
    message: response.data.message,
    success: true,
  };
};

/**
 * Register a new parent user
 */
export const registerParent = async (payload: RegisterParentPayload): Promise<AuthResponse> => {
  const formattedMobile = formatMobileNumber(payload.mobile_number);
  
  const response = await api.post<{ data: AuthTokenData }>('/api/auth/register/parent', {
    ...payload,
    mobile_number: formattedMobile,
  });
  
  // Return in AuthResponse format
  return {
    data: response.data.data,
    token: response.data.data?.access_token, // For backward compatibility
  };
};

/**
 * Login with various credential types
 */
export const login = async (payload: LoginPayload): Promise<AuthResponse> => {
  // Format mobile number if OTP credentials are provided
  if (payload.otpCredentials?.mobileNumber) {
    payload.otpCredentials.mobileNumber = formatMobileNumber(payload.otpCredentials.mobileNumber);
  }
  
  const response = await api.post<{ data: AuthTokenData }>('/api/auth/login', payload);
  
  // Return in AuthResponse format
  return {
    data: response.data.data,
    token: response.data.data?.access_token, // For backward compatibility
  };
};
