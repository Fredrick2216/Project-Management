
import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Plus, 
  FolderOpen, 
  Calendar, 
  BarChart3,
  Target,
  Users,
  Clock,
  Brain,
  AlertTriangle
} from "lucide-react";
import { useProjects } from "@/hooks/useProjects";
import { useTasks } from "@/hooks/useTasks";
import { ProjectKanbanBoard } from "@/components/projects/ProjectKanbanBoard";
import { ProjectStatusBadge } from "@/components/projects/ProjectStatusBadge";
import { TaskProjectManager } from "@/components/shared/TaskProjectManager";
import { SmartProjectTimeline } from "@/components/projects/SmartProjectTimeline";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

const Projects = () => {
  const [showProjectManager, setShowProjectManager] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const { data: projects, isLoading: projectsLoading } = useProjects();
  const { data: tasks, isLoading: tasksLoading } = useTasks();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const isLoading = projectsLoading || tasksLoading;

  const activeProjects = projects?.filter(project => project.status === 'active') || [];
  const completedProjects = projects?.filter(project => project.status === 'completed') || [];

  const handleTaskUpdate = async (taskId: string, updates: any) => {
    try {
      console.log('Updating task:', taskId, updates);
      
      const { error } = await supabase
        .from('tasks')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', taskId);

      if (error) {
        console.error('Task update error:', error);
        throw error;
      }

      await queryClient.invalidateQueries({ queryKey: ['tasks'] });
      
      toast({
        title: "Task updated",
        description: "Task has been updated successfully.",
      });
    } catch (error: any) {
      console.error('Task update failed:', error);
      toast({
        title: "Error updating task",
        description: error.message || "Failed to update task",
        variant: "destructive",
      });
    }
  };

  // Calculate project analytics
  const getProjectAnalytics = () => {
    if (!projects || !tasks) return null;

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'completed').length;
    const overdueTasks = tasks.filter(t => {
      if (!t.due_date || t.status === 'completed') return false;
      return new Date(t.due_date) < new Date();
    }).length;

    const avgProgress = projects.length > 0 ? 
      Math.round(projects.reduce((acc, project) => {
        const projectTasks = tasks.filter(t => t.project_id === project.id);
        const projectCompleted = projectTasks.filter(t => t.status === 'completed');
        const progress = projectTasks.length > 0 ? (projectCompleted.length / projectTasks.length) * 100 : 0;
        return acc + progress;
      }, 0) / projects.length) : 0;

    return {
      totalTasks,
      completedTasks,
      overdueTasks,
      avgProgress,
      completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
    };
  };

  const analytics = getProjectAnalytics();

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
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-3">
            <h1 className="text-3xl font-bold ai-gradient-text">
              Project Management
            </h1>
            <p className="text-slate-400">
              Manage your projects with AI-powered insights and smart timeline planning
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                {activeProjects.length} Active
              </Badge>
              <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
                {completedProjects.length} Completed
              </Badge>
              {analytics && analytics.overdueTasks > 0 && (
                <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white">
                  {analytics.overdueTasks} Overdue
                </Badge>
              )}
            </div>
          </div>
          <Dialog open={showProjectManager} onOpenChange={setShowProjectManager}>
            <DialogTrigger asChild>
              <Button className="ai-gradient text-white">
                <Plus className="h-4 w-4 mr-2" />
                New Project
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto dark-glass-card">
              <DialogHeader>
                <DialogTitle className="text-slate-100">Project Manager</DialogTitle>
              </DialogHeader>
              <TaskProjectManager />
            </DialogContent>
          </Dialog>
        </div>

        {/* Project Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 dark-glass-card">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <FolderOpen className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="kanban" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Kanban
            </TabsTrigger>
            <TabsTrigger value="timeline" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Smart Timeline
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {projects && projects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => {
                  const projectTasks = tasks?.filter(t => t.project_id === project.id) || [];
                  const completedTasks = projectTasks.filter(t => t.status === 'completed');
                  const progress = projectTasks.length > 0 ? 
                    Math.round((completedTasks.length / projectTasks.length) * 100) : 0;

                  return (
                    <Card key={project.id} className="dark-glass-card border-slate-700/50 hover:scale-105 transition-all">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg font-semibold text-slate-100 truncate">
                            {project.name}
                          </CardTitle>
                          <ProjectStatusBadge status={project.status} />
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {project.description && (
                          <p className="text-sm text-slate-400 line-clamp-2">
                            {project.description}
                          </p>
                        )}
                        
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-slate-300">Progress</span>
                              <span className="text-slate-100">{progress}%</span>
                            </div>
                            <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                              <div 
                                className="h-full ai-gradient transition-all duration-300" 
                                style={{ width: `${progress}%` }} 
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4 text-center">
                            <div className="p-2 rounded-lg bg-primary/20">
                              <p className="text-lg font-bold text-primary">
                                {projectTasks.length}
                              </p>
                              <p className="text-xs text-slate-400">Tasks</p>
                            </div>
                            <div className="p-2 rounded-lg bg-green-500/20">
                              <p className="text-lg font-bold text-green-400">
                                {completedTasks.length}
                              </p>
                              <p className="text-xs text-slate-400">Done</p>
                            </div>
                          </div>

                          <div className="flex flex-col gap-2 text-xs text-slate-500">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>Created {new Date(project.created_at).toLocaleDateString()}</span>
                            </div>
                            {project.updated_at && (
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                <span>Updated {new Date(project.updated_at).toLocaleDateString()}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <FolderOpen className="h-16 w-16 mx-auto mb-4 text-slate-600 opacity-50" />
                <h3 className="text-lg font-semibold mb-2 text-slate-300">
                  No projects yet
                </h3>
                <p className="text-slate-400 mb-4">
                  Create your first project to get started with task management
                </p>
                <Button onClick={() => setShowProjectManager(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Project
                </Button>
              </div>
            )}
          </TabsContent>

          {/* Kanban Tab */}
          <TabsContent value="kanban">
            {tasks && tasks.length > 0 ? (
              <ProjectKanbanBoard 
                tasks={tasks} 
                onTaskUpdate={handleTaskUpdate}
              />
            ) : (
              <Card className="dark-glass-card border-slate-700/50">
                <CardContent className="text-center py-12">
                  <BarChart3 className="h-16 w-16 mx-auto mb-4 text-slate-600 opacity-50" />
                  <h3 className="text-lg font-semibold mb-2 text-slate-300">
                    No tasks available
                  </h3>
                  <p className="text-slate-400 mb-4">
                    Create some tasks to see them in the Kanban board
                  </p>
                  <Button onClick={() => setShowProjectManager(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Tasks
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Smart Timeline Tab */}
          <TabsContent value="timeline">
            <SmartProjectTimeline />
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            {analytics ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card className="dark-glass-card border-slate-700/50">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-base">
                        <Target className="h-5 w-5 text-primary" />
                        <span className="text-slate-100">Project Health</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-primary">{analytics.avgProgress}%</p>
                        <p className="text-sm text-slate-400">Average Progress</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="dark-glass-card border-slate-700/50">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-base">
                        <Users className="h-5 w-5 text-green-400" />
                        <span className="text-slate-100">Task Completion</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-400">{analytics.completionRate}%</p>
                        <p className="text-sm text-slate-400">{analytics.completedTasks} of {analytics.totalTasks}</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="dark-glass-card border-slate-700/50">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-base">
                        <BarChart3 className="h-5 w-5 text-blue-400" />
                        <span className="text-slate-100">Active Projects</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-blue-400">{activeProjects.length}</p>
                        <p className="text-sm text-slate-400">Currently active</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="dark-glass-card border-slate-700/50">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-base">
                        <AlertTriangle className={`h-5 w-5 ${analytics.overdueTasks > 0 ? 'text-red-400' : 'text-slate-400'}`} />
                        <span className="text-slate-100">Overdue Tasks</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center">
                        <p className={`text-2xl font-bold ${analytics.overdueTasks > 0 ? 'text-red-400' : 'text-slate-400'}`}>
                          {analytics.overdueTasks}
                        </p>
                        <p className="text-sm text-slate-400">Need attention</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Project Progress Details */}
                <Card className="dark-glass-card border-slate-700/50">
                  <CardHeader>
                    <CardTitle className="text-slate-100">Project Progress Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {projects && projects.map(project => {
                        const projectTasks = tasks?.filter(t => t.project_id === project.id) || [];
                        const completedProjectTasks = projectTasks.filter(t => t.status === 'completed');
                        const projectProgress = projectTasks.length > 0 ? 
                          Math.round((completedProjectTasks.length / projectTasks.length) * 100) : 0;

                        return (
                          <div key={project.id} className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
                            <div className="flex items-center justify-between mb-3">
                              <div>
                                <h4 className="font-medium text-slate-100">{project.name}</h4>
                                <p className="text-sm text-slate-400">{projectTasks.length} tasks</p>
                              </div>
                              <div className="text-right">
                                <p className="text-lg font-bold text-primary">{projectProgress}%</p>
                                <ProjectStatusBadge status={project.status} />
                              </div>
                            </div>
                            <div className="w-full h-2 bg-slate-700 rounded-full">
                              <div 
                                className="h-full bg-primary rounded-full transition-all"
                                style={{ width: `${projectProgress}%` }}
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
              <Card className="dark-glass-card border-slate-700/50">
                <CardContent className="text-center py-12">
                  <BarChart3 className="h-16 w-16 mx-auto mb-4 text-slate-600 opacity-50" />
                  <h3 className="text-lg font-semibold mb-2 text-slate-300">
                    No analytics data
                  </h3>
                  <p className="text-slate-400">Create projects and tasks to see analytics</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Projects;
