import { useMutation, useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useAuthStore, type AuthUser } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  data: {
    user: AuthUser;
    accessToken: string;
    refreshToken: string;
  };
}

interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role?: string;
}

// Login hook
export function useLogin() {
  const { setAuth } = useAuthStore();
  const router = useRouter();

  return useMutation({
    mutationFn: async (credentials: LoginRequest): Promise<LoginResponse> => {
      const { data } = await api.post<LoginResponse>('/auth/login', credentials);
      return data;
    },
    onSuccess: (data) => {
      // Store token in localStorage
      localStorage.setItem('accessToken', data.data.accessToken);
      
      // Update auth store
      setAuth(data.data.user, data.data.accessToken);
      
      toast.success(`Welcome back, ${data.data.user.name}!`);
      
      // Redirect based on role
      const redirectPath = data.data.user.role === 'VENDOR' ? '/vendor-portal/rfqs' : '/dashboard';
      router.push(redirectPath);
    },
    onError: (error: any) => {
      console.error('Login error:', error);
      const message = error.response?.data?.message || 'Invalid email or password. Please try again.';
      toast.error(message);
    },
  });
}

// Register hook
export function useRegister() {
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: RegisterRequest) => {
      const response = await api.post('/auth/register', data);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Account created successfully! Please login.');
      router.push('/login');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(message);
    },
  });
}

// Logout hook
export function useLogout() {
  const { clearAuth } = useAuthStore();
  const router = useRouter();

  return useMutation({
    mutationFn: async () => {
      try {
        await api.post('/auth/logout');
      } catch (error) {
        // Continue with logout even if API call fails
        console.error('Logout API error:', error);
      }
    },
    onSuccess: () => {
      // Clear local storage
      localStorage.removeItem('accessToken');
      
      // Clear auth store
      clearAuth();
      
      toast.success('Logged out successfully');
      router.push('/login');
    },
  });
}

// Get current user hook
export function useCurrentUser() {
  const { user, isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const { data } = await api.get('/auth/me');
      return data.data.user;
    },
    enabled: isAuthenticated && !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Refresh token hook
export function useRefreshToken() {
  const { setAuth, clearAuth } = useAuthStore();

  return useMutation({
    mutationFn: async () => {
      const { data } = await api.post('/auth/refresh');
      return data;
    },
    onSuccess: (data) => {
      localStorage.setItem('accessToken', data.data.accessToken);
      setAuth(data.data.user, data.data.accessToken);
    },
    onError: () => {
      // If refresh fails, clear auth and redirect to login
      localStorage.removeItem('accessToken');
      clearAuth();
      window.location.href = '/login';
    },
  });
}
