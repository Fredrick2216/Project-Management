
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useProjects = () => {
  return useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error('Error fetching projects:', error);
          throw error;
        }
        return data || [];
      } catch (error) {
        console.error('Projects query error:', error);
        throw error;
      }
    },
    retry: 3,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (project: any) => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('You must be logged in to create projects');

        // Validate project data
        const cleanProject = {
          name: project.name?.trim(),
          description: project.description?.trim() || null,
          status: ['active', 'inactive', 'completed'].includes(project.status) ? project.status : 'active',
          user_id: user.id
        };

        if (!cleanProject.name) {
          throw new Error('Project name is required');
        }

        const { data, error } = await supabase
          .from('projects')
          .insert([cleanProject])
          .select()
          .single();

        if (error) {
          console.error('Project creation error:', error);
          throw error;
        }

        return data;
      } catch (error) {
        console.error('Create project mutation error:', error);
        throw error;
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast({
        title: "Project created successfully",
        description: `"${data.name}" has been added to your projects.`,
      });
    },
    onError: (error: any) => {
      console.error('Project creation failed:', error);
      toast({
        title: "Error creating project",
        description: error.message || "Failed to create project. Please try again.",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateProject = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      try {
        if (!id) {
          throw new Error('Project ID is required');
        }

        // Validate updates
        if (updates.status && !['active', 'inactive', 'completed'].includes(updates.status)) {
          updates.status = 'active';
        }

        const { data, error } = await supabase
          .from('projects')
          .update(updates)
          .eq('id', id)
          .select()
          .single();

        if (error) {
          console.error('Project update error:', error);
          throw error;
        }

        return data;
      } catch (error) {
        console.error('Update project mutation error:', error);
        throw error;
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast({
        title: "Project updated successfully",
        description: `"${data.name}" has been updated.`,
      });
    },
    onError: (error: any) => {
      console.error('Project update failed:', error);
      toast({
        title: "Error updating project",
        description: error.message || "Failed to update project. Please try again.",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (projectId: string) => {
      try {
        if (!projectId) {
          throw new Error('Project ID is required');
        }

        const { data, error } = await supabase
          .from('projects')
          .delete()
          .eq('id', projectId)
          .select()
          .single();

        if (error) {
          console.error('Project deletion error:', error);
          throw error;
        }

        return data;
      } catch (error) {
        console.error('Delete project mutation error:', error);
        throw error;
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast({
        title: "Project deleted",
        description: `"${data.name}" has been deleted.`,
      });
    },
    onError: (error: any) => {
      console.error('Project deletion failed:', error);
      toast({
        title: "Error deleting project",
        description: error.message || "Failed to delete project. Please try again.",
        variant: "destructive",
      });
    },
  });
};
