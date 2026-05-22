import axios from 'axios';
import { Tweet, SearchRequest } from './types';

// The Next.js API proxy lives at /api/* — avoids CORS issues
const client = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

export async function getAllTweets(): Promise<Tweet[]> {
  const res = await client.get<Tweet[]>('/documents');
  return res.data;
}

export async function getTweetById(id: string): Promise<Tweet> {
  const res = await client.get<Tweet>(`/documents/${id}`);
  return res.data;
}

export async function searchTweets(text: string): Promise<Tweet[]> {
  const body: SearchRequest = { text };
  const res = await client.post<Tweet[]>('/documents/search', body);
  return res.data;
}
