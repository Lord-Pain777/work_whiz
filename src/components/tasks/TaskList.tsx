import React from 'react';
import { motion } from 'framer-motion';
import { Task } from '../../types';
import { TaskActions } from './TaskActions';
import { calculateTimeLeft } from '../../lib/utils';

interface TaskListProps {
  tasks: Task[];
}

export const TaskList: React.FC<TaskListProps> = ({ tasks }) => {
  const sortedTasks = [...tasks].sort((a, b) => {
    const statusOrder = { 'in-progress': 0, 'pending': 1, 'completed': 2 };
    return statusOrder[a.status] - statusOrder[b.status];
  });

  return (
    <div className="space-y-4">
      {sortedTasks.map((task) => (
        <motion.div
          key={task.id}
          layout
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="border border-gray-200 rounded-lg p-4 hover:border-teal-500 transition-colors"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-gray-900">{task.title}</h3>
            <TaskActions task={task} />
          </div>
          <p className="text-sm text-gray-500 mb-3">{task.description}</p>
          <div className="flex items-center justify-between text-sm">
            <span className="text-teal-600 font-medium">{task.points} points</span>
            <span className="text-gray-500">{calculateTimeLeft(new Date(task.deadline))}</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
};