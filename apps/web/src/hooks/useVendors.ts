import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { toast } from 'sonner';

export interface Vendor {
  id: string;
  name: string;
  email: string;
  contactNo: string;
  gstNo?: string;
  category?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';
  score?: number;
  createdAt: string;
  updatedAt: string;
}

// Fetch all vendors
export function useVendors(filters?: { status?: string; category?: string }) {
  return useQuery({
    queryKey: ['vendors', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.status) params.append('status', filters.status);
      if (filters?.category) params.append('category', filters.category);
      
      const { data } = await api.get(`/vendors?${params.toString()}`);
      return data.data.vendors as Vendor[];
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// Fetch single vendor
export function useVendor(vendorId: string) {
  return useQuery({
    queryKey: ['vendor', vendorId],
    queryFn: async () => {
      const { data } = await api.get(`/vendors/${vendorId}`);
      return data.data.vendor as Vendor;
    },
    enabled: !!vendorId,
  });
}

// Create vendor
export function useCreateVendor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (vendorData: Partial<Vendor>) => {
      const { data } = await api.post('/vendors', vendorData);
      return data.data.vendor;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendors'] });
      toast.success('Vendor created successfully');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to create vendor';
      toast.error(message);
    },
  });
}

// Update vendor
export function useUpdateVendor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data: vendorData }: { id: string; data: Partial<Vendor> }) => {
      const { data } = await api.put(`/vendors/${id}`, vendorData);
      return data.data.vendor;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['vendors'] });
      queryClient.invalidateQueries({ queryKey: ['vendor', variables.id] });
      toast.success('Vendor updated successfully');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to update vendor';
      toast.error(message);
    },
  });
}

// Delete vendor
export function useDeleteVendor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (vendorId: string) => {
      await api.delete(`/vendors/${vendorId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendors'] });
      toast.success('Vendor deleted successfully');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to delete vendor';
      toast.error(message);
    },
  });
}

// Update vendor status
export function useUpdateVendorStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { data } = await api.patch(`/vendors/${id}/status`, { status });
      return data.data.vendor;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['vendors'] });
      queryClient.invalidateQueries({ queryKey: ['vendor', variables.id] });
      toast.success('Vendor status updated successfully');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to update vendor status';
      toast.error(message);
    },
  });
}
