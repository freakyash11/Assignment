export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  timezone?: string;
}

export interface Task {
  id: string;
  userId: string;
  title: string;
  description?: string;
  tags: string[];
  status: 'todo' | 'done';
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
