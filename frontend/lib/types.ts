export interface Tweet {
  id: string;
  userId: number;
  text: string;
  createdAt: string; // ISO string from backend
  _links?: Record<string, { href: string }>;
}

export interface SearchRequest {
  text: string;
}

export interface ApiError {
  message: string;
  status?: number;
}
