
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useTasks = () => {
  return useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('tasks')
          .select(`
            *,
            projects (
              name
            )
          `)
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error('Error fetching tasks:', error);
          throw error;
        }
        return data || [];
      } catch (error) {
        console.error('Tasks query error:', error);
        throw error;
      }
    },
    retry: 3,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      try {
        console.log('Updating task:', id, updates);
        
        // Validate required fields
        if (!id) {
          throw new Error('Task ID is required');
        }

        // Ensure priority is valid
        if (updates.priority && !['low', 'medium', 'high'].includes(updates.priority)) {
          updates.priority = 'medium';
        }

        // Ensure status is valid
        if (updates.status && !['pending', 'in_progress', 'completed', 'deleted'].includes(updates.status)) {
          updates.status = 'pending';
        }

        // Ensure progress is within valid range
        if (updates.progress !== undefined) {
          updates.progress = Math.max(0, Math.min(100, Number(updates.progress) || 0));
        }

        const { data, error } = await supabase
          .from('tasks')
          .update(updates)
          .eq('id', id)
          .select()
          .single();

        if (error) {
          console.error('Task update error:', error);
          throw error;
        }
        
        console.log('Task updated successfully:', data);
        return data;
      } catch (error) {
        console.error('Update task mutation error:', error);
        throw error;
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast({
        title: "Task updated successfully",
        description: `"${data.title}" has been updated.`,
      });
    },
    onError: (error: any) => {
      console.error('Task update failed:', error);
      toast({
        title: "Error updating task",
        description: error.message || "Failed to update task. Please try again.",
        variant: "destructive",
      });
    },
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (task: any) => {
      try {
        console.log('Creating task with data:', task);
        
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          throw new Error('You must be logged in to create tasks');
        }

        // Validate and clean task data
        const cleanTask = {
          title: task.title?.trim(),
          description: task.description?.trim() || null,
          priority: ['low', 'medium', 'high'].includes(task.priority) ? task.priority : 'medium',
          status: ['pending', 'in_progress', 'completed'].includes(task.status) ? task.status : 'pending',
          project_id: task.project_id || null,
          assigned_to: task.assigned_to?.trim() || null,
          due_date: task.due_date || null,
          progress: Math.max(0, Math.min(100, Number(task.progress) || 0)),
          category: task.category || 'development',
          estimated_hours: Math.max(0, Number(task.estimated_hours) || 1),
          ai_score: Math.max(0, Math.min(100, Number(task.ai_score) || Math.floor(Math.random() * 50) + 50)),
          user_id: user.id
        };

        // Validate required fields
        if (!cleanTask.title) {
          throw new Error('Task title is required');
        }

        const { data, error } = await supabase
          .from('tasks')
          .insert([cleanTask])
          .select()
          .single();

        if (error) {
          console.error('Task creation error:', error);
          throw error;
        }

        console.log('Task created successfully:', data);
        return data;
      } catch (error) {
        console.error('Create task mutation error:', error);
        throw error;
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast({
        title: "Task created successfully",
        description: `"${data.title}" has been added to your tasks.`,
      });
    },
    onError: (error: any) => {
      console.error('Task creation failed:', error);
      toast({
        title: "Error creating task",
        description: error.message || "Failed to create task. Please try again.",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (taskId: string) => {
      try {
        if (!taskId) {
          throw new Error('Task ID is required');
        }

        const { data, error } = await supabase
          .from('tasks')
          .update({ status: 'deleted' })
          .eq('id', taskId)
          .select()
          .single();

        if (error) {
          console.error('Task deletion error:', error);
          throw error;
        }

        return data;
      } catch (error) {
        console.error('Delete task mutation error:', error);
        throw error;
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast({
        title: "Task deleted",
        description: `"${data.title}" has been deleted.`,
      });
    },
    onError: (error: any) => {
      console.error('Task deletion failed:', error);
      toast({
        title: "Error deleting task",
        description: error.message || "Failed to delete task. Please try again.",
        variant: "destructive",
      });
    },
  });
};
