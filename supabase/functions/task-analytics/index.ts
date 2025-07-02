
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
      .eq('user_id', user.id);

    if (!tasks) throw new Error('No tasks found');

    // Calculate comprehensive analytics
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'completed').length;
    const inProgressTasks = tasks.filter(t => t.status === 'in_progress').length;
    const pendingTasks = tasks.filter(t => t.status === 'pending').length;

    // Priority distribution
    const highPriorityTasks = tasks.filter(t => t.priority === 'high' || t.priority === 'urgent').length;
    const mediumPriorityTasks = tasks.filter(t => t.priority === 'medium').length;
    const lowPriorityTasks = tasks.filter(t => t.priority === 'low').length;

    // Progress calculations
    const avgProgress = tasks.reduce((sum, t) => sum + (t.progress || 0), 0) / totalTasks || 0;
    const avgAIScore = tasks.reduce((sum, t) => sum + (t.ai_score || 0), 0) / totalTasks || 0;

    // Due date analysis
    const overdueTasks = tasks.filter(t => {
      if (!t.due_date) return false;
      const dueDate = new Date(t.due_date);
      const today = new Date();
      return dueDate < today && t.status !== 'completed';
    }).length;

    const dueSoonTasks = tasks.filter(t => {
      if (!t.due_date) return false;
      const dueDate = new Date(t.due_date);
      const threeDaysFromNow = new Date();
      threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
      return dueDate <= threeDaysFromNow && t.status !== 'completed';
    }).length;

    // Assignment analysis
    const assignedTasks = tasks.filter(t => t.assigned_to).length;
    const unassignedTasks = totalTasks - assignedTasks;

    // Category analysis (if category field exists)
    const categoryStats = tasks.reduce((acc, task) => {
      const category = task.category || 'uncategorized';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Calculate productivity trends (last 7 days)
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    const productivityTrend = last7Days.map(date => {
      const dayTasks = tasks.filter(t => 
        t.updated_at && t.updated_at.startsWith(date)
      );
      return {
        date,
        completed: dayTasks.filter(t => t.status === 'completed').length,
        created: dayTasks.length,
        progress: dayTasks.reduce((sum, t) => sum + (t.progress || 0), 0) / dayTasks.length || 0
      };
    });

    // Store updated analytics data
    const analyticsData = [
      { metric_name: 'total_tasks', metric_value: totalTasks, user_id: user.id },
      { metric_name: 'completed_tasks', metric_value: completedTasks, user_id: user.id },
      { metric_name: 'in_progress_tasks', metric_value: inProgressTasks, user_id: user.id },
      { metric_name: 'pending_tasks', metric_value: pendingTasks, user_id: user.id },
      { metric_name: 'overdue_tasks', metric_value: overdueTasks, user_id: user.id },
      { metric_name: 'due_soon_tasks', metric_value: dueSoonTasks, user_id: user.id },
      { metric_name: 'high_priority_tasks', metric_value: highPriorityTasks, user_id: user.id },
      { metric_name: 'assigned_tasks', metric_value: assignedTasks, user_id: user.id },
      { metric_name: 'avg_progress', metric_value: Math.round(avgProgress), user_id: user.id },
      { metric_name: 'avg_ai_score', metric_value: Math.round(avgAIScore), user_id: user.id },
      { metric_name: 'productivity_score', metric_value: Math.round((completedTasks / totalTasks) * 100), user_id: user.id }
    ];

    // Upsert analytics data
    const { error } = await supabase
      .from('analytics_data')
      .upsert(analyticsData, { 
        onConflict: 'user_id,metric_name,date',
        ignoreDuplicates: false 
      });

    if (error) throw error;

    return new Response(JSON.stringify({
      totalTasks,
      completedTasks,
      inProgressTasks,
      pendingTasks,
      overdueTasks,
      dueSoonTasks,
      highPriorityTasks,
      mediumPriorityTasks,
      lowPriorityTasks,
      assignedTasks,
      unassignedTasks,
      avgProgress: Math.round(avgProgress),
      avgAIScore: Math.round(avgAIScore),
      completionRate: Math.round((completedTasks / totalTasks) * 100) || 0,
      productivityTrend,
      categoryStats,
      insights: {
        productivity: avgProgress > 75 ? 'high' : avgProgress > 50 ? 'medium' : 'low',
        workload: overdueTasks > 5 ? 'overloaded' : dueSoonTasks > 3 ? 'busy' : 'manageable',
        prioritization: highPriorityTasks / totalTasks > 0.3 ? 'good' : 'needs_improvement'
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error calculating analytics:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
