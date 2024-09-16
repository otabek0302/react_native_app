import { useState, useEffect, useCallback } from 'react';

type FetchFunction<T> = (params?: any) => Promise<T>;

interface UseAppwriteReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

const useAppwrite = <T>(fn: FetchFunction<T>, params?: any): UseAppwriteReturn<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fn(params);
      setData(result);
    } catch (err) {
      console.error('Error retrieving data:', err);
      setError(`Failed to retrieve data: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  }, [fn, params]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const refetch = useCallback(() => {
    fetchPosts();
  }, [fetchPosts]);

  return { data, loading, error, refetch };
};


export default useAppwrite;