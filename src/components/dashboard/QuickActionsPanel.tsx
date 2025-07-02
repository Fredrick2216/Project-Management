
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Users, 
  FolderOpen, 
  CheckCircle2, 
  Target,
  Zap,
  Calendar,
  Edit,
  Trash2
} from "lucide-react";
import { Link } from "react-router-dom";
import { useCreateNotification } from "@/hooks/useNotifications";
import { useCreateTask } from "@/hooks/useTasks";
import { useCreateProject } from "@/hooks/useProjects";
import { useCreateTeamMember } from "@/hooks/useTeam";
import { useTasks, useUpdateTask } from "@/hooks/useTasks";
import { useToast } from "@/hooks/use-toast";
import { TaskCreateForm } from "./TaskCreateForm";
import { useState } from "react";

export const QuickActionsPanel = () => {
  const [isCreating, setIsCreating] = useState(false);
  const createNotification = useCreateNotification();
  const createTask = useCreateTask();
  const createProject = useCreateProject();
  const createTeamMember = useCreateTeamMember();
  const updateTask = useUpdateTask();
  const { data: tasks } = useTasks();
  const { toast } = useToast();

  const handleQuickAction = async (actionType: string) => {
    setIsCreating(true);
    try {
      switch (actionType) {
        case 'create-task':
          await createTask.mutateAsync({
            title: `Quick Task - ${new Date().toLocaleTimeString()}`,
            description: "Task created via quick action",
            priority: "medium",
            status: "pending",
            progress: 0,
            ai_score: 65
          });
          toast({
            title: "Quick task created",
            description: "A new task has been added to your list",
          });
          break;
        case 'add-member':
          await createTeamMember.mutateAsync({
            name: `New Member ${Date.now()}`,
            email: `member${Date.now()}@company.com`,
            role: "member",
            status: "active"
          });
          toast({
            title: "Team member added",
            description: "A new team member has been added",
          });
          break;
        case 'new-project':
          await createProject.mutateAsync({
            name: `Project ${new Date().toLocaleDateString()}`,
            description: "Project created via quick action",
            status: "active"
          });
          toast({
            title: "Project created",
            description: "A new project has been created",
          });
          break;
        case 'schedule':
          await createNotification.mutateAsync({
            title: "Meeting Scheduled",
            message: `Team meeting scheduled for ${new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleDateString()}`,
            type: "info"
          });
          toast({
            title: "Meeting scheduled",
            description: "Meeting notification has been created",
          });
          break;
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to perform action. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const markTaskComplete = async (taskId: string) => {
    try {
      await updateTask.mutateAsync({
        id: taskId,
        updates: { status: 'completed', progress: 100 }
      });
      toast({
        title: "Task completed",
        description: "Task has been marked as completed",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update task",
        variant: "destructive",
      });
    }
  };

  const quickActions = [
    {
      title: "Create Task",
      description: "Add new task with AI priority",
      icon: Plus,
      color: "text-ai-primary",
      bgColor: "bg-ai-primary/10",
      action: "create-task",
      component: TaskCreateForm
    },
    {
      title: "Add Member",
      description: "Invite new team member",
      icon: Users,
      color: "text-ai-success",
      bgColor: "bg-ai-success/10",
      action: "add-member"
    },
    {
      title: "New Project",
      description: "Start new project",
      icon: FolderOpen,
      color: "text-ai-warning",
      bgColor: "bg-ai-warning/10",
      action: "new-project"
    },
    {
      title: "Schedule",
      description: "Plan team meeting",
      icon: Calendar,
      color: "text-ai-accent",
      bgColor: "bg-ai-accent/10",
      action: "schedule"
    }
  ];

  // Calculate real-time stats from actual tasks
  const completedTasks = tasks?.filter(task => task.status === 'completed').length || 0;
  const pendingTasks = tasks?.filter(task => task.status === 'pending' || task.status === 'in_progress').length || 0;
  const totalTasks = tasks?.length || 0;
  const dailyGoalProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <Card className="glass-card border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="h-5 w-5 text-primary" />
            <span>Quick Actions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3">
            {quickActions.map((action, index) => {
              if (action.component) {
                const Component = action.component;
                return <Component key={index} />;
              }
              
              return (
                <Button
                  key={index}
                  variant="outline"
                  className={`w-full h-auto p-4 flex items-center justify-start space-x-4 hover:scale-[1.02] transition-all ${action.bgColor} border-white/10`}
                  onClick={() => handleQuickAction(action.action)}
                  disabled={isCreating}
                >
                  <div className={`p-2 rounded-lg ${action.bgColor} ${action.color} flex-shrink-0`}>
                    <action.icon className="h-4 w-4" />
                  </div>
                  <div className="text-left flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{action.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{action.description}</p>
                  </div>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Progress Stats */}
      <Card className="glass-card border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-primary" />
            <span>Today's Progress</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Overall Completion</span>
              <span>{completedTasks}/{totalTasks} tasks</span>
            </div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full ai-gradient transition-all duration-300" style={{ width: `${dailyGoalProgress}%` }} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="p-2 rounded-lg bg-ai-success/10">
              <p className="text-lg font-bold text-ai-success">{completedTasks}</p>
              <p className="text-xs text-muted-foreground">Completed</p>
            </div>
            <div className="p-2 rounded-lg bg-ai-warning/10">
              <p className="text-lg font-bold text-ai-warning">{pendingTasks}</p>
              <p className="text-xs text-muted-foreground">Pending</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
