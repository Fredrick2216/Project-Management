
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Target,
  Brain,
  Zap,
  AlertTriangle,
  Activity
} from "lucide-react";
import { PredictiveInsights } from "@/components/analytics/PredictiveInsights";
import { AdvancedVisualization } from "@/components/analytics/AdvancedVisualization";
import { TaskAnalyticsEngine } from "@/components/analytics/TaskAnalyticsEngine";
import { useTasks } from "@/hooks/useTasks";
import { useProjects } from "@/hooks/useProjects";
import { useTeamMembers } from "@/hooks/useTeam";
import { useAnalyticsData } from "@/hooks/useAnalytics";

const Analytics = () => {
  const { data: tasks, isLoading: tasksLoading } = useTasks();
  const { data: projects, isLoading: projectsLoading } = useProjects();
  const { data: teamMembers, isLoading: teamLoading } = useTeamMembers();
  const { data: analyticsData, isLoading: analyticsLoading } = useAnalyticsData();

  const isLoading = tasksLoading || projectsLoading || teamLoading || analyticsLoading;

  // Calculate overview metrics
  const totalTasks = tasks?.length || 0;
  const completedTasks = tasks?.filter(t => t.status === 'completed').length || 0;
  const activeTasks = tasks?.filter(t => t.status === 'in_progress').length || 0;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  const activeProjects = projects?.filter(p => p.status === 'active').length || 0;
  const totalTeamMembers = teamMembers?.length || 0;

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
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-slate-100">
            Advanced Analytics
          </h1>
          <p className="text-slate-400">
            AI-powered insights and predictive analytics for your projects
          </p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-slate-900/95 backdrop-blur-sm border-slate-700/50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-slate-100">
                <Target className="h-5 w-5 text-primary" />
                <span>Task Completion</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">{completionRate}%</p>
                <p className="text-sm text-slate-400">{completedTasks} of {totalTasks} tasks</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/95 backdrop-blur-sm border-slate-700/50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-slate-100">
                <Activity className="h-5 w-5 text-green-400" />
                <span>Active Tasks</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <p className="text-3xl font-bold text-green-400">{activeTasks}</p>
                <p className="text-sm text-slate-400">In progress</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/95 backdrop-blur-sm border-slate-700/50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-slate-100">
                <BarChart3 className="h-5 w-5 text-blue-400" />
                <span>Active Projects</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-400">{activeProjects}</p>
                <p className="text-sm text-slate-400">Projects running</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/95 backdrop-blur-sm border-slate-700/50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-slate-100">
                <Users className="h-5 w-5 text-purple-400" />
                <span>Team Members</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <p className="text-3xl font-bold text-purple-400">{totalTeamMembers}</p>
                <p className="text-sm text-slate-400">Active members</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Analytics Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 bg-slate-900/50 border-slate-700">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="predictive" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              Predictive
            </TabsTrigger>
            <TabsTrigger value="advanced" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Advanced
            </TabsTrigger>
            <TabsTrigger value="team" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Team
            </TabsTrigger>
            <TabsTrigger value="engine" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Engine
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {tasks && tasks.length > 0 ? (
                <>
                  <Card className="bg-slate-900/95 backdrop-blur-sm border-slate-700/50">
                    <CardHeader>
                      <CardTitle className="text-slate-100">Task Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {['pending', 'in_progress', 'completed'].map(status => {
                          const count = tasks.filter(t => t.status === status).length;
                          const percentage = totalTasks > 0 ? (count / totalTasks) * 100 : 0;
                          return (
                            <div key={status} className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-slate-300 capitalize">{status.replace('_', ' ')}</span>
                                <span className="text-slate-100">{count} ({percentage.toFixed(0)}%)</span>
                              </div>
                              <div className="w-full h-2 bg-slate-700 rounded-full">
                                <div 
                                  className={`h-full rounded-full transition-all ${
                                    status === 'completed' ? 'bg-green-500' :
                                    status === 'in_progress' ? 'bg-blue-500' : 'bg-yellow-500'
                                  }`}
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-900/95 backdrop-blur-sm border-slate-700/50">
                    <CardHeader>
                      <CardTitle className="text-slate-100">Priority Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {['high', 'medium', 'low'].map(priority => {
                          const count = tasks.filter(t => t.priority === priority).length;
                          const percentage = totalTasks > 0 ? (count / totalTasks) * 100 : 0;
                          return (
                            <div key={priority} className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-slate-300 capitalize">{priority}</span>
                                <span className="text-slate-100">{count} ({percentage.toFixed(0)}%)</span>
                              </div>
                              <div className="w-full h-2 bg-slate-700 rounded-full">
                                <div 
                                  className={`h-full rounded-full transition-all ${
                                    priority === 'high' ? 'bg-red-500' :
                                    priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                                  }`}
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </>
              ) : (
                <Card className="col-span-2 bg-slate-900/95 backdrop-blur-sm border-slate-700/50">
                  <CardContent className="text-center py-12">
                    <AlertTriangle className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-300 mb-2">No Data Available</h3>
                    <p className="text-slate-400">Create some tasks to see analytics</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="predictive">
            <PredictiveInsights />
          </TabsContent>

          <TabsContent value="advanced">
            <AdvancedVisualization />
          </TabsContent>

          <TabsContent value="team">
            <Card className="bg-slate-900/95 backdrop-blur-sm border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-slate-100">Team Performance</CardTitle>
              </CardHeader>
              <CardContent>
                {teamMembers && teamMembers.length > 0 ? (
                  <div className="space-y-4">
                    {teamMembers.map(member => {
                      const memberTasks = tasks?.filter(t => t.assigned_to === member.name) || [];
                      const completedMemberTasks = memberTasks.filter(t => t.status === 'completed');
                      const memberCompletionRate = memberTasks.length > 0 ? 
                        Math.round((completedMemberTasks.length / memberTasks.length) * 100) : 0;

                      return (
                        <div key={member.id} className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <h4 className="font-medium text-slate-100">{member.name}</h4>
                              <p className="text-sm text-slate-400">{member.role}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold text-primary">{memberCompletionRate}%</p>
                              <p className="text-xs text-slate-400">{memberTasks.length} tasks</p>
                            </div>
                          </div>
                          <div className="w-full h-2 bg-slate-700 rounded-full">
                            <div 
                              className="h-full bg-primary rounded-full transition-all"
                              style={{ width: `${memberCompletionRate}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-400">No team members found</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="engine">
            <TaskAnalyticsEngine />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;
