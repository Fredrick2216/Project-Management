
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, AlertTriangle, CheckCircle2, Info, Zap, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNotifications, useMarkNotificationRead } from "@/hooks/useNotifications";
import { useTasks } from "@/hooks/useTasks";
import { useProjects } from "@/hooks/useProjects";

interface SmartNotification {
  id: string;
  title: string;
  message: string;
  type: 'urgent' | 'success' | 'info' | 'warning';
  priority: number;
  timestamp: Date;
  actionRequired: boolean;
  category: 'performance' | 'deadline' | 'optimization' | 'collaboration';
}

export const SmartNotificationCenter = () => {
  const [realTimeNotifications, setRealTimeNotifications] = useState<SmartNotification[]>([]);
  const { data: dbNotifications } = useNotifications();
  const { data: tasks } = useTasks();
  const { data: projects } = useProjects();
  const markAsRead = useMarkNotificationRead();
  const { toast } = useToast();

  // Generate real-time analytics notifications based on actual data
  useEffect(() => {
    if (!tasks || !projects) return;

    const notifications: SmartNotification[] = [];

    // Check for overdue tasks
    const overdueTasks = tasks.filter(task => {
      if (!task.due_date) return false;
      const dueDate = new Date(task.due_date);
      const today = new Date();
      return dueDate < today && task.status !== 'completed';
    });

    if (overdueTasks.length > 0) {
      notifications.push({
        id: 'overdue-tasks',
        title: 'Overdue Tasks Alert',
        message: `You have ${overdueTasks.length} overdue tasks that need immediate attention.`,
        type: 'urgent',
        priority: 10,
        timestamp: new Date(),
        actionRequired: true,
        category: 'deadline'
      });
    }

    // Check for recently completed tasks (last 24 hours)
    const recentlyCompleted = tasks.filter(task => {
      if (task.status !== 'completed' || !task.updated_at) return false;
      const updatedDate = new Date(task.updated_at);
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
      return updatedDate > yesterday;
    });

    if (recentlyCompleted.length >= 3) {
      notifications.push({
        id: 'productivity-boost',
        title: 'Productivity Achievement',
        message: `Great work! You've completed ${recentlyCompleted.length} tasks in the last 24 hours.`,
        type: 'success',
        priority: 7,
        timestamp: new Date(),
        actionRequired: false,
        category: 'performance'
      });
    }

    // Check for tasks due soon (next 3 days)
    const dueSoonTasks = tasks.filter(task => {
      if (!task.due_date || task.status === 'completed') return false;
      const dueDate = new Date(task.due_date);
      const threeDaysFromNow = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
      const today = new Date();
      return dueDate > today && dueDate <= threeDaysFromNow;
    });

    if (dueSoonTasks.length > 0) {
      notifications.push({
        id: 'upcoming-deadlines',
        title: 'Upcoming Deadlines',
        message: `${dueSoonTasks.length} tasks are due within the next 3 days. Plan accordingly.`,
        type: 'warning',
        priority: 8,
        timestamp: new Date(),
        actionRequired: true,
        category: 'deadline'
      });
    }

    // Check for high-priority unassigned tasks
    const unassignedHighPriority = tasks.filter(task => 
      !task.assigned_to && 
      (task.priority === 'high' || task.priority === 'urgent') && 
      task.status !== 'completed'
    );

    if (unassignedHighPriority.length > 0) {
      notifications.push({
        id: 'unassigned-priority',
        title: 'Assignment Needed',
        message: `${unassignedHighPriority.length} high-priority tasks need team member assignment.`,
        type: 'info',
        priority: 6,
        timestamp: new Date(),
        actionRequired: true,
        category: 'optimization'
      });
    }

    // Check project completion rates
    const activeProjects = projects.filter(p => p.status === 'active');
    if (activeProjects.length > 0) {
      const projectStats = activeProjects.map(project => {
        const projectTasks = tasks.filter(t => t.project_id === project.id);
        const completedTasks = projectTasks.filter(t => t.status === 'completed');
        const completionRate = projectTasks.length > 0 ? (completedTasks.length / projectTasks.length) * 100 : 0;
        return { project, completionRate, totalTasks: projectTasks.length };
      });

      const strugglingProjects = projectStats.filter(p => p.completionRate < 30 && p.totalTasks > 2);
      
      if (strugglingProjects.length > 0) {
        notifications.push({
          id: 'project-attention',
          title: 'Project Review Needed',
          message: `${strugglingProjects.length} projects have low completion rates and may need attention.`,
          type: 'warning',
          priority: 7,
          timestamp: new Date(),
          actionRequired: true,
          category: 'optimization'
        });
      }
    }

    setRealTimeNotifications(notifications);
  }, [tasks, projects]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'urgent': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'success': return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default: return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'urgent': return 'border-l-red-500 bg-red-50/50';
      case 'success': return 'border-l-green-500 bg-green-50/50';
      case 'warning': return 'border-l-yellow-500 bg-yellow-50/50';
      default: return 'border-l-blue-500 bg-blue-50/50';
    }
  };

  const dismissNotification = (id: string) => {
    setRealTimeNotifications(prev => prev.filter(n => n.id !== id));
  };

  const markDbNotificationAsRead = async (id: string) => {
    try {
      await markAsRead.mutateAsync(id);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to mark notification as read",
        variant: "destructive",
      });
    }
  };

  // Combine real-time notifications with database notifications
  const allNotifications = [
    ...realTimeNotifications,
    ...(dbNotifications?.filter(n => !n.read).map(n => ({
      id: n.id,
      title: n.title,
      message: n.message,
      type: (n.type as 'urgent' | 'success' | 'info' | 'warning') || 'info',
      priority: 5,
      timestamp: new Date(n.created_at),
      actionRequired: n.type === 'urgent',
      category: 'collaboration' as const
    })) || [])
  ].sort((a, b) => b.priority - a.priority);

  const unreadCount = allNotifications.length;

  return (
    <Card className="glass-card border-white/10">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bell className="h-5 w-5 text-primary" />
            <span>Smart Notifications</span>
            {unreadCount > 0 && (
              <Badge className="bg-red-500 text-white">
                {unreadCount}
              </Badge>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-xs">
              <Zap className="h-3 w-3 mr-1" />
              Real-time Data
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 max-h-96 overflow-y-auto">
        {allNotifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-3 rounded-lg border-l-4 ${getNotificationColor(notification.type)} hover:shadow-sm transition-all`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3 flex-1">
                {getNotificationIcon(notification.type)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-medium text-sm">{notification.title}</h4>
                    {notification.actionRequired && (
                      <Badge variant="outline" className="text-xs">
                        <Zap className="h-3 w-3 mr-1" />
                        Action Required
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
                  <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                    <span>{notification.timestamp.toLocaleTimeString()}</span>
                    <Badge variant="outline" className="text-xs">
                      {notification.category}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      Priority: {notification.priority}/10
                    </Badge>
                  </div>
                </div>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  if (notification.id.startsWith('overdue-') || notification.id.startsWith('productivity-') || 
                      notification.id.startsWith('upcoming-') || notification.id.startsWith('unassigned-') || 
                      notification.id.startsWith('project-')) {
                    dismissNotification(notification.id);
                  } else {
                    markDbNotificationAsRead(notification.id);
                  }
                }}
                className="h-6 w-6 p-0"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ))}
        
        {allNotifications.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No notifications</p>
            <p className="text-xs mt-2">Notifications will appear based on your actual task activity</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
