
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { 
  Calendar, 
  Clock, 
  Brain, 
  Plus, 
  Target,
  TrendingUp,
  Lightbulb,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAutomation, PredictiveTask } from "@/hooks/useAutomation";
import { useForm } from "react-hook-form";

type PredictiveTaskFormData = {
  title: string;
  estimated_duration: number;
  priority: 'low' | 'medium' | 'high';
  complexity: number;
  reasoning: string;
};

export const PredictiveScheduler = () => {
  const { 
    predictiveTasks, 
    loading, 
    createPredictiveTask 
  } = useAutomation();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<PredictiveTaskFormData>({
    defaultValues: {
      title: '',
      estimated_duration: 60,
      priority: 'medium',
      complexity: 50,
      reasoning: ''
    }
  });

  const priorityColors = {
    low: 'bg-green-500/20 text-green-400 border-green-500/30',
    medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    high: 'bg-red-500/20 text-red-400 border-red-500/30'
  };

  const onSubmit = async (data: PredictiveTaskFormData) => {
    try {
      const suggestedStartTime = new Date();
      suggestedStartTime.setHours(suggestedStartTime.getHours() + 2); // Suggest starting in 2 hours

      await createPredictiveTask({
        ...data,
        dependencies: [],
        suggested_start_time: suggestedStartTime,
        confidence: Math.floor(Math.random() * 30) + 70, // Random confidence between 70-100
        status: 'pending'
      });
      
      setIsDialogOpen(false);
      form.reset();
      
      toast({
        title: "Success",
        description: "Predictive task created successfully",
      });
    } catch (error) {
      console.error('Error creating predictive task:', error);
      toast({
        title: "Error",
        description: "Failed to create predictive task",
        variant: "destructive"
      });
    }
  };

  const getOptimalSchedule = () => {
    // Simple AI-like scheduling logic
    const sortedTasks = [...predictiveTasks].sort((a, b) => {
      const priorityWeight = { high: 3, medium: 2, low: 1 };
      const aPriority = priorityWeight[a.priority];
      const bPriority = priorityWeight[b.priority];
      
      if (aPriority !== bPriority) {
        return bPriority - aPriority; // Higher priority first
      }
      
      return a.complexity - b.complexity; // Lower complexity first for same priority
    });

    return sortedTasks.slice(0, 5); // Return top 5 optimized tasks
  };

  const optimalTasks = getOptimalSchedule();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* AI Insights Panel */}
      <Card className="dark-glass-card border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary animate-pulse" />
            <span className="ai-gradient-text">AI Scheduling Insights</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20">
              <Calendar className="h-8 w-8 text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-400">{predictiveTasks.length}</div>
              <div className="text-sm text-muted-foreground">Scheduled Tasks</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-gradient-to-br from-green-500/20 to-emerald-500/20">
              <TrendingUp className="h-8 w-8 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-400">
                {predictiveTasks.length > 0 
                  ? Math.round(predictiveTasks.reduce((sum, task) => sum + task.confidence, 0) / predictiveTasks.length)
                  : 0}%
              </div>
              <div className="text-sm text-muted-foreground">Avg Confidence</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20">
              <Clock className="h-8 w-8 text-purple-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-400">
                {predictiveTasks.reduce((sum, task) => sum + task.estimated_duration, 0)}h
              </div>
              <div className="text-sm text-muted-foreground">Total Duration</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Optimal Schedule */}
      {optimalTasks.length > 0 && (
        <Card className="dark-glass-card border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-yellow-400" />
              <span>AI-Optimized Schedule</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {optimalTasks.map((task, index) => (
                <div key={task.id} className="flex items-center gap-4 p-3 rounded-lg bg-background/50">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{task.title}</h4>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{task.estimated_duration}h duration</span>
                      <Badge className={priorityColors[task.priority]} variant="outline">
                        {task.priority}
                      </Badge>
                      <span>Confidence: {task.confidence}%</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">Suggested start</div>
                    <div className="font-medium">
                      {task.suggested_start_time.toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Predictive Tasks */}
      <Card className="dark-glass-card border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              <span>Predictive Task Scheduler</span>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Predictive Task
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create Predictive Task</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="title"
                      rules={{ required: "Task title is required" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Task Title</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Enter task title" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="reasoning"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>AI Reasoning</FormLabel>
                          <FormControl>
                            <Textarea 
                              {...field} 
                              placeholder="Explain why this task is predicted to be important"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="estimated_duration"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Duration (hours)</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                type="number" 
                                min="1" 
                                max="40"
                                onChange={(e) => field.onChange(parseInt(e.target.value))}
                                placeholder="Estimated hours" 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="priority"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Priority</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select priority" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="low">Low</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="high">High</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="complexity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Complexity (1-100)</FormLabel>
                          <FormControl>
                            <div className="space-y-2">
                              <Input 
                                {...field} 
                                type="number" 
                                min="1" 
                                max="100"
                                onChange={(e) => field.onChange(parseInt(e.target.value))}
                                placeholder="Task complexity" 
                              />
                              <Progress value={field.value} className="h-2" />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="flex justify-end space-x-2 pt-4">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setIsDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button type="submit">Create Predictive Task</Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {predictiveTasks.length === 0 ? (
            <div className="text-center py-12">
              <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No Predictive Tasks</h3>
              <p className="text-muted-foreground mb-4">
                Let AI help you schedule and prioritize your upcoming tasks
              </p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Predictive Task
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {predictiveTasks.map((task) => (
                <div 
                  key={task.id}
                  className="p-4 rounded-lg border bg-background/50 hover:bg-background/80 transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-medium mb-1">{task.title}</h4>
                      <p className="text-sm text-muted-foreground mb-2">{task.reasoning}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{task.estimated_duration}h</span>
                        </div>
                        <Badge className={priorityColors[task.priority]} variant="outline">
                          {task.priority}
                        </Badge>
                        <div className="flex items-center gap-1">
                          <Target className="h-3 w-3" />
                          <span>{task.complexity}% complexity</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
                        <Brain className="h-3 w-3" />
                        <span>Confidence: {task.confidence}%</span>
                      </div>
                      <Badge variant={task.status === 'completed' ? 'default' : 'secondary'}>
                        {task.status === 'completed' ? (
                          <CheckCircle className="h-3 w-3 mr-1" />
                        ) : (
                          <AlertCircle className="h-3 w-3 mr-1" />
                        )}
                        {task.status}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="text-xs text-muted-foreground">
                    Suggested start: {task.suggested_start_time.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
