
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

    const { data: tasks } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', user.id)
      .neq('status', 'completed');

    if (!tasks) throw new Error('No tasks found');

    // AI-powered task prioritization algorithm
    const prioritizedTasks = tasks.map(task => {
      let score = 0;

      // Priority weight (40% of score)
      switch (task.priority) {
        case 'high': score += 40; break;
        case 'medium': score += 25; break;
        case 'low': score += 10; break;
      }

      // Due date urgency (30% of score)
      if (task.due_date) {
        const daysUntilDue = Math.floor(
          (new Date(task.due_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
        );
        if (daysUntilDue <= 1) score += 30;
        else if (daysUntilDue <= 3) score += 20;
        else if (daysUntilDue <= 7) score += 15;
        else if (daysUntilDue <= 14) score += 10;
        else score += 5;
      }

      // Progress momentum (20% of score)
      const progress = task.progress || 0;
      if (progress > 0 && progress < 100) {
        score += Math.min(20, progress / 5); // Boost for tasks in progress
      }

      // Complexity estimation (10% of score)
      const descriptionLength = task.description?.length || 0;
      if (descriptionLength < 100) score += 10; // Simple tasks get priority
      else if (descriptionLength < 300) score += 7;
      else score += 5;

      return {
        ...task,
        ai_priority_score: Math.min(100, score)
      };
    });

    // Sort by AI priority score
    prioritizedTasks.sort((a, b) => b.ai_priority_score - a.ai_priority_score);

    // Update AI scores in database
    for (const task of prioritizedTasks) {
      await supabase
        .from('tasks')
        .update({ ai_score: task.ai_priority_score })
        .eq('id', task.id);
    }

    // Generate recommendations
    const recommendations = [];
    const topTasks = prioritizedTasks.slice(0, 3);
    
    if (topTasks.length > 0) {
      recommendations.push({
        type: 'focus',
        title: 'Focus Recommendation',
        description: `Start with "${topTasks[0].title}" - it has the highest AI priority score of ${topTasks[0].ai_priority_score}.`
      });
    }

    const overdueTasks = prioritizedTasks.filter(task => 
      task.due_date && new Date(task.due_date) < new Date()
    );

    if (overdueTasks.length > 0) {
      recommendations.push({
        type: 'urgent',
        title: 'Overdue Alert',
        description: `You have ${overdueTasks.length} overdue task(s). Consider addressing these immediately.`
      });
    }

    return new Response(JSON.stringify({
      prioritized_tasks: prioritizedTasks,
      recommendations,
      total_tasks: tasks.length,
      avg_priority_score: Math.round(
        prioritizedTasks.reduce((sum, t) => sum + t.ai_priority_score, 0) / prioritizedTasks.length
      )
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in smart prioritization:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
