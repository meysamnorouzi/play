import { createContext, useContext, useState, type ReactNode, useEffect } from 'react';

export interface UserData {
  phone: string;
  firstName?: string;
  lastName?: string;
  nationalId?: string;
  birthDate?: string;
  email?: string;
  avatar?: string;
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

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserData | null;
  handleLogin: (authResponse: AuthResponse) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<UserData>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedAuth = localStorage.getItem('isAuthenticated');
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('authToken') || localStorage.getItem('access_token');

    // If user was previously logged in (with token or auth flag), read their information from localStorage
    if ((storedAuth === 'true' || storedToken) && storedUser) {
      setIsAuthenticated(true);
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const handleLogin = async (authResponse: AuthResponse): Promise<void> => {
    // Extract user data from API response
    const userData: UserData = {
      phone: authResponse.user?.phone || '',
      firstName: authResponse.user?.firstName,
      lastName: authResponse.user?.lastName,
      nationalId: authResponse.user?.nationalId,
      email: authResponse.user?.email,
    };

    // Save token data if provided (new API structure)
    if (authResponse.data) {
      localStorage.setItem('access_token', authResponse.data.access_token);
      localStorage.setItem('refresh_token', authResponse.data.refresh_token);
      localStorage.setItem('token_type', authResponse.data.token_type);
      localStorage.setItem('expires_in', authResponse.data.expires_in.toString());
      localStorage.setItem('issued_at', authResponse.data.issued_at);
      localStorage.setItem('refresh_expires_in', authResponse.data.refresh_expires_in.toString());
      // Also save as authToken for backward compatibility
      localStorage.setItem('authToken', authResponse.data.access_token);
    } else if (authResponse.token) {
      // Legacy support
      localStorage.setItem('authToken', authResponse.token);
    }

    // Save login status and user information in localStorage
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('user', JSON.stringify(userData));
    setIsAuthenticated(true);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('token_type');
    localStorage.removeItem('expires_in');
    localStorage.removeItem('issued_at');
    localStorage.removeItem('refresh_expires_in');
    setIsAuthenticated(false);
    setUser(null);
  };

  const updateUser = (updatedData: Partial<UserData>) => {
    if (!user) return;
    
    // Update user information
    const updatedUser = { ...user, ...updatedData };
    
    setUser(updatedUser);
    
    // Save in localStorage
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  if (isLoading) {
    return null; 
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, handleLogin, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
