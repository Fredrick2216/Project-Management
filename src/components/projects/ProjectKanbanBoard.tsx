
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DragDropContext, 
  Droppable, 
  Draggable,
  DropResult
} from "react-beautiful-dnd";
import { 
  Calendar, 
  Clock, 
  MoreHorizontal, 
  Plus,
  User,
  Flag
} from "lucide-react";
import { TaskStatusBadge } from "@/components/tasks/TaskStatusBadge";

interface Task {
  id: string;
  title: string;
  description?: string;
  priority: string;
  status: string;
  assigned_to?: string;
  due_date?: string;
  progress: number;
}

interface ProjectKanbanBoardProps {
  tasks: Task[];
  onTaskUpdate: (taskId: string, updates: any) => void;
}

export const ProjectKanbanBoard = ({ tasks, onTaskUpdate }: ProjectKanbanBoardProps) => {
  const [columns] = useState({
    pending: { title: "To Do", color: "bg-slate-100", tasks: [] },
    in_progress: { title: "In Progress", color: "bg-blue-100", tasks: [] },
    completed: { title: "Done", color: "bg-green-100", tasks: [] }
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "text-red-600 bg-red-100";
      case "medium": return "text-yellow-600 bg-yellow-100";
      case "low": return "text-green-600 bg-green-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const getInitials = (name: string) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';
  };

  const organizedTasks = tasks?.reduce((acc, task) => {
    const status = task.status || 'pending';
    if (!acc[status]) acc[status] = [];
    acc[status].push(task);
    return acc;
  }, {} as Record<string, Task[]>) || {};

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    
    if (!destination) return;
    if (destination.droppableId === source.droppableId) return;

    const newStatus = destination.droppableId;
    const newProgress = newStatus === 'completed' ? 100 : 
                       newStatus === 'in_progress' ? 50 : 0;

    onTaskUpdate(draggableId, { 
      status: newStatus,
      progress: newProgress
    });
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold">Project Board</h3>
        <Button className="ai-gradient text-white">
          <Plus className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      </div>
      
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(columns).map(([columnId, column]) => (
            <div key={columnId} className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-sm text-muted-foreground">
                  {column.title}
                </h4>
                <Badge variant="outline" className="text-xs">
                  {organizedTasks[columnId]?.length || 0}
                </Badge>
              </div>
              
              <Droppable droppableId={columnId}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`min-h-96 p-3 rounded-lg border-2 border-dashed transition-colors ${
                      snapshot.isDraggingOver 
                        ? 'border-primary bg-primary/5' 
                        : 'border-gray-200 bg-gray-50/50'
                    }`}
                  >
                    <div className="space-y-3">
                      {(organizedTasks[columnId] || []).map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided, snapshot) => (
                            <Card
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`cursor-grab active:cursor-grabbing transition-all ${
                                snapshot.isDragging 
                                  ? 'shadow-lg rotate-2 scale-105' 
                                  : 'hover:shadow-md'
                              }`}
                            >
                              <CardContent className="p-4">
                                <div className="space-y-3">
                                  <div className="flex items-start justify-between">
                                    <h5 className="font-medium text-sm leading-tight">
                                      {task.title}
                                    </h5>
                                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                      <MoreHorizontal className="h-3 w-3" />
                                    </Button>
                                  </div>
                                  
                                  {task.description && (
                                    <p className="text-xs text-muted-foreground line-clamp-2">
                                      {task.description}
                                    </p>
                                  )}
                                  
                                  <div className="flex items-center justify-between">
                                    <Badge 
                                      className={`text-xs ${getPriorityColor(task.priority)}`}
                                    >
                                      <Flag className="h-3 w-3 mr-1" />
                                      {task.priority}
                                    </Badge>
                                    
                                    <TaskStatusBadge status={task.status} size="sm" />
                                  </div>

                                  <div className="flex items-center justify-between">
                                    {task.assigned_to && (
                                      <Avatar className="h-6 w-6">
                                        <AvatarFallback className="text-xs bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                                          {getInitials(task.assigned_to)}
                                        </AvatarFallback>
                                      </Avatar>
                                    )}
                                    
                                    {task.due_date && (
                                      <div className="flex items-center text-xs text-muted-foreground">
                                        <Calendar className="h-3 w-3 mr-1" />
                                        {new Date(task.due_date).toLocaleDateString()}
                                      </div>
                                    )}
                                  </div>
                                  
                                  <div className="space-y-1">
                                    <div className="flex justify-between text-xs">
                                      <span>Progress</span>
                                      <span>{task.progress}%</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                      <div 
                                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
                                        style={{ width: `${task.progress}%` }}
                                      />
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          )}
                        </Draggable>
                      ))}
                    </div>
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};
