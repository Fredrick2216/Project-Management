
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useAIInsights = () => {
  return useQuery({
    queryKey: ['ai-insights'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('ai_insights')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10);
        
        if (error) {
          console.error('Error fetching AI insights:', error);
          throw error;
        }
        return data || [];
      } catch (error) {
        console.error('AI insights query error:', error);
        throw error;
      }
    },
    retry: 3,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useGenerateAIInsights = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async () => {
      try {
        console.log('Generating AI insights...');
        const { data, error } = await supabase.functions.invoke('generate-ai-insights');

        if (error) {
          console.error('AI insights generation error:', error);
          throw error;
        }
        
        console.log('AI insights generated successfully:', data);
        return data;
      } catch (error) {
        console.error('Generate AI insights mutation error:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-insights'] });
      toast({
        title: "AI Insights Generated",
        description: "New insights have been generated based on your data.",
      });
    },
    onError: (error: any) => {
      console.error('AI insights generation failed:', error);
      toast({
        title: "Error generating insights",
        description: error.message || "Failed to generate insights. Please try again.",
        variant: "destructive",
      });
    },
  });
};
