export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'employee';
  avatarUrl?: string;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface DemoCredentials {
  admin: AuthCredentials;
  employee: AuthCredentials;
}