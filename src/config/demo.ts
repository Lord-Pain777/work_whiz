import { DemoCredentials } from '../types/auth';

export const mockUsers = {
  'admin@example.com': {
    id: '1',
    email: 'admin@example.com',
    name: 'Admin User',
    role: 'admin' as const,
  },
  'john@example.com': {
    id: '2',
    email: 'john@example.com',
    name: 'John Doe',
    role: 'employee' as const,
  },
};

export const demoCredentials: DemoCredentials = {
  admin: { email: 'admin@example.com', password: 'admin123' },
  employee: { email: 'john@example.com', password: 'employee123' },
};