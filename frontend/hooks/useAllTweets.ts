import { useQuery } from '@tanstack/react-query';
import { getAllTweets } from '@/lib/api';
import { MOCK_TWEETS } from '@/lib/mockData';

export function useAllTweets() {
  return useQuery({
    queryKey: ['tweets'],
    queryFn: async () => {
      try {
        return await getAllTweets();
      } catch {
        // Return mock data on error; caller reads isError + isMockData
        return MOCK_TWEETS;
      }
    },
    retry: 1,
    staleTime: 30_000,
  });
}
