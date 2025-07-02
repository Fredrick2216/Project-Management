
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useTaskStats = () => {
  return useQuery({
    queryKey: ['task-stats'],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('task-analytics');

      if (error) throw error;
      return data;
    },
  });
};

export const useAnalyticsData = () => {
  return useQuery({
    queryKey: ['analytics-data'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('analytics_data')
        .select('*')
        .order('date', { ascending: false })
        .limit(30);
      
      if (error) throw error;
      return data;
    },
  });
};

export const useCreateAnalytics = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (analytics: any) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('analytics_data')
        .insert([{ ...analytics, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['analytics-data'] });
      toast({
        title: "Analytics data saved",
        description: "Analytics data has been recorded.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error saving analytics",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useProductivityData = () => {
  return useQuery({
    queryKey: ['productivity-data'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('analytics_data')
        .select('*')
        .eq('metric_name', 'productivity_score')
        .order('date', { ascending: true })
        .limit(7);
      
      if (error) throw error;
      return data?.map(item => ({
        date: item.date,
        value: parseInt(item.metric_value.toString()),
      })) || [];
    },
  });
};

export const useTaskCompletionData = () => {
  return useQuery({
    queryKey: ['task-completion-data'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('analytics_data')
        .select('*')
        .eq('metric_name', 'tasks_completed')
        .order('date', { ascending: true })
        .limit(7);
      
      if (error) throw error;
      return data?.map(item => ({
        date: item.date,
        completed: parseInt(item.metric_value.toString()),
      })) || [];
    },
  });
};
