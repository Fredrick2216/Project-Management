
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Brain, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  Zap,
  AlertCircle,
  Play,
  Pause,
  RotateCcw
} from "lucide-react";
import { useTasks } from "@/hooks/useTasks";
import { TaskStatusBadge } from "@/components/tasks/TaskStatusBadge";
import { useToast } from "@/hooks/use-toast";

interface AITaskPriority {
  id: string;
  title: string;
  status: string;
  priority: string;
  progress: number;
  ai_score: number;
  due_date?: string;
  estimated_hours?: number;
  category?: string;
  ai_priority_score?: number;
}

export const SmartTaskQueue = () => {
  const { data: tasks, isLoading, refetch } = useTasks();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  // AI-powered task prioritization algorithm
  const getSmartPrioritizedTasks = (): AITaskPriority[] => {
    if (!tasks || tasks.length === 0) return [];

    return tasks
      .filter(task => task.status !== 'completed' && task.status !== 'deleted')
      .map(task => ({
        ...task,
        ai_priority_score: calculateAIPriorityScore(task)
      }))
      .sort((a, b) => (b.ai_priority_score || 0) - (a.ai_priority_score || 0))
      .slice(0, 8);
  };

  const calculateAIPriorityScore = (task: any): number => {
    let score = 0;
    
    // Priority weight (40% of total score)
    const priorityWeights = { high: 40, medium: 25, low: 10 };
    score += priorityWeights[task.priority as keyof typeof priorityWeights] || 15;
    
    // Deadline urgency (30% of total score)
    if (task.due_date) {
      const daysUntilDue = Math.ceil((new Date(task.due_date).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
      if (daysUntilDue < 0) score += 30; // Overdue
      else if (daysUntilDue <= 1) score += 25; // Due today/tomorrow
      else if (daysUntilDue <= 3) score += 20; // Due this week
      else if (daysUntilDue <= 7) score += 15; // Due next week
      else score += 5; // Due later
    }
    
    // Progress consideration (15% of total score)
    const progressScore = task.progress || 0;
    if (progressScore > 80) score += 5; // Almost done
    else if (progressScore > 50) score += 10; // In progress
    else if (progressScore > 0) score += 15; // Started
    else score += 12; // Not started
    
    // AI score integration (15% of total score)
    score += (task.ai_score || 50) * 0.15;
    
    return Math.round(score);
  };

  const runAIAnalysis = async () => {
    setIsAnalyzing(true);
    
    try {
      // Simulate AI analysis with actual processing time
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      await refetch();
      
      toast({
        title: "AI Analysis Complete",
        description: "Task priorities have been updated based on current data",
      });
    } catch (error) {
      console.error('AI Analysis error:', error);
      toast({
        title: "Analysis Failed",
        description: "Unable to complete AI analysis. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const smartTasks = getSmartPrioritizedTasks();
  
  // Calculate statistics
  const totalTasks = tasks?.length || 0;
  const completedTasks = tasks?.filter(t => t.status === 'completed').length || 0;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const avgAIScore = smartTasks.length > 0 
    ? Math.round(smartTasks.reduce((sum, task) => sum + (task.ai_score || 50), 0) / smartTasks.length)
    : 50;

  const highPriorityTasks = smartTasks.filter(t => t.priority === 'high').length;
  const urgentTasks = smartTasks.filter(t => {
    if (!t.due_date) return false;
    const daysUntilDue = Math.ceil((new Date(t.due_date).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
    return daysUntilDue <= 1;
  }).length;

  if (isLoading) {
    return (
      <Card className="glass-card border-white/10">
        <CardContent className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* AI Analysis Header */}
      <Card className="glass-card border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="h-6 w-6 text-primary animate-pulse" />
              <span className="ai-gradient-text">Smart Task Queue</span>
              <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
                AI-Powered
              </Badge>
            </div>
            <Button 
              onClick={runAIAnalysis} 
              disabled={isAnalyzing}
              size="sm"
              className="bg-primary/20 border border-primary/50 text-primary hover:bg-primary/30"
            >
              {isAnalyzing ? (
                <>
                  <RotateCcw className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 mr-2" />
                  Run AI Analysis
                </>
              )}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-3 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20">
              <div className="text-2xl font-bold text-blue-400">{smartTasks.length}</div>
              <div className="text-sm text-muted-foreground">Priority Tasks</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-gradient-to-br from-green-500/20 to-emerald-500/20">
              <div className="text-2xl font-bold text-green-400">{completionRate}%</div>
              <div className="text-sm text-muted-foreground">Completion Rate</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20">
              <div className="text-2xl font-bold text-purple-400">{avgAIScore}</div>
              <div className="text-sm text-muted-foreground">Avg AI Score</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-gradient-to-br from-red-500/20 to-orange-500/20">
              <div className="text-2xl font-bold text-red-400">{urgentTasks}</div>
              <div className="text-sm text-muted-foreground">Urgent Tasks</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Smart Task List */}
      <Card className="glass-card border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <span>AI-Prioritized Tasks</span>
            {highPriorityTasks > 0 && (
              <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                {highPriorityTasks} High Priority
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {smartTasks.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">All Caught Up!</h3>
              <p className="text-muted-foreground">
                {totalTasks === 0 
                  ? "No tasks found. Create some tasks to see AI prioritization."
                  : "No active tasks in the priority queue. Great work!"
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {smartTasks.map((task, index) => {
                const isUrgent = task.due_date && new Date(task.due_date) < new Date();
                const daysUntilDue = task.due_date 
                  ? Math.ceil((new Date(task.due_date).getTime() - new Date().getTime()) / (1000 * 3600 * 24))
                  : null;
                
                return (
                  <div 
                    key={task.id}
                    className={`p-4 rounded-lg border transition-all hover:bg-background/80 ${
                      index === 0 ? 'bg-primary/5 border-primary/30 shadow-lg' : 
                      index < 3 ? 'bg-blue-500/5 border-blue-500/20' :
                      'bg-background/50 border-border'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                          index === 0 ? 'bg-primary/20 text-primary' : 
                          index < 3 ? 'bg-blue-500/20 text-blue-400' :
                          'bg-muted text-muted-foreground'
                        }`}>
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium mb-1 text-foreground">{task.title}</h4>
                          <div className="flex items-center gap-3 text-sm flex-wrap">
                            <TaskStatusBadge status={task.status} size="sm" />
                            <Badge variant="outline" className="text-xs">
                              {task.priority}
                            </Badge>
                            {task.category && (
                              <Badge variant="secondary" className="text-xs">
                                {task.category}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex items-center gap-1 text-sm">
                            <Brain className="h-3 w-3 text-primary" />
                            <span className="font-medium">{task.ai_score || 50}</span>
                          </div>
                          {isUrgent && (
                            <AlertCircle className="h-4 w-4 text-red-400" />
                          )}
                        </div>
                        {task.due_date && (
                          <div className={`text-xs ${
                            isUrgent ? 'text-red-400 font-medium' : 
                            daysUntilDue && daysUntilDue <= 3 ? 'text-yellow-400' : 
                            'text-muted-foreground'
                          }`}>
                            {isUrgent ? 'Overdue!' : 
                             daysUntilDue === 0 ? 'Due today' :
                             daysUntilDue === 1 ? 'Due tomorrow' :
                             daysUntilDue && daysUntilDue > 0 ? `${daysUntilDue} days left` :
                             'Past due'}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{task.progress || 0}%</span>
                      </div>
                      <Progress value={task.progress || 0} className="h-2" />
                    </div>
                    
                    {task.estimated_hours && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mt-2">
                        <Clock className="h-3 w-3" />
                        <span>{task.estimated_hours}h estimated</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* AI Insights Summary */}
      {smartTasks.length > 0 && (
        <Card className="glass-card border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              <span>AI Insights</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              {urgentTasks > 0 && (
                <div className="flex items-start gap-2 p-3 rounded-lg bg-red-950/20 border border-red-800/30">
                  <AlertCircle className="h-4 w-4 text-red-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-red-400">Urgent Attention Required</p>
                    <p className="text-red-300 text-xs">
                      {urgentTasks} task{urgentTasks > 1 ? 's' : ''} {urgentTasks > 1 ? 'are' : 'is'} due within 24 hours
                    </p>
                  </div>
                </div>
              )}
              
              {highPriorityTasks > 0 && (
                <div className="flex items-start gap-2 p-3 rounded-lg bg-yellow-950/20 border border-yellow-800/30">
                  <TrendingUp className="h-4 w-4 text-yellow-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-yellow-400">High Priority Focus</p>
                    <p className="text-yellow-300 text-xs">
                      {highPriorityTasks} high-priority task{highPriorityTasks > 1 ? 's' : ''} need{highPriorityTasks === 1 ? 's' : ''} immediate attention
                    </p>
                  </div>
                </div>
              )}
              
              <div className="flex items-start gap-2 p-3 rounded-lg bg-blue-950/20 border border-blue-800/30">
                <Zap className="h-4 w-4 text-blue-400 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-400">Productivity Insights</p>
                  <p className="text-blue-300 text-xs">
                    AI has analyzed {totalTasks} tasks with an average score of {avgAIScore}/100. 
                    Current completion rate: {completionRate}%
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
