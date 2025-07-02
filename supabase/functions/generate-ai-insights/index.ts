
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization')!;
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Fetch user's data for analysis
    const { data: tasks } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', user.id);

    const { data: projects } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', user.id);

    // Generate AI insights based on data patterns
    const insights = [];

    if (tasks && tasks.length > 0) {
      const highPriorityTasks = tasks.filter(t => t.priority === 'high').length;
      const overdueTasks = tasks.filter(t => t.due_date && new Date(t.due_date) < new Date()).length;
      const avgProgress = tasks.reduce((sum, t) => sum + (t.progress || 0), 0) / tasks.length;

      if (highPriorityTasks > 5) {
        insights.push({
          user_id: user.id,
          type: 'workload',
          title: 'High Priority Overload',
          description: `You have ${highPriorityTasks} high-priority tasks. Consider delegating or breaking them into smaller chunks.`,
          actionable: 'Consider delegating tasks or breaking them into smaller milestones'
        });
      }

      if (overdueTasks > 0) {
        insights.push({
          user_id: user.id,
          type: 'deadline',
          title: 'Overdue Tasks Alert',
          description: `${overdueTasks} tasks are overdue. Focus on completing these first to improve your productivity score.`,
          actionable: 'Prioritize overdue tasks immediately'
        });
      }

      if (avgProgress < 50) {
        insights.push({
          user_id: user.id,
          type: 'progress',
          title: 'Progress Optimization',
          description: `Your average task progress is ${Math.round(avgProgress)}%. Consider setting smaller milestones to maintain momentum.`,
          actionable: 'Break down tasks into smaller, manageable milestones'
        });
      }
    }

    if (projects && projects.length > 3) {
      insights.push({
        user_id: user.id,
        type: 'project_management',
        title: 'Project Focus Recommendation',
        description: `You're managing ${projects.length} projects. Consider focusing on 2-3 core projects for better results.`,
        actionable: 'Focus on 2-3 core projects for better productivity'
      });
    }

    // Insert insights into database (fixed column names)
    if (insights.length > 0) {
      const { error } = await supabase
        .from('ai_insights')
        .insert(insights);

      if (error) throw error;
    }

    return new Response(JSON.stringify({ 
      success: true, 
      insights_generated: insights.length,
      insights: insights
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error generating AI insights:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
