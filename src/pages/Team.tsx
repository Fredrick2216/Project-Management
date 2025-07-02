
import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Plus, 
  Users, 
  MessageSquare, 
  BarChart3,
  Brain,
  Target,
  Zap,
  TrendingUp,
  Clock,
  CheckCircle2
} from "lucide-react";
import { TeamCollaborationHub } from "@/components/team/TeamCollaborationHub";
import { TaskProjectManager } from "@/components/shared/TaskProjectManager";
import { ResourceOptimizer } from "@/components/team/ResourceOptimizer";
import { useTeamMembers } from "@/hooks/useTeam";
import { useTasks } from "@/hooks/useTasks";
import { useProjects } from "@/hooks/useProjects";

const Team = () => {
  const [showTeamManager, setShowTeamManager] = useState(false);
  const [activeTab, setActiveTab] = useState("collaboration");
  
  const { data: teamMembers, isLoading: teamLoading } = useTeamMembers();
  const { data: tasks, isLoading: tasksLoading } = useTasks();
  const { data: projects, isLoading: projectsLoading } = useProjects();

  const isLoading = teamLoading || tasksLoading || projectsLoading;

  // Calculate team analytics
  const getTeamAnalytics = () => {
    if (!teamMembers || !tasks) {
      return {
        totalMembers: 0,
        activeMembers: 0,
        totalTasks: 0,
        completedTasks: 0,
        teamEfficiency: 0,
        averageTasksPerMember: 0
      };
    }

    const activeMembers = teamMembers.filter(member => member.status === 'active').length;
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.status === 'completed').length;
    const teamEfficiency = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    const averageTasksPerMember = teamMembers.length > 0 ? Math.round(totalTasks / teamMembers.length) : 0;

    return {
      totalMembers: teamMembers.length,
      activeMembers,
      totalTasks,
      completedTasks,
      teamEfficiency,
      averageTasksPerMember
    };
  };

  const analytics = getTeamAnalytics();

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
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold ai-gradient-text">Team Management</h1>
            <p className="text-muted-foreground mt-2">
              Collaborate with your team and optimize resource allocation with AI
            </p>
            <div className="flex items-center space-x-2 mt-2">
              <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
                <Users className="h-3 w-3 mr-1" />
                Team Hub
              </Badge>
              <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                <Brain className="h-3 w-3 mr-1" />
                AI Optimization
              </Badge>
            </div>
          </div>
          <Dialog open={showTeamManager} onOpenChange={setShowTeamManager}>
            <DialogTrigger asChild>
              <Button className="ai-gradient text-white">
                <Plus className="h-4 w-4 mr-2" />
                Add Member
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Team & Task Manager</DialogTitle>
              </DialogHeader>
              <TaskProjectManager />
            </DialogContent>
          </Dialog>
        </div>

        {/* Team Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="collaboration" className="flex items-center space-x-2">
              <MessageSquare className="h-4 w-4" />
              <span>Collaboration</span>
            </TabsTrigger>
            <TabsTrigger value="optimization" className="flex items-center space-x-2">
              <Brain className="h-4 w-4" />
              <span>AI Optimizer</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Analytics</span>
            </TabsTrigger>
          </TabsList>

          {/* Collaboration Tab */}
          <TabsContent value="collaboration">
            <TeamCollaborationHub />
          </TabsContent>

          {/* AI Optimization Tab */}
          <TabsContent value="optimization">
            <ResourceOptimizer />
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Team Overview Metrics */}
              <Card className="bg-slate-900/95 backdrop-blur-sm border-slate-700/50">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center space-x-2 text-slate-100">
                    <Users className="h-5 w-5 text-blue-400" />
                    <span>Team Size</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-blue-400">{analytics.totalMembers}</span>
                      <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                        {analytics.activeMembers} active
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-400">Total team members</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/95 backdrop-blur-sm border-slate-700/50">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center space-x-2 text-slate-100">
                    <Target className="h-5 w-5 text-green-400" />
                    <span>Team Efficiency</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-green-400">{analytics.teamEfficiency}%</span>
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                        {analytics.completedTasks}/{analytics.totalTasks}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-400">Completion rate</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/95 backdrop-blur-sm border-slate-700/50">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center space-x-2 text-slate-100">
                    <TrendingUp className="h-5 w-5 text-purple-400" />
                    <span>Workload</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-purple-400">{analytics.averageTasksPerMember}</span>
                      <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                        avg/member
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-400">Tasks per member</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Team Performance Details */}
            <Card className="bg-slate-900/95 backdrop-blur-sm border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-slate-100">Team Performance Details</CardTitle>
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
                    <p className="text-xs text-slate-400 mt-2">Add team members to see analytics</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Project Distribution */}
            {projects && projects.length > 0 && (
              <Card className="bg-slate-900/95 backdrop-blur-sm border-slate-700/50">
                <CardHeader>
                  <CardTitle className="text-slate-100">Project Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {projects.map(project => {
                      const projectTasks = tasks?.filter(t => t.project_id === project.id) || [];
                      const completedProjectTasks = projectTasks.filter(t => t.status === 'completed');
                      const projectProgress = projectTasks.length > 0 ? 
                        Math.round((completedProjectTasks.length / projectTasks.length) * 100) : 0;

                      return (
                        <div key={project.id} className="p-3 rounded-lg bg-slate-800/30 border border-slate-700/50">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-slate-100">{project.name}</h4>
                            <Badge 
                              className={`${
                                project.status === 'active' ? 'bg-green-500/20 text-green-400' :
                                project.status === 'completed' ? 'bg-blue-500/20 text-blue-400' :
                                'bg-yellow-500/20 text-yellow-400'
                              }`}
                            >
                              {project.status}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between text-sm mb-2">
                            <span className="text-slate-300">{projectProgress}% complete</span>
                            <span className="text-slate-400">{completedProjectTasks.length}/{projectTasks.length} tasks</span>
                          </div>
                          <div className="w-full h-2 bg-slate-700 rounded-full">
                            <div 
                              className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all"
                              style={{ width: `${projectProgress}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Team;
