import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useTaskSuggestions } from '../../hooks/useTaskSuggestions';
import { Button } from '../ui/Button';

export const TaskSuggestions: React.FC = () => {
  const { suggestions, isLoading } = useTaskSuggestions();

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-24 bg-gray-100 rounded-lg"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Sparkles className="h-5 w-5 text-teal-600" />
        <h3 className="text-lg font-medium">Recommended Tasks</h3>
      </div>
      
      {suggestions.map((task) => (
        <motion.div
          key={task.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:border-teal-500 transition-colors"
        >
          <h4 className="font-medium text-gray-900">{task.title}</h4>
          <p className="text-sm text-gray-500 mt-1">{task.description}</p>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-sm font-medium text-teal-600">{task.points} points</span>
            <Button variant="outline" size="sm">
              Start Task
            </Button>
          </div>
        </motion.div>
      ))}
    </div>
  );
};