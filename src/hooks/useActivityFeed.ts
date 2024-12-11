import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';

interface ActivityItem {
  id: string;
  userId: string;
  type: 'task_completed' | 'points_earned' | 'task_started';
  description: string;
  timestamp: string;
  metadata: Record<string, any>;
}

export const useActivityFeed = () => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    if (!user) return;

    const fetchActivities = async () => {
      try {
        const { data } = await supabase
          .from('activity_feed')
          .select('*')
          .eq('userId', user.id)
          .order('timestamp', { ascending: false })
          .limit(10);

        setActivities(data || []);
      } catch (error) {
        console.error('Error fetching activities:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchActivities();

    const activitySubscription = supabase
      .channel('activity_feed')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'activity_feed', filter: `userId=eq.${user.id}` },
        (payload) => {
          setActivities((current) => [payload.new as ActivityItem, ...current]);
        }
      )
      .subscribe();

    return () => {
      activitySubscription.unsubscribe();
    };
  }, [user]);

  return { activities, isLoading };
};