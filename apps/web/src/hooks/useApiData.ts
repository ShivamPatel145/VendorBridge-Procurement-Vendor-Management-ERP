'use client';
import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';

export function useApiData<T>(
  endpoint: string,
  params?: Record<string, unknown>,
  deps: unknown[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(endpoint, { params });
      const body = res.data?.data ?? res.data;
      setData(body);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Failed to load data');
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoint, JSON.stringify(params), ...deps]);

  useEffect(() => { fetch(); }, [fetch]);

  return { data, loading, error, refetch: fetch };
}
