import React from 'react';
import { Play, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { supabase } from '../../lib/supabase';
import { Task } from '../../types';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

interface TaskActionsProps {
  task: Task;
}

export const TaskActions: React.FC<TaskActionsProps> = ({ task }) => {
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleTaskAction = async (action: 'start' | 'complete' | 'abandon') => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const newStatus = action === 'start' ? 'in-progress' : 
                       action === 'complete' ? 'completed' : 'abandoned';

      const { error } = await supabase
        .from('tasks')
        .update({ status: newStatus })
        .eq('id', task.id);

      if (error) throw error;

      if (action === 'complete') {
        await supabase.from('points_history').insert({
          userId: user.id,
          taskId: task.id,
          points: task.points,
          reason: 'Task completion'
        });

        await supabase.from('activity_feed').insert({
          userId: user.id,
          type: 'task_completed',
          description: `Completed task: ${task.title}`,
          metadata: { taskId: task.id, points: task.points }
        });

        toast.success(`Task completed! Earned ${task.points} points`);
      }
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Failed to update task');
    } finally {
      setIsLoading(false);
    }
  };

  if (task.status === 'completed') {
    return (
      <span className="text-green-600 text-sm font-medium flex items-center">
        <CheckCircle className="h-4 w-4 mr-1" />
        Completed
      </span>
    );
  }

  return (
    <div className="flex space-x-2">
      {task.status === 'pending' && (
        <Button
          size="sm"
          variant="outline"
          onClick={() => handleTaskAction('start')}
          isLoading={isLoading}
        >
          <Play className="h-4 w-4 mr-1" />
          Start
        </Button>
      )}
      
      {task.status === 'in-progress' && (
        <>
          <Button
            size="sm"
            onClick={() => handleTaskAction('complete')}
            isLoading={isLoading}
          >
            <CheckCircle className="h-4 w-4 mr-1" />
            Complete
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleTaskAction('abandon')}
            isLoading={isLoading}
          >
            <XCircle className="h-4 w-4 mr-1" />
            Abandon
          </Button>
        </>
      )}
    </div>
  );
};