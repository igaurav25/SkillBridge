export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  count?: number;
  total?: number;
  page?: number;
  pages?: number;
  token?: string;
  user?: any;
  errors?: Record<string, string>;
  categoryCounts?: Record<string, number>;
  stats?: any;
  unreadCount?: number;
}
