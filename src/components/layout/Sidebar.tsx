import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Trophy, Users, BarChart2 } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { cn } from '../../lib/utils';

export const Sidebar: React.FC = () => {
  const { user } = useAuthStore();

  const navItems = [
    { icon: Home, label: 'Dashboard', path: '/' },
    { icon: Trophy, label: 'Leaderboard', path: '/leaderboard' },
    ...(user?.role === 'admin'
      ? [{ icon: BarChart2, label: 'Admin Panel', path: '/admin' }]
      : []),
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-4rem)]">
      <nav className="mt-8 space-y-1 px-4">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                'flex items-center px-4 py-2 text-sm font-medium rounded-lg',
                isActive
                  ? 'bg-teal-50 text-teal-600'
                  : 'text-gray-600 hover:bg-gray-50'
              )
            }
          >
            <item.icon className="mr-3 h-5 w-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};