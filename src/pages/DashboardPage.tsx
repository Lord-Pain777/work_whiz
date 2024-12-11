import React from 'react';
import { useAuthStore } from '../store/authStore';
import { Task } from '../types';
import { Button } from '../components/ui/Button';
import { supabase } from '../lib/supabase';
import { TaskSuggestions } from '../components/tasks/TaskSuggestions';
import { TaskList } from '../components/tasks/TaskList';
import { ActivityFeed } from '../components/activity/ActivityFeed';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export const DashboardPage: React.FC = () => {
  const { user } = useAuthStore();
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchTasks = async () => {
      try {
        const { data } = await supabase
          .from('tasks')
          .select('*')
          .eq('assignedUserId', user?.id)
          .order('deadline', { ascending: true });
        
        setTasks(data || []);
      } catch (error) {
        console.error('Error fetching tasks:', error);
        toast.error('Failed to fetch tasks');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();

    const tasksSubscription = supabase
      .channel('tasks')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'tasks', filter: `assigned_user_id=eq.${user?.id}` },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setTasks((current) => [...current, payload.new as Task]);
            toast.success('New task assigned!');
          } else if (payload.eventType === 'UPDATE') {
            setTasks((current) =>
              current.map((task) =>
                task.id === payload.new.id ? { ...task, ...payload.new } : task
              )
            );
          }
        }
      )
      .subscribe();

    return () => {
      tasksSubscription.unsubscribe();
    };
  }, [user?.id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="md:flex md:items-center md:justify-between mb-8"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
          <p className="mt-1 text-sm text-gray-500">Here's an overview of your tasks and progress.</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button>
            Start New Task
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-lg shadow p-6"
        >
          <h2 className="text-lg font-medium text-gray-900 mb-4">Active Tasks</h2>
          <TaskList tasks={tasks} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow p-6"
        >
          <TaskSuggestions />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-lg shadow p-6"
        >
          <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h2>
          <ActivityFeed />
        </motion.div>
      </div>
    </div>
  );
};