
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Target,
  Lightbulb,
  Zap,
  BarChart3,
  Users,
  Calendar
} from "lucide-react";
import { useGenerateAIInsights, useAIInsights } from "@/hooks/useAIInsights";
import { useTasks } from "@/hooks/useTasks";
import { useProjects } from "@/hooks/useProjects";
import { useState } from "react";

interface AIInsightsPanelProps {
  taskStats: any;
  teamMembers: any[];
}

export const AIInsightsPanel = ({ taskStats, teamMembers }: AIInsightsPanelProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const generateInsights = useGenerateAIInsights();
  const { data: aiInsights, refetch } = useAIInsights();
  const { data: tasks } = useTasks();
  const { data: projects } = useProjects();

  const handleGenerateInsights = async () => {
    setIsGenerating(true);
    try {
      await generateInsights.mutateAsync();
      await refetch();
    } catch (error) {
      console.error('Error generating insights:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Enhanced AI insights with real-time data analysis based on ACTUAL completion rate
  const generateRealtimeInsights = () => {
    if (!tasks || !projects || !teamMembers) return [];
    
    const insights = [];
    
    // Task completion analysis based on REAL data
    const completedTasks = tasks.filter(task => task.status === 'completed').length;
    const totalTasks = tasks.length;
    const actualCompletionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    
    console.log('Actual completion rate calculation:', { completedTasks, totalTasks, actualCompletionRate });
    
    // Use the REAL completion rate, not the passed taskStats
    if (actualCompletionRate >= 90) {
      insights.push({
        type: "success",
        icon: TrendingUp,
        title: "Exceptional Productivity Achievement",
        description: `Outstanding ${actualCompletionRate.toFixed(1)}% completion rate! Your team is performing exceptionally well with ${completedTasks} out of ${totalTasks} tasks completed.`,
        actionable: "Consider taking on more challenging projects or mentoring other teams with your successful practices.",
        color: "text-emerald-400",
        bgColor: "bg-emerald-950/30",
        borderColor: "border-emerald-800/50"
      });
    } else if (actualCompletionRate >= 75) {
      insights.push({
        type: "success",
        icon: CheckCircle2,
        title: "Strong Performance Trend",
        description: `Good ${actualCompletionRate.toFixed(1)}% completion rate with ${completedTasks} completed tasks. You're on track for success.`,
        actionable: "Focus on maintaining this momentum and identifying areas for further optimization.",
        color: "text-emerald-400",
        bgColor: "bg-emerald-950/30",
        borderColor: "border-emerald-800/50"
      });
    } else if (actualCompletionRate >= 50) {
      insights.push({
        type: "warning",
        icon: Target,
        title: "Room for Improvement",
        description: `Current ${actualCompletionRate.toFixed(1)}% completion rate (${completedTasks}/${totalTasks}) indicates potential for optimization.`,
        actionable: "Review task priorities, break down complex tasks, or redistribute workload among team members.",
        color: "text-amber-400",
        bgColor: "bg-amber-950/30",
        borderColor: "border-amber-800/50"
      });
    } else {
      insights.push({
        type: "warning",
        icon: AlertTriangle,
        title: "Action Required",
        description: `Low ${actualCompletionRate.toFixed(1)}% completion rate needs immediate attention. Only ${completedTasks} out of ${totalTasks} tasks completed.`,
        actionable: "Urgent review needed: reassess task complexity, team capacity, or project scope.",
        color: "text-red-400",
        bgColor: "bg-red-950/30",
        borderColor: "border-red-800/50"
      });
    }

    // Overdue tasks analysis
    const overdueTasks = tasks.filter(task => {
      if (!task.due_date || task.status === 'completed') return false;
      return new Date(task.due_date) < new Date();
    });
    
    if (overdueTasks.length > 0) {
      insights.push({
        type: "warning",
        icon: Clock,
        title: "Overdue Tasks Alert",
        description: `${overdueTasks.length} tasks are past their due date and need immediate attention.`,
        actionable: "Prioritize overdue tasks and consider adjusting project timelines or resources.",
        color: "text-red-400",
        bgColor: "bg-red-950/30",
        borderColor: "border-red-800/50"
      });
    }

    // Team workload analysis
    const assignedTasks = tasks.filter(task => task.assigned_to && task.status !== 'completed');
    const unassignedTasks = tasks.filter(task => !task.assigned_to && task.status !== 'completed');
    
    if (unassignedTasks.length > 3) {
      insights.push({
        type: "info",
        icon: Users,
        title: "Task Assignment Needed",
        description: `${unassignedTasks.length} tasks are unassigned and may be delaying project progress.`,
        actionable: "Review unassigned tasks and distribute them among available team members.",
        color: "text-blue-400",
        bgColor: "bg-blue-950/30",
        borderColor: "border-blue-800/50"
      });
    }

    // Project health analysis
    const activeProjects = projects.filter(p => p.status === 'active');
    if (activeProjects.length > 0) {
      const projectStats = activeProjects.map(project => {
        const projectTasks = tasks.filter(t => t.project_id === project.id);
        const completedProjectTasks = projectTasks.filter(t => t.status === 'completed');
        const projectCompletionRate = projectTasks.length > 0 ? (completedProjectTasks.length / projectTasks.length) * 100 : 0;
        return { project, completionRate: projectCompletionRate, totalTasks: projectTasks.length };
      });

      const strugglingProjects = projectStats.filter(p => p.completionRate < 30 && p.totalTasks > 2);
      
      if (strugglingProjects.length > 0) {
        insights.push({
          type: "warning",
          icon: BarChart3,
          title: "Project Health Check",
          description: `${strugglingProjects.length} projects have low completion rates and may need review.`,
          actionable: "Analyze bottlenecks in struggling projects and consider reallocating resources.",
          color: "text-orange-400",
          bgColor: "bg-orange-950/30",
          borderColor: "border-orange-800/50"
        });
      }
    }

    return insights.slice(0, 4); // Limit to 4 insights
  };

  const insights = aiInsights && aiInsights.length > 0 
    ? aiInsights.map(insight => ({
        type: insight.type || "info",
        icon: insight.type === "success" ? TrendingUp : 
              insight.type === "warning" ? AlertTriangle :
              insight.type === "info" ? Target : Lightbulb,
        title: insight.title,
        description: insight.description,
        actionable: insight.actionable || "No specific action needed.",
        color: insight.type === "success" ? "text-emerald-400" :
               insight.type === "warning" ? "text-amber-400" :
               insight.type === "info" ? "text-blue-400" : "text-purple-400",
        bgColor: insight.type === "success" ? "bg-emerald-950/30" :
                 insight.type === "warning" ? "bg-amber-950/30" :
                 insight.type === "info" ? "bg-blue-950/30" : "bg-purple-950/30",
        borderColor: insight.type === "success" ? "border-emerald-800/50" :
                     insight.type === "warning" ? "border-amber-800/50" :
                     insight.type === "info" ? "border-blue-800/50" : "border-purple-800/50"
      }))
    : generateRealtimeInsights();

  return (
    <Card className="bg-slate-900/95 backdrop-blur-sm border-slate-700/50 shadow-2xl">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center space-x-2">
          <Brain className="h-5 w-5 text-purple-400" />
          <span className="text-slate-100">AI-Powered Insights</span>
          <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
            <Zap className="h-3 w-3 mr-1" />
            Live Analysis
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {insights.length > 0 ? (
          insights.map((insight, index) => (
            <div 
              key={index}
              className={`p-4 rounded-lg border backdrop-blur-sm transition-all hover:shadow-lg hover:scale-[1.02] ${insight.bgColor} ${insight.borderColor}`}
            >
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg bg-slate-800/50 ${insight.color}`}>
                  <insight.icon className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-sm text-slate-100">{insight.title}</h4>
                    <Badge variant="outline" className="text-xs border-slate-600 text-slate-300">
                      AI Generated
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-300 mb-2">
                    {insight.description}
                  </p>
                  <p className="text-xs font-medium text-slate-200">
                    💡 {insight.actionable}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-4 text-slate-400">
            <Brain className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No insights available</p>
            <p className="text-xs">Create some tasks to get AI insights</p>
          </div>
        )}
        
        <div className="space-y-2">
          <Button 
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0" 
            size="sm"
            onClick={handleGenerateInsights}
            disabled={isGenerating}
          >
            <Brain className="h-4 w-4 mr-2" />
            {isGenerating ? "Generating Advanced Insights..." : "Generate Advanced Insights"}
          </Button>
          
          {tasks && teamMembers && (
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 bg-slate-800/30 border border-slate-700/50 rounded text-center">
                <BarChart3 className="h-3 w-3 mx-auto mb-1 text-slate-400" />
                <span className="text-slate-300">Analyzed {tasks.length || 0} tasks</span>
              </div>
              <div className="p-2 bg-slate-800/30 border border-slate-700/50 rounded text-center">
                <Users className="h-3 w-3 mx-auto mb-1 text-slate-400" />
                <span className="text-slate-300">{teamMembers.length} team members</span>
              </div>
            </div>
          )}
        </div>
        
        <div className="text-center pt-2 border-t border-slate-700/50">
          <Badge variant="outline" className="text-xs border-slate-600 text-slate-300">
            AI insights updated in real-time • Based on actual data
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};
