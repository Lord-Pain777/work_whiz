import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../ui/Button';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

interface TaskFormData {
  title: string;
  description: string;
  assignedUserId: string;
  points: number;
  deadline: string;
}

export const TaskCreationForm: React.FC = () => {
  const [users, setUsers] = React.useState<Array<{ id: string; name: string }>>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [formData, setFormData] = React.useState<TaskFormData>({
    title: '',
    description: '',
    assignedUserId: '',
    points: 100,
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  });

  React.useEffect(() => {
    const fetchUsers = async () => {
      const { data } = await supabase
        .from('users')
        .select('id, name')
        .eq('role', 'employee');
      setUsers(data || []);
    };
    fetchUsers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.from('tasks').insert({
        ...formData,
        status: 'pending',
      });

      if (error) throw error;

      toast.success('Task created successfully');
      setFormData({
        title: '',
        description: '',
        assignedUserId: '',
        points: 100,
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      });
    } catch (error) {
      console.error('Error creating task:', error);
      toast.error('Failed to create task');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Task Title
        </label>
        <input
          type="text"
          id="title"
          required
          value={formData.title}
          onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-teal-500 focus:ring-teal-500"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          required
          value={formData.description}
          onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
          rows={3}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-teal-500 focus:ring-teal-500"
        />
      </div>

      <div>
        <label htmlFor="assignedUserId" className="block text-sm font-medium text-gray-700">
          Assign To
        </label>
        <select
          id="assignedUserId"
          required
          value={formData.assignedUserId}
          onChange={(e) => setFormData((prev) => ({ ...prev, assignedUserId: e.target.value }))}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-teal-500 focus:ring-teal-500"
        >
          <option value="">Select an employee</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="points" className="block text-sm font-medium text-gray-700">
            Points
          </label>
          <input
            type="number"
            id="points"
            required
            min="1"
            value={formData.points}
            onChange={(e) => setFormData((prev) => ({ ...prev, points: parseInt(e.target.value) }))}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-teal-500 focus:ring-teal-500"
          />
        </div>

        <div>
          <label htmlFor="deadline" className="block text-sm font-medium text-gray-700">
            Deadline
          </label>
          <input
            type="date"
            id="deadline"
            required
            value={formData.deadline}
            onChange={(e) => setFormData((prev) => ({ ...prev, deadline: e.target.value }))}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-teal-500 focus:ring-teal-500"
          />
        </div>
      </div>

      <Button type="submit" isLoading={isLoading} className="w-full">
        <Plus className="h-4 w-4 mr-2" />
        Create Task
      </Button>
    </form>
  );
};