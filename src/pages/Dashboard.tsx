
import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  TrendingUp,
  BarChart3,
  Users,
  Target,
  Zap,
  Calendar,
  Plus,
  RefreshCw
} from "lucide-react";
import { SmartTaskQueue } from "@/components/dashboard/SmartTaskQueue";
import { AIInsightsPanel } from "@/components/dashboard/AIInsightsPanel";
import { QuickActionsPanel } from "@/components/dashboard/QuickActionsPanel";
import { TaskCreateForm } from "@/components/dashboard/TaskCreateForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useTasks } from "@/hooks/useTasks";
import { useProjects } from "@/hooks/useProjects";
import { useTeamMembers } from "@/hooks/useTeam";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const { data: tasks, isLoading: tasksLoading, refetch: refetchTasks } = useTasks();
  const { data: projects, isLoading: projectsLoading, refetch: refetchProjects } = useProjects();
  const { data: teamMembers, isLoading: teamLoading, refetch: refetchTeam } = useTeamMembers();
  const { toast } = useToast();

  const isLoading = tasksLoading || projectsLoading || teamLoading;

  // Calculate task statistics with error handling
  const getTaskStats = () => {
    if (!tasks || tasks.length === 0) {
      return {
        total: 0,
        completed: 0,
        inProgress: 0,
        pending: 0,
        overdue: 0,
        completionRate: 0,
        pendingRate: 0,
        overdueRate: 0
      };
    }

    const total = tasks.length;
    const completed = tasks.filter(task => task.status === 'completed').length;
    const inProgress = tasks.filter(task => task.status === 'in_progress').length;
    const pending = tasks.filter(task => task.status === 'pending').length;
    
    const overdue = tasks.filter(task => {
      if (!task.due_date || task.status === 'completed') return false;
      return new Date(task.due_date) < new Date();
    }).length;

    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    const pendingRate = total > 0 ? Math.round((pending / total) * 100) : 0;
    const overdueRate = total > 0 ? Math.round((overdue / total) * 100) : 0;

    return {
      total,
      completed,
      inProgress,
      pending,
      overdue,
      completionRate,
      pendingRate,
      overdueRate
    };
  };

  const taskStats = getTaskStats();

  // Get recent activity
  const getRecentActivity = () => {
    if (!tasks) return [];
    
    return tasks
      .filter(task => task.updated_at)
      .sort((a, b) => new Date(b.updated_at!).getTime() - new Date(a.updated_at!).getTime())
      .slice(0, 5)
      .map(task => ({
        id: task.id,
        title: task.title,
        status: task.status,
        updatedAt: task.updated_at,
        priority: task.priority
      }));
  };

  const recentActivity = getRecentActivity();

  // Refresh all data
  const handleRefreshData = async () => {
    try {
      await Promise.all([
        refetchTasks(),
        refetchProjects(),
        refetchTeam()
      ]);
      setRefreshKey(prev => prev + 1);
      toast({
        title: "Data refreshed",
        description: "Dashboard data has been updated successfully.",
      });
    } catch (error) {
      console.error('Refresh error:', error);
      toast({
        title: "Refresh failed",
        description: "Failed to refresh dashboard data.",
        variant: "destructive",
      });
    }
  };

  // Auto-refresh data every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      handleRefreshData();
    }, 300000); // 5 minutes

    return () => clearInterval(interval);
  }, []);

  const handleTaskCreated = () => {
    setShowTaskForm(false);
    refetchTasks();
    toast({
      title: "Task created",
      description: "New task has been created successfully.",
    });
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold ai-gradient-text">
              AI Dashboard
            </h1>
            <p className="text-slate-400">
              Welcome back! Here's what's happening with your projects.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefreshData}
              className="border-slate-600 text-slate-300 hover:bg-slate-800"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Dialog open={showTaskForm} onOpenChange={setShowTaskForm}>
              <DialogTrigger asChild>
                <Button className="ai-gradient text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  New Task
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl dark-glass-card">
                <DialogHeader>
                  <DialogTitle className="text-slate-100">Create New Task</DialogTitle>
                </DialogHeader>
                <TaskCreateForm />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Alert for overdue tasks */}
        {taskStats.overdue > 0 && (
          <Card className="border-red-500/50 bg-red-950/20">
            <CardContent className="flex items-center gap-3 py-4">
              <AlertTriangle className="h-5 w-5 text-red-400" />
              <div>
                <p className="font-medium text-red-400">
                  {taskStats.overdue} overdue task{taskStats.overdue > 1 ? 's' : ''} need{taskStats.overdue === 1 ? 's' : ''} attention
                </p>
                <p className="text-sm text-red-300">
                  Review and update these tasks to keep your projects on track.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-950/50 to-cyan-950/50 border-blue-800/50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle2 className="h-5 w-5 text-blue-400" />
                <span className="text-slate-100">Task Completion</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-blue-400">{taskStats.completionRate}%</span>
                  <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                    {taskStats.completed}/{taskStats.total}
                  </Badge>
                </div>
                <div className="w-full h-2 bg-slate-700 rounded-full">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all"
                    style={{ width: `${taskStats.completionRate}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-950/50 to-emerald-950/50 border-green-800/50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-green-400" />
                <span className="text-slate-100">Active Tasks</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-green-400">{taskStats.inProgress}</span>
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                    In Progress
                  </Badge>
                </div>
                <p className="text-sm text-slate-400">
                  Tasks currently being worked on
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-950/50 to-orange-950/50 border-yellow-800/50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-yellow-400" />
                <span className="text-slate-100">Pending Tasks</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-yellow-400">{taskStats.pending}</span>
                  <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                    {taskStats.pendingRate}%
                  </Badge>
                </div>
                <p className="text-sm text-slate-400">
                  Tasks waiting to be started
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-950/50 to-pink-950/50 border-purple-800/50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-purple-400" />
                <span className="text-slate-100">Projects</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-purple-400">{projects?.length || 0}</span>
                  <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                    Active
                  </Badge>
                </div>
                <p className="text-sm text-slate-400">
                  Total active projects
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Dashboard Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-slate-900/50 border-slate-700">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="tasks" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Smart Queue
            </TabsTrigger>
            <TabsTrigger value="insights" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              AI Insights
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Activity */}
              <Card className="lg:col-span-2 bg-slate-900/95 backdrop-blur-sm border-slate-700/50">
                <CardHeader>
                  <CardTitle className="text-slate-100">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  {recentActivity.length > 0 ? (
                    <div className="space-y-4">
                      {recentActivity.map((activity) => (
                        <div key={activity.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
                          <div className="space-y-1">
                            <p className="font-medium text-slate-100">{activity.title}</p>
                            <div className="flex items-center gap-2">
                              <Badge 
                                className={
                                  activity.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                                  activity.status === 'in_progress' ? 'bg-blue-500/20 text-blue-400' :
                                  'bg-yellow-500/20 text-yellow-400'
                                }
                              >
                                {activity.status.replace('_', ' ')}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {activity.priority}
                              </Badge>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-slate-400">
                              {activity.updatedAt ? new Date(activity.updatedAt).toLocaleDateString() : 'Recently'}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Calendar className="h-12 w-12 mx-auto mb-4 text-slate-400 opacity-50" />
                      <p className="text-slate-400">No recent activity</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <QuickActionsPanel />
            </div>
          </TabsContent>

          <TabsContent value="tasks">
            <SmartTaskQueue key={refreshKey} />
          </TabsContent>

          <TabsContent value="insights">
            <AIInsightsPanel 
              taskStats={taskStats} 
              teamMembers={teamMembers || []}
            />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
