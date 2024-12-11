export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'employee';
  avatarUrl?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assignedUserId: string;
  deadline: Date;
  status: 'pending' | 'in-progress' | 'completed';
  points: number;
  createdAt: Date;
}

export interface LeaderboardEntry {
  userId: string;
  userName: string;
  avatarUrl?: string;
  totalPoints: number;
  rank: number;
}