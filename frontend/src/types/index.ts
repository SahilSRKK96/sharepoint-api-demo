export interface User {
  id: string;
  userId: string;
  name: string;
  status: 'Active' | 'Inactive' | 'Pending';
  group: string;
  updatedDate: string;
  createdDate: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  count?: number;
  error?: string;
}
