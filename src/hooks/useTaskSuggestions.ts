import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Task } from '../types';
import { useAuthStore } from '../store/authStore';

export const useTaskSuggestions = () => {
  const [suggestions, setSuggestions] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    if (!user) return;

    const fetchSuggestions = async () => {
      try {
        const { data: completedTasks } = await supabase
          .from('tasks')
          .select('points, status')
          .eq('assignedUserId', user.id)
          .eq('status', 'completed');

        const averagePoints = completedTasks?.reduce((acc, task) => acc + task.points, 0) / (completedTasks?.length || 1);

        const { data: suggestions } = await supabase
          .from('tasks')
          .select('*')
          .eq('status', 'pending')
          .gte('points', averagePoints * 0.8)
          .lte('points', averagePoints * 1.2)
          .limit(3);

        setSuggestions(suggestions || []);
      } catch (error) {
        console.error('Error fetching task suggestions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSuggestions();
  }, [user]);

  return { suggestions, isLoading };
};