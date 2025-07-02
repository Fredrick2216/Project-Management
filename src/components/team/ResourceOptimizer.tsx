
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Users, 
  TrendingUp, 
  AlertTriangle, 
  Target,
  Brain,
  Zap,
  CheckCircle2,
  BarChart3,
  RefreshCw
} from "lucide-react";
import { useTeamMembers } from "@/hooks/useTeam";
import { useTasks } from "@/hooks/useTasks";
import { useToast } from "@/hooks/use-toast";

interface ResourceAnalysis {
  member: string;
  workload: number;
  efficiency: number;
  capacity: number;
  utilization: number;
  skills: string[];
  recommendations: string[];
  assignedTasks: number;
  completedTasks: number;
  overdueTasks: number;
}

interface OptimizationSuggestion {
  type: 'rebalance' | 'reassign' | 'upskill' | 'hire';
  priority: 'high' | 'medium' | 'low';
  description: string;
  impact: string;
  affected: string[];
}

export const ResourceOptimizer = () => {
  const [analysis, setAnalysis] = useState<ResourceAnalysis[]>([]);
  const [suggestions, setSuggestions] = useState<OptimizationSuggestion[]>([]);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const { data: teamMembers, isLoading: teamLoading, error: teamError } = useTeamMembers();
  const { data: tasks, isLoading: tasksLoading, error: tasksError } = useTasks();
  const { toast } = useToast();

  const runOptimization = async () => {
    if (!teamMembers || !tasks) {
      toast({
        title: "No Data Available",
        description: "Please ensure team members and tasks are loaded before running optimization.",
        variant: "destructive"
      });
      return;
    }

    setIsOptimizing(true);
    
    try {
      // Simulate AI processing
      await new Promise(resolve => setTimeout(resolve, 2500));

      const resourceAnalysis: ResourceAnalysis[] = teamMembers.map(member => {
        const memberTasks = tasks.filter(t => t.assigned_to === member.name);
        const completedTasks = memberTasks.filter(t => t.status === 'completed');
        const overdueTasks = memberTasks.filter(t => {
          if (!t.due_date || t.status === 'completed') return false;
          return new Date(t.due_date) < new Date();
        });

        // Calculate metrics
        const assignedTasks = memberTasks.length;
        const completionRate = assignedTasks > 0 ? (completedTasks.length / assignedTasks) * 100 : 0;
        const workload = Math.min(assignedTasks * 10, 100); // Simulate workload
        const efficiency = completionRate;
        const capacity = 100;
        const utilization = Math.min((assignedTasks / 10) * 100, 100); // Assuming 10 tasks is full capacity

        // Generate skills based on task types and member role
        const baseSkills = ['Communication', 'Problem Solving', 'Time Management'];
        const roleSpecificSkills = member.role === 'manager' ? ['Leadership', 'Planning'] :
                                 member.role === 'developer' ? ['Programming', 'Testing'] :
                                 ['Analysis', 'Documentation'];
        const skills = [...baseSkills.slice(0, 1), ...roleSpecificSkills].slice(0, 3);

        // Generate recommendations
        const recommendations = [];
        if (workload > 80) {
          recommendations.push('Consider redistributing some tasks to balance workload');
        }
        if (efficiency < 60 && assignedTasks > 0) {
          recommendations.push('May benefit from additional training or support');
        }
        if (overdueTasks.length > 0) {
          recommendations.push('Prioritize overdue tasks and review capacity');
        }
        if (utilization < 50 && assignedTasks < 3) {
          recommendations.push('Has capacity to take on additional responsibilities');
        }
        if (recommendations.length === 0) {
          recommendations.push('Performance is well-balanced, continue current approach');
        }

        return {
          member: member.name,
          workload,
          efficiency,
          capacity,
          utilization,
          skills,
          recommendations,
          assignedTasks: assignedTasks,
          completedTasks: completedTasks.length,
          overdueTasks: overdueTasks.length
        };
      });

      // Generate optimization suggestions
      const optimizationSuggestions: OptimizationSuggestion[] = [];

      // Find overloaded and underutilized members
      const overloaded = resourceAnalysis.filter(r => r.workload > 80);
      const underutilized = resourceAnalysis.filter(r => r.utilization < 40 && r.assignedTasks < 3);

      if (overloaded.length > 0 && underutilized.length > 0) {
        optimizationSuggestions.push({
          type: 'rebalance',
          priority: 'high',
          description: 'Redistribute tasks between overloaded and underutilized team members',
          impact: 'Improve overall team productivity by 15-25%',
          affected: [...overloaded.map(r => r.member), ...underutilized.map(r => r.member)]
        });
      }

      // Check for low efficiency members
      const lowEfficiency = resourceAnalysis.filter(r => r.efficiency < 60 && r.assignedTasks > 0);
      if (lowEfficiency.length > 0) {
        optimizationSuggestions.push({
          type: 'upskill',
          priority: 'medium',
          description: 'Provide additional training for team members with lower efficiency rates',
          impact: 'Boost team efficiency by 10-20%',
          affected: lowEfficiency.map(r => r.member)
        });
      }

      // Check if team is at capacity
      const avgUtilization = resourceAnalysis.reduce((sum, r) => sum + r.utilization, 0) / resourceAnalysis.length;
      if (avgUtilization > 85) {
        optimizationSuggestions.push({
          type: 'hire',
          priority: 'high',
          description: 'Team is at high capacity - consider expanding the team',
          impact: 'Reduce burnout risk and improve delivery times',
          affected: ['Entire Team']
        });
      }

      // Task reassignment suggestions
      const overdueTasks = tasks.filter(t => {
        if (!t.due_date || t.status === 'completed') return false;
        return new Date(t.due_date) < new Date();
      });

      if (overdueTasks.length > 2) {
        optimizationSuggestions.push({
          type: 'reassign',
          priority: 'high',
          description: 'Reassign overdue tasks to available team members',
          impact: 'Reduce project delays and improve delivery timelines',
          affected: ['Task Assignments']
        });
      }

      setAnalysis(resourceAnalysis);
      setSuggestions(optimizationSuggestions);

      toast({
        title: "Optimization Complete",
        description: "Resource analysis and recommendations have been generated successfully.",
      });
    } catch (error) {
      console.error('Optimization error:', error);
      toast({
        title: "Optimization Error",
        description: "Failed to generate resource optimization. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsOptimizing(false);
    }
  };

  useEffect(() => {
    if (teamMembers && tasks && teamMembers.length > 0) {
      runOptimization();
    }
  }, [teamMembers, tasks]);

  const getUtilizationColor = (utilization: number) => {
    if (utilization > 90) return 'text-red-400';
    if (utilization > 70) return 'text-yellow-400';
    if (utilization > 40) return 'text-green-400';
    return 'text-blue-400';
  };

  const getSuggestionIcon = (type: OptimizationSuggestion['type']) => {
    switch (type) {
      case 'rebalance': return <BarChart3 className="h-4 w-4" />;
      case 'reassign': return <Users className="h-4 w-4" />;
      case 'upskill': return <Target className="h-4 w-4" />;
      case 'hire': return <TrendingUp className="h-4 w-4" />;
    }
  };

  const getSuggestionColor = (priority: OptimizationSuggestion['priority']) => {
    switch (priority) {
      case 'high': return 'border-red-500 bg-red-950/30';
      case 'medium': return 'border-yellow-500 bg-yellow-950/30';
      case 'low': return 'border-green-500 bg-green-950/30';
    }
  };

  // Handle loading states
  if (teamLoading || tasksLoading) {
    return (
      <Card className="bg-slate-900/95 backdrop-blur-sm border-slate-700/50">
        <CardContent className="p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-slate-300">Loading optimization data...</p>
        </CardContent>
      </Card>
    );
  }

  // Handle error states
  if (teamError || tasksError) {
    return (
      <Card className="bg-slate-900/95 backdrop-blur-sm border-slate-700/50">
        <CardContent className="p-6 text-center">
          <AlertTriangle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-100 mb-2">Error Loading Data</h3>
          <p className="text-slate-400 mb-4">Failed to load optimization data. Please try again.</p>
          <Button onClick={runOptimization} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (isOptimizing) {
    return (
      <Card className="bg-slate-900/95 backdrop-blur-sm border-slate-700/50">
        <CardContent className="p-6">
          <div className="flex items-center justify-center space-x-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="text-slate-300">AI is optimizing resource allocation...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-slate-900/95 backdrop-blur-sm border-slate-700/50">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Brain className="h-5 w-5 text-primary" />
              <span className="text-slate-100">AI Resource Optimizer</span>
              <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                <Zap className="h-3 w-3 mr-1" />
                Smart Analysis
              </Badge>
            </div>
            <Button onClick={runOptimization} disabled={isOptimizing} size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Re-optimize
            </Button>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Resource Analysis */}
      <Card className="bg-slate-900/95 backdrop-blur-sm border-slate-700/50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-slate-100">
            <Users className="h-5 w-5 text-primary" />
            <span>Team Resource Analysis</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analysis.length > 0 ? analysis.map((member) => (
              <div key={member.member} className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                        {member.member.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-medium text-slate-100">{member.member}</h4>
                      <div className="flex items-center space-x-2 mt-1">
                        {member.skills.map(skill => (
                          <Badge key={skill} variant="outline" className="text-xs text-slate-300 border-slate-600">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-bold ${getUtilizationColor(member.utilization)}`}>
                      {member.utilization.toFixed(0)}%
                    </p>
                    <p className="text-xs text-slate-400">Utilization</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="text-center">
                    <p className="text-lg font-bold text-slate-100">{member.assignedTasks}</p>
                    <p className="text-xs text-slate-400">Assigned</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-green-400">{member.completedTasks}</p>
                    <p className="text-xs text-slate-400">Completed</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-red-400">{member.overdueTasks}</p>
                    <p className="text-xs text-slate-400">Overdue</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-slate-100">{member.efficiency.toFixed(0)}%</p>
                    <p className="text-xs text-slate-400">Efficiency</p>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-300">Workload</span>
                    <span className="text-slate-300">{member.workload.toFixed(0)}%</span>
                  </div>
                  <Progress value={member.workload} className="h-2" />
                </div>

                {member.recommendations.length > 0 && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-slate-200">Recommendations:</p>
                    {member.recommendations.map((rec, index) => (
                      <p key={index} className="text-xs text-slate-400">• {rec}</p>
                    ))}
                  </div>
                )}
              </div>
            )) : (
              <div className="text-center py-8 text-slate-400">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No team data available</p>
                <p className="text-xs mt-2">Add team members to see resource analysis</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Optimization Suggestions */}
      <Card className="bg-slate-900/95 backdrop-blur-sm border-slate-700/50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-slate-100">
            <Target className="h-5 w-5 text-primary" />
            <span>AI Optimization Suggestions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {suggestions.length > 0 ? suggestions.map((suggestion, index) => (
              <div key={index} className={`p-4 rounded-lg border ${getSuggestionColor(suggestion.priority)}`}>
                <div className="flex items-start space-x-3">
                  <div className="p-2 rounded-lg bg-slate-800/50">
                    {getSuggestionIcon(suggestion.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-slate-100 capitalize">
                        {suggestion.type} Recommendation
                      </h4>
                      <Badge 
                        variant="outline"
                        className={`text-xs ${
                          suggestion.priority === 'high' ? 'text-red-400 border-red-600' :
                          suggestion.priority === 'medium' ? 'text-yellow-400 border-yellow-600' :
                          'text-green-400 border-green-600'
                        }`}
                      >
                        {suggestion.priority} priority
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-300 mb-2">{suggestion.description}</p>
                    <p className="text-xs text-slate-400 mb-2">
                      <strong>Expected Impact:</strong> {suggestion.impact}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {suggestion.affected.map(item => (
                        <Badge key={item} variant="outline" className="text-xs text-slate-300 border-slate-600">
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )) : (
              <div className="text-center py-8 text-slate-400">
                <CheckCircle2 className="h-12 w-12 mx-auto mb-4 text-green-400" />
                <p className="text-green-400">Team resources are optimally allocated</p>
                <p className="text-xs mt-2">No optimization suggestions at this time</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
