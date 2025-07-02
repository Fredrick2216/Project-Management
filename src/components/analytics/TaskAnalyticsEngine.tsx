
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  AlertTriangle, 
  Target, 
  Clock, 
  Brain,
  BarChart3,
  Zap,
  Calendar,
  Users,
  CheckCircle2
} from "lucide-react";
import { useTasks } from "@/hooks/useTasks";
import { useProjects } from "@/hooks/useProjects";
import { useTeamMembers } from "@/hooks/useTeam";
import { useToast } from "@/hooks/use-toast";

interface TaskAnalytics {
  burndownRate: number;
  velocityTrend: 'up' | 'down' | 'stable';
  bottlenecks: string[];
  riskFactors: string[];
  optimizations: string[];
  teamPerformance: { member: string; score: number; tasks: number }[];
}

export const TaskAnalyticsEngine = () => {
  const [analytics, setAnalytics] = useState<TaskAnalytics | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { data: tasks } = useTasks();
  const { data: projects } = useProjects();
  const { data: teamMembers } = useTeamMembers();
  const { toast } = useToast();

  const runAnalysis = async () => {
    if (!tasks || !projects || !teamMembers) return;

    setIsAnalyzing(true);
    
    // Simulate advanced analytics processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    try {
      // Calculate burndown rate
      const completedTasks = tasks.filter(t => t.status === 'completed');
      const totalTasks = tasks.length;
      const burndownRate = totalTasks > 0 ? (completedTasks.length / totalTasks) * 100 : 0;

      // Analyze velocity trend
      const recentTasks = tasks.filter(t => {
        const updatedDate = new Date(t.updated_at || t.created_at);
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        return updatedDate > sevenDaysAgo;
      });
      
      const completedRecent = recentTasks.filter(t => t.status === 'completed').length;
      const velocityTrend = completedRecent > 5 ? 'up' : completedRecent < 2 ? 'down' : 'stable';

      // Identify bottlenecks
      const bottlenecks = [];
      const overdueTasks = tasks.filter(t => {
        if (!t.due_date || t.status === 'completed') return false;
        return new Date(t.due_date) < new Date();
      });
      
      if (overdueTasks.length > 3) {
        bottlenecks.push(`${overdueTasks.length} overdue tasks creating workflow delays`);
      }

      const unassignedTasks = tasks.filter(t => !t.assigned_to && t.status !== 'completed');
      if (unassignedTasks.length > 2) {
        bottlenecks.push(`${unassignedTasks.length} unassigned tasks blocking progress`);
      }

      // Risk factors
      const riskFactors = [];
      const highPriorityPending = tasks.filter(t => 
        (t.priority === 'high' || t.priority === 'urgent') && 
        t.status !== 'completed'
      );
      
      if (highPriorityPending.length > 0) {
        riskFactors.push(`${highPriorityPending.length} high-priority tasks at risk`);
      }

      // Optimizations
      const optimizations = [];
      if (burndownRate < 50) {
        optimizations.push('Consider breaking down large tasks into smaller chunks');
      }
      if (unassignedTasks.length > 0) {
        optimizations.push('Assign tasks to available team members for better accountability');
      }
      if (overdueTasks.length > 0) {
        optimizations.push('Review and adjust project timelines based on current capacity');
      }

      // Team performance analysis
      const teamPerformance = teamMembers.map(member => {
        const memberTasks = tasks.filter(t => t.assigned_to === member.name);
        const completedMemberTasks = memberTasks.filter(t => t.status === 'completed');
        const score = memberTasks.length > 0 ? 
          Math.round((completedMemberTasks.length / memberTasks.length) * 100) : 0;
        
        return {
          member: member.name,
          score,
          tasks: memberTasks.length
        };
      }).sort((a, b) => b.score - a.score);

      setAnalytics({
        burndownRate,
        velocityTrend,
        bottlenecks,
        riskFactors,
        optimizations,
        teamPerformance
      });

      toast({
        title: "Analytics Complete",
        description: "Advanced task analysis has been generated",
      });
    } catch (error) {
      toast({
        title: "Analysis Error",
        description: "Failed to generate analytics",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    if (tasks && projects && teamMembers) {
      runAnalysis();
    }
  }, [tasks, projects, teamMembers]);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down': return <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />;
      default: return <Target className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-green-600 bg-green-50 border-green-200';
      case 'down': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    }
  };

  if (isAnalyzing) {
    return (
      <Card className="bg-slate-900/95 backdrop-blur-sm border-slate-700/50">
        <CardContent className="p-6">
          <div className="flex items-center justify-center space-x-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="text-slate-300">Running advanced analytics...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!analytics) {
    return (
      <Card className="bg-slate-900/95 backdrop-blur-sm border-slate-700/50">
        <CardContent className="p-6 text-center">
          <Brain className="h-12 w-12 mx-auto mb-4 text-slate-400" />
          <p className="text-slate-300">No analytics data available</p>
          <Button onClick={runAnalysis} className="mt-4">
            <BarChart3 className="h-4 w-4 mr-2" />
            Generate Analytics
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Burndown & Velocity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-slate-900/95 backdrop-blur-sm border-slate-700/50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-slate-100">
              <Target className="h-5 w-5 text-primary" />
              <span>Burndown Rate</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-slate-100">
                  {analytics.burndownRate.toFixed(1)}%
                </span>
                <Badge className={analytics.burndownRate > 70 ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}>
                  {analytics.burndownRate > 70 ? 'On Track' : 'Needs Attention'}
                </Badge>
              </div>
              <Progress value={analytics.burndownRate} className="h-2" />
              <p className="text-xs text-slate-400">
                Task completion rate across all projects
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/95 backdrop-blur-sm border-slate-700/50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-slate-100">
              <Zap className="h-5 w-5 text-primary" />
              <span>Velocity Trend</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-3">
              {getTrendIcon(analytics.velocityTrend)}
              <div>
                <p className="font-medium text-slate-100 capitalize">
                  {analytics.velocityTrend} Velocity
                </p>
                <Badge className={getTrendColor(analytics.velocityTrend)}>
                  {analytics.velocityTrend === 'up' ? 'Accelerating' : 
                   analytics.velocityTrend === 'down' ? 'Slowing' : 'Stable'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Team Performance */}
      <Card className="bg-slate-900/95 backdrop-blur-sm border-slate-700/50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-slate-100">
            <Users className="h-5 w-5 text-primary" />
            <span>Team Performance</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analytics.teamPerformance.map((member, index) => (
              <div key={member.member} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-xs font-medium text-primary">
                      #{index + 1}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-slate-100">{member.member}</p>
                    <p className="text-xs text-slate-400">{member.tasks} tasks assigned</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Progress value={member.score} className="w-20 h-2" />
                  <span className="text-sm font-medium text-slate-100 w-12">
                    {member.score}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Issues & Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Bottlenecks */}
        <Card className="bg-slate-900/95 backdrop-blur-sm border-slate-700/50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-slate-100">
              <AlertTriangle className="h-5 w-5 text-red-400" />
              <span>Bottlenecks</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {analytics.bottlenecks.length > 0 ? (
                analytics.bottlenecks.map((bottleneck, index) => (
                  <div key={index} className="p-2 rounded bg-red-950/30 border border-red-800/50">
                    <p className="text-xs text-red-300">{bottleneck}</p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400">No bottlenecks detected</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Risk Factors */}
        <Card className="bg-slate-900/95 backdrop-blur-sm border-slate-700/50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-slate-100">
              <Clock className="h-5 w-5 text-yellow-400" />
              <span>Risk Factors</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {analytics.riskFactors.length > 0 ? (
                analytics.riskFactors.map((risk, index) => (
                  <div key={index} className="p-2 rounded bg-yellow-950/30 border border-yellow-800/50">
                    <p className="text-xs text-yellow-300">{risk}</p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400">No risks identified</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Optimizations */}
        <Card className="bg-slate-900/95 backdrop-blur-sm border-slate-700/50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-slate-100">
              <CheckCircle2 className="h-5 w-5 text-green-400" />
              <span>Optimizations</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {analytics.optimizations.length > 0 ? (
                analytics.optimizations.map((optimization, index) => (
                  <div key={index} className="p-2 rounded bg-green-950/30 border border-green-800/50">
                    <p className="text-xs text-green-300">{optimization}</p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400">System optimized</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center">
        <Button onClick={runAnalysis} disabled={isAnalyzing} className="bg-primary/20 border border-primary/50 text-primary hover:bg-primary/30">
          <BarChart3 className="h-4 w-4 mr-2" />
          Refresh Analytics
        </Button>
      </div>
    </div>
  );
};
