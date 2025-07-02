
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Calendar, 
  Clock, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle2,
  Users,
  Target,
  Zap
} from "lucide-react";
import { useProjects } from "@/hooks/useProjects";
import { useTasks } from "@/hooks/useTasks";
import { useToast } from "@/hooks/use-toast";

interface TimelineItem {
  id: string;
  title: string;
  type: 'project' | 'task';
  startDate: Date;
  endDate: Date;
  progress: number;
  status: string;
  assignee?: string;
  priority?: string;
  dependencies?: string[];
}

interface TimelineMetrics {
  totalDuration: number;
  criticalPath: string[];
  riskItems: TimelineItem[];
  milestones: { date: Date; title: string; type: string }[];
}

export const SmartProjectTimeline = () => {
  const [timelineItems, setTimelineItems] = useState<TimelineItem[]>([]);
  const [metrics, setMetrics] = useState<TimelineMetrics | null>(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'week' | 'month' | 'quarter'>('month');
  const { data: projects } = useProjects();
  const { data: tasks } = useTasks();
  const { toast } = useToast();

  const generateTimeline = () => {
    if (!projects || !tasks) return;

    const items: TimelineItem[] = [];
    const now = new Date();

    // Add projects to timeline
    projects.forEach(project => {
      const projectTasks = tasks.filter(t => t.project_id === project.id);
      const completedTasks = projectTasks.filter(t => t.status === 'completed');
      const progress = projectTasks.length > 0 ? (completedTasks.length / projectTasks.length) * 100 : 0;
      
      // Estimate project timeline based on tasks
      const startDate = new Date(project.created_at);
      const endDate = new Date(startDate.getTime() + (90 * 24 * 60 * 60 * 1000)); // 90 days default

      items.push({
        id: project.id,
        title: project.name,
        type: 'project',
        startDate,
        endDate,
        progress,
        status: project.status
      });
    });

    // Add tasks to timeline
    tasks.forEach(task => {
      if (task.due_date) {
        const dueDate = new Date(task.due_date);
        const startDate = new Date(task.created_at);
        
        items.push({
          id: task.id,
          title: task.title,
          type: 'task',
          startDate,
          endDate: dueDate,
          progress: task.progress || 0,
          status: task.status,
          assignee: task.assigned_to,
          priority: task.priority,
          dependencies: []
        });
      }
    });

    // Calculate metrics
    const riskItems = items.filter(item => {
      if (item.type === 'task' && item.endDate < now && item.status !== 'completed') {
        return true; // Overdue
      }
      if (item.progress < 50 && item.endDate.getTime() - now.getTime() < 7 * 24 * 60 * 60 * 1000) {
        return true; // Behind schedule
      }
      return false;
    });

    const milestones = items
      .filter(item => item.type === 'project' || item.priority === 'high')
      .map(item => ({
        date: item.endDate,
        title: item.title,
        type: item.type
      }))
      .sort((a, b) => a.date.getTime() - b.date.getTime());

    const totalDuration = Math.max(...items.map(item => 
      item.endDate.getTime() - item.startDate.getTime()
    )) / (24 * 60 * 60 * 1000);

    setTimelineItems(items.sort((a, b) => a.startDate.getTime() - b.startDate.getTime()));
    setMetrics({
      totalDuration,
      criticalPath: riskItems.map(item => item.title),
      riskItems,
      milestones
    });
  };

  useEffect(() => {
    generateTimeline();
  }, [projects, tasks]);

  const getTimelineWidth = (item: TimelineItem) => {
    const duration = item.endDate.getTime() - item.startDate.getTime();
    const maxDuration = Math.max(...timelineItems.map(i => 
      i.endDate.getTime() - i.startDate.getTime()
    ));
    return Math.max((duration / maxDuration) * 100, 10);
  };

  const getTimelinePosition = (item: TimelineItem) => {
    const now = new Date();
    const earliestStart = Math.min(...timelineItems.map(i => i.startDate.getTime()));
    const position = ((item.startDate.getTime() - earliestStart) / (24 * 60 * 60 * 1000)) * 2;
    return Math.max(position, 0);
  };

  const getStatusColor = (status: string, progress: number) => {
    if (status === 'completed') return 'bg-green-500';
    if (progress > 75) return 'bg-blue-500';
    if (progress > 50) return 'bg-yellow-500';
    if (progress > 25) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const isOverdue = (item: TimelineItem) => {
    return item.endDate < new Date() && item.status !== 'completed';
  };

  return (
    <div className="space-y-6">
      {/* Timeline Controls */}
      <Card className="bg-slate-900/95 backdrop-blur-sm border-slate-700/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2 text-slate-100">
              <Calendar className="h-5 w-5 text-primary" />
              <span>Smart Project Timeline</span>
              <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                <Zap className="h-3 w-3 mr-1" />
                AI-Powered
              </Badge>
            </CardTitle>
            <div className="flex space-x-2">
              {(['week', 'month', 'quarter'] as const).map(timeframe => (
                <Button
                  key={timeframe}
                  variant={selectedTimeframe === timeframe ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedTimeframe(timeframe)}
                  className="capitalize"
                >
                  {timeframe}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {metrics && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                <div className="flex items-center space-x-2">
                  <Target className="h-4 w-4 text-primary" />
                  <span className="text-sm text-slate-300">Duration</span>
                </div>
                <p className="text-lg font-bold text-slate-100">
                  {Math.round(metrics.totalDuration)} days
                </p>
              </div>
              <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="h-4 w-4 text-green-400" />
                  <span className="text-sm text-slate-300">Milestones</span>
                </div>
                <p className="text-lg font-bold text-slate-100">
                  {metrics.milestones.length}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 text-red-400" />
                  <span className="text-sm text-slate-300">At Risk</span>
                </div>
                <p className="text-lg font-bold text-slate-100">
                  {metrics.riskItems.length}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-blue-400" />
                  <span className="text-sm text-slate-300">Active Items</span>
                </div>
                <p className="text-lg font-bold text-slate-100">
                  {timelineItems.length}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Timeline Visualization */}
      <Card className="bg-slate-900/95 backdrop-blur-sm border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-slate-100">Timeline View</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {timelineItems.map((item) => (
              <div key={item.id} className="relative">
                <div className="flex items-center space-x-4 mb-2">
                  <Badge 
                    variant={item.type === 'project' ? 'default' : 'outline'}
                    className={item.type === 'project' ? 'bg-primary/20 text-primary' : 'text-slate-300 border-slate-600'}
                  >
                    {item.type}
                  </Badge>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-slate-100 truncate">{item.title}</h4>
                      <div className="flex items-center space-x-2">
                        {item.assignee && (
                          <Badge variant="outline" className="text-xs text-slate-300 border-slate-600">
                            {item.assignee}
                          </Badge>
                        )}
                        {item.priority && (
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${
                              item.priority === 'high' ? 'text-red-400 border-red-600' :
                              item.priority === 'medium' ? 'text-yellow-400 border-yellow-600' :
                              'text-green-400 border-green-600'
                            }`}
                          >
                            {item.priority}
                          </Badge>
                        )}
                        {isOverdue(item) && (
                          <Badge className="bg-red-500/20 text-red-400">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Overdue
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 text-xs text-slate-400 mt-1">
                      <span>{item.startDate.toLocaleDateString()}</span>
                      <span>→</span>
                      <span>{item.endDate.toLocaleDateString()}</span>
                      <span>•</span>
                      <span>{item.progress}% complete</span>
                    </div>
                  </div>
                </div>
                
                {/* Timeline Bar */}
                <div className="relative h-6 bg-slate-800/50 rounded-lg overflow-hidden border border-slate-700/50">
                  <div 
                    className={`absolute top-0 left-0 h-full ${getStatusColor(item.status, item.progress)} opacity-70 transition-all`}
                    style={{ width: `${item.progress}%` }}
                  />
                  <div className="absolute inset-0 flex items-center px-2">
                    <span className="text-xs font-medium text-white mix-blend-difference">
                      {item.progress}%
                    </span>
                  </div>
                  {isOverdue(item) && (
                    <div className="absolute top-0 right-0 h-full w-1 bg-red-500" />
                  )}
                </div>
              </div>
            ))}
            
            {timelineItems.length === 0 && (
              <div className="text-center py-8 text-slate-400">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No timeline data available</p>
                <p className="text-xs mt-2">Create projects and tasks with due dates to see timeline</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Critical Path & Milestones */}
      {metrics && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-slate-900/95 backdrop-blur-sm border-slate-700/50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-slate-100">
                <TrendingUp className="h-5 w-5 text-red-400" />
                <span>Critical Path</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {metrics.criticalPath.length > 0 ? (
                  metrics.criticalPath.map((item, index) => (
                    <div key={index} className="p-2 rounded bg-red-950/30 border border-red-800/50">
                      <p className="text-sm text-red-300">{item}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-400">No critical path items</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/95 backdrop-blur-sm border-slate-700/50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-slate-100">
                <CheckCircle2 className="h-5 w-5 text-green-400" />
                <span>Upcoming Milestones</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {metrics.milestones.slice(0, 5).map((milestone, index) => (
                  <div key={index} className="flex items-center justify-between p-2 rounded bg-slate-800/50">
                    <div>
                      <p className="text-sm font-medium text-slate-100">{milestone.title}</p>
                      <p className="text-xs text-slate-400">{milestone.date.toLocaleDateString()}</p>
                    </div>
                    <Badge variant="outline" className="text-xs text-slate-300 border-slate-600">
                      {milestone.type}
                    </Badge>
                  </div>
                ))}
                {metrics.milestones.length === 0 && (
                  <p className="text-slate-400">No upcoming milestones</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
